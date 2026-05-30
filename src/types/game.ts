// src/types/game.ts

import { Player } from './player';
import { BoardTile } from './property';

export interface GameLogEntry {
  id: string;
  timestamp: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'danger';
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  board: BoardTile[];
  dice: [number, number];
  isDiceRolled: boolean;
  gameLog: GameLogEntry[];
  isGameOver: boolean;
  winner: Player | null;
  status: 'waiting' | 'playing' | 'paused';
  showPurchaseModal: boolean;
  pendingPurchaseTile: BoardTile | null;
}
