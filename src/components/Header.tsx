import React, { useState } from 'react';
import { Search, Globe, User, Moon, Sun, Star, ChevronDown, Check } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenWatchlist: () => void;
  watchlistCount: number;
  isDark: boolean;
  onToggleTheme: () => void;
  activeNav: string;
  onSelectNav: (item: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenWatchlist,
  watchlistCount,
  isDark,
  onToggleTheme,
  activeNav,
  onSelectNav,
}) => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('EN');
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showStartedModal, setShowStartedModal] = useState(false);

  const languages = ['EN', 'DE', 'JA', 'FR', 'ES', 'ZH'];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#131722]/95 backdrop-blur-md border-b border-[#e0e3eb] dark:border-[#2a2e39] transition-colors">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Logo & Search */}
          <div className="flex items-center space-x-6">
            {/* Logo */}
            <a
              href="#"
              aria-label="TradingView Home"
              className="flex items-center space-x-1.5 focus:outline-hidden group"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <svg
                className="w-8 h-8 fill-black dark:fill-white transition-transform group-hover:scale-105"
                viewBox="0 0 36 28"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M14 22H7V6h7v16zm15 0h-7V0h7v22zM7 22H0v-6h7v6z" />
              </svg>
            </a>

            {/* Global Search Input with Shortcut */}
            <div className="relative w-64 md:w-72 hidden sm:block">
              <button
                type="button"
                onClick={onOpenSearch}
                className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-full bg-[#f0f3fa] dark:bg-[#1e222d] text-[#787b86] hover:bg-[#e4e7f0] dark:hover:bg-[#2a2e39] transition text-sm cursor-pointer border border-transparent dark:border-[#2a2e39]"
              >
                <span className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-[#131722] dark:text-[#d1d4dc]" />
                  <span className="text-xs font-normal text-[#131722]/80 dark:text-[#d1d4dc]/80">
                    Search (Ctrl+K)
                  </span>
                </span>
                <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-medium bg-white dark:bg-[#131722] text-[#787b86] rounded border border-gray-200 dark:border-gray-700 shadow-2xs">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-7 text-sm font-medium text-[#131722] dark:text-[#d1d4dc]">
              {['Products', 'Community', 'Markets', 'Brokers'].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => onSelectNav(item)}
                  className={`nav-link pb-1 transition-colors cursor-pointer ${
                    activeNav === item
                      ? 'active text-[#2962ff] font-semibold'
                      : 'text-[#131722]/80 dark:text-[#d1d4dc]/80 hover:text-[#2962ff] dark:hover:text-[#2962ff]'
                  }`}
                >
                  {item}
                </button>
              ))}

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsMoreOpen(!isMoreOpen)}
                  className="nav-link text-[#131722]/80 dark:text-[#d1d4dc]/80 hover:text-[#2962ff] flex items-center space-x-1 cursor-pointer"
                >
                  <span>More</span>
                  <ChevronDown className="w-3.5 h-3.5 mt-0.5 text-[#787b86]" />
                </button>

                {isMoreOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-xl shadow-lg py-2 z-50">
                    <a
                      href="#news"
                      onClick={() => setIsMoreOpen(false)}
                      className="block px-4 py-2 text-xs hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39] text-[#131722] dark:text-[#d1d4dc]"
                    >
                      Market News & Analysis
                    </a>
                    <a
                      href="#screeners"
                      onClick={() => setIsMoreOpen(false)}
                      className="block px-4 py-2 text-xs hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39] text-[#131722] dark:text-[#d1d4dc]"
                    >
                      Heatmaps & Screeners
                    </a>
                    <a
                      href="#education"
                      onClick={() => setIsMoreOpen(false)}
                      className="block px-4 py-2 text-xs hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39] text-[#131722] dark:text-[#d1d4dc]"
                    >
                      Pine Script™ Library
                    </a>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Right Utility Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4 text-sm">
            {/* Mobile Search Button */}
            <button
              type="button"
              onClick={onOpenSearch}
              aria-label="Open search"
              className="sm:hidden p-2 rounded-full hover:bg-[#f0f3fa] dark:hover:bg-[#1e222d] text-[#131722] dark:text-[#d1d4dc]"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Watchlist Quick Button */}
            <button
              type="button"
              onClick={onOpenWatchlist}
              title="Open Watchlist"
              className="flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full hover:bg-[#f0f3fa] dark:hover:bg-[#1e222d] text-[#131722] dark:text-[#d1d4dc] border border-transparent hover:border-[#e0e3eb] dark:hover:border-[#2a2e39] transition cursor-pointer"
            >
              <Star className={`w-4 h-4 ${watchlistCount > 0 ? 'text-amber-500 fill-amber-500' : 'text-[#787b86]'}`} />
              <span className="hidden md:inline">Watchlist</span>
              {watchlistCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#2962ff] text-white text-[10px] flex items-center justify-center font-bold">
                  {watchlistCount}
                </span>
              )}
            </button>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={onToggleTheme}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-1.5 rounded-full hover:bg-[#f0f3fa] dark:hover:bg-[#1e222d] text-[#131722] dark:text-[#d1d4dc] transition cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#787b86]" />}
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center space-x-1 text-xs font-semibold px-2 py-1.5 rounded hover:bg-[#f0f3fa] dark:hover:bg-[#1e222d] text-[#131722] dark:text-[#d1d4dc] cursor-pointer"
              >
                <Globe className="w-4 h-4 text-[#131722] dark:text-[#d1d4dc]" />
                <span>{selectedLang}</span>
              </button>

              {isLangOpen && (
                <div className="absolute top-full right-0 mt-1 w-24 bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-xl shadow-lg py-1 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => {
                        setSelectedLang(lang);
                        setIsLangOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39] text-[#131722] dark:text-[#d1d4dc]"
                    >
                      <span>{lang}</span>
                      {selectedLang === lang && <Check className="w-3 h-3 text-[#2962ff]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Profile Avatar */}
            <div className="relative">
              <button
                type="button"
                aria-label="Account"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="p-1.5 rounded-full hover:bg-[#f0f3fa] dark:hover:bg-[#1e222d] text-[#131722] dark:text-[#d1d4dc] focus:outline-hidden cursor-pointer"
              >
                <User className="w-5 h-5 text-[#131722] dark:text-[#d1d4dc]" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-2xl shadow-xl py-3 px-2 z-50">
                  <div className="px-3 pb-2 border-b border-[#e0e3eb] dark:border-[#2a2e39]">
                    <p className="text-xs font-bold text-[#131722] dark:text-white">Pro Trader Account</p>
                    <p className="text-[11px] text-[#787b86]">Live market tier active</p>
                  </div>
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenWatchlist();
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs rounded hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39] text-[#131722] dark:text-[#d1d4dc]"
                    >
                      Saved Watchlists ({watchlistCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="w-full text-left px-3 py-1.5 text-xs rounded hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39] text-[#131722] dark:text-[#d1d4dc]"
                    >
                      Chart Layouts & Themes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="w-full text-left px-3 py-1.5 text-xs rounded hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39] text-[#131722] dark:text-[#d1d4dc]"
                    >
                      Paper Trading Settings
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Get Started Button */}
            <button
              type="button"
              onClick={() => setShowStartedModal(true)}
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold text-xs sm:text-sm px-4 py-2 rounded-full shadow-xs hover:opacity-95 transition cursor-pointer shrink-0"
            >
              Get started
            </button>
          </div>
        </div>
      </header>

      {/* Get Started Dialog */}
      {showStartedModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg">
                TV
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#131722] dark:text-white">Start Trading with TradingView</h3>
                <p className="text-xs text-[#787b86]">Real-time data feeds, Pine Script™, and 100+ technical indicators</p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="p-3 bg-[#f0f3fa] dark:bg-[#131722] rounded-xl flex items-center justify-between text-xs">
                <span className="font-medium text-[#131722] dark:text-[#d1d4dc]">Real-time US & Global Equities</span>
                <span className="text-[#089981] font-bold">Included</span>
              </div>
              <div className="p-3 bg-[#f0f3fa] dark:bg-[#131722] rounded-xl flex items-center justify-between text-xs">
                <span className="font-medium text-[#131722] dark:text-[#d1d4dc]">High-speed Bar Replay & Alerts</span>
                <span className="text-[#089981] font-bold">Enabled</span>
              </div>
              <div className="p-3 bg-[#f0f3fa] dark:bg-[#131722] rounded-xl flex items-center justify-between text-xs">
                <span className="font-medium text-[#131722] dark:text-[#d1d4dc]">Paper Trading Sandbox</span>
                <span className="text-[#2962ff] font-bold">$100k Demo</span>
              </div>
            </div>

            <div className="pt-3 flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setShowStartedModal(false)}
                className="flex-1 py-2.5 rounded-full bg-[#2962ff] hover:bg-[#1e53e5] text-white font-semibold text-xs transition cursor-pointer"
              >
                Launch Live Workspace
              </button>
              <button
                type="button"
                onClick={() => setShowStartedModal(false)}
                className="py-2.5 px-4 rounded-full border border-[#e0e3eb] dark:border-[#2a2e39] text-xs font-medium text-[#787b86] hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
