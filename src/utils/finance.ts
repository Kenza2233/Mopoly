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

export const calculateRent = (tile: BoardTile, allTiles: BoardTile[], rentMultiplier: number = 1.0): number => {
  let baseRent = 0;

  if (tile.type === 'property') {
    if (tile.houses > 0) {
      baseRent = tile.rent[tile.houses];
    } else {
        const groupTiles = allTiles.filter(t => t.group === tile.group);
        const hasFullSet = groupTiles.every(t => t.ownerId === tile.ownerId && !t.isMortgaged);
        baseRent = hasFullSet ? tile.rent[0] * 2 : tile.rent[0];
    }
  } else if (tile.type === 'railroad') {
    const ownedRailroads = allTiles.filter(t => t.type === 'railroad' && t.ownerId === tile.ownerId && !t.isMortgaged).length;
    baseRent = tile.rent[ownedRailroads - 1] || 0;
  } else if (tile.type === 'utility') {
    const ownedUtilities = allTiles.filter(t => t.type === 'utility' && t.ownerId === tile.ownerId && !t.isMortgaged).length;
    baseRent = tile.rent[ownedUtilities - 1] || 0;
  }

  return Math.round(baseRent * rentMultiplier);
};
