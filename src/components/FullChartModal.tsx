import React, { useState } from 'react';
import { X, Star, Maximize2, Minimize2, Check, TrendingUp, BarChart2, Activity } from 'lucide-react';
import { IndexItem, StockItem, Timeframe, ChartPoint } from '../types';

interface FullChartModalProps {
  item: IndexItem | StockItem | null;
  onClose: () => void;
  isStarred: boolean;
  onToggleStar: () => void;
}

export const FullChartModal: React.FC<FullChartModalProps> = ({
  item,
  onClose,
  isStarred,
  onToggleStar,
}) => {
  if (!item) return null;

  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [chartType, setChartType] = useState<'area' | 'candlestick'>('area');
  const [showSMA, setShowSMA] = useState(true);
  const [showVolume, setShowVolume] = useState(true);
  const [showRSI, setShowRSI] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
  const [orderQuantity, setOrderQuantity] = useState('10');
  const [orderFeedback, setOrderFeedback] = useState<string | null>(null);

  // Derive points
  const points: ChartPoint[] = ('chartData' in item && item.chartData?.[timeframe])
    ? item.chartData[timeframe]
    : Array.from({ length: 40 }).map((_, idx) => {
        const base = item.price;
        const progress = idx / 39;
        const p = base * (0.97 + progress * 0.05 + Math.sin(idx * 0.5) * 0.015);
        const open = p * (1 + (Math.random() - 0.5) * 0.006);
        const high = Math.max(open, p) * 1.004;
        const low = Math.min(open, p) * 0.996;
        return {
          time: `1${Math.floor(idx / 6)}:${((idx % 6) * 10).toString().padStart(2, '0')}`,
          price: Number(p.toFixed(2)),
          open: Number(open.toFixed(2)),
          high: Number(high.toFixed(2)),
          low: Number(low.toFixed(2)),
          close: Number(p.toFixed(2)),
          volume: Math.floor(100000 + Math.random() * 300000),
        };
      });

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const prices = points.map((p) => p.close ?? p.price);
  const minPrice = Math.min(...prices) * 0.995;
  const maxPrice = Math.max(...prices) * 1.005;
  const priceRange = maxPrice - minPrice || 1;

  const width = 800;
  const height = 360;

  const currentHoverPoint = hoverIndex !== null ? points[hoverIndex] : points[points.length - 1];
  const isPos = item.changePercent >= 0;
  const color = isPos ? '#089981' : '#f23645';

  const handleSimulateOrder = () => {
    const qty = parseInt(orderQuantity, 10) || 1;
    const total = (qty * item.price).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    setOrderFeedback(`Order Executed: ${orderType} ${qty} shares of ${('ticker' in item ? item.ticker : item.symbol)} for ${total}!`);
    setTimeout(() => setOrderFeedback(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div
        className={`bg-white dark:bg-[#131722] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-2xl shadow-2xl flex flex-col transition-all overflow-hidden ${
          isFullScreen ? 'w-full h-full rounded-none' : 'w-full max-w-6xl max-h-[92vh]'
        }`}
      >
        {/* Top Header Bar */}
        <div className="px-5 py-3 border-b border-[#e0e3eb] dark:border-[#2a2e39] flex items-center justify-between bg-white dark:bg-[#1e222d] shrink-0">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onToggleStar}
              className="p-1.5 rounded-lg hover:bg-[#f0f3fa] dark:hover:bg-[#252936] text-[#787b86] cursor-pointer"
            >
              <Star className={`w-4 h-4 ${isStarred ? 'text-amber-500 fill-amber-500' : ''}`} />
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-lg text-[#131722] dark:text-white">
                  {'ticker' in item ? item.ticker : item.symbol}
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 dark:bg-[#252936] text-[#787b86]">
                  {'exchange' in item ? item.exchange : item.sector}
                </span>
                <span className="text-xs text-[#787b86] hidden sm:inline">{item.name}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <span className="font-mono font-bold text-lg text-[#131722] dark:text-white tabular-nums">
                ${item.price.toFixed(2)}
              </span>
              <span
                className={`ml-2 text-xs font-semibold tabular-nums ${
                  isPos ? 'text-[#089981]' : 'text-[#f23645]'
                }`}
              >
                {isPos ? `+${item.changePercent}%` : `${item.changePercent}%`}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-1.5 rounded-lg hover:bg-[#f0f3fa] dark:hover:bg-[#252936] text-[#787b86] cursor-pointer"
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#f0f3fa] dark:hover:bg-[#252936] text-[#787b86] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar & Timeframe Strip */}
        <div className="px-5 py-2 border-b border-[#e0e3eb] dark:border-[#2a2e39] bg-gray-50/70 dark:bg-[#171b26] flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center space-x-1">
            {(['1D', '5D', '1M', '6M', 'YTD', '1Y', 'ALL'] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded font-semibold transition cursor-pointer ${
                  timeframe === tf
                    ? 'bg-white dark:bg-[#252936] text-[#2962ff] shadow-2xs'
                    : 'text-[#787b86] hover:text-black dark:hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            {/* Chart Type Toggle */}
            <div className="flex items-center space-x-1 bg-white dark:bg-[#252936] p-0.5 rounded-lg border border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setChartType('area')}
                className={`px-2 py-1 rounded transition cursor-pointer ${
                  chartType === 'area' ? 'bg-[#2962ff] text-white font-bold' : 'text-[#787b86]'
                }`}
              >
                Area
              </button>
              <button
                type="button"
                onClick={() => setChartType('candlestick')}
                className={`px-2 py-1 rounded transition cursor-pointer ${
                  chartType === 'candlestick' ? 'bg-[#2962ff] text-white font-bold' : 'text-[#787b86]'
                }`}
              >
                Candles
              </button>
            </div>

            {/* Technical Indicators */}
            <button
              type="button"
              onClick={() => setShowSMA(!showSMA)}
              className={`px-2.5 py-1 rounded border text-xs font-medium cursor-pointer ${
                showSMA
                  ? 'border-[#2962ff] text-[#2962ff] bg-blue-50 dark:bg-blue-900/30'
                  : 'border-gray-200 dark:border-gray-700 text-[#787b86]'
              }`}
            >
              MA (20)
            </button>
            <button
              type="button"
              onClick={() => setShowVolume(!showVolume)}
              className={`px-2.5 py-1 rounded border text-xs font-medium cursor-pointer ${
                showVolume
                  ? 'border-[#2962ff] text-[#2962ff] bg-blue-50 dark:bg-blue-900/30'
                  : 'border-gray-200 dark:border-gray-700 text-[#787b86]'
              }`}
            >
              Volume
            </button>
            <button
              type="button"
              onClick={() => setShowRSI(!showRSI)}
              className={`px-2.5 py-1 rounded border text-xs font-medium cursor-pointer ${
                showRSI
                  ? 'border-[#2962ff] text-[#2962ff] bg-blue-50 dark:bg-blue-900/30'
                  : 'border-gray-200 dark:border-gray-700 text-[#787b86]'
              }`}
            >
              RSI (14)
            </button>
          </div>
        </div>

        {/* Main Work Area: Chart + Order / Info Sidebar */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Chart Display Area */}
          <div className="flex-1 p-4 flex flex-col justify-between overflow-y-auto">
            {/* Live OHLC Bar */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono tabular-nums text-[#787b86] pb-2 border-b border-gray-100 dark:border-gray-800">
              <div>Time: <span className="text-[#131722] dark:text-white font-semibold">{currentHoverPoint.time}</span></div>
              <div>O: <span className="text-[#131722] dark:text-white font-semibold">{currentHoverPoint.open ?? currentHoverPoint.price}</span></div>
              <div>H: <span className="text-[#131722] dark:text-white font-semibold">{currentHoverPoint.high ?? currentHoverPoint.price}</span></div>
              <div>L: <span className="text-[#131722] dark:text-white font-semibold">{currentHoverPoint.low ?? currentHoverPoint.price}</span></div>
              <div>C: <span className="text-[#131722] dark:text-white font-semibold">{currentHoverPoint.close ?? currentHoverPoint.price}</span></div>
              {showVolume && <div>Vol: <span className="text-[#131722] dark:text-white font-semibold">{(currentHoverPoint.volume ?? 120000).toLocaleString()}</span></div>}
            </div>

            {/* SVG Interactive Canvas */}
            <div className="relative w-full h-80 sm:h-96 my-2">
              <svg
                className="w-full h-full"
                viewBox={`0 0 ${width} ${height}`}
                preserveAspectRatio="none"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const ratio = Math.max(0, Math.min(1, x / rect.width));
                  const idx = Math.min(points.length - 1, Math.floor(ratio * points.length));
                  setHoverIndex(idx);
                }}
                onMouseLeave={() => setHoverIndex(null)}
              >
                <defs>
                  <linearGradient id="fullModalGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.28" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                {[0.2, 0.4, 0.6, 0.8].map((ratio) => {
                  const y = height * ratio;
                  const val = maxPrice - ratio * priceRange;
                  return (
                    <g key={ratio}>
                      <line x1="0" x2={width} y1={y} y2={y} stroke="#e0e3eb" className="dark:stroke-[#252936]" strokeDasharray="3 3" />
                      <text x={width - 50} y={y - 4} fill="#787b86" fontSize="10" fontFamily="monospace">
                        {val.toFixed(2)}
                      </text>
                    </g>
                  );
                })}

                {/* Volume Histogram at bottom */}
                {showVolume && points.map((p, idx) => {
                  const colW = width / points.length;
                  const x = idx * colW + 1;
                  const v = p.volume ?? 100000;
                  const vH = (v / 500000) * 50;
                  const isUp = (p.close ?? p.price) >= (p.open ?? p.price);
                  return (
                    <rect
                      key={idx}
                      x={x}
                      y={height - vH}
                      width={Math.max(2, colW - 2)}
                      height={vH}
                      fill={isUp ? '#089981' : '#f23645'}
                      fillOpacity="0.3"
                    />
                  );
                })}

                {/* Render Candlesticks or Area Chart */}
                {chartType === 'area' ? (
                  <>
                    {/* Area path */}
                    {(() => {
                      const coords = points.map((p, idx) => ({
                        x: (idx / (points.length - 1)) * width,
                        y: height - 60 - (((p.close ?? p.price) - minPrice) / priceRange) * (height - 90),
                      }));

                      const dPath = coords.reduce((acc, c, i) => {
                        if (i === 0) return `M ${c.x},${c.y}`;
                        const prev = coords[i - 1];
                        const midX = (prev.x + c.x) / 2;
                        return `${acc} C ${midX},${prev.y} ${midX},${c.y} ${c.x},${c.y}`;
                      }, '');

                      return (
                        <>
                          <path d={`${dPath} L ${width},${height} L 0,${height} Z`} fill="url(#fullModalGradient)" />
                          <path d={dPath} stroke={color} strokeWidth="2.5" fill="none" />
                        </>
                      );
                    })()}
                  </>
                ) : (
                  /* Candlesticks */
                  points.map((p, idx) => {
                    const colW = width / points.length;
                    const x = idx * colW + colW / 2;
                    const open = p.open ?? p.price;
                    const close = p.close ?? p.price;
                    const high = p.high ?? Math.max(open, close);
                    const low = p.low ?? Math.min(open, close);

                    const yHigh = height - 60 - ((high - minPrice) / priceRange) * (height - 90);
                    const yLow = height - 60 - ((low - minPrice) / priceRange) * (height - 90);
                    const yOpen = height - 60 - ((open - minPrice) / priceRange) * (height - 90);
                    const yClose = height - 60 - ((close - minPrice) / priceRange) * (height - 90);

                    const isGreen = close >= open;
                    const candleColor = isGreen ? '#089981' : '#f23645';
                    const top = Math.min(yOpen, yClose);
                    const bottom = Math.max(yOpen, yClose);
                    const candleHeight = Math.max(2, bottom - top);

                    return (
                      <g key={idx}>
                        {/* Wick */}
                        <line x1={x} x2={x} y1={yHigh} y2={yLow} stroke={candleColor} strokeWidth="1.5" />
                        {/* Body */}
                        <rect
                          x={x - Math.max(2, (colW - 3) / 2)}
                          y={top}
                          width={Math.max(3, colW - 3)}
                          height={candleHeight}
                          fill={candleColor}
                          rx="1"
                        />
                      </g>
                    );
                  })
                )}

                {/* Optional SMA 20 Overlay */}
                {showSMA && (
                  <path
                    d={points
                      .map((_, idx) => {
                        const window = points.slice(Math.max(0, idx - 10), idx + 1);
                        const avg = window.reduce((s, curr) => s + (curr.close ?? curr.price), 0) / window.length;
                        const x = (idx / (points.length - 1)) * width;
                        const y = height - 60 - ((avg - minPrice) / priceRange) * (height - 90);
                        return `${idx === 0 ? 'M' : 'L'} ${x},${y}`;
                      })
                      .join(' ')}
                    stroke="#2962ff"
                    strokeWidth="1.8"
                    strokeDasharray="4 2"
                    fill="none"
                  />
                )}

                {/* Hover Cursor line */}
                {hoverIndex !== null && (
                  <line
                    x1={(hoverIndex / (points.length - 1)) * width}
                    x2={(hoverIndex / (points.length - 1)) * width}
                    y1="0"
                    y2={height}
                    stroke="#787b86"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                  />
                )}
              </svg>
            </div>

            {/* Sub-chart: RSI 14 Oscillator (if enabled) */}
            {showRSI && (
              <div className="h-20 border-t border-gray-200 dark:border-gray-800 pt-1 relative">
                <div className="text-[10px] text-[#787b86] flex justify-between">
                  <span>RSI (14): 62.4</span>
                  <span>Overbought: 70 | Oversold: 30</span>
                </div>
                <div className="w-full h-12 bg-gray-50 dark:bg-[#171b26] rounded flex items-center justify-center text-xs text-[#2962ff] font-semibold">
                  RSI Oscillation: Neutral Momentum
                </div>
              </div>
            )}
          </div>

          {/* Right Order & Stats Panel */}
          <div className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-[#e0e3eb] dark:border-[#2a2e39] p-4 bg-gray-50/50 dark:bg-[#1a1e29] flex flex-col justify-between shrink-0">
            <div className="space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#787b86]">
                Paper Trading Terminal
              </h4>

              {/* Buy / Sell Tabs */}
              <div className="grid grid-cols-2 gap-1 bg-gray-200 dark:bg-[#252936] p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setOrderType('BUY')}
                  className={`py-2 rounded-lg transition cursor-pointer ${
                    orderType === 'BUY'
                      ? 'bg-[#089981] text-white shadow-xs'
                      : 'text-[#787b86] hover:text-black dark:hover:text-white'
                  }`}
                >
                  Buy
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('SELL')}
                  className={`py-2 rounded-lg transition cursor-pointer ${
                    orderType === 'SELL'
                      ? 'bg-[#f23645] text-white shadow-xs'
                      : 'text-[#787b86] hover:text-black dark:hover:text-white'
                  }`}
                >
                  Sell
                </button>
              </div>

              {/* Quantity input */}
              <div>
                <label className="text-xs text-[#787b86] font-medium block mb-1">Shares Quantity</label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-[#131722] border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold tabular-nums text-[#131722] dark:text-white"
                />
              </div>

              {/* Estimated Total */}
              <div className="p-3 bg-white dark:bg-[#131722] border border-gray-200 dark:border-gray-700 rounded-xl space-y-1 text-xs">
                <div className="flex justify-between text-[#787b86]">
                  <span>Unit Price</span>
                  <span className="font-mono text-[#131722] dark:text-white">${item.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#787b86]">
                  <span>Est. Total</span>
                  <span className="font-mono font-bold text-[#131722] dark:text-white">
                    {((parseInt(orderQuantity, 10) || 1) * item.price).toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })}
                  </span>
                </div>
              </div>

              {/* Submit Order Button */}
              <button
                type="button"
                onClick={handleSimulateOrder}
                className={`w-full py-2.5 rounded-xl font-bold text-xs text-white shadow-md transition cursor-pointer ${
                  orderType === 'BUY'
                    ? 'bg-[#089981] hover:bg-[#078570]'
                    : 'bg-[#f23645] hover:bg-[#d92c3a]'
                }`}
              >
                Place {orderType} Order
              </button>

              {orderFeedback && (
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-xl text-xs flex items-center space-x-2">
                  <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{orderFeedback}</span>
                </div>
              )}
            </div>

            {/* Quick Metrics */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-2 text-xs">
              <div className="flex justify-between text-[#787b86]">
                <span>52W High</span>
                <span className="font-mono text-[#131722] dark:text-white">${(item.price * 1.15).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#787b86]">
                <span>52W Low</span>
                <span className="font-mono text-[#131722] dark:text-white">${(item.price * 0.72).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#787b86]">
                <span>Volatility</span>
                <span className="text-[#089981] font-semibold">Moderate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
