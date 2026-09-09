import React, { useState } from 'react';
import { Users, ArrowUpRight, Maximize2 } from 'lucide-react';
import { Employee } from '../../types';

interface EmployeeOverviewTableProps {
  employees: Employee[];
  onViewAll: () => void;
  onSelectEmployee: (emp: Employee) => void;
  isDark: boolean;
  onMaximize?: () => void;
}

export const EmployeeOverviewTable: React.FC<EmployeeOverviewTableProps> = ({
  employees,
  onViewAll,
  onSelectEmployee,
  isDark,
  onMaximize
}) => {
  const [tierFilter, setTierFilter] = useState<'All' | 'High' | 'Medium' | 'At Risk'>('All');

  const filteredEmployees = employees.filter(e => {
    if (tierFilter === 'All') return true;
    return e.status === tierFilter;
  });

  const displayed = filteredEmployees.slice(0, 8);

  return (
    <div className={`rounded-2xl p-5 border flex flex-col justify-between transition-all ${
      isDark ? 'glass-card text-slate-100' : 'bg-white border-slate-200 shadow-sm text-slate-900'
    }`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Employee Prediction Overview
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Tier Filters */}
          <div className="flex items-center gap-1 text-[10px] font-semibold">
            {(['All', 'High', 'Medium', 'At Risk'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTierFilter(t)}
                className={`px-2 py-0.5 rounded-lg border transition-all ${
                  tierFilter === t 
                    ? t === 'High' ? 'bg-emerald-500/25 text-emerald-600 dark:text-emerald-300 border-emerald-500/40'
                      : t === 'At Risk' ? 'bg-rose-500/25 text-rose-600 dark:text-rose-300 border-rose-500/40'
                      : t === 'Medium' ? 'bg-blue-500/25 text-blue-600 dark:text-blue-300 border-blue-500/40'
                      : 'bg-cyan-500/25 text-cyan-700 dark:text-cyan-300 border-cyan-500/40'
                    : isDark 
                      ? 'bg-slate-800/40 text-slate-400 border-slate-700/60 hover:bg-slate-800' 
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                }`}
              >
                {t === 'At Risk' ? 'Risk' : t}
              </button>
            ))}
          </div>

          <button
            onClick={onViewAll}
            className="flex items-center gap-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors ml-1"
          >
            <span>View all</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          {onMaximize && (
            <button
              onClick={onMaximize}
              title="Maximize Employee Prediction Table"
              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800/60 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-2.5 px-2">#</th>
              <th className="py-2.5 px-3">Employee Name</th>
              <th className="py-2.5 px-3">Department</th>
              <th className="py-2.5 px-3 text-center">Current Productivity</th>
              <th className="py-2.5 px-3 text-center">Predicted (Next Month)</th>
              <th className="py-2.5 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-xs">
            {displayed.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  <p className="font-semibold text-xs mb-1">No employee records in current dataset</p>
                  <p className="text-[11px] text-slate-500">Add employees via the Data Entry tab or upload a CSV/Excel dataset to view metrics.</p>
                </td>
              </tr>
            ) : (
              displayed.map((emp, index) => {
                return (
                  <tr
                    key={emp.id}
                    onClick={() => onSelectEmployee(emp)}
                    className={`group cursor-pointer transition-colors ${
                      isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-2 px-2 text-slate-400 font-medium">
                      {index + 1}
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 group-hover:ring-cyan-400 transition-all"
                        />
                        <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                          {emp.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-slate-500 dark:text-slate-400">
                      {emp.department}
                    </td>
                    <td className="py-2 px-3 text-center font-bold text-slate-800 dark:text-slate-200">
                      {emp.currentProductivity}%
                    </td>
                    <td className="py-2 px-3 text-center font-bold text-cyan-600 dark:text-cyan-400">
                      {emp.predictedProductivity}%
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        emp.status === 'High'
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : emp.status === 'Medium'
                          ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                          : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
