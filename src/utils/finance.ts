// src/utils/finance.ts
import { Property, BoardTile } from '../types';

export const calculateScaledValue = (baseValue: number, startingCash: number): number => {
  const multiplier = startingCash / 1500;
  return Math.round((baseValue * multiplier) / 10) * 10;
};

export const getScaledProperty = (property: Property, startingCash: number): Property => {
  return {
    ...property,
    price: calculateScaledValue(property.price, startingCash),
    rent: property.rent.map(r => calculateScaledValue(r, startingCash)),
    housePrice: property.housePrice ? calculateScaledValue(property.housePrice, startingCash) : undefined,
    mortgageValue: calculateScaledValue(property.mortgageValue, startingCash),
  };
};

export const calculateRent = (tile: BoardTile, allTiles: BoardTile[]): number => {
  if (tile.type === 'property') {
    if (tile.houses > 0) {
      return tile.rent[tile.houses];
    }
    // Check if owner has full set
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
    // For simplicity, we use fixed rent from the array [4, 10] multiplied by dice roll elsewhere
    // but here we just return the multiplier
    return tile.rent[ownedUtilities - 1] || 0;
  }

  return 0;
};
