// src/components/ui/PlayerCard.tsx
import React from 'react';
import { Player } from '../../types';
import { formatCurrency } from '../../utils/currency';
import { clsx } from 'clsx';

interface PlayerCardProps {
  player: Player;
  isActive: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, isActive }) => {
  return (
    <div className={clsx(
      "p-4 rounded-xl border-2 transition-all duration-300 flex flex-col gap-2 relative overflow-hidden",
      isActive ? "border-white bg-white/20 shadow-lg scale-105" : "border-transparent bg-white/5 opacity-80",
      player.isBankrupt && "grayscale opacity-50"
    )}>
      {isActive && (
        <div className="absolute top-0 right-0 bg-white text-monopoly-darkGreen text-[10px] px-2 py-0.5 font-bold uppercase rounded-bl-lg">
          Current Turn
        </div>
      )}

      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full border-2 border-white/50"
          style={{ backgroundColor: player.color }}
        />
        <div className="overflow-hidden">
          <div className="font-black text-white uppercase text-sm leading-tight truncate">{player.name}</div>
          <div className="text-white/60 text-[10px] font-bold uppercase">
            {player.type === 'ai' ? `AI Bot • ${player.movesCount} rds` : 'Human'}
          </div>
        </div>
      </div>

      <div className="text-2xl font-black text-white mt-1">
        {formatCurrency(player.cash)}
      </div>

      <div className="flex justify-between items-end mt-auto">
        <div className="text-[10px] text-white/50 font-bold uppercase">
          {player.properties.length} Properties
        </div>
        {player.isInJail && (
          <div className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded font-bold">
            IN JAIL
          </div>
        )}
      </div>
    </div>
  );
};
