// src/types/settings.ts

export type CardActionType = 'money' | 'move' | 'jail' | 'outOfJail';

export interface GameCard {
  id: number;
  text: string;
  amount: number;
  action: CardActionType;
  type: 'chance' | 'chest';
  targetPosition?: number;
}

export interface PlayerSettings {
  id: string;
  name: string;
  isAI: boolean;
  aiDifficulty?: 'easy' | 'medium' | 'hard';
  tokenColor: string;
}

export interface BoardSettings {
  propertyPriceMultiplier: number;
  rentMultiplier: number;
  buildingCostMultiplier: number;
  enableAuction: boolean;
  enableFreeParkingPrize: boolean;
  enableHousesHotels: boolean;
  enableMortgage: boolean;
  enableChanceCards: boolean;
  enableCommunityChest: boolean;
}

export interface FinanceSettings {
  startingCash: number;
  earlyGameRounds: number;
  aiEarlyGameCaution: 'low' | 'medium' | 'high';
}

export interface GameSettings {
  players: PlayerSettings[];
  board: BoardSettings;
  finance: FinanceSettings;
  saveToLocalStorage: boolean;
}
