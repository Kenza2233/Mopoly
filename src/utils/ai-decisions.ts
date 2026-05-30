// src/utils/ai-decisions.ts
import { Player, BoardTile, GameSettings } from '../types';

interface AIDecision {
  action: 'buy' | 'skip';
  reason?: string;
}

export const getAIDecision = (
  player: Player,
  tile: BoardTile,
  board: BoardTile[],
  settings: GameSettings,
  totalMoves: number
): AIDecision => {
  const playerCount = settings.players.length || 4;
  const averageMoves = Math.floor(totalMoves / playerCount);
  const { earlyGameRounds, aiEarlyGameCaution } = settings.finance;

  // 1. Early Game Caution Logic
  if (averageMoves < earlyGameRounds) {
    const isCheap = tile.price <= 200;
    const isSpecial = tile.type === 'railroad' || tile.type === 'utility';

    // Check if buying completes a monopoly
    const groupTiles = board.filter(t => t.group === tile.group);
    const wouldCompleteMonopoly = groupTiles.every(t =>
      t.id === tile.id || (t.ownerId === player.id)
    );

    // Caution Threshold: How much cash must be left after purchase
    const cautionMultiplier = aiEarlyGameCaution === 'high' ? 0.6 : aiEarlyGameCaution === 'medium' ? 0.5 : 0.4;
    const minCashToKeep = settings.finance.startingCash * cautionMultiplier;
    const canAffordWithCaution = (player.cash - tile.price) >= minCashToKeep;

    if (!canAffordWithCaution && !wouldCompleteMonopoly) {
      return { action: 'skip', reason: 'Early game caution: preserving cash' };
    }

    if (!isCheap && !isSpecial && !wouldCompleteMonopoly) {
      return { action: 'skip', reason: 'Early game caution: targeting strategic properties' };
    }
  }

  // 2. Standard Decision Logic
  if (player.cash >= tile.price) {
    return { action: 'buy' };
  }

  return { action: 'skip' };
};

export const getAIDelay = (difficulty: 'easy' | 'medium' | 'hard' = 'medium'): number => {
  const delays = {
    easy: [1500, 2500],
    medium: [1000, 2000],
    hard: [800, 1500]
  };
  const [min, max] = delays[difficulty];
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
