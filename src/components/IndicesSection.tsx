import React, { useState, useRef } from 'react';
import { ChevronRight, ExternalLink } from 'lucide-react';
import { IndexItem, GlobalIndex, Timeframe, ChartPoint } from '../types';

interface IndicesSectionProps {
  indices: IndexItem[];
  globalIndices: GlobalIndex[];
  selectedIndexId: string;
  onSelectIndex: (id: string) => void;
  onOpenFullChart: (index: IndexItem) => void;
  onOpenAllWorldIndices: () => void;
}

export const IndicesSection: React.FC<IndicesSectionProps> = ({
  indices,
  globalIndices,
  selectedIndexId,
  onSelectIndex,
  onOpenFullChart,
  onOpenAllWorldIndices,
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [hoveredPoint, setHoveredPoint] = useState<ChartPoint | null>(null);
  const [hoverX, setHoverX] = useState<number | null>(null);
  const [hoverY, setHoverY] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const selectedIndex = indices.find((idx) => idx.id === selectedIndexId) || indices[0];
  const points = selectedIndex.chartData[timeframe] || selectedIndex.chartData['1D'];

  // Calculate SVG bounds & coordinates
  const prices = points.map((p) => p.price);
  const minPrice = Math.min(...prices) * 0.998;
  const maxPrice = Math.max(...prices) * 1.002;
  const range = maxPrice - minPrice || 1;

  const svgWidth = 600;
  const svgHeight = 240;

  // Build SVG path
  const coords = points.map((p, index) => {
    const x = (index / (points.length - 1)) * svgWidth;
    const y = svgHeight - ((p.price - minPrice) / range) * (svgHeight - 40) - 20;
    return { x, y, point: p };
  });

  const pathData = coords.reduce((acc, curr, idx) => {
    if (idx === 0) return `M ${curr.x},${curr.y}`;
    const prev = coords[idx - 1];
    const midX = (prev.x + curr.x) / 2;
    return `${acc} C ${midX},${prev.y} ${midX},${curr.y} ${curr.x},${curr.y}`;
  }, '');

  const areaData = `${pathData} L ${svgWidth},${svgHeight} L 0,${svgHeight} Z`;

  const isPositive = selectedIndex.changePercent >= 0;
  const strokeColor = isPositive ? '#089981' : '#f23645';

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const relativeX = (mouseX / rect.width) * svgWidth;

    // Find nearest point
    let closest = coords[0];
    let minDiff = Infinity;
    for (const c of coords) {
      const diff = Math.abs(c.x - relativeX);
      if (diff < minDiff) {
        minDiff = diff;
        closest = c;
      }
    }

    setHoveredPoint(closest.point);
    setHoverX(closest.x);
    setHoverY(closest.y);
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
    setHoverX(null);
    setHoverY(null);
  };

  const displayPrice = hoveredPoint ? hoveredPoint.price : selectedIndex.price;
  const displayChange = hoveredPoint
    ? Number((hoveredPoint.price - points[0].price).toFixed(2))
    : selectedIndex.change;
  const displayChangePercent = hoveredPoint
    ? Number((((hoveredPoint.price - points[0].price) / points[0].price) * 100).toFixed(2))
    : selectedIndex.changePercent;
  const isDisplayPositive = displayChange >= 0;

  return (
    <section className="space-y-6" data-purpose="indices-overview" id="indices">
      {/* Title & View all world indices link */}
      <div className="flex items-center justify-between">
        <a
          href="#indices"
          onClick={(e) => {
            e.preventDefault();
            onOpenAllWorldIndices();
          }}
          className="inline-flex items-center space-x-1.5 text-2xl sm:text-3xl font-bold tracking-tight text-[#131722] dark:text-white hover:text-[#2962ff] group"
        >
          <span>Indices</span>
          <ChevronRight className="w-6 h-6 text-[#131722] dark:text-white group-hover:text-[#2962ff] group-hover:translate-x-1 transition" />
        </a>

        <button
          type="button"
          onClick={onOpenAllWorldIndices}
          className="text-xs sm:text-sm font-semibold text-[#2962ff] hover:text-[#1e53e5] flex items-center space-x-1 cursor-pointer"
        >
          <span>View all world indices</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Quick Selector Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {indices.map((idx) => {
          const isSelected = idx.id === selectedIndexId;
          const isItemPositive = idx.changePercent >= 0;
          return (
            <div
              key={idx.id}
              onClick={() => onSelectIndex(idx.id)}
              className={`flex items-center p-3.5 rounded-full transition cursor-pointer border ${
                isSelected
                  ? 'bg-[#e6eaf3] dark:bg-[#252936] border-[#2962ff]/50 shadow-xs'
                  : 'bg-[#f0f3fa] dark:bg-[#1e222d] hover:bg-[#e6eaf3] dark:hover:bg-[#252936] border-transparent hover:border-gray-300 dark:hover:border-gray-700'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full ${idx.badgeColor} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs`}
              >
                {idx.badgeNumber}
              </div>
              <div className="ml-3 truncate">
                <div className="text-sm font-bold text-[#131722] dark:text-white leading-tight">{idx.name.split(' Index')[0]}</div>
                <div className="text-xs text-[#787b86]">{idx.badgeSubtext}</div>
              </div>
              <div className="ml-auto text-right shrink-0">
                <div className="text-sm font-semibold text-[#131722] dark:text-white tabular-nums">
                  {idx.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div
                  className={`text-xs font-semibold tabular-nums ${
                    isItemPositive ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {isItemPositive ? `+${idx.changePercent}%` : `${idx.changePercent}%`}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Featured Chart + World Indices Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        {/* Interactive Chart Card (7 cols) */}
        <div className="lg:col-span-7 border border-[#e0e3eb] dark:border-[#2a2e39] rounded-2xl p-5 bg-white dark:bg-[#1e222d] shadow-2xs flex flex-col justify-between transition-colors">
          <div>
            {/* Index Header Info */}
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-full ${selectedIndex.badgeColor} text-white flex items-center justify-center font-bold text-sm`}
                >
                  {selectedIndex.badgeNumber}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#131722] dark:text-white flex items-center space-x-2">
                    <span>{selectedIndex.name}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 dark:bg-[#2a2e39] text-[#787b86]">
                      {selectedIndex.ticker}
                    </span>
                  </h3>
                  <p className="text-xs text-[#787b86]">{selectedIndex.exchange}</p>
                </div>
              </div>

              {/* Price & Percentage */}
              <div className="text-right">
                <div className="text-2xl font-bold text-[#131722] dark:text-white tabular-nums">
                  {displayPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div
                  className={`text-xs font-bold flex items-center justify-end space-x-1 tabular-nums ${
                    isDisplayPositive ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  <span>{isDisplayPositive ? `+${displayChange}` : displayChange}</span>
                  <span>({isDisplayPositive ? `+${displayChangePercent}%` : `${displayChangePercent}%`})</span>
                  <span className="text-gray-400 font-normal">{hoveredPoint ? hoveredPoint.time : 'Today'}</span>
                </div>
              </div>
            </div>

            {/* Timeframe Controls */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex space-x-1 bg-gray-100/70 dark:bg-[#131722] p-1 rounded-lg text-xs font-semibold">
                {(['1D', '5D', '1M', '6M', 'YTD', '1Y', 'ALL'] as Timeframe[]).map((tf) => (
                  <button
                    key={tf}
                    type="button"
                    onClick={() => {
                      setTimeframe(tf);
                      setHoveredPoint(null);
                    }}
                    className={`px-2.5 py-1 rounded transition cursor-pointer ${
                      timeframe === tf
                        ? 'bg-white dark:bg-[#2a2e39] text-[#131722] dark:text-white shadow-2xs font-bold'
                        : 'text-[#787b86] hover:text-black dark:hover:text-white'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              <div className="hidden sm:flex items-center space-x-2 text-xs text-[#787b86]">
                <span className="inline-block w-2 h-2 rounded-full bg-[#089981] animate-pulse" />
                <span>Market Open</span>
              </div>
            </div>

            {/* SVG Vector Area Chart Simulation */}
            <div className="h-64 sm:h-72 w-full mt-4 relative cursor-crosshair">
              <svg
                ref={svgRef}
                className="w-full h-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <defs>
                  <linearGradient id={`chartGradient-${selectedIndex.id}`} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="0" x2={svgWidth} y1="40" y2="40" stroke="#f0f3fa" className="dark:stroke-[#252936]" strokeDasharray="4 4" strokeWidth="1" />
                <line x1="0" x2={svgWidth} y1="100" y2="100" stroke="#f0f3fa" className="dark:stroke-[#252936]" strokeDasharray="4 4" strokeWidth="1" />
                <line x1="0" x2={svgWidth} y1="160" y2="160" stroke="#f0f3fa" className="dark:stroke-[#252936]" strokeDasharray="4 4" strokeWidth="1" />
                <line x1="0" x2={svgWidth} y1="220" y2="220" stroke="#f0f3fa" className="dark:stroke-[#252936]" strokeWidth="1" />

                {/* Chart Fill */}
                <path d={areaData} fill={`url(#chartGradient-${selectedIndex.id})`} />

                {/* Chart Main Stroke Line */}
                <path d={pathData} stroke={strokeColor} strokeLinecap="round" strokeWidth="2.5" />

                {/* Interactive Crosshair & Hover Tooltip Marker */}
                {hoverX !== null && hoverY !== null && (
                  <g>
                    {/* Vertical guideline */}
                    <line
                      x1={hoverX}
                      x2={hoverX}
                      y1="0"
                      y2={svgHeight}
                      stroke="#787b86"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />
                    {/* Horizontal guideline */}
                    <line
                      x1="0"
                      x2={svgWidth}
                      y1={hoverY}
                      y2={hoverY}
                      stroke="#787b86"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />
                    <circle cx={hoverX} cy={hoverY} r="6" fill={strokeColor} />
                    <circle cx={hoverX} cy={hoverY} r="12" fill={strokeColor} fillOpacity="0.2" />
                  </g>
                )}

                {/* Static End Point Marker if not hovered */}
                {hoverX === null && coords.length > 0 && (
                  <g>
                    <circle cx={coords[coords.length - 1].x} cy={coords[coords.length - 1].y} r="4.5" fill={strokeColor} />
                    <circle cx={coords[coords.length - 1].x} cy={coords[coords.length - 1].y} r="9" fill={strokeColor} fillOpacity="0.25" />
                  </g>
                )}
              </svg>
            </div>
          </div>

          {/* Chart Card Bottom Action */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
            <span className="text-[#787b86]">Volume: {selectedIndex.volume}</span>
            <button
              type="button"
              onClick={() => onOpenFullChart(selectedIndex)}
              className="inline-flex items-center font-bold text-[#2962ff] hover:text-[#1e53e5] space-x-1 cursor-pointer"
            >
              <span>Launch full chart view</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* World Indices List (5 cols) */}
        <div className="lg:col-span-5 border border-[#e0e3eb] dark:border-[#2a2e39] rounded-2xl p-5 bg-white dark:bg-[#1e222d] flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <h4 className="font-bold text-base text-[#131722] dark:text-white">Major Global Indices</h4>
              <span className="text-xs text-[#787b86]">24h Change</span>
            </div>

            {/* List of World Index Rows */}
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {globalIndices.slice(0, 5).map((item) => {
                const isItemPos = item.changePercent >= 0;
                return (
                  <div
                    key={item.symbol}
                    onClick={onOpenAllWorldIndices}
                    className="py-3 flex items-center justify-between hover:bg-[#f0f3fa]/50 dark:hover:bg-[#252936]/50 px-2 rounded-lg transition cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-7 h-7 rounded-full bg-slate-100 dark:bg-[#2a2e39] text-[#131722] dark:text-white font-bold text-xs flex items-center justify-center border border-gray-300 dark:border-gray-700">
                        {item.countryCode}
                      </span>
                      <div>
                        <div className="font-bold text-sm text-[#131722] dark:text-white leading-snug group-hover:text-[#2962ff] transition">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-[#787b86]">{item.region}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-[#131722] dark:text-white tabular-nums">
                        {item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <div
                        className={`text-xs font-semibold tabular-nums ${
                          isItemPos ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {isItemPos ? `+${item.changePercent}%` : `${item.changePercent}%`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 text-center">
            <button
              type="button"
              onClick={onOpenAllWorldIndices}
              className="text-xs font-bold text-[#2962ff] hover:text-[#1e53e5] cursor-pointer"
            >
              Explore 40+ international regional indices →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
