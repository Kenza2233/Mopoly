// src/hooks/useGameActions.ts
import { useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { calculateRent } from '../utils/finance';
import { Player, BoardTile } from '../types';

export const useGameActions = () => {
  const store = useGameStore();

  const handleLanding = useCallback((player: Player, tile: BoardTile, diceRoll: number) => {
    const { updatePlayer, addLog, buyProperty, setPurchaseModal, board } = useGameStore.getState();

    addLog(`${player.name} landed on ${tile.name}`);

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
          if (player.cash >= tile.price * 1.2) {
            buyProperty(player.id, tile.id);
          }
        } else {
          if (player.cash >= tile.price) {
            setPurchaseModal(true, tile);
          }
        }
      } else if (tile.ownerId !== player.id && !tile.isMortgaged) {
        let rent = calculateRent(tile, board);
        if (tile.type === 'utility') {
          rent = rent * diceRoll;
        }
        const owner = useGameStore.getState().players.find(p => p.id === tile.ownerId);
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

  const buyProperty = useCallback((playerId: string, tileId: number) => {
    const { players, board, updatePlayer, updateTile, addLog } = useGameStore.getState();
    const player = players.find(p => p.id === playerId);
    const tile = board.find(t => t.id === tileId);

    if (player && tile && player.cash >= tile.price) {
      updatePlayer(playerId, {
        cash: player.cash - tile.price,
        properties: [...player.properties, tileId]
      });
      updateTile(tileId, { ownerId: playerId });
      addLog(`${player.name} bought ${tile.name} for $${tile.price}`, 'success');
    }
  }, []);

  const handleMove = useCallback((steps: number) => {
    const { players, currentPlayerIndex, board, updatePlayer, addLog, settings } = useGameStore.getState();
    const currentPlayer = players[currentPlayerIndex];
    if (!currentPlayer) return;

    let newPosition = (currentPlayer.position + steps) % 40;

    if (newPosition < currentPlayer.position) {
      const goBonus = Math.round((settings.startingCash / 1500) * 200);
      updatePlayer(currentPlayer.id, {
        position: newPosition,
        cash: currentPlayer.cash + goBonus
      });
      addLog(`${currentPlayer.name} passed GO and collected $${goBonus}`, 'success');
    } else {
      updatePlayer(currentPlayer.id, { position: newPosition });
    }

    const landTile = board[newPosition];
    handleLanding(currentPlayer, landTile, steps);
  }, [handleLanding]);

  const performAITurn = useCallback(async () => {
    const { players, currentPlayerIndex, rollDice, nextTurn } = useGameStore.getState();
    const currentPlayer = players[currentPlayerIndex];

    if (currentPlayer && currentPlayer.type === 'ai' && !currentPlayer.isBankrupt) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const [d1, d2] = rollDice();
      handleMove(d1 + d2);

      await new Promise(resolve => setTimeout(resolve, 1500));
      nextTurn();
    }
  }, [handleMove]);

  return {
    handleMove,
    buyProperty,
    performAITurn,
  };
};
