// src/store/gameStore.ts
import { create } from 'zustand';
import { Player, BoardTile, GameStatus, GameLogEntry } from '../types';
import { GameSettings, GameCard } from '../types/settings';
import { DEFAULT_SETTINGS } from '../constants/defaultSettings';
import { OFFICIAL_BOARD_DATA } from '../constants/monopolyOfficial';
import { calculateDynamicPrice, getScaledProperty } from '../utils/finance';
import { CHANCE_CARDS, COMMUNITY_CHEST_CARDS } from '../constants/cards';

interface GameState {
  // State
  players: Player[];
  currentPlayerIndex: number;
  board: BoardTile[];
  status: GameStatus;
  dice: [number, number];
  isDiceRolled: boolean;
  gameLog: GameLogEntry[];
  settings: GameSettings;
  isGameOver: boolean;
  winner: Player | null;

  // UI States
  showPurchaseModal: boolean;
  pendingPurchaseTile: BoardTile | null;
  activeCard: GameCard | null;
  isMoving: boolean;

  // Actions
  updateSettings: (settings: Partial<GameSettings>) => void;
  startGame: () => void;
  updatePlayer: (playerId: string, updates: Partial<Player>) => void;
  updateTile: (tileId: number, updates: Partial<BoardTile>) => void;
  rollDice: () => [number, number];
  setDiceRolled: (rolled: boolean) => void;
  movePlayer: (playerId: string, toPosition: number) => void;
  buyProperty: (playerId: string, tileId: number) => void;
  payRent: (fromPlayerId: string, toPlayerId: string, amount: number) => void;
  nextTurn: () => void;
  addLog: (message: string, type?: 'info' | 'success' | 'warning' | 'danger') => void;
  setPurchaseModal: (show: boolean, tile: BoardTile | null) => void;
  setGameOver: (winner: Player) => void;

  // Card Actions
  drawCard: (type: 'chance' | 'chest') => void;
  closeCard: () => void;
  setIsMoving: (moving: boolean) => void;

  // Management Actions
  buildHouse: (tileId: number) => void;
  toggleMortgage: (tileId: number) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  players: [],
  currentPlayerIndex: 0,
  board: [],
  status: 'setup',
  dice: [1, 1],
  isDiceRolled: false,
  gameLog: [{ id: '1', timestamp: Date.now(), message: 'Welcome to Monopoly!', type: 'info' }],
  settings: DEFAULT_SETTINGS,
  isGameOver: false,
  winner: null,
  showPurchaseModal: false,
  pendingPurchaseTile: null,
  activeCard: null,
  isMoving: false,

  updateSettings: (newSettings) => set((state) => ({
    settings: { ...state.settings, ...newSettings }
  })),

