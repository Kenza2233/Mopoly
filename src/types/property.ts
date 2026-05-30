// src/types/property.ts

export type PropertyGroup =
  | 'brown' | 'lightBlue' | 'pink' | 'orange'
  | 'red' | 'yellow' | 'green' | 'darkBlue'
  | 'railroad' | 'utility';

export type TileType = 'property' | 'tax' | 'chance' | 'chest' | 'corner' | 'railroad' | 'utility';

export interface Property {
  id: number;
  name: string;
  type: TileType;
  group?: PropertyGroup;
  price: number;
  rent: number[]; // [base, 1 house, 2 houses, 3 houses, 4 houses, hotel]
  housePrice?: number;
  mortgageValue: number;
  position: number;
}

export interface BoardTile extends Property {
  ownerId?: string;
  houses: number; // 5 means hotel
  isMortgaged: boolean;
}
