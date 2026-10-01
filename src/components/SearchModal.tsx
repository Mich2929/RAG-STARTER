import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Star } from 'lucide-react';
import { IndexItem, StockItem, AssetRow } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  indices: IndexItem[];
  stocks: StockItem[];
  crypto: AssetRow[];
  futures: AssetRow[];
  forex: AssetRow[];
  onSelectItem: (item: any) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  indices,
  stocks,
  crypto,
  futures,
  forex,
  onSelectItem,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'stocks' | 'indices' | 'crypto' | 'futures' | 'forex'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Aggregate items
  const allItems = [
    ...indices.map((i) => ({ ...i, type: 'indices', symbol: i.ticker, desc: i.name })),
    ...stocks.map((s) => ({ ...s, type: 'stocks', desc: s.name })),
    ...crypto.map((c) => ({ ...c, type: 'crypto', desc: c.name })),
    ...futures.map((f) => ({ ...f, type: 'futures', desc: f.name })),
    ...forex.map((x) => ({ ...x, type: 'forex', desc: x.name })),
  ];

  const filtered = allItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.type === selectedCategory;
    const q = query.toLowerCase().trim();
    if (!q) return matchesCategory;
    const matchesQuery =
      item.symbol.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 p-4">
      <div className="bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Box */}
        <div className="p-4 border-b border-[#e0e3eb] dark:border-[#2a2e39] flex items-center space-x-3 bg-white dark:bg-[#1e222d]">
          <Search className="w-5 h-5 text-[#787b86]" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search symbols, indices, crypto, forex..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm sm:text-base outline-hidden text-[#131722] dark:text-white placeholder-[#787b86]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-[#787b86]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-[#787b86] bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
            ESC
          </kbd>
        </div>

        {/* Filter Categories */}
        <div className="flex items-center space-x-1 px-4 py-2 bg-gray-50/70 dark:bg-[#171b26] border-b border-[#e0e3eb] dark:border-[#2a2e39] text-xs font-semibold overflow-x-auto custom-scroll">
          {[
            { id: 'all', label: 'All' },
            { id: 'stocks', label: 'Stocks' },
            { id: 'indices', label: 'Indices' },
            { id: 'crypto', label: 'Crypto' },
            { id: 'futures', label: 'Futures' },
            { id: 'forex', label: 'Forex' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#131722] dark:bg-white text-white dark:text-[#131722]'
                  : 'text-[#787b86] hover:text-black dark:hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800 p-2">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#787b86]">
              No instruments found for "{query}". Try searching for NVDA, BTC, or SPX.
            </div>
          ) : (
            filtered.map((item) => {
              const isPos = item.changePercent >= 0;
              return (
                <div
                  key={`${item.type}-${item.symbol}`}
                  onClick={() => {
                    onSelectItem(item);
                    onClose();
                  }}
                  className="p-3 flex items-center justify-between hover:bg-[#f0f3fa] dark:hover:bg-[#252936] rounded-xl transition cursor-pointer group"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#2a2e39] text-[#131722] dark:text-white font-extrabold text-xs flex items-center justify-center shrink-0 uppercase">
                      {item.symbol.slice(0, 3)}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-[#131722] dark:text-white group-hover:text-[#2962ff] transition">
                          {item.symbol}
                        </span>
                        <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-gray-100 dark:bg-[#2a2e39] text-[#787b86]">
                          {item.type}
                        </span>
                      </div>
                      <div className="text-xs text-[#787b86] truncate max-w-xs">{item.name}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-semibold text-[#131722] dark:text-white tabular-nums">
                      ${item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <div
                      className={`text-xs font-semibold tabular-nums ${
                        isPos ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isPos ? `+${item.changePercent}%` : `${item.changePercent}%`}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
