import React, { useState } from 'react';
import { X, Calendar, Bell, Check, TrendingUp } from 'lucide-react';
import { EconomicEvent } from '../types';

interface EventDetailModalProps {
  event: EconomicEvent | null;
  onClose: () => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, onClose }) => {
  if (!event) return null;

  const [reminderSet, setReminderSet] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-[#2962ff]">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  event.impact === 'HIGH'
                    ? 'bg-red-100 text-red-700'
                    : event.impact === 'MED'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {event.impact} IMPACT
              </span>
              <h3 className="font-extrabold text-lg text-[#131722] dark:text-white mt-1">
                {event.title}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#f0f3fa] dark:hover:bg-[#252936] text-[#787b86]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 bg-[#f0f3fa] dark:bg-[#131722] p-4 rounded-xl text-xs">
          <div className="flex justify-between">
            <span className="text-[#787b86]">Scheduled Time</span>
            <span className="font-bold text-[#131722] dark:text-white">{event.time}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#787b86]">Jurisdiction</span>
            <span className="font-bold text-[#131722] dark:text-white">{event.country}</span>
          </div>
          {event.impact === 'EARN' ? (
            <>
              <div className="flex justify-between">
                <span className="text-[#787b86]">Consensus</span>
                <span className="font-bold text-[#089981]">{event.consensus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#787b86]">Revenue Estimate</span>
                <span className="font-bold text-[#131722] dark:text-white">{event.revEst}</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between">
                <span className="text-[#787b86]">Consensus Forecast</span>
                <span className="font-bold text-[#131722] dark:text-white">{event.forecast}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#787b86]">Previous Release</span>
                <span className="font-bold text-[#131722] dark:text-white">{event.prior}</span>
              </div>
            </>
          )}
        </div>

        <p className="text-xs text-[#787b86] leading-relaxed">
          High-impact economic indicators typically cause significant volatility across equity index futures, currency pairs, and bond yields. Set a notification to track the live print.
        </p>

        <div className="flex items-center space-x-3 pt-2">
          <button
            type="button"
            onClick={() => setReminderSet(true)}
            className="flex-1 py-2.5 rounded-full bg-[#2962ff] hover:bg-[#1e53e5] text-white font-semibold text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            {reminderSet ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Reminder Scheduled</span>
              </>
            ) : (
              <>
                <Bell className="w-4 h-4" />
                <span>Set Alert for Release</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-full border border-gray-200 dark:border-gray-700 text-xs font-semibold text-[#787b86] hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
