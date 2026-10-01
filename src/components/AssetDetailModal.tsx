import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { AssetRow } from '../types';

interface AssetDetailModalProps {
  asset: AssetRow | null;
  onClose: () => void;
  onOpenTrade: () => void;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({ asset, onClose, onOpenTrade }) => {
  if (!asset) return null;

  const isPos = asset.changePercent >= 0;
  const strokeColor = isPos ? '#089981' : '#f23645';

  // Generate realistic sparkline for asset
  const points = Array.from({ length: 25 }).map((_, i) => {
    const progress = i / 24;
    return asset.price * (0.97 + progress * 0.04 + Math.sin(i * 0.6) * 0.015);
  });
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const path = points
    .map((val, i) => {
      const x = (i / 24) * 400;
      const y = 140 - ((val - min) / range) * 110;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
          <div className="flex items-center space-x-3">
            <div
              className={`w-9 h-9 rounded-full ${asset.iconBg} font-bold text-xs flex items-center justify-center`}
            >
              {asset.icon}
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-[#131722] dark:text-white">{asset.symbol}</h3>
              <p className="text-xs text-[#787b86]">{asset.name}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#f0f3fa] dark:hover:bg-[#252936] text-[#787b86]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-baseline justify-between">
          <div className="text-3xl font-extrabold font-mono text-[#131722] dark:text-white tabular-nums">
            ${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div
            className={`text-sm font-bold flex items-center space-x-1 tabular-nums ${
              isPos ? 'text-[#089981]' : 'text-[#f23645]'
            }`}
          >
            {isPos ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{isPos ? `+${asset.changePercent}%` : `${asset.changePercent}%`}</span>
          </div>
        </div>

        {/* Mini SVG Area */}
        <div className="w-full h-36 bg-[#f8f9fd] dark:bg-[#131722] rounded-xl p-2 relative overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 400 150" fill="none">
            <path d={path} stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-gray-50 dark:bg-[#131722] rounded-xl">
            <span className="text-[#787b86] block">Category</span>
            <span className="font-bold text-[#131722] dark:text-white uppercase mt-0.5 block">
              {asset.category}
            </span>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-[#131722] rounded-xl">
            <span className="text-[#787b86] block">Reported Volume</span>
            <span className="font-bold text-[#131722] dark:text-white mt-0.5 block">
              {asset.volume || 'Institutional Feed'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3 pt-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenTrade();
            }}
            className="flex-1 py-2.5 rounded-full bg-[#2962ff] hover:bg-[#1e53e5] text-white font-semibold text-xs transition cursor-pointer"
          >
            Launch Interactive Chart
          </button>
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-full border border-gray-200 dark:border-gray-700 text-xs font-semibold text-[#787b86] hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
