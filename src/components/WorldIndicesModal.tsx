import React, { useState } from 'react';
import { X, Search, Globe, ArrowUpDown } from 'lucide-react';
import { GlobalIndex } from '../types';

interface WorldIndicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  indices: GlobalIndex[];
  onSelectIndex: (index: GlobalIndex) => void;
}

export const WorldIndicesModal: React.FC<WorldIndicesModalProps> = ({
  isOpen,
  onClose,
  indices,
  onSelectIndex,
}) => {
  if (!isOpen) return null;

  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');

  const regions = ['All', 'Americas', 'Europe', 'Asia-Pacific'];

  const filtered = indices.filter((item) => {
    const matchSearch =
      item.symbol.toLowerCase().includes(search.toLowerCase()) ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.region.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-2xl max-w-4xl w-full h-[80vh] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#e0e3eb] dark:border-[#2a2e39] flex items-center justify-between bg-white dark:bg-[#1e222d] shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-[#2962ff]">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-[#131722] dark:text-white">
                Major World Indices Directory
              </h3>
              <p className="text-xs text-[#787b86]">
                Benchmark sovereign and equity indices across global trading exchanges
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#f0f3fa] dark:hover:bg-[#252936] text-[#787b86] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-[#e0e3eb] dark:border-[#2a2e39] bg-gray-50/70 dark:bg-[#171b26] flex items-center justify-between gap-4 shrink-0">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#787b86] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search world index by country, name, or ticker..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-[#131722] border border-gray-200 dark:border-gray-700 rounded-lg text-xs outline-hidden text-[#131722] dark:text-white"
            />
          </div>
          <span className="text-xs text-[#787b86] font-medium">{filtered.length} indices tracked</span>
        </div>

        {/* Directory Grid/Table */}
        <div className="flex-1 overflow-auto divide-y divide-gray-100 dark:divide-gray-800">
          {filtered.map((item) => {
            const isPos = item.changePercent >= 0;
            return (
              <div
                key={item.symbol}
                onClick={() => {
                  onSelectIndex(item);
                  onClose();
                }}
                className="p-4 flex items-center justify-between hover:bg-[#f0f3fa] dark:hover:bg-[#252936] transition cursor-pointer group"
              >
                <div className="flex items-center space-x-3.5">
                  <span className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-[#2a2e39] text-[#131722] dark:text-white font-bold text-xs flex items-center justify-center border border-gray-200 dark:border-gray-700">
                    {item.countryCode}
                  </span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-[#131722] dark:text-white group-hover:text-[#2962ff] transition">
                        {item.name}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 dark:bg-[#2a2e39] text-[#787b86]">
                        {item.symbol}
                      </span>
                    </div>
                    <div className="text-xs text-[#787b86]">{item.region}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-bold text-[#131722] dark:text-white tabular-nums">
                    {item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div
                    className={`text-xs font-semibold tabular-nums ${
                      isPos ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}
                  >
                    {isPos ? `+${item.changePercent}%` : `${item.changePercent}%`}
                    <span className="text-[#787b86] ml-2 hidden sm:inline">
                      Vol: {item.volume}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
