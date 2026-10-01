import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SubNav } from './components/SubNav';
import { HeroSection } from './components/HeroSection';
import { IndicesSection } from './components/IndicesSection';
import { StocksSection } from './components/StocksSection';
import { MultiAssetSection } from './components/MultiAssetSection';
import { CalendarCommunitySection } from './components/CalendarCommunitySection';
import { Footer } from './components/Footer';

import { FullChartModal } from './components/FullChartModal';
import { SearchModal } from './components/SearchModal';
import { ScreenerModal } from './components/ScreenerModal';
import { WorldIndicesModal } from './components/WorldIndicesModal';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { TradeIdeasModal } from './components/TradeIdeasModal';
import { EventDetailModal } from './components/EventDetailModal';
import { AssetDetailModal } from './components/AssetDetailModal';

import {
  MAIN_INDICES,
  MAJOR_GLOBAL_INDICES,
  STOCKS_DATA,
  CRYPTO_ASSETS,
  FUTURES_ASSETS,
  FOREX_ASSETS,
  ECONOMIC_EVENTS,
  COMMUNITY_BUZZ,
} from './data/marketData';

import { IndexItem, StockItem, AssetRow, EconomicEvent, GlobalIndex } from './types';

export default function App() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [activeNav, setActiveNav] = useState('Markets');
  const [activeSubTab, setActiveSubTab] = useState('indices');
  const [heroView, setHeroView] = useState('Markets, everywhere');
  const [selectedIndexId, setSelectedIndexId] = useState('spx');

  // Watchlist state
  const [watchlistSymbols, setWatchlistSymbols] = useState<Set<string>>(
    new Set(['NVDA', 'BTCUSD', 'AAPL'])
  );

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [isScreenerOpen, setIsScreenerOpen] = useState(false);
  const [isWorldIndicesOpen, setIsWorldIndicesOpen] = useState(false);
  const [isTradeIdeasOpen, setIsTradeIdeasOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EconomicEvent | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<AssetRow | null>(null);
  const [fullChartItem, setFullChartItem] = useState<IndexItem | StockItem | null>(null);

  // Sync dark class to html element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleToggleWatchlist = (symbol: string) => {
    setWatchlistSymbols((prev) => {
      const next = new Set(prev);
      if (next.has(symbol)) {
        next.delete(symbol);
      } else {
        next.add(symbol);
      }
      return next;
    });
  };

  const handleOpenStockChart = (stock: StockItem) => {
    setFullChartItem(stock);
  };

  const handleSelectSearchItem = (item: any) => {
    if (item.type === 'indices') {
      const matched = MAIN_INDICES.find((i) => i.ticker === item.symbol || i.id === item.id);
      if (matched) {
        setSelectedIndexId(matched.id);
        setFullChartItem(matched);
      }
    } else if (item.type === 'stocks') {
      const matched = STOCKS_DATA.find((s) => s.symbol === item.symbol);
      if (matched) {
        setFullChartItem(matched);
      }
    } else {
      setSelectedAsset(item as AssetRow);
    }
  };

  const handleSelectGlobalIndex = (index: GlobalIndex) => {
    // If it's one of the main 3, select it; otherwise make a stock/index item to display
    const matched = MAIN_INDICES.find((i) => i.ticker === index.symbol);
    if (matched) {
      setSelectedIndexId(matched.id);
      setFullChartItem(matched);
    } else {
      // Create ad-hoc IndexItem to view in full chart
      const adHoc: IndexItem = {
        id: index.symbol.toLowerCase(),
        name: index.name,
        ticker: index.symbol,
        exchange: index.region,
        currency: 'USD',
        price: index.price,
        change: index.changeUSD,
        changePercent: index.changePercent,
        volume: index.volume,
        badgeNumber: index.countryCode,
        badgeColor: 'bg-slate-800',
        badgeSubtext: index.region,
        chartData: MAIN_INDICES[0].chartData,
      };
      setFullChartItem(adHoc);
    }
  };

  const handleLaunchChartFromAsset = () => {
    if (!selectedAsset) return;
    const adHoc: StockItem = {
      symbol: selectedAsset.symbol,
      name: selectedAsset.name,
      sector: selectedAsset.category.toUpperCase(),
      price: selectedAsset.price,
      changePercent: selectedAsset.changePercent,
      changeUSD: (selectedAsset.price * selectedAsset.changePercent) / 100,
      volume: selectedAsset.volume || '1.2B',
      volumeRaw: 1000,
      marketCap: '$1.4T',
      marketCapRaw: 1400,
      rating: 'Buy',
      peRatio: 0,
      logoText: selectedAsset.symbol.slice(0, 2),
      logoBg: selectedAsset.iconBg,
      sparkline: [12, 14, 18, 15, 20, 24],
    };
    setSelectedAsset(null);
    setFullChartItem(adHoc);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#131722] text-[#131722] dark:text-[#d1d4dc] transition-colors">
      {/* Top Main Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
        watchlistCount={watchlistSymbols.size}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        activeNav={activeNav}
        onSelectNav={(item) => setActiveNav(item)}
      />

      {/* Sub-Navigation Bar */}
      <SubNav activeTab={activeSubTab} onSelectTab={(tab) => setActiveSubTab(tab)} />

      {/* Main Container */}
      <main className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* Hero Section */}
        <HeroSection currentView={heroView} onSelectView={(v) => setHeroView(v)} />

        {/* Indices Section */}
        <IndicesSection
          indices={MAIN_INDICES}
          globalIndices={MAJOR_GLOBAL_INDICES}
          selectedIndexId={selectedIndexId}
          onSelectIndex={(id) => setSelectedIndexId(id)}
          onOpenFullChart={(idx) => setFullChartItem(idx)}
          onOpenAllWorldIndices={() => setIsWorldIndicesOpen(true)}
        />

        {/* Stocks Section */}
        <StocksSection
          stocks={STOCKS_DATA}
          onOpenStockChart={handleOpenStockChart}
          onOpenScreener={() => setIsScreenerOpen(true)}
          onToggleWatchlist={handleToggleWatchlist}
          watchlistSymbols={watchlistSymbols}
        />

        {/* Multi-Asset Section (Crypto, Futures, Currencies) */}
        <MultiAssetSection
          cryptoAssets={CRYPTO_ASSETS}
          futuresAssets={FUTURES_ASSETS}
          forexAssets={FOREX_ASSETS}
          onSelectAsset={(asset) => setSelectedAsset(asset)}
          onOpenAssetModal={(cat) => {
            if (cat === 'crypto') setIsSearchOpen(true);
            else if (cat === 'futures') setIsSearchOpen(true);
            else setIsSearchOpen(true);
          }}
        />

        {/* Key Events & Community Buzz */}
        <CalendarCommunitySection
          events={ECONOMIC_EVENTS}
          buzzItems={COMMUNITY_BUZZ}
          onOpenTradeIdeas={() => setIsTradeIdeasOpen(true)}
          onOpenEventDetail={(ev) => setSelectedEvent(ev)}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenScreener={() => setIsScreenerOpen(true)}
        onOpenWorldIndices={() => setIsWorldIndicesOpen(true)}
        onOpenTradeIdeas={() => setIsTradeIdeasOpen(true)}
      />

      {/* Modals & Drawers */}
      <FullChartModal
        item={fullChartItem}
        onClose={() => setFullChartItem(null)}
        isStarred={
          fullChartItem
            ? watchlistSymbols.has('ticker' in fullChartItem ? fullChartItem.ticker : fullChartItem.symbol)
            : false
        }
        onToggleStar={() => {
          if (fullChartItem) {
            handleToggleWatchlist('ticker' in fullChartItem ? fullChartItem.ticker : fullChartItem.symbol);
          }
        }}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        indices={MAIN_INDICES}
        stocks={STOCKS_DATA}
        crypto={CRYPTO_ASSETS}
        futures={FUTURES_ASSETS}
        forex={FOREX_ASSETS}
        onSelectItem={handleSelectSearchItem}
      />

      <ScreenerModal
        isOpen={isScreenerOpen}
        onClose={() => setIsScreenerOpen(false)}
        stocks={STOCKS_DATA}
        onSelectStock={handleOpenStockChart}
        watchlistSymbols={watchlistSymbols}
        onToggleWatchlist={handleToggleWatchlist}
      />

      <WorldIndicesModal
        isOpen={isWorldIndicesOpen}
        onClose={() => setIsWorldIndicesOpen(false)}
        indices={MAJOR_GLOBAL_INDICES}
        onSelectIndex={handleSelectGlobalIndex}
      />

      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlistSymbols={watchlistSymbols}
        stocks={STOCKS_DATA}
        indices={MAIN_INDICES}
        onSelectSymbol={(sym) => {
          const s = STOCKS_DATA.find((x) => x.symbol === sym);
          if (s) setFullChartItem(s);
          else {
            const i = MAIN_INDICES.find((x) => x.ticker === sym);
            if (i) setFullChartItem(i);
          }
        }}
        onRemoveSymbol={handleToggleWatchlist}
      />

      <TradeIdeasModal
        isOpen={isTradeIdeasOpen}
        onClose={() => setIsTradeIdeasOpen(false)}
        onSelectSymbol={(sym) => {
          const s = STOCKS_DATA.find((x) => x.symbol === sym);
          if (s) setFullChartItem(s);
        }}
      />

      <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />

      <AssetDetailModal
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
        onOpenTrade={handleLaunchChartFromAsset}
      />
    </div>
  );
}
