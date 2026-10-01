# TradingView Markets & Financial Analytics Dashboard

A modern, high-performance financial market overview and analytics dashboard built with React, TypeScript, Vite, and Tailwind CSS. Features real-time streaming quotes simulation, interactive vector area charts with scrubbing crosshairs, multi-timeframe analytics, institutional equity screeners, global macro indices, and asset classes across Equities, Crypto, Commodities/Futures, and Forex.

## 🚀 Features

- **Interactive Vector Charting**:
  - Live SVG area and candlestick charting with multi-timeframe support (`1D`, `5D`, `1M`, `6M`, `YTD`, `1Y`, `ALL`).
  - Interactive crosshairs with live OHLC tooltips and market open status indicators.
  - Technical indicators: 20-day SMA, 50-day SMA, Volume histogram, and RSI (14) oscillator.

- **Market Indices & Perspectives**:
  - Dynamic index switching between S&P 500 (`SPX`), Nasdaq 100 (`NDX`), Dow Jones 30 (`DJI`), and Russell 2000 (`RUT`).
  - Major Global Indices tracking Tokyo (`Nikkei 225`), Frankfurt (`DAX`), London (`FTSE 100`), Hong Kong (`Hang Seng`), and Paris (`CAC 40`).
  - Comprehensive World Indices directory covering 40+ international exchanges.

- **Equities & Stock Screener**:
  - Actively traded equities table with 7-day sparklines, market valuations, trading volumes, and analyst ratings (*Strong Buy*, *Buy*, *Neutral*).
  - Quick-filter tabs: *Highest volume*, *Gainers*, *Losers*, and *Most volatile*.
  - Full-screen institutional stock screener with sector filters, P/E ratios, and multi-column sorting.

- **Multi-Asset Coverage**:
  - **Crypto Coins**: Bitcoin (`BTCUSD`), Ethereum (`ETHUSD`), Solana (`SOLUSD`), Ripple (`XRPUSD`).
  - **Commodities & Futures**: Gold, Crude Oil (WTI), Silver, Natural Gas.
  - **Currencies (Forex)**: `EUR/USD`, `USD/JPY`, `GBP/USD`, `AUD/USD`.

- **Macro Events & Community Buzz**:
  - Economic and earnings calendar with impact categorization (*HIGH*, *MED*, *EARN*), consensus forecasts, and reminder alerts.
  - Community sentiment stream with live bullish/bearish voting and technical setup ideas.

- **Trading Tools & Utilities**:
  - Paper trading terminal simulating order placement with portfolio execution feedback.
  - Global Symbol Search (`Ctrl+K` / `⌘K`) with real-time filtering across all asset types.
  - Personal Watchlist slide-over drawer to monitor pinned symbols.
  - Dark / Light mode toggle.

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Animations**: Motion

## 📦 Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Mich2929/RAG-STARTER.git
cd RAG-STARTER

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`.

### Build for Production

```bash
npm run build
```

## 📄 License

Apache-2.0
