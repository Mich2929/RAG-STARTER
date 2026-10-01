import React, { useState } from 'react';
import { ChevronRight, ArrowRight, Star } from 'lucide-react';
import { StockItem } from '../types';

interface StocksSectionProps {
  stocks: StockItem[];
  onOpenStockChart: (stock: StockItem) => void;
  onOpenScreener: () => void;
  onToggleWatchlist: (symbol: string) => void;
  watchlistSymbols: Set<string>;
}

type StockFilter = 'volume' | 'gainers' | 'losers' | 'volatile';

export const StocksSection: React.FC<StocksSectionProps> = ({
  stocks,
  onOpenStockChart,
  onOpenScreener,
  onToggleWatchlist,
  watchlistSymbols,
}) => {
  const [activeFilter, setActiveFilter] = useState<StockFilter>('volume');
  const [selectedHotTicker, setSelectedHotTicker] = useState<string | null>(null);

  // Filter and sort stocks based on active tab
  const getFilteredStocks = () => {
    let list = [...stocks];
    if (selectedHotTicker) {
      const match = list.find((s) => s.symbol === selectedHotTicker);
      if (match) {
        list = [match, ...list.filter((s) => s.symbol !== selectedHotTicker)];
      }
    }

    switch (activeFilter) {
      case 'gainers':
        return list.sort((a, b) => b.changePercent - a.changePercent);
      case 'losers':
        return list.sort((a, b) => a.changePercent - b.changePercent);
      case 'volatile':
        return list.sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
      case 'volume':
      default:
        return list.sort((a, b) => b.volumeRaw - a.volumeRaw);
    }
  };

  const displayedStocks = getFilteredStocks().slice(0, 4);

  const hotTickers = [
    { symbol: 'NVDA', chg: '+3.17%', positive: true },
    { symbol: 'AAPL', chg: '+1.22%', positive: true },
    { symbol: 'TSLA', chg: '-2.04%', positive: false },
    { symbol: 'AMZN', chg: '+0.81%', positive: true },
    { symbol: 'MSFT', chg: '+0.39%', positive: true },
    { symbol: 'GOOGL', chg: '+1.54%', positive: true },
  ];

  return (
    <section className="space-y-6 pt-4" data-purpose="trending-stocks-table" id="stocks">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <a
            href="#stocks"
            onClick={(e) => {
              e.preventDefault();
              onOpenScreener();
            }}
            className="inline-flex items-center space-x-1.5 text-2xl sm:text-3xl font-bold tracking-tight text-[#131722] dark:text-white hover:text-[#2962ff] group"
          >
            <span>Stocks</span>
            <ChevronRight className="w-6 h-6 text-[#131722] dark:text-white group-hover:text-[#2962ff] group-hover:translate-x-1 transition" />
          </a>
          <p className="text-xs sm:text-sm text-[#787b86]">
            Most actively traded equities, leading movers and market valuations
          </p>
        </div>

        {/* Filter Tab Buttons */}
        <div className="flex items-center space-x-1 bg-[#f0f3fa] dark:bg-[#1e222d] p-1 rounded-full text-xs font-semibold">
          {[
            { id: 'volume', label: 'Highest volume' },
            { id: 'gainers', label: 'Gainers' },
            { id: 'losers', label: 'Losers' },
            { id: 'volatile', label: 'Most volatile' },
          ].map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id as StockFilter)}
                className={`px-3.5 py-1.5 rounded-full transition cursor-pointer ${
                  isActive
                    ? 'bg-[#131722] text-white shadow-xs'
                    : 'text-[#787b86] hover:text-black dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Ticker Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto custom-scroll pb-1">
        <span className="text-xs font-bold text-[#787b86] uppercase mr-1 shrink-0">HOT:</span>
        {hotTickers.map((ticker) => {
          const isSelected = selectedHotTicker === ticker.symbol;
          return (
            <button
              key={ticker.symbol}
              type="button"
              onClick={() => {
                setSelectedHotTicker(isSelected ? null : ticker.symbol);
                const found = stocks.find((s) => s.symbol === ticker.symbol);
                if (found) onOpenStockChart(found);
              }}
              className={`px-3 py-1 border rounded-full text-xs font-medium flex items-center space-x-1.5 shrink-0 transition cursor-pointer ${
                isSelected
                  ? 'bg-blue-50 dark:bg-blue-900/30 border-[#2962ff]'
                  : 'bg-white dark:bg-[#1e222d] hover:bg-[#f0f3fa] dark:hover:bg-[#252936] border-[#e0e3eb] dark:border-[#2a2e39] text-[#131722] dark:text-[#d1d4dc]'
              }`}
            >
              <span className="font-bold">{ticker.symbol}</span>
              <span
                className={`font-semibold tabular-nums ${
                  ticker.positive ? 'text-[#089981]' : 'text-[#f23645]'
                }`}
              >
                {ticker.chg}
              </span>
            </button>
          );
        })}
      </div>

      {/* Rich Financial Table */}
      <div className="border border-[#e0e3eb] dark:border-[#2a2e39] rounded-2xl overflow-hidden bg-white dark:bg-[#1e222d] shadow-2xs transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" data-purpose="market-table">
            <thead>
              <tr className="border-b border-[#e0e3eb] dark:border-[#2a2e39] bg-gray-50/70 dark:bg-[#131722]/50 text-[11px] font-semibold text-[#787b86] uppercase tracking-wider">
                <th className="py-3 px-4">Symbol</th>
                <th className="py-3 px-4">Last Price</th>
                <th className="py-3 px-4">Chg %</th>
                <th className="py-3 px-4">Chg USD</th>
                <th className="py-3 px-4 hidden md:table-cell">Sparkline (7D)</th>
                <th className="py-3 px-4 hidden sm:table-cell">Volume</th>
                <th className="py-3 px-4 hidden lg:table-cell">Market Cap</th>
                <th className="py-3 px-4 text-right">Analyst Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
              {displayedStocks.map((stock) => {
                const isPositive = stock.changePercent >= 0;
                const isStarred = watchlistSymbols.has(stock.symbol);

                // Build sparkline path
                const min = Math.min(...stock.sparkline);
                const max = Math.max(...stock.sparkline);
                const range = max - min || 1;
                const pointsSvg = stock.sparkline
                  .map((val, idx) => {
                    const x = (idx / (stock.sparkline.length - 1)) * 96 + 2;
                    const y = 22 - ((val - min) / range) * 18;
                    return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`;
                  })
                  .join(' ');

                return (
                  <tr
                    key={stock.symbol}
                    onClick={() => onOpenStockChart(stock)}
                    className="hover:bg-[#f0f3fa]/60 dark:hover:bg-[#252936]/60 transition group cursor-pointer"
                  >
                    <td className="py-3.5 px-4 flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWatchlist(stock.symbol);
                        }}
                        title={isStarred ? 'Remove from Watchlist' : 'Add to Watchlist'}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-[#787b86] transition cursor-pointer"
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${
                            isStarred ? 'text-amber-500 fill-amber-500' : 'hover:text-amber-500'
                          }`}
                        />
                      </button>

                      <div
                        className={`w-8 h-8 rounded-lg ${stock.logoBg} font-extrabold text-xs flex items-center justify-center shrink-0 shadow-2xs`}
                      >
                        {stock.logoText}
                      </div>
                      <div className="truncate">
                        <div className="font-bold text-[#131722] dark:text-white group-hover:text-[#2962ff] transition">
                          {stock.symbol}
                        </div>
                        <div className="text-xs text-[#787b86] truncate max-w-[140px] sm:max-w-none">
                          {stock.name}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-[#131722] dark:text-white tabular-nums">
                      ${stock.price.toFixed(2)}
                    </td>

                    <td
                      className={`py-3.5 px-4 font-bold tabular-nums ${
                        isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isPositive ? `+${stock.changePercent.toFixed(2)}%` : `${stock.changePercent.toFixed(2)}%`}
                    </td>

                    <td
                      className={`py-3.5 px-4 text-xs font-semibold tabular-nums ${
                        isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isPositive ? `+$${stock.changeUSD.toFixed(2)}` : `-$${Math.abs(stock.changeUSD).toFixed(2)}`}
                    </td>

                    <td className="py-3.5 px-4 hidden md:table-cell w-28">
                      <svg className="w-24 h-6 fill-none" viewBox="0 0 100 24">
                        <path
                          d={pointsSvg}
                          stroke={isPositive ? '#089981' : '#f23645'}
                          strokeLinecap="round"
                          strokeWidth="2"
                        />
                      </svg>
                    </td>

                    <td className="py-3.5 px-4 hidden sm:table-cell text-xs font-medium text-[#131722] dark:text-[#d1d4dc] tabular-nums">
                      {stock.volume}
                    </td>

                    <td className="py-3.5 px-4 hidden lg:table-cell text-xs font-medium text-[#131722] dark:text-[#d1d4dc] tabular-nums">
                      {stock.marketCap}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-xs font-semibold ${
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

        {/* Table Footer Link */}
        <div className="px-5 py-3.5 bg-gray-50/50 dark:bg-[#131722]/50 border-t border-[#e0e3eb] dark:border-[#2a2e39] flex items-center justify-between text-xs">
          <span className="text-[#787b86]">
            Showing {displayedStocks.length} of {stocks.length}+ US Large Cap Equities
          </span>
          <button
            type="button"
            onClick={onOpenScreener}
            className="font-bold text-[#2962ff] hover:text-[#1e53e5] flex items-center space-x-1 cursor-pointer"
          >
            <span>Open in Stock Screener</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
