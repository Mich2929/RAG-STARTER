import React from 'react';
import { X, Trash2, ArrowUpRight, ArrowDownRight, Star } from 'lucide-react';
import { StockItem, IndexItem } from '../types';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  watchlistSymbols: Set<string>;
  stocks: StockItem[];
  indices: IndexItem[];
  onSelectSymbol: (symbol: string) => void;
  onRemoveSymbol: (symbol: string) => void;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  watchlistSymbols,
  stocks,
  indices,
  onSelectSymbol,
  onRemoveSymbol,
}) => {
  if (!isOpen) return null;

  // Find all items in watchlist
  const watchlistItems = [
    ...stocks.filter((s) => watchlistSymbols.has(s.symbol)),
    ...indices.filter((i) => watchlistSymbols.has(i.ticker)),
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-sm bg-white dark:bg-[#1e222d] border-l border-[#e0e3eb] dark:border-[#2a2e39] h-full shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[#e0e3eb] dark:border-[#2a2e39] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <h3 className="font-bold text-base text-[#131722] dark:text-white">
              My Watchlist ({watchlistItems.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-[#f0f3fa] dark:hover:bg-[#252936] text-[#787b86]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800 p-2">
          {watchlistItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#787b86] space-y-3">
              <Star className="w-8 h-8 mx-auto text-gray-300 dark:text-gray-600" />
              <p>Your watchlist is currently empty.</p>
              <p className="text-[11px]">Click the star icon next to any stock or index to pin it here for quick monitoring.</p>
            </div>
          ) : (
            watchlistItems.map((item) => {
              const symbol = 'ticker' in item ? item.ticker : item.symbol;
              const isPos = item.changePercent >= 0;
              return (
                <div
                  key={symbol}
                  onClick={() => {
                    onSelectSymbol(symbol);
                    onClose();
                  }}
                  className="p-3 flex items-center justify-between hover:bg-[#f0f3fa] dark:hover:bg-[#252936] rounded-xl transition cursor-pointer group"
                >
                  <div>
                    <div className="font-bold text-sm text-[#131722] dark:text-white group-hover:text-[#2962ff] transition">
                      {symbol}
                    </div>
                    <div className="text-xs text-[#787b86] truncate max-w-[120px]">{item.name}</div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-sm font-semibold text-[#131722] dark:text-white tabular-nums">
                        ${item.price.toFixed(2)}
                      </div>
                      <div
                        className={`text-xs font-semibold flex items-center justify-end space-x-0.5 tabular-nums ${
                          isPos ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {isPos ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        <span>{isPos ? `+${item.changePercent}%` : `${item.changePercent}%`}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveSymbol(symbol);
                      }}
                      className="p-1 rounded text-[#787b86] hover:text-[#f23645] opacity-0 group-hover:opacity-100 transition"
                      title="Remove from watchlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 dark:bg-[#171b26] border-t border-[#e0e3eb] dark:border-[#2a2e39] text-center text-xs text-[#787b86]">
          Real-time updates enabled
        </div>
      </div>
    </div>
  );
};
