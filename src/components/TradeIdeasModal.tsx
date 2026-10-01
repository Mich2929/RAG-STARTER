import React, { useState } from 'react';
import { X, ThumbsUp, MessageSquare, TrendingUp, TrendingDown, Share2 } from 'lucide-react';

interface TradeIdeasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSymbol: (symbol: string) => void;
}

export const TradeIdeasModal: React.FC<TradeIdeasModalProps> = ({
  isOpen,
  onClose,
  onSelectSymbol,
}) => {
  if (!isOpen) return null;

  const [ideas, setIdeas] = useState([
    {
      id: 1,
      author: 'QuantumWave_Trades',
      avatar: 'QW',
      time: '24m ago',
      symbol: 'NVDA',
      title: 'NVDA: Ascending Triangle Breakout Target $152.00',
      bias: 'Bullish',
      likes: 142,
      comments: 18,
      text: 'Volume confirmation on the 4H timeframe with bullish divergence on MACD. Stop loss placed at $138.20 support retest.',
    },
    {
      id: 2,
      author: 'SatoshiNomad',
      avatar: 'SN',
      time: '1h ago',
      symbol: 'BTCUSD',
      title: 'Bitcoin: Liquidity sweep before explosive push past $98,000',
      bias: 'Bullish',
      likes: 389,
      comments: 64,
      text: 'Whale order book clusters are defending the $94.5k zone. Looking for institutional spot ETF inflows to trigger new highs.',
    },
    {
      id: 3,
      author: 'DeltaHedger',
      avatar: 'DH',
      time: '3h ago',
      symbol: 'TSLA',
      title: 'Tesla: Range-bound consolidation, watch $215 support',
      bias: 'Bearish',
      likes: 87,
      comments: 29,
      text: 'Rejection at 50-day EMA with declining volume. Risk-reward favors short entries targeting the lower channel around $208.',
    },
  ]);

  const [userLikes, setUserLikes] = useState<Record<number, boolean>>({});

  const handleLike = (id: number) => {
    setUserLikes((prev) => {
      const liked = !!prev[id];
      setIdeas((prevIdeas) =>
        prevIdeas.map((idea) =>
          idea.id === id ? { ...idea, likes: idea.likes + (liked ? -1 : 1) } : idea
        )
      );
      return { ...prev, [id]: !liked };
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-2xl max-w-2xl w-full max-h-[85vh] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#e0e3eb] dark:border-[#2a2e39] flex items-center justify-between bg-white dark:bg-[#1e222d] shrink-0">
          <div>
            <h3 className="font-extrabold text-lg text-[#131722] dark:text-white">
              TradingView Community Trade Ideas
            </h3>
            <p className="text-xs text-[#787b86]">
              Real-time analysis, technical setups & discussions from verified traders
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#f0f3fa] dark:hover:bg-[#252936] text-[#787b86] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ideas Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {ideas.map((idea) => {
            const isLiked = !!userLikes[idea.id];
            const isBullish = idea.bias === 'Bullish';
            return (
              <div
                key={idea.id}
                className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#131722]/50 hover:border-[#2962ff]/40 transition space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                      {idea.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-[#131722] dark:text-white">
                        {idea.author}
                      </div>
                      <div className="text-[10px] text-[#787b86]">{idea.time}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectSymbol(idea.symbol);
                        onClose();
                      }}
                      className="px-2.5 py-1 rounded bg-[#f0f3fa] dark:bg-[#252936] font-bold text-xs text-[#2962ff] hover:underline"
                    >
                      {idea.symbol}
                    </button>
                    <span
                      className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                        isBullish
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-[#089981]'
                          : 'bg-rose-100 dark:bg-rose-950 text-[#f23645]'
                      }`}
                    >
                      {isBullish ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      <span>{idea.bias}</span>
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-[#131722] dark:text-white leading-snug">
                    {idea.title}
                  </h4>
                  <p className="text-xs text-[#787b86] mt-1 leading-relaxed">{idea.text}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-200/50 dark:border-gray-800 text-xs text-[#787b86]">
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      onClick={() => handleLike(idea.id)}
                      className={`flex items-center space-x-1 hover:text-[#2962ff] transition cursor-pointer ${
                        isLiked ? 'text-[#2962ff] font-bold' : ''
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{idea.likes}</span>
                    </button>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{idea.comments}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href);
                      alert('Idea link copied to clipboard!');
                    }}
                    className="flex items-center space-x-1 hover:text-[#2962ff] transition cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
