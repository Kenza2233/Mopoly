// src/components/board/Tile.tsx
import React from 'react';
import { BoardTile, Player } from '../../types';
import { formatCurrency } from '../../utils/currency';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TileProps {
  tile: BoardTile;
  players: Player[];
  isSide?: 'top' | 'right' | 'bottom' | 'left';
  isCorner?: boolean;
}

const colorMap: Record<string, string> = {
  brown: 'bg-amber-900',
  lightBlue: 'bg-sky-300',
  pink: 'bg-pink-500',
  orange: 'bg-orange-500',
  red: 'bg-red-600',
  yellow: 'bg-yellow-400',
  green: 'bg-green-600',
  darkBlue: 'bg-blue-800',
};

export const Tile: React.FC<TileProps> = ({ tile, players, isSide, isCorner }) => {
  const presentPlayers = players.filter(p => p.position === tile.position && !p.isBankrupt);
  const owner = players.find(p => p.id === tile.ownerId);

  return (
    <div className={cn(
      "relative border border-monopoly-darkGreen/20 flex flex-col items-center justify-between text-[10px] font-bold text-center p-1",
      isCorner ? "w-full h-full bg-monopoly-green" : "bg-monopoly-green",
      isSide === 'top' && "flex-col-reverse",
      isSide === 'left' && "flex-row-reverse items-center justify-center gap-1",
      isSide === 'right' && "flex-row items-center justify-center gap-1"
    )}>
      {/* Color Strip */}
      {tile.group && (
        <div className={cn(
          "absolute",
          colorMap[tile.group],
          (isSide === 'bottom' || !isSide) && "top-0 left-0 right-0 h-1/4 border-b border-monopoly-darkGreen/20",
          isSide === 'top' && "bottom-0 left-0 right-0 h-1/4 border-t border-monopoly-darkGreen/20",
          isSide === 'left' && "right-0 top-0 bottom-0 w-1/4 border-l border-monopoly-darkGreen/20",
          isSide === 'right' && "left-0 top-0 bottom-0 w-1/4 border-r border-monopoly-darkGreen/20"
        )} />
      )}

      {/* Content */}
      <span className={cn(
        "uppercase leading-tight z-10",
        isSide === 'left' || isSide === 'right' ? "rotate-0 [writing-mode:vertical-rl]" : ""
      )}>
        {tile.name}
      </span>

      {!isCorner && tile.price > 0 && (
        <span className="z-10">{formatCurrency(tile.price)}</span>
      )}

      {/* Players on tile */}
      <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-0.5 pointer-events-none z-20">
        {presentPlayers.map(p => (
          <div
            key={p.id}
            className="w-3 h-3 rounded-full border border-white shadow-sm"
            style={{ backgroundColor: p.color }}
          />
        ))}
      </div>

      {/* Ownership Indicator */}
      {owner && (
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundColor: owner.color }}
        />
      )}
    </div>
  );
};
