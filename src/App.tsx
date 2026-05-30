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
import { PROPERTY_GROUP_COLORS } from './constants/colors';

const App: React.FC = () => {
  const {
    players, currentPlayerIndex, dice, isDiceRolled,
    status, isGameOver, winner, rollDice, nextTurn,
    showPurchaseModal, pendingPurchaseTile, setPurchaseModal,
    buyProperty
  } = useGameStore();

  const { handleMove, performAITurn } = useGameActions();
  const [isRolling, setIsRolling] = useState(false);

  const currentPlayer = players[currentPlayerIndex];

  useEffect(() => {
    if (status === 'playing' && currentPlayer?.type === 'ai' && !isDiceRolled) {
      performAITurn();
    }
  }, [currentPlayerIndex, status, currentPlayer?.type, performAITurn, isDiceRolled]);

  const onRollDice = () => {
    if (isRolling || isDiceRolled) return;

    setIsRolling(true);
    setTimeout(() => {
      const [d1, d2] = rollDice();
      setIsRolling(false);
      handleMove(d1 + d2);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans p-4 md:p-8 flex flex-col items-center">
      <SettingsModal />

      {showPurchaseModal && pendingPurchaseTile && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-monopoly-darkGreen p-8 rounded-2xl border-4 border-monopoly-green max-w-sm w-full shadow-2xl text-center animate-in fade-in zoom-in duration-300">
            <div
              className="w-full h-12 mb-4 rounded border-2 border-white/20"
              style={{ backgroundColor: pendingPurchaseTile.group ? PROPERTY_GROUP_COLORS[pendingPurchaseTile.group] : '#1f363d' }}
            />
            <h3 className="text-2xl font-black text-white uppercase mb-2">{pendingPurchaseTile.name}</h3>
            <p className="text-white/60 mb-6 font-bold uppercase text-sm">Price: {formatCurrency(pendingPurchaseTile.price)}</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  buyProperty(currentPlayer.id, pendingPurchaseTile.id);
                  setPurchaseModal(false, null);
                }}
                className="bg-monopoly-green text-monopoly-darkGreen font-black py-3 rounded-lg uppercase hover:scale-105 transition-transform"
              >
                Buy
              </button>
              <button
                onClick={() => setPurchaseModal(false, null)}
                className="bg-white/10 text-white font-black py-3 rounded-lg uppercase hover:bg-white/20 transition-colors"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      {isGameOver && winner && (
        <div className="fixed inset-0 bg-black/90 z-[60] flex flex-col items-center justify-center p-4 backdrop-blur-md">
          <div className="text-white text-6xl font-black mb-4 uppercase animate-bounce">Winner!</div>
          <div
            className="w-24 h-24 rounded-full border-4 border-white mb-4 shadow-[0_0_50px_rgba(255,255,255,0.3)]"
            style={{ backgroundColor: winner.color }}
          />
          <div className="text-4xl font-black text-white uppercase mb-8">{winner.name}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-white text-slate-900 px-8 py-3 rounded-full font-black uppercase hover:scale-110 transition-transform shadow-2xl"
          >
            New Game
          </button>
        </div>
      )}

      <div className="max-w-[1400px] w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Column - Players */}
        <div className="lg:col-span-3 flex flex-col gap-4 order-2 lg:order-1">
          <div className="flex flex-col gap-4">
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

          <div className="flex items-center gap-8 bg-white/5 p-6 rounded-2xl border border-white/10 w-full justify-center backdrop-blur-sm">
            <Dice values={dice} rolling={isRolling} />

            <div className="flex flex-col gap-2 min-w-[160px]">
              {status === 'playing' && currentPlayer?.type === 'human' && (
                <>
                  {!isDiceRolled ? (
                    <button
                      onClick={onRollDice}
                      disabled={isRolling}
                      className="bg-monopoly-green text-monopoly-darkGreen px-8 py-4 rounded-xl font-black uppercase text-xl hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50"
                    >
                      Roll Dice
                    </button>
                  ) : (
                    <button
                      onClick={nextTurn}
                      className="bg-white text-monopoly-darkGreen px-8 py-4 rounded-xl font-black uppercase text-xl hover:scale-105 active:scale-95 transition-all shadow-xl"
                    >
                      End Turn
                    </button>
                  )}
                </>
              )}
              {currentPlayer?.type === 'ai' && (
                <div className="text-monopoly-green font-black uppercase tracking-widest animate-pulse text-center">
                  AI is thinking...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Logs & Management */}
        <div className="lg:col-span-3 flex flex-col gap-4 h-[600px] lg:h-[800px] order-3">
          <PropertyManager />
          <div className="flex-1 min-h-0">
            <GameLog />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
