import React from 'react';
import { Users, BarChart3, Trophy, AlertTriangle, ArrowUp, Maximize2 } from 'lucide-react';
import { KpiMetrics } from '../../types';

interface KpiCardsProps {
  kpis: KpiMetrics;
  isDark: boolean;
  onMaximize?: (cardId: string) => void;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ kpis, isDark, onMaximize }) => {
  const highPct = Math.round((kpis.highEmployees / (kpis.totalEmployees || 1)) * 100);
  const medPct = Math.round((kpis.mediumEmployees / (kpis.totalEmployees || 1)) * 100);
  const lowPct = Math.max(0, 100 - highPct - medPct);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Total Employees with High / Medium / Low Breakdown & Averages */}
      <div
        className={`group rounded-2xl p-4 border transition-all duration-300 flex flex-col justify-between ${
          isDark 
            ? 'glass-card glass-card-hover text-slate-100 group-hover:shadow-glow-blue' 
            : 'bg-white border-slate-200 shadow-sm text-slate-900 hover:shadow-md'
        }`}
      >
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-md bg-blue-600/20 text-blue-500 dark:bg-blue-600/30 dark:text-blue-400 border border-blue-500/30">
            <Users className="w-7 h-7" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                Total Employees
              </p>
              {onMaximize && (
                <button
                  onClick={() => onMaximize('kpis')}
                  title="Maximize KPI breakdown"
                  className="p-1 rounded-lg text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">
              {kpis.totalEmployees.toLocaleString()}
            </h3>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className="flex items-center font-semibold text-emerald-600 dark:text-emerald-400">
                <ArrowUp className="w-3 h-3 stroke-[3]" />
                +{kpis.totalEmployeesChange}%
              </span>
              <span className="text-slate-400 text-[11px]">vs last month</span>
            </div>
          </div>
        </div>

        {/* Visual Segmented Distribution Bar */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex mb-2">
            <div style={{ width: `${highPct}%` }} className="h-full bg-emerald-500" title={`High: ${highPct}%`}></div>
            <div style={{ width: `${medPct}%` }} className="h-full bg-blue-500" title={`Medium: ${medPct}%`}></div>
            <div style={{ width: `${lowPct}%` }} className="h-full bg-rose-500" title={`Low: ${lowPct}%`}></div>
          </div>

          {/* High, Med, Low Counts & Averages Line */}
          <div className="flex items-center justify-between text-[11px] leading-none">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold" title="High Tier (≥80%)">
              High: {kpis.highEmployees} <span className="text-[10px] opacity-80">({kpis.highAvgProductivity}%)</span>
            </span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold" title="Medium Tier (50-79%)">
              Med: {kpis.mediumEmployees} <span className="text-[10px] opacity-80">({kpis.mediumAvgProductivity}%)</span>
            </span>
            <span className="text-rose-600 dark:text-rose-400 font-semibold" title="Low / At Risk Tier (<50%)">
              Low: {kpis.lowEmployees} <span className="text-[10px] opacity-80">({kpis.lowAvgProductivity}%)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Card 2: Productivity */}
      <div
        className={`group rounded-2xl p-4 border transition-all duration-300 flex flex-col justify-between ${
          isDark 
            ? 'glass-card glass-card-hover text-slate-100 group-hover:shadow-glow-cyan' 
            : 'bg-white border-slate-200 shadow-sm text-slate-900 hover:shadow-md'
        }`}
      >
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-md bg-cyan-500/20 text-cyan-600 dark:bg-cyan-500/30 dark:text-cyan-400 border border-cyan-400/30">
            <BarChart3 className="w-7 h-7" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                Productivity
              </p>
              {onMaximize && (
                <button
                  onClick={() => onMaximize('kpis')}
                  title="Maximize KPI breakdown"
                  className="p-1 rounded-lg text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">
              {kpis.productivity}%
            </h3>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className="flex items-center font-semibold text-emerald-600 dark:text-emerald-400">
                <ArrowUp className="w-3 h-3 stroke-[3]" />
                +{kpis.productivityChange}%
              </span>
              <span className="text-slate-400 text-[11px]">vs last month</span>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>Workforce Benchmark</span>
          <span className="font-semibold text-cyan-600 dark:text-cyan-400">Overall 84% Target</span>
        </div>
      </div>

      {/* Card 3: Top Performers (High Employees) */}
      <div
        className={`group rounded-2xl p-4 border transition-all duration-300 flex flex-col justify-between ${
          isDark 
            ? 'glass-card glass-card-hover text-slate-100 group-hover:shadow-glow-purple' 
            : 'bg-white border-slate-200 shadow-sm text-slate-900 hover:shadow-md'
        }`}
      >
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-md bg-purple-600/20 text-purple-600 dark:bg-purple-600/30 dark:text-purple-400 border border-purple-500/30">
            <Trophy className="w-7 h-7" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                Top Performers
              </p>
              {onMaximize && (
                <button
                  onClick={() => onMaximize('kpis')}
                  title="Maximize KPI breakdown"
                  className="p-1 rounded-lg text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">
              {kpis.highEmployees}
            </h3>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className="flex items-center font-semibold text-emerald-600 dark:text-emerald-400">
                <ArrowUp className="w-3 h-3 stroke-[3]" />
                +{kpis.topPerformersChange}%
              </span>
              <span className="text-slate-400 text-[11px]">vs last month</span>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>High Output Tier (≥80%)</span>
          <span className="font-semibold text-purple-600 dark:text-purple-400">{kpis.highAvgProductivity}% Avg Output</span>
        </div>
      </div>

      {/* Card 4: At Risk Workforce (Low Employees) */}
      <div
        className={`group rounded-2xl p-4 border transition-all duration-300 flex flex-col justify-between ${
          isDark 
            ? 'glass-card glass-card-hover text-slate-100 group-hover:shadow-glow-rose' 
            : 'bg-white border-slate-200 shadow-sm text-slate-900 hover:shadow-md'
        }`}
      >
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-md bg-rose-600/20 text-rose-600 dark:bg-rose-600/30 dark:text-rose-400 border border-rose-500/30">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                At Risk Workforce
              </p>
              {onMaximize && (
                <button
                  onClick={() => onMaximize('kpis')}
                  title="Maximize KPI breakdown"
                  className="p-1 rounded-lg text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">
              {kpis.lowEmployees}
            </h3>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className="flex items-center font-semibold text-rose-600 dark:text-rose-400">
                <ArrowUp className="w-3 h-3 stroke-[3]" />
                +{kpis.atRiskChange}%
              </span>
              <span className="text-slate-400 text-[11px]">needs attention</span>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>Early Warning Trigger (&lt;65%)</span>
          <span className="font-semibold text-rose-600 dark:text-rose-400">{kpis.lowAvgProductivity}% Avg Output</span>
        </div>
      </div>
    </div>
  );
};
