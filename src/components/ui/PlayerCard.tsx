// src/components/ui/PlayerCard.tsx
import React, { useEffect, useState } from 'react';
import { Player } from '../../types';
import { clsx } from 'clsx';

interface PlayerCardProps {
  player: Player;
  isActive: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, isActive }) => {
  const [prevCash, setPrevCash] = useState(player.cash);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (player.cash !== prevCash) {
      setIsUpdating(true);
      const timer = setTimeout(() => setIsUpdating(false), 300);
      setPrevCash(player.cash);
      return () => clearTimeout(timer);
    }
  }, [player.cash, prevCash]);

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={clsx(
      "p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col gap-2 relative overflow-hidden shadow-md bg-white",
      isActive ? "border-blue-500 scale-105 shadow-xl z-10" : "border-gray-100 opacity-90",
      player.isBankrupt && "grayscale opacity-50 bg-gray-100"
    )}>
      {isActive && (
        <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] px-3 py-1 font-black uppercase rounded-bl-xl tracking-tighter">
          Active
        </div>
      )}

      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-full border-4 border-white shadow-inner"
          style={{ backgroundColor: player.color }}
        />
        <div className="overflow-hidden">
          <div className="font-black text-gray-900 uppercase text-base leading-tight truncate">{player.name}</div>
          <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
            {player.type === 'ai' ? 'AI Bot' : 'Human Player'}
          </div>
        </div>
      </div>

      <div className={clsx(
        "text-2xl font-black mt-1 transition-all duration-300",
        isUpdating ? "money-updating text-green-600 scale-110" : "text-gray-900"
      )}>
        {formatMoney(player.cash)}
      </div>

      <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-50">
        <div className="text-[10px] text-gray-400 font-black uppercase tracking-wider">
          {player.properties.length} Properties
        </div>
        {player.isInJail && (
          <div className="bg-red-600 text-white text-[9px] px-2 py-0.5 rounded-full font-black uppercase">
            In Jail
          </div>
        )}
      </div>
    </div>
  );
};
