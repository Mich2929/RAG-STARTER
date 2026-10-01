import React from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { AssetRow } from '../types';

interface MultiAssetSectionProps {
  cryptoAssets: AssetRow[];
  futuresAssets: AssetRow[];
  forexAssets: AssetRow[];
  onSelectAsset: (asset: AssetRow) => void;
  onOpenAssetModal: (category: 'crypto' | 'futures' | 'forex') => void;
}

export const MultiAssetSection: React.FC<MultiAssetSectionProps> = ({
  cryptoAssets,
  futuresAssets,
  forexAssets,
  onSelectAsset,
  onOpenAssetModal,
}) => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4" data-purpose="asset-classes-grid">
      {/* Crypto Card */}
      <div
        className="border border-[#e0e3eb] dark:border-[#2a2e39] rounded-2xl p-5 bg-white dark:bg-[#1e222d] shadow-2xs flex flex-col justify-between transition-colors"
        id="crypto"
      >
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={() => onOpenAssetModal('crypto')}
              className="flex items-center space-x-1 font-bold text-lg text-[#131722] dark:text-white hover:text-[#2962ff] transition cursor-pointer"
            >
              <span>Crypto Coins</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="text-xs px-2 py-0.5 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-semibold rounded">
              24h 🟢
            </span>
          </div>

          <div className="space-y-3 mt-4">
            {cryptoAssets.slice(0, 3).map((item) => {
              const isPos = item.changePercent >= 0;
              return (
                <div
                  key={item.symbol}
                  onClick={() => onSelectAsset(item)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-[#f0f3fa] dark:hover:bg-[#252936] transition cursor-pointer group"
                >
                  <div className="flex items-center space-x-2.5">
                    <div
                      className={`w-7 h-7 rounded-full ${item.iconBg} font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs`}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#131722] dark:text-white group-hover:text-[#2962ff] transition">
                        {item.symbol}
                      </div>
                      <div className="text-[11px] text-[#787b86]">{item.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-[#131722] dark:text-white tabular-nums">
                      ${item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div
                      className={`text-xs font-semibold tabular-nums ${
                        isPos ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isPos ? `+${item.changePercent.toFixed(2)}%` : `${item.changePercent.toFixed(2)}%`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 mt-4">
          <button
            type="button"
            onClick={() => onOpenAssetModal('crypto')}
            className="w-full text-xs font-bold text-[#2962ff] hover:text-[#1e53e5] flex items-center justify-between cursor-pointer"
          >
            <span>View Crypto Screener</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Commodities & Futures Card */}
      <div
        className="border border-[#e0e3eb] dark:border-[#2a2e39] rounded-2xl p-5 bg-white dark:bg-[#1e222d] shadow-2xs flex flex-col justify-between transition-colors"
        id="futures"
      >
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={() => onOpenAssetModal('futures')}
              className="flex items-center space-x-1 font-bold text-lg text-[#131722] dark:text-white hover:text-[#2962ff] transition cursor-pointer"
            >
              <span>Futures</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="text-xs px-2 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold rounded">
              CME/NYMEX
            </span>
          </div>

          <div className="space-y-3 mt-4">
            {futuresAssets.slice(0, 3).map((item) => {
              const isPos = item.changePercent >= 0;
              return (
                <div
                  key={item.symbol}
                  onClick={() => onSelectAsset(item)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-[#f0f3fa] dark:hover:bg-[#252936] transition cursor-pointer group"
                >
                  <div className="flex items-center space-x-2.5">
                    <div
                      className={`w-7 h-7 rounded-full ${item.iconBg} text-xs flex items-center justify-center shrink-0 border border-gray-200 dark:border-gray-700`}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#131722] dark:text-white group-hover:text-[#2962ff] transition">
                        {item.symbol}
                      </div>
                      <div className="text-[11px] text-[#787b86]">{item.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-[#131722] dark:text-white tabular-nums">
                      {item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div
                      className={`text-xs font-semibold tabular-nums ${
                        isPos ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isPos ? `+${item.changePercent.toFixed(2)}%` : `${item.changePercent.toFixed(2)}%`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 mt-4">
          <button
            type="button"
            onClick={() => onOpenAssetModal('futures')}
            className="w-full text-xs font-bold text-[#2962ff] hover:text-[#1e53e5] flex items-center justify-between cursor-pointer"
          >
            <span>View Energy & Metals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Forex Currencies Card */}
      <div
        className="border border-[#e0e3eb] dark:border-[#2a2e39] rounded-2xl p-5 bg-white dark:bg-[#1e222d] shadow-2xs flex flex-col justify-between transition-colors"
        id="forex"
      >
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={() => onOpenAssetModal('forex')}
              className="flex items-center space-x-1 font-bold text-lg text-[#131722] dark:text-white hover:text-[#2962ff] transition cursor-pointer"
            >
              <span>Currencies</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="text-xs px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold rounded">
              FX Major
            </span>
          </div>

          <div className="space-y-3 mt-4">
            {forexAssets.slice(0, 3).map((item) => {
              const isPos = item.changePercent >= 0;
              const symbols = item.symbol.split(' / ');
              const firstSymbol = symbols[0] === 'EUR' ? '€' : symbols[0] === 'USD' ? '$' : symbols[0] === 'GBP' ? '£' : 'A';
              const secondSymbol = symbols[1] === 'USD' ? '$' : symbols[1] === 'JPY' ? '¥' : '$';

              return (
                <div
                  key={item.symbol}
                  onClick={() => onSelectAsset(item)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-[#f0f3fa] dark:hover:bg-[#252936] transition cursor-pointer group"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="flex -space-x-1">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center border border-white dark:border-[#1e222d]">
                        {firstSymbol}
                      </span>
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center border border-white dark:border-[#1e222d]">
                        {secondSymbol}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#131722] dark:text-white group-hover:text-[#2962ff] transition">
                        {item.symbol}
                      </div>
                      <div className="text-[11px] text-[#787b86]">{item.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-[#131722] dark:text-white tabular-nums">
                      {item.price.toFixed(item.price < 10 ? 5 : 2)}
                    </div>
                    <div
                      className={`text-xs font-semibold tabular-nums ${
                        isPos ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isPos ? `+${item.changePercent.toFixed(2)}%` : `${item.changePercent.toFixed(2)}%`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 mt-4">
          <button
            type="button"
            onClick={() => onOpenAssetModal('forex')}
            className="w-full text-xs font-bold text-[#2962ff] hover:text-[#1e53e5] flex items-center justify-between cursor-pointer"
          >
            <span>View Forex Heatmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
