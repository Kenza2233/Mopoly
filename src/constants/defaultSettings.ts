// src/constants/defaultSettings.ts
import { GameSettings } from '../types/settings';

export const DEFAULT_SETTINGS: GameSettings = {
  players: [
    { id: '1', name: 'Player 1', isAI: false, tokenColor: '#3b82f6' },
    { id: '2', name: 'AI Bot 1', isAI: true, aiDifficulty: 'medium', tokenColor: '#ef4444' },
    { id: '3', name: 'AI Bot 2', isAI: true, aiDifficulty: 'medium', tokenColor: '#eab308' },
    { id: '4', name: 'AI Bot 3', isAI: true, aiDifficulty: 'medium', tokenColor: '#10b981' },
  ],
  board: {
    propertyPriceMultiplier: 1.0,
    rentMultiplier: 1.0,
    buildingCostMultiplier: 1.0,
    enableAuction: false,
    enableFreeParkingPrize: false,
    enableHousesHotels: true,
    enableMortgage: true,
    enableChanceCards: true,
    enableCommunityChest: true,
  },
  finance: {
    startingCash: 1500,
    earlyGameRounds: 5,
    aiEarlyGameCaution: 'medium',
  },
  saveToLocalStorage: true,
};
