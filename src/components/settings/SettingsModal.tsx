// src/components/settings/SettingsModal.tsx
import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';

export const SettingsModal: React.FC = () => {
  const { settings, setSettings, initGame, status } = useGameStore();
  const [cash, setCash] = useState(settings.startingCash);

  const handleStart = () => {
    setSettings({ startingCash: cash });
    initGame();
  };

  if (status !== 'waiting' && status !== 'paused') return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-monopoly-darkGreen p-8 rounded-2xl border-4 border-monopoly-green max-w-md w-full shadow-2xl">
        <h2 className="text-3xl font-black text-white uppercase mb-6 text-center tracking-tight">Game Settings</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-white/60 text-xs font-bold uppercase mb-2">Starting Cash</label>
            <input
              type="range"
              min="500"
              max="5000"
              step="100"
              value={cash}
              onChange={(e) => setCash(Number(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-monopoly-green"
            />
            <div className="text-right text-monopoly-green font-black text-xl mt-2">${cash}</div>
          </div>

          <div>
            <label className="block text-white/60 text-xs font-bold uppercase mb-2">AI Difficulty</label>
            <div className="grid grid-cols-3 gap-2">
              {['easy', 'medium', 'hard'].map((d) => (
                <button
                  key={d}
                  onClick={() => setSettings({ aiDifficulty: d as any })}
                  className={`py-2 rounded-lg font-bold uppercase text-xs transition-colors ${
                    settings.aiDifficulty === d
                      ? 'bg-monopoly-green text-monopoly-darkGreen'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleStart}
            className="w-full bg-monopoly-green text-monopoly-darkGreen font-black py-4 rounded-xl uppercase text-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            {status === 'waiting' ? 'Start Game' : 'Restart Game'}
          </button>
        </div>
      </div>
    </div>
  );
};
