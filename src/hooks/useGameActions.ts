// src/hooks/useGameActions.ts
import { useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { calculateRent } from '../utils/finance';
import { Player, BoardTile } from '../types';
import { getAIDecision, getAIDelay } from '../utils/ai-decisions';
import { delay, getMovementPath } from '../utils/animation';

export const useGameActions = () => {
  const handleLanding = useCallback(async (player: Player, tile: BoardTile, diceRoll: number) => {
    const {
      updatePlayer, addLog, buyProperty, setPurchaseModal, board, settings,
      players, drawCard, isGameOver
    } = useGameStore.getState();

    if (isGameOver) return;

    addLog(`${player.name} landed on ${tile.name}`);

    // Handle Chance / Community Chest
    if (tile.type === 'chance' || tile.type === 'chest') {
      if (settings.board.enableChanceCards || settings.board.enableCommunityChest) {
        drawCard(tile.type as 'chance' | 'chest');
        return;
      }
    }

    if (tile.type === 'tax') {
      const taxAmount = tile.price;
      updatePlayer(player.id, { cash: player.cash - taxAmount });
      addLog(`${player.name} paid $${taxAmount} in taxes`, 'danger');
      return;
    }

    if (tile.type === 'corner' && tile.id === 30) {
      updatePlayer(player.id, { position: 10, isInJail: true, jailTurns: 0 });
      addLog(`${player.name} went to JAIL!`, 'danger');
      return;
    }

    if (['property', 'railroad', 'utility'].includes(tile.type)) {
      if (!tile.ownerId) {
        if (player.type === 'ai') {
          const totalMoves = players.reduce((sum, p) => sum + p.movesCount, 0);
          const decision = getAIDecision(player, tile, board, settings, totalMoves);
          if (decision.action === 'buy') {
            buyProperty(player.id, tile.id);
          } else {
            addLog(`${player.name} skipped ${tile.name} (${decision.reason})`, 'info');
          }
        } else {
          if (player.cash >= tile.price) {
            setPurchaseModal(true, tile);
          }
        }
      } else if (tile.ownerId !== player.id && !tile.isMortgaged) {
        let rent = calculateRent(tile, board, settings.board.rentMultiplier);
        if (tile.type === 'utility') {
          rent = rent * diceRoll;
        }
        const owner = players.find(p => p.id === tile.ownerId);
        if (owner) {
          updatePlayer(player.id, { cash: player.cash - rent });
          updatePlayer(owner.id, { cash: owner.cash + rent });
          addLog(`${player.name} paid $${rent} rent to ${owner.name}`, 'warning');

          if (player.cash - rent < 0) {
            handleBankruptcy(player.id);
          }
        }
      }
    }
  }, []);

  const handleBankruptcy = useCallback((playerId: string) => {
    const { players, updatePlayer, updateTile, addLog, setGameOver } = useGameStore.getState();
    const player = players.find(p => p.id === playerId);
    if (!player) return;

    updatePlayer(playerId, { isBankrupt: true, cash: 0 });
    addLog(`${player.name} is bankrupt!`, 'danger');

    player.properties.forEach(tileId => {
      updateTile(tileId, { ownerId: undefined, houses: 0, isMortgaged: false });
    });

    const activePlayers = players.filter(p => !p.isBankrupt && p.id !== playerId);
    if (activePlayers.length === 1) {
      setGameOver(activePlayers[0]);
    }
  }, []);

  const handleMove = useCallback(async (steps: number) => {
    const { players, currentPlayerIndex, board, updatePlayer, addLog, settings } = useGameStore.getState();
    const currentPlayer = players[currentPlayerIndex];
    if (!currentPlayer || currentPlayer.isBankrupt) return;

    // Check Jail
    if (currentPlayer.isInJail) {
        if (steps === 0) {
             // Teleported
        } else {
            addLog(`${currentPlayer.name} is in JAIL and cannot move.`, 'warning');
            updatePlayer(currentPlayer.id, { jailTurns: currentPlayer.jailTurns + 1 });
            if (currentPlayer.jailTurns >= 2) {
                updatePlayer(currentPlayer.id, { isInJail: false, jailTurns: 0 });
                addLog(`${currentPlayer.name} paid fine and left JAIL.`, 'info');
            }
            return;
        }
    }

    const path = getMovementPath(currentPlayer.position, steps);

    // Animate movement step by step
    for (const pos of path) {
      const isPassingGo = pos === 0;
      let cashUpdate = 0;

      if (isPassingGo) {
        const goBonus = Math.round((settings.finance.startingCash / 1500) * 200);
        cashUpdate = goBonus;
        addLog(`${currentPlayer.name} passed GO and collected $${goBonus}`, 'success');
      }

      updatePlayer(currentPlayer.id, {
        position: pos,
        cash: (useGameStore.getState().players[currentPlayerIndex].cash || 0) + cashUpdate
      });

      await delay(250);
    }

    const finalPos = path[path.length - 1];
    updatePlayer(currentPlayer.id, { movesCount: currentPlayer.movesCount + 1 });

    const landTile = board[finalPos];
    await handleLanding(useGameStore.getState().players[currentPlayerIndex], landTile, steps);
  }, [handleLanding]);

  const performAITurn = useCallback(async () => {
    const { players, currentPlayerIndex, rollDice, nextTurn, settings, setIsMoving, activeCard, showPurchaseModal, updatePlayer, addLog } = useGameStore.getState();
    const currentPlayer = players[currentPlayerIndex];

    if (currentPlayer && currentPlayer.type === 'ai' && !currentPlayer.isBankrupt && !activeCard && !showPurchaseModal) {
      const difficulty = settings.players.find(p => p.id === currentPlayer.id)?.aiDifficulty || 'medium';
      await delay(getAIDelay(difficulty));

      if (currentPlayer.isInJail) {
          addLog(`${currentPlayer.name} is trying to leave JAIL...`);
          const d1 = Math.floor(Math.random() * 6) + 1;
          const d2 = Math.floor(Math.random() * 6) + 1;
          if (d1 === d2) {
              updatePlayer(currentPlayer.id, { isInJail: false, jailTurns: 0 });
              addLog(`${currentPlayer.name} rolled doubles and left JAIL!`, 'success');
          }
      }

      const [d1, d2] = rollDice();
      setIsMoving(true);
      await handleMove(d1 + d2);
      setIsMoving(false);

      // If AI opened a card, wait for it to be closed
      let safetyCounter = 0;
      while (useGameStore.getState().activeCard && safetyCounter < 50) {
        await delay(500);
        if (safetyCounter === 10) {
            // Close it automatically after some time if it gets stuck
            useGameStore.getState().closeCard();
        }
        safetyCounter++;
      }

      await delay(1000);
      nextTurn();
    }
  }, [handleMove]);

  return {
    handleMove,
    performAITurn,
  };
};
