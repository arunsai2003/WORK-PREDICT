import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { KpiMetrics } from '../../types';

interface EmployeeDistributionProps {
  kpis: KpiMetrics;
  isDark: boolean;
}

export const EmployeeDistribution: React.FC<EmployeeDistributionProps> = ({ kpis, isDark }) => {
  const data = [
    { name: 'High', value: kpis.highEmployees, avg: kpis.highAvgProductivity, color: '#22C55E' },
    { name: 'Medium', value: kpis.mediumEmployees, avg: kpis.mediumAvgProductivity, color: '#3B82F6' },
    { name: 'Low', value: kpis.lowEmployees, avg: kpis.lowAvgProductivity, color: '#EF4444' },
  ];

  return (
    <div className="h-full flex flex-col justify-between">
      {/* Large Donut Chart with Center Text "Total Employees" */}
      <div className="h-44 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className={`p-2.5 rounded-xl border text-xs shadow-xl ${
                      isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
                    }`}>
                      <p className="font-bold" style={{ color: d.color }}>{d.name} Tier</p>
                      <p className={isDark ? 'text-slate-200' : 'text-slate-700'}>
                        {d.value} Employees ({Math.round((d.value / kpis.totalEmployees) * 100)}%)
                      </p>
                      <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Average: {d.avg}%</p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text matching prompt */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total</span>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white leading-none mt-0.5">
            {kpis.totalEmployees}
          </span>
          <span className="text-[10px] text-slate-400">Employees</span>
        </div>
      </div>

      {/* Distribution Tiers Legend */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-center">
        <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">High (≥80%)</span>
          <p className="text-xs font-extrabold text-slate-900 dark:text-white mt-0.5">{kpis.highEmployees}</p>
          <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 font-medium">{kpis.highAvgProductivity}% avg</span>
        </div>

        <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">Medium (50-79%)</span>
          <p className="text-xs font-extrabold text-slate-900 dark:text-white mt-0.5">{kpis.mediumEmployees}</p>
          <span className="text-[10px] text-blue-600/80 dark:text-blue-400/80 font-medium">{kpis.mediumAvgProductivity}% avg</span>
        </div>

        <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
          <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">Low (&lt;50%)</span>
          <p className="text-xs font-extrabold text-slate-900 dark:text-white mt-0.5">{kpis.lowEmployees}</p>
          <span className="text-[10px] text-rose-600/80 dark:text-rose-400/80 font-medium">{kpis.lowAvgProductivity}% avg</span>
        </div>
      </div>
    </div>
  );
};
