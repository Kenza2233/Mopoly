// src/types/settings.ts

export interface GameSettings {
  startingCash: number;
  maxPlayers: number;
  aiDifficulty: 'easy' | 'medium' | 'hard';
  fastMode: boolean;
}
