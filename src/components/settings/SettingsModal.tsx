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
      <div className="bg-white/95 w-full max-w-4xl rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">

        {/* Header */}
        <div className="bg-monopoly-darkGreen p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter relative z-10">
            Game Setup
          </h1>
          <p className="text-monopoly-green/60 font-bold uppercase tracking-widest text-sm mt-1 relative z-10">
            Configure your business empire
          </p>
        </div>

        <div className="p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Economy Section */}
            <div className="space-y-8">
              <h2 className="text-xl font-black text-slate-800 uppercase flex items-center gap-3">
                <span className="w-8 h-8 bg-slate-800 text-white rounded-lg flex items-center justify-center">💰</span>
                Economy
              </h2>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="font-bold text-slate-600 uppercase text-xs">Starting Cash</label>
                    <span className="font-black text-monopoly-darkGreen">${settings.finance.startingCash.toLocaleString()}</span>
                  </div>
                  <input
                    type="range" min="500" max="5000" step="500"
                    value={settings.finance.startingCash}
                    onChange={(e) => updateSettings({ finance: { ...settings.finance, startingCash: Number(e.target.value) } })}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-monopoly-darkGreen"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="font-bold text-slate-600 uppercase text-xs">AI Difficulty</label>
                    <span className="font-black text-monopoly-darkGreen uppercase text-xs">{settings.players[1].aiDifficulty}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {(['easy', 'medium', 'hard'] as const).map(diff => (
                      <button
                        key={diff}
                        onClick={() => {
                          const newPlayers = settings.players.map(p => p.isAI ? { ...p, aiDifficulty: diff } : p);
                          updateSettings({ players: newPlayers });
                        }}
                        className={clsx(
                          "py-2 rounded-xl font-black uppercase text-xs transition-all border-2",
                          settings.players[1].aiDifficulty === diff
                            ? "bg-monopoly-darkGreen border-monopoly-darkGreen text-white shadow-lg"
                            : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                        )}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Rules Section */}
            <div className="space-y-8">
              <h2 className="text-xl font-black text-slate-800 uppercase flex items-center gap-3">
                <span className="w-8 h-8 bg-slate-800 text-white rounded-lg flex items-center justify-center">⚖️</span>
                Game Rules
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'enableChanceCards', label: 'Chance Cards', icon: '❓' },
                  { key: 'enableCommunityChest', label: 'Community Chest', icon: '📦' },
                  { key: 'enableHousesHotels', label: 'Build Houses', icon: '🏠' },
                  { key: 'enableMortgage', label: 'Mortgaging', icon: '🏦' },
                  { key: 'enableFreeParkingPrize', label: 'Free Parking Cash', icon: '🅿️' },
                  { key: 'enableAuction', label: 'Property Auction', icon: '🔨' },
                ].map((rule) => (
                  <button
                    key={rule.key}
                    onClick={() => handleToggle(rule.key as keyof typeof settings.board)}
                    className={clsx(
                      "flex items-center justify-between p-4 rounded-2xl border-2 transition-all group",
                      settings.board[rule.key as keyof typeof settings.board]
                        ? "bg-monopoly-green/10 border-monopoly-green shadow-[0_4px_0_#cde6d0]"
                        : "bg-white border-slate-100 text-slate-400"
                    )}
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-xs font-black uppercase opacity-60">{rule.icon}</span>
                      <span className="font-bold text-[11px] uppercase whitespace-nowrap">{rule.label}</span>
                    </div>
                    <div className={clsx(
                      "w-10 h-5 rounded-full relative transition-colors",
                      settings.board[rule.key as keyof typeof settings.board] ? "bg-green-500" : "bg-slate-200"
                    )}>
                      <div className={clsx(
                        "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
                        settings.board[rule.key as keyof typeof settings.board] ? "left-6" : "left-1"
                      )} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>

          <button
            onClick={startGame}
            className="w-full mt-12 bg-monopoly-darkGreen text-white font-black py-6 rounded-3xl uppercase text-2xl shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            Start Business Empire
          </button>
        </div>
      </div>
    </div>
  );
};
