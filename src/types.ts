export type Timeframe = '1D' | '5D' | '1M' | '6M' | 'YTD' | '1Y' | 'ALL';

export interface ChartPoint {
  time: string;
  price: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
}

export interface IndexItem {
  id: string;
  name: string;
  ticker: string;
  exchange: string;
  currency: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  badgeNumber: string;
  badgeColor: string;
  badgeSubtext: string;
  chartData: Record<Timeframe, ChartPoint[]>;
}

export interface GlobalIndex {
  symbol: string;
  name: string;
  region: string;
  countryCode: string;
  price: number;
  changePercent: number;
  changeUSD: number;
  volume: string;
  high52w: number;
  low52w: number;
}

export interface StockItem {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  changePercent: number;
  changeUSD: number;
  volume: string;
  volumeRaw: number;
  marketCap: string;
  marketCapRaw: number;
  rating: 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';
  peRatio: number;
  logoText: string;
  logoBg: string;
  sparkline: number[];
  chartData?: Record<Timeframe, ChartPoint[]>;
}

export interface AssetRow {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  category: 'crypto' | 'futures' | 'forex';
  icon: string;
  iconBg: string;
  currencyPair?: string;
  volume?: string;
}

export interface EconomicEvent {
  id: string;
  title: string;
  country: string;
  time: string;
  impact: 'HIGH' | 'MED' | 'LOW' | 'EARN';
  forecast: string;
  prior: string;
  consensus?: string;
  revEst?: string;
}

export interface BuzzItem {
  id: string;
  symbol: string;
  sentiment: 'Bullish' | 'Bearish';
  percentage: number;
  votesCount: number;
}
