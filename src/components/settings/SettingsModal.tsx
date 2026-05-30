// src/components/settings/SettingsModal.tsx
import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { clsx } from 'clsx';

export const SettingsModal: React.FC = () => {
  const { status, settings, updateSettings, startGame } = useGameStore();

  if (status !== 'setup') return null;

  const handleToggle = (key: keyof typeof settings.board) => {
    updateSettings({
      board: {
        ...settings.board,
        [key]: !settings.board[key as keyof typeof settings.board]
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[80] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">

        {/* Header */}
        <div className="bg-blue-600 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter relative z-10">
            Game Setup
          </h1>
          <p className="text-white/70 font-bold uppercase tracking-widest text-sm mt-1 relative z-10">
            Configure your business empire
          </p>
        </div>

        <div className="p-6 lg:p-10 space-y-8">

          {/* Economy Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-black text-gray-900 uppercase flex items-center gap-3">
              <span className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center">💰</span>
              Economy
            </h2>

            <div className="bg-gray-50 p-6 rounded-2xl border-2 border-gray-100">
              <div className="flex justify-between mb-4">
                <label className="font-bold text-gray-700 uppercase text-xs">Starting Cash</label>
                <span className="font-black text-blue-600 text-lg">${settings.finance.startingCash.toLocaleString()}</span>
              </div>
              <input
                type="range" min="500" max="5000" step="500"
                value={settings.finance.startingCash}
                onChange={(e) => updateSettings({ finance: { ...settings.finance, startingCash: Number(e.target.value) } })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>

          {/* Rules Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-black text-gray-900 uppercase flex items-center gap-3">
              <span className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center">⚖️</span>
              Game Rules
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'enableChanceCards', label: 'Chance Cards', icon: '❓', desc: 'Enable random events' },
                { key: 'enableCommunityChest', label: 'Community Chest', icon: '📦', desc: 'Bonus fund cards' },
                { key: 'enableHousesHotels', label: 'Build Houses', icon: '🏠', desc: 'Allow improvements' },
                { key: 'enableMortgage', label: 'Mortgaging', icon: '🏦', desc: 'Borrow from bank' },
              ].map((rule) => (
                <div
                  key={rule.key}
                  className="flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-gray-200 shadow-sm transition-all hover:border-blue-200"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="text-2xl">{rule.icon}</span>
                    <div className="truncate">
                      <h4 className="font-bold text-gray-900 text-sm leading-tight">{rule.label}</h4>
                      <p className="text-[10px] text-gray-500 font-medium">{rule.desc}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle(rule.key as keyof typeof settings.board)}
                    className={clsx(
                      "w-12 h-7 rounded-full relative transition-colors flex-shrink-0",
                      settings.board[rule.key as keyof typeof settings.board] ? "bg-green-500" : "bg-gray-300"
                    )}
                  >
                    <div className={clsx(
                      "absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all",
                      settings.board[rule.key as keyof typeof settings.board] ? "left-6" : "left-1"
                    )} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full bg-blue-600 text-white font-black py-5 rounded-3xl uppercase text-2xl shadow-xl hover:bg-blue-700 active:scale-[0.98] transition-all relative overflow-hidden group"
          >
            Start Business Empire
          </button>
        </div>
      </div>
    </div>
  );
};
