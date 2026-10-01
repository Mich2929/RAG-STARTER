import React, { useState } from 'react';
import { X, Search, ArrowUpDown, Filter, Star } from 'lucide-react';
import { StockItem } from '../types';

interface ScreenerModalProps {
  isOpen: boolean;
  onClose: () => void;
  stocks: StockItem[];
  onSelectStock: (stock: StockItem) => void;
  watchlistSymbols: Set<string>;
  onToggleWatchlist: (symbol: string) => void;
}

export const ScreenerModal: React.FC<ScreenerModalProps> = ({
  isOpen,
  onClose,
  stocks,
  onSelectStock,
  watchlistSymbols,
  onToggleWatchlist,
}) => {
  if (!isOpen) return null;

  const [search, setSearch] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [selectedRating, setSelectedRating] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'volume' | 'marketCap' | 'change' | 'price' | 'pe'>('marketCap');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sectors = ['All', 'Technology', 'Consumer Discretionary', 'Communication Services', 'Financials'];
  const ratings = ['All', 'Strong Buy', 'Buy', 'Neutral'];

  const filtered = stocks
    .filter((s) => {
      const matchSearch =
        s.symbol.toLowerCase().includes(search.toLowerCase()) ||
        s.name.toLowerCase().includes(search.toLowerCase());
      const matchSector = selectedSector === 'All' || s.sector.includes(selectedSector);
      const matchRating = selectedRating === 'All' || s.rating === selectedRating;
      return matchSearch && matchSector && matchRating;
    })
    .sort((a, b) => {
      let diff = 0;
      if (sortBy === 'volume') diff = a.volumeRaw - b.volumeRaw;
      else if (sortBy === 'marketCap') diff = a.marketCapRaw - b.marketCapRaw;
      else if (sortBy === 'change') diff = a.changePercent - b.changePercent;
      else if (sortBy === 'price') diff = a.price - b.price;
      else if (sortBy === 'pe') diff = a.peRatio - b.peRatio;
      return sortOrder === 'desc' ? -diff : diff;
    });

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-2xl max-w-5xl w-full h-[85vh] shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#e0e3eb] dark:border-[#2a2e39] flex items-center justify-between bg-white dark:bg-[#1e222d] shrink-0">
          <div>
            <h3 className="font-extrabold text-xl text-[#131722] dark:text-white">
              Stock Screener & Market Valuations
            </h3>
            <p className="text-xs text-[#787b86]">
              Scan {stocks.length}+ institutional equities by sector, fundamentals & technical rating
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#f0f3fa] dark:hover:bg-[#252936] text-[#787b86] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 border-b border-[#e0e3eb] dark:border-[#2a2e39] bg-gray-50/70 dark:bg-[#171b26] flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          {/* Search */}
          <div className="relative w-64">
            <Search className="w-4 h-4 text-[#787b86] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter by ticker or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-[#131722] border border-gray-200 dark:border-gray-700 rounded-lg text-xs outline-hidden text-[#131722] dark:text-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Sector */}
            <div className="flex items-center space-x-1.5">
              <span className="text-[#787b86] font-medium">Sector:</span>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="px-2.5 py-1.5 bg-white dark:bg-[#131722] border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-[#131722] dark:text-white font-medium cursor-pointer"
              >
                {sectors.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-1.5">
              <span className="text-[#787b86] font-medium">Rating:</span>
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="px-2.5 py-1.5 bg-white dark:bg-[#131722] border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-[#131722] dark:text-white font-medium cursor-pointer"
              >
                {ratings.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Screener Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="sticky top-0 bg-gray-100 dark:bg-[#171b26] text-[11px] font-semibold text-[#787b86] uppercase tracking-wider z-10 border-b border-[#e0e3eb] dark:border-[#2a2e39]">
              <tr>
                <th className="py-3 px-4">Symbol</th>
                <th
                  className="py-3 px-4 cursor-pointer hover:text-black dark:hover:text-white"
                  onClick={() => toggleSort('price')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Price</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="py-3 px-4 cursor-pointer hover:text-black dark:hover:text-white"
                  onClick={() => toggleSort('change')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Change %</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="py-3 px-4 cursor-pointer hover:text-black dark:hover:text-white"
                  onClick={() => toggleSort('volume')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Volume</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="py-3 px-4 cursor-pointer hover:text-black dark:hover:text-white"
                  onClick={() => toggleSort('marketCap')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Market Cap</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="py-3 px-4 cursor-pointer hover:text-black dark:hover:text-white"
                  onClick={() => toggleSort('pe')}
                >
                  <div className="flex items-center space-x-1">
                    <span>P/E Ratio</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right">Analyst Consensus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map((stock) => {
                const isPos = stock.changePercent >= 0;
                const isStarred = watchlistSymbols.has(stock.symbol);
                return (
                  <tr
                    key={stock.symbol}
                    onClick={() => {
                      onSelectStock(stock);
                      onClose();
                    }}
                    className="hover:bg-[#f0f3fa] dark:hover:bg-[#252936] transition cursor-pointer group"
                  >
                    <td className="py-3 px-4 flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWatchlist(stock.symbol);
                        }}
                        className="p-1 rounded text-[#787b86] hover:text-amber-500"
                      >
                        <Star className={`w-3.5 h-3.5 ${isStarred ? 'text-amber-500 fill-amber-500' : ''}`} />
                      </button>
                      <div
                        className={`w-7 h-7 rounded-lg ${stock.logoBg} font-extrabold text-xs flex items-center justify-center shrink-0`}
                      >
                        {stock.logoText}
                      </div>
                      <div>
                        <div className="font-bold text-[#131722] dark:text-white group-hover:text-[#2962ff] transition">
                          {stock.symbol}
                        </div>
                        <div className="text-xs text-[#787b86] truncate max-w-xs">{stock.name}</div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-semibold text-[#131722] dark:text-white tabular-nums">
                      ${stock.price.toFixed(2)}
                    </td>

                    <td
                      className={`py-3 px-4 font-bold tabular-nums ${
                        isPos ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isPos ? `+${stock.changePercent.toFixed(2)}%` : `${stock.changePercent.toFixed(2)}%`}
                    </td>

                    <td className="py-3 px-4 text-xs text-[#131722] dark:text-[#d1d4dc] tabular-nums">
                      {stock.volume}
                    </td>

                    <td className="py-3 px-4 text-xs font-medium text-[#131722] dark:text-[#d1d4dc] tabular-nums">
                      {stock.marketCap}
                    </td>

                    <td className="py-3 px-4 text-xs text-[#131722] dark:text-[#d1d4dc] tabular-nums">
                      {stock.peRatio.toFixed(1)}x
                    </td>

                    <td className="py-3 px-4 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                          stock.rating === 'Strong Buy'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                            : stock.rating === 'Buy'
                            ? 'bg-emerald-50 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-400'
                            : stock.rating === 'Neutral'
                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                            : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                        }`}
                      >
                        {stock.rating}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 dark:bg-[#171b26] border-t border-[#e0e3eb] dark:border-[#2a2e39] flex items-center justify-between text-xs text-[#787b86]">
          <span>Matched {filtered.length} equities matching active filters</span>
          <span>Click any row to open interactive technical chart</span>
        </div>
      </div>
    </div>
  );
};
