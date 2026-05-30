// src/components/cards/ChanceCard.tsx
import React from 'react';
import { GameCard } from '../../types/settings';
import { clsx } from 'clsx';

interface ChanceCardProps {
  card: GameCard;
  onClose: () => void;
}

export const ChanceCard: React.FC<ChanceCardProps> = ({ card, onClose }) => {
  const isChance = card.type === 'chance';

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div
        className={clsx(
          "relative w-full max-w-sm aspect-[3/4] rounded-3xl p-8 flex flex-col items-center justify-between text-center shadow-2xl animate-in fade-in zoom-in spin-in-1 duration-500",
          isChance ? "bg-gradient-to-br from-orange-400 to-orange-600" : "bg-gradient-to-br from-sky-400 to-sky-600"
        )}
      >
        {/* Card Header */}
        <div className="w-full flex justify-between items-center mb-4">
          <div className="text-white/30 font-black text-4xl uppercase tracking-tighter">
            {isChance ? '?' : '★'}
          </div>
          <div className="text-white font-black text-xl uppercase tracking-widest">
            {isChance ? 'Chance' : 'Community Chest'}
          </div>
          <div className="text-white/30 font-black text-4xl uppercase tracking-tighter">
            {isChance ? '?' : '★'}
          </div>
        </div>

        {/* Card Icon/Art area */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-6xl">
              {card.action === 'jail' ? '🚔' : card.amount > 0 ? '💰' : card.amount < 0 ? '💸' : '🏃'}
            </span>
          </div>
        </div>

        {/* Card Text */}
        <div className="flex-[1.5] flex flex-col items-center justify-center gap-4">
          <h2 className="text-2xl font-black text-white leading-tight drop-shadow-lg">
            {card.text}
          </h2>
          {card.amount !== 0 && (
            <div className="text-4xl font-black text-white bg-black/20 px-6 py-2 rounded-full border border-white/20">
              {card.amount > 0 ? '+' : ''}${Math.abs(card.amount)}
            </div>
          )}
        </div>

        {/* Footer */}
        <button
          onClick={onClose}
          className="w-full bg-white text-slate-900 font-black py-4 rounded-2xl uppercase text-xl shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          Continue
        </button>

        {/* Decorative elements */}
        <div className="absolute top-4 left-4 right-4 bottom-4 border-2 border-white/20 rounded-2xl pointer-events-none" />
      </div>
    </div>
  );
};
