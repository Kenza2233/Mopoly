// src/constants/defaultSettings.ts
import { GameSettings } from '../types';

export const DEFAULT_SETTINGS: GameSettings = {
  players: [
    { id: 'player-1', name: 'Player 1', isAI: false, tokenColor: '#f01b1b' },
    { id: 'ai-1', name: 'AI Bot 1', isAI: true, aiDifficulty: 'medium', tokenColor: '#0072bb' },
    { id: 'ai-2', name: 'AI Bot 2', isAI: true, aiDifficulty: 'medium', tokenColor: '#ffed00' },
    { id: 'ai-3', name: 'AI Bot 3', isAI: true, aiDifficulty: 'medium', tokenColor: '#1f363d' },
  ],
  board: {
    propertyPriceMultiplier: 1.0,
    rentMultiplier: 1.0,
    buildingCostMultiplier: 1.0,
    enableAuction: false,
    enableFreeParkingPrize: false,
    enableHousesHotels: true,
    enableMortgage: true,
  },
  finance: {
    startingCash: 1500,
    earlyGameRounds: 5,
    aiEarlyGameCaution: 'medium',
  },
  saveToLocalStorage: true,
};
