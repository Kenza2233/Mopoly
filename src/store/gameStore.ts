// src/store/gameStore.ts
import { create } from 'zustand';
import { GameState, Player, BoardTile, GameSettings, GameLogEntry } from '../types';
import { OFFICIAL_BOARD_DATA } from '../constants/monopolyOfficial';
import { DEFAULT_SETTINGS } from '../constants/defaultSettings';
import { getScaledProperty } from '../utils/finance';

interface GameStore extends GameState {
  settings: GameSettings;
  setSettings: (settings: Partial<GameSettings>) => void;
  initGame: () => void;
  nextTurn: () => void;
  updatePlayer: (id: string, updates: Partial<Player>) => void;
  updateTile: (id: number, updates: Partial<BoardTile>) => void;
  addLog: (message: string, type?: GameLogEntry['type']) => void;
  rollDice: (forced?: [number, number]) => [number, number];
  setGameOver: (winner: Player) => void;
  setPurchaseModal: (show: boolean, tile: BoardTile | null) => void;
}

const colors = ['#f01b1b', '#0072bb', '#ffed00', '#1f363d'];

export const useGameStore = create<GameStore>((set, get) => ({
  players: [],
  currentPlayerIndex: 0,
  board: [],
  dice: [1, 1],
  isDiceRolled: false,
  gameLog: [],
  isGameOver: false,
  winner: null,
  status: 'waiting',
  settings: DEFAULT_SETTINGS,
  showPurchaseModal: false,
  pendingPurchaseTile: null,

  setSettings: (newSettings) => set((state) => ({
    settings: { ...state.settings, ...newSettings }
  })),

  initGame: () => {
    const { settings } = get();
    const scaledBoard: BoardTile[] = OFFICIAL_BOARD_DATA.map(prop => ({
      ...getScaledProperty(prop, settings.startingCash),
      houses: 0,
      isMortgaged: false,
    }));

    const initialPlayers: Player[] = [
      {
        id: 'player-1',
        name: 'You (Human)',
        type: 'human',
        color: colors[0],
        cash: settings.startingCash,
        position: 0,
        properties: [],
        isBankrupt: false,
        isInJail: false,
        jailTurns: 0,
        getOutCards: 0,
      },
      ...Array.from({ length: 3 }).map((_, i) => ({
        id: `ai-${i + 1}`,
        name: `AI Opponent ${i + 1}`,
        type: 'ai' as const,
        color: colors[i + 1],
        cash: settings.startingCash,
        position: 0,
        properties: [],
        isBankrupt: false,
        isInJail: false,
        jailTurns: 0,
        getOutCards: 0,
      }))
    ];

    set({
      players: initialPlayers,
      board: scaledBoard,
      currentPlayerIndex: 0,
      isDiceRolled: false,
      gameLog: [{ id: '1', timestamp: Date.now(), message: 'Game started!', type: 'info' }],
      isGameOver: false,
      winner: null,
      status: 'playing',
    });
  },

  nextTurn: () => {
    const { players, currentPlayerIndex } = get();
    let nextIndex = (currentPlayerIndex + 1) % players.length;

    // Skip bankrupt players
    while (players[nextIndex].isBankrupt && players.filter(p => !p.isBankrupt).length > 1) {
      nextIndex = (nextIndex + 1) % players.length;
    }

    set({
      currentPlayerIndex: nextIndex,
      isDiceRolled: false
    });
  },

  updatePlayer: (id, updates) => set((state) => ({
    players: state.players.map(p => p.id === id ? { ...p, ...updates } : p)
  })),

  updateTile: (id, updates) => set((state) => ({
    board: state.board.map(t => t.id === id ? { ...t, ...updates } : t)
  })),

  addLog: (message, type = 'info') => set((state) => ({
    gameLog: [
      { id: Math.random().toString(36).substr(2, 9), timestamp: Date.now(), message, type },
      ...state.gameLog.slice(0, 49)
    ]
  })),

  rollDice: (forced) => {
    const newDice = forced || [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
    set({ dice: newDice, isDiceRolled: true });
    return newDice;
  },

  setGameOver: (winner) => set({ isGameOver: true, winner, status: 'paused' }),

  setPurchaseModal: (show, tile) => set({ showPurchaseModal: show, pendingPurchaseTile: tile }),
}));
