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

  const colorBarClass = cn(
    "tile-color-bar transition-all duration-300",
    side === 'bottom' && "tile-color-top",
    side === 'top' && "tile-color-bottom",
    side === 'left' && "tile-color-right",
    side === 'right' && "tile-color-left"
  );

  const isChance = tile.type === 'chance';
  const isChest = tile.type === 'chest';

  const tileClass = cn(
    "tile h-full w-full transition-all duration-300 group hover:z-50",
    side === 'top' && "tile-top",
    side === 'left' && "tile-left",
    side === 'right' && "tile-right",
    isCorner && "bg-monopoly-green",
    "hover:bg-white/90 active:scale-95 cursor-default shadow-sm"
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

      {/* Chance/Chest Badge */}
      {(isChance || isChest) && (
        <div className={clsx(
          "absolute inset-0 flex items-center justify-center pointer-events-none opacity-20",
          isChance ? "text-orange-500" : "text-sky-500"
        )}>
          <span className="text-4xl font-black">{isChance ? '?' : '★'}</span>
        </div>
      )}

      {/* Content */}
      <div className={clsx(
        "tile-name transition-transform duration-300 group-hover:scale-110",
        (isChance || isChest) && "font-black"
      )}>
        {tile.name}
      </div>

      {!isCorner && tile.price > 0 && (
        <div className="tile-price font-black opacity-60">
          {formatCurrency(tile.price)}
        </div>
      )}

      {/* Players on tile */}
      <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-0.5 pointer-events-none z-20 p-1">
        {presentPlayers.map(p => (
          <div
            key={p.id}
            className="w-2.5 h-2.5 sm:w-4 sm:h-4 rounded-full border-2 border-white shadow-xl transition-all duration-500 ease-in-out transform hover:scale-125"
            style={{
              backgroundColor: p.color,
              transitionProperty: 'top, left, transform',
              position: 'relative'
            }}
            title={p.name}
          />
        ))}
      </div>

      {/* Houses/Hotel Indicator */}
      {tile.houses > 0 && !tile.isMortgaged && (
        <div className={cn(
          "absolute flex gap-0.5 z-30 transition-transform duration-300",
          side === 'bottom' ? "top-1" :
          side === 'top' ? "bottom-1" :
          side === 'left' ? "right-1 flex-col" : "left-1 flex-col"
        )}>
          {tile.houses === 5 ? (
            <div className="w-3 h-3 bg-red-600 rounded-sm shadow-md border border-red-800" title="Hotel" />
          ) : (
            Array.from({ length: tile.houses }).map((_, i) => (
              <div key={i} className="w-2 h-2 bg-green-600 rounded-full shadow-md border border-green-800" title="House" />
            ))
          )}
        </div>
      )}

      {/* Mortgaged Overlay */}
      {tile.isMortgaged && (
        <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center z-40 pointer-events-none backdrop-blur-[1px]">
          <span className="text-[6px] sm:text-[9px] font-black text-white/90 rotate-[-15deg] uppercase px-1 bg-red-600 rounded shadow-lg">Mortgaged</span>
        </div>
      )}

      {/* Ownership Indicator */}
      {owner && (
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none z-0 transition-opacity group-hover:opacity-20"
          style={{ backgroundColor: owner.color }}
        />
      )}

      {/* Active Turn Highlight */}
      {players.find(p => p.position === tile.position && players[0].id === p.id) && (
         <div className="absolute inset-0 border-2 border-white/30 animate-pulse pointer-events-none rounded-sm" />
      )}
    </div>
  );
};
