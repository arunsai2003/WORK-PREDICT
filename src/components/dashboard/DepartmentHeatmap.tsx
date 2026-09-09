import React, { useState } from 'react';
import { Grid, PieChart as PieIcon, Maximize2 } from 'lucide-react';
import { HeatmapCell, Department, KpiMetrics } from '../../types';
import { EmployeeDistribution } from './EmployeeDistribution';

interface DepartmentHeatmapProps {
  cells: HeatmapCell[];
  kpis: KpiMetrics;
  isDark: boolean;
  onMaximize?: () => void;
}

export const DepartmentHeatmap: React.FC<DepartmentHeatmapProps> = ({ cells, kpis, isDark, onMaximize }) => {
  const [viewMode, setViewMode] = useState<'matrix' | 'donut'>('matrix');

  const departments: Department[] = ['Engineering', 'Marketing', 'Finance', 'Operations', 'HR'];
  const rows = ['Overall', 'Productivity', 'Engagement', 'Attendance', 'Collaboration'];

  const getScore = (row: string, dept: Department): number => {
    const found = cells.find(c => c.row === row && c.department === dept);
    return found ? found.score : 80;
  };

  const getCellColor = (row: string, dept: Department): string => {
    const score = getScore(row, dept);
    if (score >= 85) return 'bg-emerald-500 hover:bg-emerald-400';
    if (score >= 75) return 'bg-emerald-600 hover:bg-emerald-500';
    if (score >= 68) return 'bg-amber-500 hover:bg-amber-400';
    return 'bg-rose-500 hover:bg-rose-400';
  };

  return (
    <div className={`rounded-2xl p-5 border flex flex-col justify-between transition-all ${
      isDark ? 'glass-card text-slate-100' : 'bg-white border-slate-200 shadow-sm text-slate-900'
    }`}>
      {/* Header with Matrix / Donut Toggle Button */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {viewMode === 'matrix' ? 'Department Performance' : 'Employee Distribution'}
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {viewMode === 'matrix' ? 'Multi-metric heatmap matrix' : 'High, Medium, Low Tier Breakdown'}
          </p>
        </div>

        <div className="flex items-center gap-1 p-0.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60">
          <button
            onClick={() => setViewMode('matrix')}
            title="Matrix View"
            className={`p-1 rounded-lg text-xs transition-colors ${
              viewMode === 'matrix' 
                ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-semibold' 
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode('donut')}
            title="Donut Distribution View"
            className={`p-1 rounded-lg text-xs transition-colors ${
              viewMode === 'donut' 
                ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-semibold' 
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        {onMaximize && (
          <button
            onClick={onMaximize}
            title="Maximize Matrix / Donut View"
            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1.5"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {viewMode === 'donut' ? (
        /* Donut Chart View matching prompt */
        <EmployeeDistribution kpis={kpis} isDark={isDark} />
      ) : (
        /* Heatmap Matrix View matching screenshot */
        <>
          <div className="overflow-x-auto py-2">
            <table className="w-full border-separate border-spacing-1.5 text-center">
              <thead>
                <tr>
                  <th className="text-[10px] text-slate-400 font-medium text-left pr-2"></th>
                  {departments.map(dept => (
                    <th key={dept} className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-semibold truncate max-w-[50px]">
                      {dept === 'Engineering' ? 'Engineering' : 
                       dept === 'Marketing' ? 'Marketing' : 
                       dept === 'Finance' ? 'Finance' : 
                       dept === 'Operations' ? 'Operations' : 'HR'}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row}>
                    <td className="text-[10px] font-medium text-slate-700 dark:text-slate-300 text-left whitespace-nowrap pr-2">
                      {row}
                    </td>
                    {departments.map(dept => {
                      const colorClass = getCellColor(row, dept);
                      const score = getScore(row, dept);
                      return (
                        <td key={dept} className="p-0">
                          <div
                            title={`${dept} - ${row}: ${score}%`}
                            className={`w-7 h-5 sm:w-9 sm:h-6 rounded-md mx-auto transition-transform hover:scale-110 cursor-pointer shadow-sm ${colorClass}`}
                          ></div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-start gap-4 pt-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>High (≥80%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>Med (68-79%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>Low (&lt;68%)</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
