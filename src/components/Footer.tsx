import React from 'react';

interface FooterProps {
  onOpenScreener: () => void;
  onOpenWorldIndices: () => void;
  onOpenTradeIdeas: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenScreener,
  onOpenWorldIndices,
  onOpenTradeIdeas,
}) => {
  return (
    <footer className="border-t border-[#e0e3eb] dark:border-[#2a2e39] bg-white dark:bg-[#131722] mt-16 py-12 text-[#787b86] text-xs transition-colors">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div>
          <h5 className="font-bold text-[#131722] dark:text-white text-sm mb-3">Products</h5>
          <ul className="space-y-2">
            <li>
              <a
                href="#indices"
                onClick={(e) => {
                  e.preventDefault();
                  onOpenWorldIndices();
                }}
                className="hover:text-[#2962ff] transition"
              >
                Supercharts
              </a>
            </li>
            <li>
              <a href="#more" className="hover:text-[#2962ff] transition">
                Pine Script™
              </a>
            </li>
            <li>
              <button
                type="button"
                onClick={onOpenScreener}
                className="hover:text-[#2962ff] transition text-left cursor-pointer"
              >
                Stock Screener
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={onOpenScreener}
                className="hover:text-[#2962ff] transition text-left cursor-pointer"
              >
                Crypto Screener
              </button>
            </li>
            <li>
              <a href="#economy" className="hover:text-[#2962ff] transition">
                Economic Calendar
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-[#131722] dark:text-white text-sm mb-3">Company</h5>
          <ul className="space-y-2">
            <li>
              <a href="#about" className="hover:text-[#2962ff] transition">
                About
              </a>
            </li>
            <li>
              <a href="#features" className="hover:text-[#2962ff] transition">
                Features
              </a>
            </li>
            <li>
              <a href="#pricing" className="hover:text-[#2962ff] transition">
                Pricing
              </a>
            </li>
            <li>
              <a href="#wall" className="hover:text-[#2962ff] transition">
                Wall of Love
              </a>
            </li>
            <li>
              <a href="#careers" className="hover:text-[#2962ff] transition">
                Careers
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-[#131722] dark:text-white text-sm mb-3">Community</h5>
          <ul className="space-y-2">
            <li>
              <a href="#refer" className="hover:text-[#2962ff] transition">
                Refer a friend
              </a>
            </li>
            <li>
              <button
                type="button"
                onClick={onOpenTradeIdeas}
                className="hover:text-[#2962ff] transition text-left cursor-pointer"
              >
                Ideas
              </button>
            </li>
            <li>
              <a href="#scripts" className="hover:text-[#2962ff] transition">
                Scripts
              </a>
            </li>
            <li>
              <a href="#rules" className="hover:text-[#2962ff] transition">
                House Rules
              </a>
            </li>
            <li>
              <a href="#moderators" className="hover:text-[#2962ff] transition">
                Moderators
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-[#131722] dark:text-white text-sm mb-3">For Business</h5>
          <ul className="space-y-2">
            <li>
              <a href="#widgets" className="hover:text-[#2962ff] transition">
                Widgets
              </a>
            </li>
            <li>
              <a href="#charting-libraries" className="hover:text-[#2962ff] transition">
                Charting Libraries
              </a>
            </li>
            <li>
              <a href="#brokerage" className="hover:text-[#2962ff] transition">
                Brokerage integration
              </a>
            </li>
            <li>
              <a href="#advertising" className="hover:text-[#2962ff] transition">
                Advertising
              </a>
            </li>
          </ul>
        </div>

        <div className="col-span-2 md:col-span-1">
          <h5 className="font-bold text-[#131722] dark:text-white text-sm mb-3">TradingView</h5>
          <p className="leading-normal mb-3">
            Look first / Then leap. Market data provided by ICE Data Services and world exchanges.
          </p>
          <p className="text-[11px] text-gray-400">© 2025 TradingView, Inc.</p>
        </div>
      </div>
    </footer>
  );
};
