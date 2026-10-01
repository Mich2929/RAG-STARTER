import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface HeroSectionProps {
  currentView: string;
  onSelectView: (view: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ currentView, onSelectView }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const views = [
    { id: 'Markets, everywhere', label: 'Markets, everywhere', desc: 'All asset classes, global indices & trending equities' },
    { id: 'US Equities Deep-Dive', label: 'US Equities Deep-Dive', desc: 'S&P 500, Nasdaq 100, Russell 2000 & Mega-caps' },
    { id: 'Crypto & Digital Assets', label: 'Crypto & Digital Assets', desc: 'Bitcoin, Ethereum, Altcoins and DeFi tokens' },
    { id: 'World Macro & Commodities', label: 'World Macro & Commodities', desc: 'Energy, precious metals, FX pairs & sovereign yields' },
  ];

  return (
    <section className="text-center md:text-left py-4 relative" data-purpose="hero-title">
      <div className="relative inline-block text-left">
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="inline-flex items-center group cursor-pointer space-x-3 text-left focus:outline-hidden"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#131722] dark:text-white">
            {currentView}
          </h1>
          <ChevronDown
            className={`w-8 h-8 sm:w-10 sm:h-10 mt-1 text-[#131722] dark:text-white transition duration-200 ${
              isDropdownOpen ? 'rotate-180' : 'group-hover:translate-y-1'
            }`}
          />
        </button>

        {isDropdownOpen && (
          <div className="absolute left-0 mt-3 w-80 sm:w-96 bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-2xl shadow-2xl py-3 px-2 z-30">
            <div className="px-3 py-1.5 text-[11px] font-bold text-[#787b86] uppercase tracking-wider">
              Select Market Perspective
            </div>
            {views.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => {
                  onSelectView(v.id);
                  setIsDropdownOpen(false);
                }}
                className={`w-full text-left p-3 rounded-xl transition flex items-start justify-between cursor-pointer ${
                  currentView === v.id
                    ? 'bg-[#f0f3fa] dark:bg-[#2a2e39]'
                    : 'hover:bg-[#f8f9fd] dark:hover:bg-[#252936]'
                }`}
              >
                <div>
                  <div className="text-sm font-bold text-[#131722] dark:text-white">{v.label}</div>
                  <div className="text-xs text-[#787b86]">{v.desc}</div>
                </div>
                {currentView === v.id && <Check className="w-4 h-4 text-[#2962ff] mt-0.5" />}
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="mt-2 text-sm sm:text-base text-[#787b86] max-w-2xl">
        Real-time market quotes, streaming charts, trending global indices, sentiment and financial screeners.
      </p>
    </section>
  );
};
