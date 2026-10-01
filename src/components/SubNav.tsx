import React from 'react';

interface SubNavProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
}

export const SubNav: React.FC<SubNavProps> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    { id: 'indices', label: 'Indices' },
    { id: 'stocks', label: 'Stocks' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'futures', label: 'Futures' },
    { id: 'forex', label: 'Forex' },
    { id: 'bonds', label: 'Bonds' },
    { id: 'etfs', label: 'ETFs' },
    { id: 'economy', label: 'Economy' },
  ];

  const handleTabClick = (id: string) => {
    onSelectTab(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80; // Header offset
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="border-b border-[#e0e3eb] dark:border-[#2a2e39] bg-white dark:bg-[#131722] overflow-x-auto custom-scroll transition-colors">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 flex items-center space-x-6 text-xs sm:text-sm font-medium py-2.5 whitespace-nowrap text-[#787b86]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabClick(tab.id)}
              className={`pb-1 transition cursor-pointer ${
                isActive
                  ? 'text-[#131722] dark:text-white font-semibold border-b-2 border-black dark:border-white'
                  : 'hover:text-[#131722] dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
