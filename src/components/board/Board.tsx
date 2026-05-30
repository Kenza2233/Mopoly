// src/components/board/Board.tsx
import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { Tile } from './Tile';

export const Board: React.FC = () => {
  const { board, players } = useGameStore();

  if (board.length === 0) return null;

  // Split board into sides
  const bottomRow = board.slice(0, 11).reverse(); // 10 to 0
  const leftCol = board.slice(11, 20); // 11 to 19
  const topRow = board.slice(20, 31); // 20 to 30
  const rightCol = board.slice(31, 40).reverse(); // 39 to 31

  return (
    <div className="aspect-square w-full max-w-[700px] bg-monopoly-darkGreen p-2 shadow-2xl rounded-lg">
      <div className="grid grid-cols-11 grid-rows-11 h-full gap-0.5 bg-monopoly-darkGreen border-2 border-monopoly-darkGreen">

        {/* Top Row (20-30) */}
        {topRow.map((tile, i) => (
          <div key={tile.id} className="col-start-1" style={{ gridColumnStart: i + 1, gridRowStart: 1 }}>
            <Tile
              tile={tile}
              players={players}
              isSide="top"
              isCorner={i === 0 || i === 10}
            />
          </div>
        ))}

        {/* Left Column (11-19) */}
        {leftCol.map((tile, i) => (
          <div key={tile.id} className="col-start-1" style={{ gridRowStart: 10 - i, gridColumnStart: 1 }}>
            <Tile tile={tile} players={players} isSide="left" />
          </div>
        ))}

        {/* Right Column (31-39) */}
        {rightCol.map((tile, i) => (
          <div key={tile.id} className="col-start-11" style={{ gridRowStart: i + 2, gridColumnStart: 11 }}>
            <Tile tile={tile} players={players} isSide="right" />
          </div>
        ))}

        {/* Bottom Row (0-10) */}
        {bottomRow.map((tile, i) => (
          <div key={tile.id} className="row-start-11" style={{ gridColumnStart: 11 - i, gridRowStart: 11 }}>
            <Tile
              tile={tile}
              players={players}
              isSide="bottom"
              isCorner={i === 0 || i === 10}
            />
          </div>
        ))}

        {/* Center Area */}
        <div className="col-start-2 col-end-11 row-start-2 row-end-11 bg-monopoly-green flex flex-col items-center justify-center p-8 text-center">
          <h1 className="text-6xl font-black text-monopoly-darkGreen tracking-tighter transform -rotate-45 border-4 border-monopoly-darkGreen px-4">
            MONOPOLY
          </h1>
          <div className="mt-12 text-monopoly-darkGreen/40 font-bold uppercase tracking-widest">
            Business Board Game
          </div>
        </div>
      </div>
    </div>
  );
};
