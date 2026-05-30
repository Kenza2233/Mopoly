// src/utils/finance.ts
import { Property, BoardTile } from '../types';

export const calculateDynamicPrice = (
  basePrice: number,
  startingCash: number,
  baseStartingCash: number = 1500
): number => {
  const multiplier = startingCash / baseStartingCash;
  // Bulatkan ke kelipatan $50 agar UI rapi
  return Math.round((basePrice * multiplier) / 50) * 50;
};

export const getScaledProperty = (
  property: Property,
  startingCash: number,
  multipliers: { price: number; rent: number; build: number }
): Property => {
  const dynamicMultiplier = startingCash / 1500;

  return {
    ...property,
    price: Math.round((property.price * dynamicMultiplier * multipliers.price) / 50) * 50,
    rent: property.rent.map(r => Math.round((r * dynamicMultiplier * multipliers.rent) / 10) * 10),
    housePrice: property.housePrice
      ? Math.round((property.housePrice * dynamicMultiplier * multipliers.build) / 50) * 50
      : undefined,
    mortgageValue: Math.round((property.mortgageValue * dynamicMultiplier) / 50) * 50,
  };
};

export const calculateRent = (tile: BoardTile, allTiles: BoardTile[]): number => {
  if (tile.type === 'property') {
    if (tile.houses > 0) {
      return tile.rent[tile.houses];
    }
    const groupTiles = allTiles.filter(t => t.group === tile.group);
    const hasFullSet = groupTiles.every(t => t.ownerId === tile.ownerId && !t.isMortgaged);
    return hasFullSet ? tile.rent[0] * 2 : tile.rent[0];
  }

  if (tile.type === 'railroad') {
    const ownedRailroads = allTiles.filter(t => t.type === 'railroad' && t.ownerId === tile.ownerId && !t.isMortgaged).length;
    return tile.rent[ownedRailroads - 1] || 0;
  }

  if (tile.type === 'utility') {
    const ownedUtilities = allTiles.filter(t => t.type === 'utility' && t.ownerId === tile.ownerId && !t.isMortgaged).length;
    return tile.rent[ownedUtilities - 1] || 0;
  }

  return 0;
};
