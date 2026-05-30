// src/components/board/Tile.tsx
import React from 'react';
import { BoardTile, Player } from '../../types';
import { formatCurrency } from '../../utils/currency';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { PROPERTY_GROUP_COLORS } from '../../constants/colors';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TileProps {
  tile: BoardTile;
  players: Player[];
  isSide?: 'top' | 'right' | 'bottom' | 'left';
  isCorner?: boolean;
}

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
        <div
          className={cn(
            "absolute",
            (isSide === 'bottom' || !isSide) && "top-0 left-0 right-0 h-1/4 border-b border-monopoly-darkGreen/20",
          isSide === 'top' && "bottom-0 left-0 right-0 h-1/4 border-t border-monopoly-darkGreen/20",
          isSide === 'left' && "right-0 top-0 bottom-0 w-1/4 border-l border-monopoly-darkGreen/20",
            isSide === 'right' && "left-0 top-0 bottom-0 w-1/4 border-r border-monopoly-darkGreen/20"
          )}
          style={{ backgroundColor: PROPERTY_GROUP_COLORS[tile.group] }}
        />
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

      {/* Houses/Hotel Indicator */}
      {tile.houses > 0 && !tile.isMortgaged && (
        <div className={cn(
          "absolute flex gap-0.5 z-30",
          isSide === 'bottom' || !isSide ? "top-1" :
          isSide === 'top' ? "bottom-1" :
          isSide === 'left' ? "right-1 flex-col" : "left-1 flex-col"
        )}>
          {tile.houses === 5 ? (
            <div className="w-2 h-2 bg-red-600 rounded-sm shadow-sm" title="Hotel" />
          ) : (
            Array.from({ length: tile.houses }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-sm" title="House" />
            ))
          )}
        </div>
      )}

      {/* Mortgaged Overlay */}
      {tile.isMortgaged && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-30 pointer-events-none">
          <span className="text-[8px] font-black text-white/50 rotate-45 uppercase">Mortgaged</span>
        </div>
      )}

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
