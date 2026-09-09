import React from 'react';
import { Info, ArrowUp, Maximize2 } from 'lucide-react';

interface ProductivityScoreProps {
  score: number;
  change: number;
  isDark: boolean;
  onMaximize?: () => void;
}

export const ProductivityScore: React.FC<ProductivityScoreProps> = ({ score, change, isDark, onMaximize }) => {
  const radius = 75;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`rounded-2xl p-5 border flex flex-col justify-between transition-all ${
      isDark ? 'glass-card text-slate-100' : 'bg-white border-slate-200 shadow-sm text-slate-900'
    }`}>
      {/* Title with Info tooltip & Maximize */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Productivity Score</h3>
        <div className="flex items-center gap-1.5">
          <button 
            title="Weighted score aggregated from output, attendance, and task velocity" 
            className="p-1 rounded-lg text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
          {onMaximize && (
            <button
              onClick={onMaximize}
              title="Maximize Score Diagnostics"
              className="p-1 rounded-lg text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Radial Gauge matching screenshot */}
      <div className="relative flex flex-col items-center justify-center my-1">
        <svg className="w-48 h-28 overflow-visible" viewBox="0 0 180 100">
          <defs>
            <linearGradient id="scoreGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#22C55E" />
            </linearGradient>
            <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Track */}
          <path
            d="M 15 90 A 75 75 0 0 1 165 90"
            fill="none"
            stroke={isDark ? "rgba(30, 50, 96, 0.5)" : "#e2e8f0"}
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Progress Arc */}
          <path
            d="M 15 90 A 75 75 0 0 1 165 90"
            fill="none"
            stroke="url(#scoreGaugeGrad)"
            strokeWidth="14"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            filter={isDark ? "url(#gaugeGlow)" : undefined}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Big Number */}
        <div className="absolute top-12 flex flex-col items-center">
          <span className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {score}%
          </span>
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Overall Score
          </span>
        </div>

        {/* Gauge Scale Markers */}
        <div className="w-48 flex justify-between px-2 -mt-1 text-[11px] font-semibold text-slate-400">
          <span>0</span>
          <span>100</span>
        </div>
      </div>

      {/* Change Indicator Pill matching reference */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <ArrowUp className="w-3.5 h-3.5 stroke-[3]" />
          <span>+{change}% vs last month</span>
        </div>
      </div>
    </div>
  );
};
