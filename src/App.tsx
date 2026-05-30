// src/App.tsx
import React, { useEffect, useState } from 'react';
import { useGameStore } from './store/gameStore';
import { useGameActions } from './hooks/useGameActions';
import { Board } from './components/board/Board';
import { PlayerCard } from './components/ui/PlayerCard';
import { Dice } from './components/ui/Dice';
import { GameLog } from './components/game/GameLog';
import { SettingsModal } from './components/settings/SettingsModal';
import { formatCurrency } from './utils/currency';
import { PropertyManager } from './components/ui/PropertyManager';
import { ChanceCard } from './components/cards/ChanceCard';
import { PROPERTY_GROUP_COLORS } from './constants/colors';
import { delay } from './utils/animation';

const App: React.FC = () => {
  const {
    players, currentPlayerIndex, dice, isDiceRolled,
    status, isGameOver, winner, rollDice, nextTurn,
    showPurchaseModal, pendingPurchaseTile, setPurchaseModal,
    buyProperty, activeCard, closeCard, isMoving, setIsMoving
  } = useGameStore();

  const { handleMove, performAITurn } = useGameActions();
  const [isRolling, setIsRolling] = useState(false);

  const currentPlayer = players[currentPlayerIndex];

  useEffect(() => {
    if (status === 'playing' && currentPlayer?.type === 'ai' && !isDiceRolled && !activeCard && !isMoving) {
      performAITurn();
    }
  }, [currentPlayerIndex, status, currentPlayer?.type, performAITurn, isDiceRolled, activeCard, isMoving]);

  const onRollDice = async () => {
    if (isRolling || isDiceRolled || isMoving) return;

    setIsRolling(true);
    await delay(800);
    const [d1, d2] = rollDice();
    setIsRolling(false);

    setIsMoving(true);
    await handleMove(d1 + d2);
    setIsMoving(false);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans p-4 md:p-8 flex flex-col items-center selection:bg-monopoly-green selection:text-monopoly-darkGreen">
      <SettingsModal />

      {activeCard && (
        <ChanceCard card={activeCard} onClose={closeCard} />
      )}

      {showPurchaseModal && pendingPurchaseTile && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-[2rem] border-4 border-monopoly-darkGreen max-w-sm w-full shadow-[0_0_50px_rgba(0,0,0,0.5)] text-center animate-in fade-in zoom-in duration-300">
            <div
              className="w-full h-16 mb-6 rounded-xl border-4 border-monopoly-darkGreen/10 shadow-inner"
              style={{ backgroundColor: pendingPurchaseTile.group ? PROPERTY_GROUP_COLORS[pendingPurchaseTile.group] : '#1e293b' }}
            />
            <h3 className="text-3xl font-black text-slate-900 uppercase mb-2 tracking-tighter">{pendingPurchaseTile.name}</h3>
            <p className="text-slate-500 mb-8 font-black uppercase text-sm tracking-widest">Investment: {formatCurrency(pendingPurchaseTile.price)}</p>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => {
                  buyProperty(currentPlayer.id, pendingPurchaseTile.id);
                  setPurchaseModal(false, null);
                }}
                className="bg-monopoly-darkGreen text-white font-black py-4 rounded-2xl uppercase text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
              >
                Buy Property
              </button>
              <button
                onClick={() => setPurchaseModal(false, null)}
                className="bg-slate-100 text-slate-400 font-black py-3 rounded-2xl uppercase text-sm hover:bg-slate-200 transition-colors"
              >
                Auction / Skip
              </button>
            </div>
          </div>
        </div>
      )}

      {isGameOver && winner && (
        <div className="fixed inset-0 bg-slate-950/95 z-[90] flex flex-col items-center justify-center p-4 backdrop-blur-xl">
          <div className="text-monopoly-green text-8xl font-black mb-4 uppercase animate-bounce tracking-tighter drop-shadow-[0_0_30px_rgba(205,230,208,0.5)]">Champion!</div>
          <div
            className="w-32 h-32 rounded-full border-8 border-white mb-6 shadow-[0_0_60px_rgba(255,255,255,0.4)] animate-pulse"
            style={{ backgroundColor: winner.color }}
          />
          <div className="text-5xl font-black text-white uppercase mb-12 tracking-widest">{winner.name}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-white text-slate-950 px-12 py-5 rounded-3xl font-black uppercase text-2xl hover:scale-110 active:scale-95 transition-transform shadow-[0_20px_50px_rgba(255,255,255,0.2)]"
          >
            Restart Empire
          </button>
        </div>
      )}

      <div className="max-w-[1600px] w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Column - Players */}
        <div className="lg:col-span-3 flex flex-col gap-6 order-2 lg:order-1">
          <div className="flex flex-col gap-4">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-2">Business Tycoons</h2>
            {players.map((player, idx) => (
              <PlayerCard
                key={player.id}
                player={player}
                isActive={idx === currentPlayerIndex}
              />
            ))}
          </div>
        </div>

        {/* Center Column - Board */}
        <div className="lg:col-span-6 flex flex-col items-center gap-8 order-1 lg:order-2">
          <Board />

          <div className="flex items-center gap-12 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 w-full justify-center backdrop-blur-xl shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            <Dice values={dice} rolling={isRolling} />

            <div className="flex flex-col gap-3 min-w-[200px] relative z-10">
              {status === 'playing' && currentPlayer?.type === 'human' && (
                <>
                  {!isDiceRolled ? (
                    <button
                      onClick={onRollDice}
                      disabled={isRolling || isMoving}
                      className="bg-monopoly-green text-monopoly-darkGreen px-10 py-5 rounded-2xl font-black uppercase text-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_10px_0_#a8c3ab] disabled:opacity-50 disabled:translate-y-[4px] disabled:shadow-none"
                    >
                      Roll Dice
                    </button>
                  ) : (
                    <button
                      onClick={nextTurn}
                      disabled={isMoving}
                      className="bg-white text-monopoly-darkGreen px-10 py-5 rounded-2xl font-black uppercase text-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_10px_0_#e2e8f0] disabled:opacity-50"
                    >
                      End Turn
                    </button>
                  )}
                </>
              )}
              {currentPlayer?.type === 'ai' && (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-1 bg-monopoly-green/20 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-monopoly-green animate-[loading_1.5s_infinite]" />
                  </div>
                  <div className="text-monopoly-green font-black uppercase tracking-[0.2em] text-sm animate-pulse">
                    AI Decision...
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Logs & Management */}
        <div className="lg:col-span-3 flex flex-col gap-6 h-[700px] lg:h-[850px] order-3">
          <PropertyManager />
          <div className="flex-1 min-h-0 bg-white/5 rounded-[2rem] border border-white/10 overflow-hidden shadow-xl">
             <GameLog />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default App;
