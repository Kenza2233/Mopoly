// src/types/settings.ts

export interface PlayerSettings {
  id: string;
  name: string; // Custom name, max 20 chars
  isAI: boolean;
  aiDifficulty?: 'easy' | 'medium' | 'hard';
  tokenColor: string;
}

export interface BoardSettings {
  propertyPriceMultiplier: number; // 0.5 - 3.0
  rentMultiplier: number;
  buildingCostMultiplier: number;
  enableAuction: boolean;
  enableFreeParkingPrize: boolean;
  enableHousesHotels: boolean;
  enableMortgage: boolean;
}

export interface FinanceSettings {
  startingCash: number;
  earlyGameRounds: number; // Default: 5
  aiEarlyGameCaution: 'low' | 'medium' | 'high';
}

export interface GameSettings {
  players: PlayerSettings[];
  board: BoardSettings;
  finance: FinanceSettings;
  saveToLocalStorage: boolean;
}
