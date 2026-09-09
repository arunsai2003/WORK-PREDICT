import React from 'react';
import { Cpu, ArrowUp, Maximize2 } from 'lucide-react';
import { DepartmentSummary } from '../../types';

interface DepartmentProgressProps {
  departments: DepartmentSummary[];
  isDark: boolean;
  onMaximize?: () => void;
}

export const DepartmentProgress: React.FC<DepartmentProgressProps> = ({ departments, isDark, onMaximize }) => {
  return (
    <div className={`rounded-2xl p-5 border flex flex-col justify-between transition-all ${
      isDark ? 'glass-card text-slate-100' : 'bg-white border-slate-200 shadow-sm text-slate-900'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
            <Cpu className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Department Performance</h3>
        </div>
        {onMaximize && (
          <button
            onClick={onMaximize}
            title="Maximize Department Progress"
            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 5 Progress Bars matching screenshot */}
      <div className="space-y-4">
        {departments.map((dept) => {
          return (
            <div key={dept.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {dept.name}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {dept.productivity}%
                  </span>
                  <span className="flex items-center text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
                    <ArrowUp className="w-3 h-3 stroke-[3]" />
                    +{dept.change}%
                  </span>
                </div>
              </div>

              {/* Progress Track */}
              <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800/80 overflow-hidden p-0.5 border border-slate-200 dark:border-slate-800">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${dept.barClass} transition-all duration-1000 ease-out`}
                  style={{ width: `${dept.productivity}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
