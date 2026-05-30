// src/utils/transactions.ts
import { useGameStore } from '../store/gameStore';
import { GameCard } from '../types/settings';

/**
 * Handles cash logic for cards (Chance/Community Chest)
 */
export const handleCardTransaction = (playerId: string, card: GameCard) => {
  const { addCash, deductCash } = useGameStore.getState();

  if (card.action === 'money') {
    if (card.amount > 0) {
      addCash(playerId, card.amount);
    } else if (card.amount < 0) {
      deductCash(playerId, Math.abs(card.amount));
    }
  }
};

/**
 * Handles salary for passing GO
 */
export const handlePassingGo = (playerId: string) => {
  const { collectSalary, addLog, players } = useGameStore.getState();
  const player = players.find(p => p.id === playerId);

  if (player) {
    collectSalary(playerId);
    addLog(`${player.name} passed GO and collected salary!`, 'success');
  }
};

/**
 * Handles rent payment between players
 */
export const handleRentPayment = (fromPlayerId: string, toPlayerId: string, amount: number) => {
  const { payRent, addLog, players } = useGameStore.getState();
  const fromPlayer = players.find(p => p.id === fromPlayerId);
  const toPlayer = players.find(p => p.id === toPlayerId);

  if (fromPlayer && toPlayer) {
    payRent(fromPlayerId, toPlayerId, amount);
    addLog(`${fromPlayer.name} paid $${amount} rent to ${toPlayer.name}`, 'warning');
  }
};
