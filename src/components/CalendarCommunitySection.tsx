import React, { useState } from 'react';
import { EconomicEvent, BuzzItem } from '../types';

interface CalendarCommunitySectionProps {
  events: EconomicEvent[];
  buzzItems: BuzzItem[];
  onOpenTradeIdeas: () => void;
  onOpenEventDetail: (event: EconomicEvent) => void;
}

export const CalendarCommunitySection: React.FC<CalendarCommunitySectionProps> = ({
  events,
  buzzItems,
  onOpenTradeIdeas,
  onOpenEventDetail,
}) => {
  const [userVotes, setUserVotes] = useState<Record<string, 'Bullish' | 'Bearish'>>({});
  const [pulseDismissed, setPulseDismissed] = useState(false);

  const handleVote = (symbol: string, sentiment: 'Bullish' | 'Bearish') => {
    setUserVotes((prev) => ({
      ...prev,
      [symbol]: sentiment,
    }));
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4" data-purpose="market-insights" id="economy">
      {/* Economic & Earnings Calendar (7 cols) */}
      <div className="lg:col-span-7 border border-[#e0e3eb] dark:border-[#2a2e39] rounded-2xl p-5 bg-white dark:bg-[#1e222d] shadow-2xs transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
          <h4 className="font-bold text-lg text-[#131722] dark:text-white">Key Events &amp; Calendars</h4>
          <span className="text-xs text-[#787b86]">EST Timezone</span>
        </div>

        <div className="mt-4 space-y-3">
          {events.slice(0, 3).map((event) => (
            <div
              key={event.id}
              onClick={() => onOpenEventDetail(event)}
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#131722] border border-gray-100 dark:border-gray-800 hover:border-[#2962ff]/40 transition cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <span
                  className={`px-2 py-1 rounded text-[11px] font-bold ${
                    event.impact === 'HIGH'
                      ? 'bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300'
                      : event.impact === 'MED'
                      ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300'
                      : 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300'
                  }`}
                >
                  {event.impact}
                </span>
                <div>
                  <div className="text-sm font-semibold text-[#131722] dark:text-white">{event.title}</div>
                  <div className="text-xs text-[#787b86]">
                    {event.country} • {event.time}
                  </div>
                </div>
              </div>

              <div className="text-right text-xs">
                {event.impact === 'EARN' ? (
                  <>
                    <div className="font-semibold text-[#089981] font-bold">Consensus: {event.consensus}</div>
                    <div className="text-[#787b86]">Rev Est: {event.revEst}</div>
                  </>
                ) : (
                  <>
                    <div className="font-semibold text-[#131722] dark:text-white">Forecast: {event.forecast}</div>
                    <div className="text-[#787b86]">Prior: {event.prior}</div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Trends & Sentiment (5 cols) */}
      <div className="lg:col-span-5 border border-[#e0e3eb] dark:border-[#2a2e39] rounded-2xl p-5 bg-white dark:bg-[#1e222d] shadow-2xs flex flex-col justify-between transition-colors">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
            <h4 className="font-bold text-lg text-[#131722] dark:text-white">Community Buzz</h4>
            <button
              type="button"
              onClick={onOpenTradeIdeas}
              className="text-xs text-[#2962ff] hover:text-[#1e53e5] font-semibold cursor-pointer"
            >
              Live Stream
            </button>
          </div>

          <p className="text-xs text-[#787b86] mt-2">
            Symbols with the highest social chart idea submissions in the past 4 hours:
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {buzzItems.map((item, index) => {
              const userVote = userVotes[item.symbol];
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleVote(item.symbol, item.sentiment)}
                  title={`Click to agree with sentiment on ${item.symbol}`}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-[#131722] hover:bg-gray-200 dark:hover:bg-[#252936] text-xs font-semibold text-[#131722] dark:text-white transition cursor-pointer"
                >
                  <span>#{index + 1} {item.symbol}</span>
                  <span
                    className={`ml-1.5 ${
                      item.sentiment === 'Bullish' ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}
                  >
                    {item.sentiment} {item.percentage}%
                  </span>
                  {userVote && <span className="ml-1 text-[10px] text-[#2962ff]">✓</span>}
                </button>
              );
            })}
          </div>

          {!pulseDismissed && (
            <div className="mt-5 p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-200 leading-relaxed relative">
              💡 <strong>Market Pulse:</strong> S&amp;P 500 pushes towards record closes as mega-cap tech momentum outpaces bond yield volatility.
              <button
                type="button"
                onClick={() => setPulseDismissed(true)}
                className="absolute top-2 right-2 text-blue-400 hover:text-blue-600 text-xs cursor-pointer"
              >
                ×
              </button>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 mt-4 text-center">
          <button
            type="button"
            onClick={onOpenTradeIdeas}
            className="text-xs font-bold text-[#2962ff] hover:underline cursor-pointer"
          >
            Read top community trade ideas →
          </button>
        </div>
      </div>
    </section>
  );
};
