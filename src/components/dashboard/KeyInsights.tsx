import React from 'react';
import { 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  Target, 
  Calendar, 
  Lightbulb, 
  ArrowUpRight,
  Maximize2
} from 'lucide-react';
import { KeyInsight } from '../../types';

interface KeyInsightsProps {
  insights: KeyInsight[];
  onViewAll: () => void;
  isDark: boolean;
  onMaximize?: () => void;
}

export const KeyInsights: React.FC<KeyInsightsProps> = ({ insights, onViewAll, isDark, onMaximize }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'TrendingUp': return TrendingUp;
      case 'Users': return Users;
      case 'AlertTriangle': return AlertTriangle;
      case 'Target': return Target;
      case 'Calendar': return Calendar;
      default: return Lightbulb;
    }
  };

  return (
    <div className={`rounded-2xl p-5 border flex flex-col justify-between transition-all ${
      isDark ? 'glass-card text-slate-100' : 'bg-white border-slate-200 shadow-sm text-slate-900'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Key Insights</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onViewAll}
            className="flex items-center gap-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
          >
            <span>View all</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
          {onMaximize && (
            <button
              onClick={onMaximize}
              title="Maximize Key Insights"
              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 5 Cards matching reference image */}
      <div className="space-y-2.5">
        {insights.slice(0, 5).map((item) => {
          const Icon = getIcon(item.iconName);
          return (
            <div
              key={item.id}
              className={`p-2.5 rounded-xl border flex items-center gap-3 transition-all ${
                isDark 
                  ? 'bg-slate-900/50 border-slate-800/80 hover:border-cyan-500/30' 
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {/* Icon */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${item.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                    {item.title}
                  </h4>
                  <span className="text-[10px] font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-500/15 border border-cyan-500/30 px-1.5 py-0.5 rounded flex-shrink-0">
                    {item.date}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-1">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