  startGame: () => {
    const { settings } = get();

    const initialBoard: BoardTile[] = OFFICIAL_BOARD_DATA.map(p => {
        const scaled = getScaledProperty(p, settings.finance.startingCash, {
            price: settings.board.propertyPriceMultiplier,
            rent: settings.board.rentMultiplier,
            build: settings.board.buildingCostMultiplier
        });
        return {
            ...scaled,
            ownerId: undefined,
            houses: 0,
            isMortgaged: false
        };
    });

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
      movesCount: 0
    }));

    set({
      board: initialBoard,
      players: initialPlayers,
      status: 'playing',
      currentPlayerIndex: 0,
      isGameOver: false,
      winner: null,
      gameLog: [{ id: Math.random().toString(), timestamp: Date.now(), message: '💰 Game started! Build your empire.', type: 'info' }]
    });
  },

  updatePlayer: (id, updates) => set((state) => ({
    players: state.players.map(p => p.id === id ? { ...p, ...updates } : p)
  })),

  updateTile: (id, updates) => set((state) => ({
    board: state.board.map(t => t.id === id ? { ...t, ...updates } : t)
  })),

  rollDice: () => {
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    set({ dice: [d1, d2], isDiceRolled: true });
    return [d1, d2];
  },

  setDiceRolled: (rolled) => set({ isDiceRolled: rolled }),

  setIsMoving: (moving) => set({ isMoving: moving }),

  movePlayer: (playerId, toPosition) => set((state) => {
    const players = state.players.map(p => {
      if (p.id === playerId) {
        return { ...p, position: toPosition };
      }
      return p;
    });
    return { players };
  }),

  drawCard: (type) => {
    const cards = type === 'chance' ? CHANCE_CARDS : COMMUNITY_CHEST_CARDS;
    const randomCard = cards[Math.floor(Math.random() * cards.length)];
    set({ activeCard: randomCard });
  },

  closeCard: () => {
    const { activeCard, players, currentPlayerIndex, updatePlayer } = get();
    if (!activeCard) return;

    const player = players[currentPlayerIndex];

    if (activeCard.action === 'money') {
      updatePlayer(player.id, { cash: player.cash + activeCard.amount });
    } else if (activeCard.action === 'jail') {
      updatePlayer(player.id, { position: 10, isInJail: true, jailTurns: 0 });
    } else if (activeCard.action === 'move' && activeCard.targetPosition !== undefined) {
      updatePlayer(player.id, { position: activeCard.targetPosition });
    }

    set({ activeCard: null });
  },

  buyProperty: (playerId, tileId) => set((state) => {
    const tile = state.board.find(t => t.id === tileId);
    if (!tile) return state;

    const players = state.players.map(p => {
      if (p.id === playerId) {
        return {
          ...p,
          cash: p.cash - tile.price,
          properties: [...p.properties, tileId]
        };
      }
      return p;
    });

    const board = state.board.map(t =>
      t.id === tileId ? { ...t, ownerId: playerId } : t
    );

    const playerName = players.find(p => p.id === playerId)?.name;

    return {
      players,
      board,
      gameLog: [{ id: Math.random().toString(), timestamp: Date.now(), message: `🏡 ${playerName} bought ${tile.name}`, type: 'success' }, ...state.gameLog]
    };
  }),

  payRent: (fromId, toId, amount) => set((state) => {
    const players = state.players.map(p => {
      if (p.id === fromId) return { ...p, cash: p.cash - amount };
      if (p.id === toId) return { ...p, cash: p.cash + amount };
      return p;
    });
    return { players };
  }),

  nextTurn: () => set((state) => {
    const nextIndex = (state.currentPlayerIndex + 1) % state.players.length;
    return {
      currentPlayerIndex: nextIndex,
      isDiceRolled: false
    };
  }),

  addLog: (message, type = 'info') => set((state) => ({
    gameLog: [{ id: Math.random().toString(), timestamp: Date.now(), message, type }, ...state.gameLog.slice(0, 49)]
  })),

  setPurchaseModal: (show, tile) => set({
    showPurchaseModal: show,
    pendingPurchaseTile: tile
  }),

  setGameOver: (winner) => set({ isGameOver: true, winner }),

  buildHouse: (tileId) => set((state) => {
    const tile = state.board.find(t => t.id === tileId);
    const player = state.players.find(p => p.id === tile?.ownerId);
    if (!tile || !player || tile.houses >= 5 || !tile.housePrice || player.cash < tile.housePrice) return state;

    const board = state.board.map(t => t.id === tileId ? { ...t, houses: t.houses + 1 } : t);
    const players = state.players.map(p => p.id === player.id ? { ...p, cash: p.cash - tile.housePrice! } : p);

    return { board, players };
  }),

  toggleMortgage: (tileId) => set((state) => {
    const tile = state.board.find(t => t.id === tileId);
    if (!tile || !tile.ownerId) return state;

    const player = state.players.find(p => p.id === tile.ownerId);
    if (!player) return state;

    const mortgageValue = tile.mortgageValue;
    const isNowMortgaged = !tile.isMortgaged;

    const cashChange = isNowMortgaged ? mortgageValue : -(mortgageValue * 1.1);

    return {
      board: state.board.map(t => t.id === tileId ? { ...t, isMortgaged: isNowMortgaged } : t),
      players: state.players.map(p => p.id === player.id ? { ...p, cash: p.cash + cashChange } : p)
    };
  })
}));
