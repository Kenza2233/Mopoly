// src/components/settings/SettingsModal.tsx
import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { PlayerSettings, GameSettings, FinanceSettings } from '../../types';
import { DEFAULT_SETTINGS } from '../../constants/defaultSettings';

export const SettingsModal: React.FC = () => {
  const { settings, setSettings, initGame, status } = useGameStore();
  const [localSettings, setLocalSettings] = useState<GameSettings>(settings);

  const handleStart = () => {
    setSettings(localSettings);
    initGame();
  };

  const updatePlayer = (id: string, updates: Partial<PlayerSettings>) => {
    setLocalSettings(prev => ({
      ...prev,
      players: prev.players.map(p => p.id === id ? { ...p, ...updates } : p)
    }));
  };

  if (status !== 'waiting' && status !== 'paused') return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-monopoly-darkGreen p-6 md:p-8 rounded-2xl border-4 border-monopoly-green max-w-4xl w-full shadow-2xl my-8">
        <h2 className="text-3xl font-black text-white uppercase mb-6 text-center tracking-tight">Advanced Settings</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Section 1: Players */}
          <div className="space-y-4">
            <h3 className="text-monopoly-green font-black uppercase text-sm border-b border-monopoly-green/20 pb-2">👥 Players & AI</h3>
            {localSettings.players.map((p, idx) => (
              <div key={p.id} className="bg-white/5 p-3 rounded-lg space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: p.tokenColor }} />
                  <input
                    type="text"
                    value={p.name}
                    onChange={(e) => updatePlayer(p.id, { name: e.target.value.slice(0, 20) })}
                    disabled={p.isAI && false} // Allowing rename for AI too
                    placeholder={`Player ${idx + 1}`}
                    className="bg-transparent text-white font-bold border-b border-white/10 focus:border-monopoly-green outline-none w-full"
                  />
                </div>
                {p.isAI && (
                  <div className="flex gap-2">
                    {['easy', 'medium', 'hard'].map(d => (
                      <button
                        key={d}
                        onClick={() => updatePlayer(p.id, { aiDifficulty: d as 'easy' | 'medium' | 'hard' })}
                        className={`text-[10px] px-2 py-1 rounded uppercase font-bold transition-colors ${
                          p.aiDifficulty === d ? 'bg-monopoly-green text-monopoly-darkGreen' : 'bg-white/10 text-white/60'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-6">
            {/* Section 2: Finance */}
            <div className="space-y-4">
              <h3 className="text-monopoly-green font-black uppercase text-sm border-b border-monopoly-green/20 pb-2">💰 Finance & Scale</h3>
              <div>
                <label className="block text-white/40 text-[10px] font-bold uppercase mb-1">Starting Cash</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range" min="500" max="5000" step="100"
                    value={localSettings.finance.startingCash}
                    onChange={(e) => setLocalSettings(prev => ({ ...prev, finance: { ...prev.finance, startingCash: Number(e.target.value) } }))}
                    className="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-monopoly-green"
                  />
                  <span className="text-white font-black text-sm w-16 text-right">${localSettings.finance.startingCash}</span>
                </div>
              </div>
            </div>

            {/* Section 3: Board Multipliers */}
            <div className="space-y-4">
              <h3 className="text-monopoly-green font-black uppercase text-sm border-b border-monopoly-green/20 pb-2">🎲 Board Rules</h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { label: 'Property Price', key: 'propertyPriceMultiplier' },
                  { label: 'Rent Multiplier', key: 'rentMultiplier' },
                  { label: 'Building Cost', key: 'buildingCostMultiplier' }
                ].map(item => (
                  <div key={item.key}>
                    <label className="block text-white/40 text-[10px] font-bold uppercase mb-1">{item.label}</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range" min="0.5" max="3.0" step="0.1"
                        value={localSettings.board[item.key as keyof typeof localSettings.board] as number}
                        onChange={(e) => setLocalSettings(prev => ({
                          ...prev,
                          board: { ...prev.board, [item.key]: Number(e.target.value) }
                        }))}
                        className="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-monopoly-green"
                      />
                      <span className="text-white font-black text-sm w-10 text-right">{Number(localSettings.board[item.key as keyof typeof localSettings.board]).toFixed(1)}x</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: AI Behavior */}
            <div className="space-y-4">
              <h3 className="text-monopoly-green font-black uppercase text-sm border-b border-monopoly-green/20 pb-2">🤖 AI Behavior</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/40 text-[10px] font-bold uppercase mb-1">Early Caution (Rds)</label>
                  <input
                    type="number" min="0" max="20"
                    value={localSettings.finance.earlyGameRounds}
                    onChange={(e) => setLocalSettings(prev => ({ ...prev, finance: { ...prev.finance, earlyGameRounds: Number(e.target.value) } }))}
                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-white font-bold outline-none focus:border-monopoly-green"
                  />
                </div>
                <div>
                  <label className="block text-white/40 text-[10px] font-bold uppercase mb-1">Caution Level</label>
                  <select
                    value={localSettings.finance.aiEarlyGameCaution}
                    onChange={(e) => setLocalSettings(prev => ({
                      ...prev,
                      finance: { ...prev.finance, aiEarlyGameCaution: e.target.value as FinanceSettings['aiEarlyGameCaution'] }
                    }))}
                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-white font-bold outline-none focus:border-monopoly-green appearance-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={() => setLocalSettings(DEFAULT_SETTINGS)}
            className="flex-1 bg-white/5 text-white/60 font-bold py-3 rounded-xl uppercase text-sm hover:bg-white/10 transition-all"
          >
            Reset Defaults
          </button>
          <button
            onClick={handleStart}
            className="flex-[2] bg-monopoly-green text-monopoly-darkGreen font-black py-3 rounded-xl uppercase text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
          >
            {status === 'waiting' ? 'Start Game' : 'Resume Game'}
          </button>
        </div>
      </div>
    </div>
  );
};
