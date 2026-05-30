// src/store/gameStore.ts
import { create } from 'zustand';
import { GameState, Player, BoardTile, GameSettings, GameLogEntry } from '../types';
import { OFFICIAL_BOARD_DATA } from '../constants/monopolyOfficial';
import { DEFAULT_SETTINGS } from '../constants/defaultSettings';
import { getScaledProperty } from '../utils/finance';

interface GameStore extends GameState {
  settings: GameSettings;
  totalMoves: number;
  setSettings: (settings: Partial<GameSettings>) => void;
  initGame: () => void;
  nextTurn: () => void;
  updatePlayer: (id: string, updates: Partial<Player>) => void;
  updateTile: (id: number, updates: Partial<BoardTile>) => void;
  addLog: (message: string, type?: GameLogEntry['type']) => void;
  rollDice: (forced?: [number, number]) => [number, number];
  setGameOver: (winner: Player) => void;
  setPurchaseModal: (show: boolean, tile: BoardTile | null) => void;
  buyProperty: (playerId: string, tileId: number) => void;
  buildHouse: (tileId: number) => void;
  toggleMortgage: (tileId: number) => void;
}

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
  totalMoves: 0,
  showPurchaseModal: false,
  pendingPurchaseTile: null,

  setSettings: (newSettings) => set((state) => ({
    settings: { ...state.settings, ...newSettings }
  })),

  initGame: () => {
    const { settings } = get();
    const scaledBoard: BoardTile[] = OFFICIAL_BOARD_DATA.map(prop => ({
      ...getScaledProperty(prop, settings.finance.startingCash, {
        price: settings.board.propertyPriceMultiplier,
        rent: settings.board.rentMultiplier,
        build: settings.board.buildingCostMultiplier,
      }),
      houses: 0,
      isMortgaged: false,
    }));

    const initialPlayers: Player[] = settings.players.map(p => ({
      id: p.id,
      name: p.name,
      type: p.isAI ? 'ai' : 'human',
      color: p.tokenColor,
      cash: settings.finance.startingCash,
      position: 0,
      properties: [],
      isBankrupt: false,
      isInJail: false,
      jailTurns: 0,
      getOutCards: 0,
      movesCount: 0,
    }));

    set({
      players: initialPlayers,
      board: scaledBoard,
      currentPlayerIndex: 0,
      isDiceRolled: false,
      gameLog: [{ id: '1', timestamp: Date.now(), message: 'Game started with custom settings!', type: 'info' }],
      isGameOver: false,
      winner: null,
      status: 'playing',
      totalMoves: 0,
    });
  },

  nextTurn: () => {
    const { players, currentPlayerIndex } = get();
    let nextIndex = (currentPlayerIndex + 1) % players.length;

    while (players[nextIndex].isBankrupt && players.filter(p => !p.isBankrupt).length > 1) {
      nextIndex = (nextIndex + 1) % players.length;
    }

    set({
      currentPlayerIndex: nextIndex,
      isDiceRolled: false
    });
  },

  updatePlayer: (id, updates) => set((state) => {
    const newPlayers = state.players.map(p => p.id === id ? { ...p, ...updates } : p);
    const movesAdded = updates.position !== undefined ? 1 : 0;
    return {
      players: newPlayers,
      totalMoves: state.totalMoves + movesAdded
    };
  }),

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

  buyProperty: (playerId, tileId) => set((state) => {
    const player = state.players.find(p => p.id === playerId);
    const tile = state.board.find(t => t.id === tileId);

    if (player && tile && player.cash >= tile.price) {
      return {
        players: state.players.map(p => p.id === playerId ? {
          ...p,
          cash: p.cash - tile.price,
          properties: [...p.properties, tileId]
        } : p),
        board: state.board.map(t => t.id === tileId ? { ...t, ownerId: playerId } : t),
        gameLog: [
          { id: Math.random().toString(36).substr(2, 9), timestamp: Date.now(), message: `${player.name} bought ${tile.name} for $${tile.price}`, type: 'success' },
          ...state.gameLog.slice(0, 49)
        ]
      };
    }
    return state;
  }),

  buildHouse: (tileId) => set((state) => {
    const tile = state.board.find(t => t.id === tileId);
    const owner = state.players.find(p => p.id === tile?.ownerId);

    if (!tile || !owner || !tile.housePrice || owner.cash < tile.housePrice || tile.houses >= 5 || tile.isMortgaged) return state;

    // Check for monopoly
    const groupTiles = state.board.filter(t => t.group === tile.group);
    const hasMonopoly = groupTiles.every(t => t.ownerId === owner.id && !t.isMortgaged);
    if (!hasMonopoly) return state;

    return {
      players: state.players.map(p => p.id === owner.id ? { ...p, cash: p.cash - (tile.housePrice || 0) } : p),
      board: state.board.map(t => t.id === tileId ? { ...t, houses: t.houses + 1 } : t),
      gameLog: [
        { id: Math.random().toString(36).substr(2, 9), timestamp: Date.now(), message: `${owner.name} built a ${tile.houses === 4 ? 'hotel' : 'house'} on ${tile.name}`, type: 'success' },
        ...state.gameLog.slice(0, 49)
      ]
    };
  }),

  toggleMortgage: (tileId) => set((state) => {
    const tile = state.board.find(t => t.id === tileId);
    const owner = state.players.find(p => p.id === tile?.ownerId);
    if (!tile || !owner || tile.houses > 0) return state;

    const newMortgagedState = !tile.isMortgaged;
    const cashChange = newMortgagedState ? tile.mortgageValue : -Math.round(tile.mortgageValue * 1.1);

    if (!newMortgagedState && owner.cash < Math.abs(cashChange)) return state;

    return {
      players: state.players.map(p => p.id === owner.id ? { ...p, cash: p.cash + cashChange } : p),
      board: state.board.map(t => t.id === tileId ? { ...t, isMortgaged: newMortgagedState } : t),
      gameLog: [
        { id: Math.random().toString(36).substr(2, 9), timestamp: Date.now(), message: `${owner.name} ${newMortgagedState ? 'mortgaged' : 'redeemed'} ${tile.name}`, type: 'info' },
        ...state.gameLog.slice(0, 49)
      ]
    };
  }),
}));
