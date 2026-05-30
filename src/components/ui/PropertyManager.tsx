// src/components/ui/PropertyManager.tsx
import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { formatCurrency } from '../../utils/currency';
import { PROPERTY_GROUP_COLORS } from '../../constants/colors';

export const PropertyManager: React.FC = () => {
  const { players, currentPlayerIndex, board, buildHouse, toggleMortgage, status } = useGameStore();
  const currentPlayer = players[currentPlayerIndex];

  if (status !== 'playing' || !currentPlayer || currentPlayer.type !== 'human') return null;

  const ownedProperties = board.filter(t => t.ownerId === currentPlayer.id);

  if (ownedProperties.length === 0) return null;

  return (
    <div className="bg-black/20 rounded-xl p-4 flex flex-col gap-4 border border-white/5 overflow-hidden">
      <h3 className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Manage Properties</h3>
      <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar max-h-[300px] pr-2">
        {ownedProperties.map(tile => {
          const groupTiles = board.filter(t => t.group === tile.group);
          const hasMonopoly = tile.group && groupTiles.every(t => t.ownerId === currentPlayer.id && !t.isMortgaged);
          const canBuild = hasMonopoly && tile.housePrice && tile.houses < 5 && !tile.isMortgaged;
          const canMortgage = tile.houses === 0;

          return (
            <div key={tile.id} className="bg-white/5 p-2 rounded border border-white/10 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-8 rounded"
                  style={{ backgroundColor: tile.group ? PROPERTY_GROUP_COLORS[tile.group] : '#333' }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-white font-bold text-xs truncate uppercase">{tile.name}</div>
                  <div className="text-white/40 text-[10px]">
                    {tile.isMortgaged ? 'MORTGAGED' : `${tile.houses === 5 ? 'Hotel' : tile.houses + ' Houses'}`}
                  </div>
                </div>
              </div>

              <div className="flex gap-1">
                {tile.housePrice && (
                  <button
                    onClick={() => buildHouse(tile.id)}
                    disabled={!canBuild || currentPlayer.cash < (tile.housePrice || 0)}
                    className="flex-1 bg-monopoly-green/10 text-monopoly-green text-[9px] font-bold py-1 rounded uppercase disabled:opacity-20 hover:bg-monopoly-green/20"
                  >
                    Build (${tile.housePrice})
                  </button>
                )}
                <button
                  onClick={() => toggleMortgage(tile.id)}
                  disabled={!canMortgage || (!tile.isMortgaged && currentPlayer.cash < Math.round(tile.mortgageValue * 1.1) && false)}
                  className="flex-1 bg-white/5 text-white/60 text-[9px] font-bold py-1 rounded uppercase disabled:opacity-20 hover:bg-white/10"
                >
                  {tile.isMortgaged ? 'Redeem' : 'Mortgage'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
