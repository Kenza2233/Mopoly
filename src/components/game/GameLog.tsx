// src/components/game/GameLog.tsx
import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../../store/gameStore';

export const GameLog: React.FC = () => {
  const { gameLog } = useGameStore();
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = 0;
    }
  }, [gameLog]);

  return (
    <div className="bg-black/20 rounded-xl p-4 flex flex-col h-full border border-white/5">
      <h3 className="text-white/40 text-xs font-bold uppercase mb-4 tracking-widest">Game Events</h3>
      <div
        ref={logRef}
        className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar"
      >
        {gameLog.map((log) => (
          <div
            key={log.id}
            className={`text-sm font-medium leading-tight p-2 rounded border-l-4 ${
              log.type === 'success' ? 'bg-green-500/10 border-green-500 text-green-400' :
              log.type === 'danger' ? 'bg-red-500/10 border-red-500 text-red-400' :
              log.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500 text-yellow-400' :
              'bg-white/5 border-white/20 text-white/80'
            }`}
          >
            {log.message}
          </div>
        ))}
      </div>
    </div>
  );
};
