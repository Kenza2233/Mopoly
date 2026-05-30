// src/components/board/Board.tsx
import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { Tile } from './Tile';

export const Board: React.FC = () => {
  const { board, players } = useGameStore();

  if (board.length === 0) return null;

  // We map the tiles to their grid positions
  // Bottom: 0-10
  // Left: 11-19
  // Top: 20-30
  // Right: 31-39

  return (
    <div className="w-full flex justify-center items-center p-2 sm:p-4">
      <div className="monopoly-board shadow-2xl rounded-sm">
        {/* Tiles */}
        {board.map((tile, index) => {
          let gridStyle: React.CSSProperties = {};
          let side: 'top' | 'right' | 'bottom' | 'left' = 'bottom';

          if (index >= 0 && index <= 10) {
            // Bottom row: 10 down to 0
            gridStyle = { gridRow: 11, gridColumn: 11 - index };
            side = 'bottom';
          } else if (index >= 11 && index <= 19) {
            // Left column: 11 up to 19 (bottom to top)
            gridStyle = { gridColumn: 1, gridRow: 11 - (index - 10) };
            side = 'left';
          } else if (index >= 20 && index <= 30) {
            // Top row: 20 to 30
            gridStyle = { gridRow: 1, gridColumn: index - 19 };
            side = 'top';
          } else if (index >= 31 && index <= 39) {
            // Right column: 31 to 39 (top to bottom)
            gridStyle = { gridColumn: 11, gridRow: index - 29 };
            side = 'right';
          }

          return (
            <div key={tile.id} style={gridStyle} className="h-full w-full">
              <Tile
                tile={tile}
                players={players}
                side={side}
                isCorner={index % 10 === 0}
              />
            </div>
          );
        })}

        {/* Center Area */}
        <div className="center-area">
          <div className="monopoly-logo shadow-lg">
            MONOPOLY
          </div>
          <div className="mt-4 sm:mt-8 text-slate-800/40 font-black uppercase tracking-[0.2em] text-[10px] sm:text-xs text-center">
            Business Board Game
          </div>

          {/* Decorative inner border */}
          <div className="absolute inset-4 border-2 border-slate-800/5 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
