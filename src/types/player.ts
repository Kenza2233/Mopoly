// src/types/player.ts

export type PlayerType = 'human' | 'ai';

export interface Player {
  id: string;
  name: string;
  type: PlayerType;
  color: string;
  cash: number;
  position: number;
  properties: number[]; // Array of tile IDs
  isBankrupt: boolean;
  isInJail: boolean;
  jailTurns: number;
  getOutCards: number;
}
