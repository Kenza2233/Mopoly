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
  side: 'top' | 'right' | 'bottom' | 'left';
  isCorner?: boolean;
}

export const Tile: React.FC<TileProps> = ({ tile, players, side, isCorner }) => {
  const presentPlayers = players.filter(p => p.position === tile.position && !p.isBankrupt);
  const owner = players.find(p => p.id === tile.ownerId);

  // Determine color bar position based on side
  const colorBarClass = cn(
    "tile-color-bar",
    side === 'bottom' && "tile-color-top",
    side === 'top' && "tile-color-bottom",
    side === 'left' && "tile-color-right",
    side === 'right' && "tile-color-left"
  );

  const tileClass = cn(
    "tile h-full w-full",
    side === 'top' && "tile-top",
    side === 'left' && "tile-left",
    side === 'right' && "tile-right",
    isCorner && "bg-monopoly-green"
  );

  return (
    <div className={tileClass}>
      {/* Color Strip for Properties */}
      {tile.group && (
        <div
          className={colorBarClass}
          style={{ backgroundColor: PROPERTY_GROUP_COLORS[tile.group] }}
        />
      )}

      {/* Content */}
      <div className="tile-name">
        {tile.name}
      </div>

      {!isCorner && tile.price > 0 && (
        <div className="tile-price">
          {formatCurrency(tile.price)}
        </div>
      )}

      {/* Players on tile */}
      <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-0.5 pointer-events-none z-20 p-1">
        {presentPlayers.map(p => (
          <div
            key={p.id}
            className="w-2 h-2 sm:w-3 sm:h-3 rounded-full border border-white shadow-sm transition-transform duration-300"
            style={{ backgroundColor: p.color }}
            title={p.name}
          />
        ))}
      </div>

      {/* Houses/Hotel Indicator */}
      {tile.houses > 0 && !tile.isMortgaged && (
        <div className={cn(
          "absolute flex gap-0.5 z-30",
          side === 'bottom' ? "top-1" :
          side === 'top' ? "bottom-1" :
          side === 'left' ? "right-1 flex-col" : "left-1 flex-col"
        )}>
          {tile.houses === 5 ? (
            <div className="w-2 h-2 bg-red-600 rounded-sm shadow-sm" title="Hotel" />
          ) : (
            Array.from({ length: tile.houses }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-green-600 rounded-full shadow-sm" title="House" />
            ))
          )}
        </div>
      )}

      {/* Mortgaged Overlay */}
      {tile.isMortgaged && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-40 pointer-events-none">
          <span className="text-[6px] sm:text-[8px] font-black text-white/80 rotate-45 uppercase">Mortgaged</span>
        </div>
      )}

      {/* Ownership Indicator (Subtle background tint) */}
      {owner && (
        <div
          className="absolute inset-0 opacity-10 pointer-events-none z-0"
          style={{ backgroundColor: owner.color }}
        />
      )}
    </div>
  );
};
