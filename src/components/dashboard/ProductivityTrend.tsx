import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { Activity, Maximize2 } from 'lucide-react';
import { MonthlyTrend } from '../../types';

interface ProductivityTrendProps {
  data: MonthlyTrend[];
  isDark: boolean;
  onMaximize?: () => void;
}

export const ProductivityTrend: React.FC<ProductivityTrendProps> = ({ data, isDark, onMaximize }) => {
  return (
    <div className={`rounded-2xl p-5 border flex flex-col justify-between transition-all ${
      isDark ? 'glass-card text-slate-100' : 'bg-white border-slate-200 shadow-sm text-slate-900'
    }`}>
      {/* Header with Title and Legend */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Productivity Trend</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Actual vs AI Forecast</p>
          </div>
        </div>

        {/* Legend & Maximize button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-sm shadow-cyan-500/50"></span>
              <span className="text-slate-600 dark:text-slate-300">Actual</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 rotate-45"></span>
              <span className="text-slate-600 dark:text-slate-300">AI Forecast</span>
            </div>
          </div>
          {onMaximize && (
            <button
              onClick={onMaximize}
              title="Maximize Trend Chart"
              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke={isDark ? "rgba(59, 130, 246, 0.15)" : "rgba(226, 232, 240, 0.9)"} 
            />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }}
            />
            <YAxis 
              domain={[0, 100]} 
              ticks={[0, 20, 40, 60, 80, 100]} 
              tickFormatter={(val) => `${val}%`}
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className={`p-2.5 rounded-xl border text-xs shadow-xl backdrop-blur-md ${
                      isDark ? 'bg-slate-900/95 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-lg'
                    }`}>
                      <p className="font-bold mb-1">{label} 2026</p>
                      <p className="text-cyan-600 dark:text-cyan-400 flex items-center justify-between gap-4 font-semibold">
                        <span>Actual:</span>
                        <span>{payload[0]?.value}%</span>
                      </p>
                      <p className="text-blue-600 dark:text-blue-400 flex items-center justify-between gap-4 font-semibold">
                        <span>AI Forecast:</span>
                        <span>{payload[1]?.value}%</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* Glowing Teal line for Actual */}
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#06B6D4"
              strokeWidth={3}
              dot={{ r: 4, fill: '#06B6D4', strokeWidth: 2, stroke: isDark ? '#070d1e' : '#ffffff' }}
              activeDot={{ r: 6, fill: '#06B6D4', stroke: '#ffffff', strokeWidth: 2 }}
            />
            {/* Blue line for AI Forecast */}
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="#3B82F6"
              strokeWidth={2.5}
              strokeDasharray="4 4"
              dot={{ r: 3.5, fill: '#3B82F6', strokeWidth: 1, stroke: '#ffffff' }}
              activeDot={{ r: 5, fill: '#3B82F6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
