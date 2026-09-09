import React, { useState } from 'react';
import { 
  X, 
  Minimize2, 
  Users, 
  TrendingUp, 
  BarChart3, 
  Grid, 
  Lightbulb, 
  Cpu,
  Trash2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  KpiMetrics, 
  MonthlyTrend, 
  HeatmapCell, 
  Employee, 
  KeyInsight, 
  DepartmentSummary 
} from '../../types';
import { EmployeeDistribution } from './EmployeeDistribution';

interface MaximizedCardModalProps {
  cardId: 'kpis' | 'trend' | 'score' | 'heatmap' | 'employees' | 'insights' | 'departments' | null;
  onClose: () => void;
  kpis: KpiMetrics;
  monthlyTrends: MonthlyTrend[];
  heatmapCells: HeatmapCell[];
  employees: Employee[];
  insights: KeyInsight[];
  departments: DepartmentSummary[];
  onSelectEmployee: (emp: Employee) => void;
  onDeleteEmployee?: (emp: Employee) => void;
  isDark: boolean;
}

export const MaximizedCardModal: React.FC<MaximizedCardModalProps> = ({
  cardId,
  onClose,
  kpis,
  monthlyTrends,
  heatmapCells,
  employees,
  insights,
  departments,
  onSelectEmployee,
  onDeleteEmployee,
  isDark
}) => {
  const [tableDept, setTableDept] = useState<string>('All');
  const [tableTier, setTableTier] = useState<string>('All');
  const [tableSearch, setTableSearch] = useState<string>('');
  const [trendView, setTrendView] = useState<'all' | 'actual' | 'forecast'>('all');
  const [insightCategory, setInsightCategory] = useState<string>('all');

  const avgAttendance = employees.length ? Math.round(employees.reduce((s, e) => s + e.attendance, 0) / employees.length) : 0;
  const avgEngagement = employees.length ? Math.round(employees.reduce((s, e) => s + e.engagement, 0) / employees.length) : 0;
  const avgTasks = employees.length ? Math.round(employees.reduce((s, e) => s + Math.min(100, Math.round((e.tasksCompleted / (e.tasksTotal || 1)) * 100)), 0) / employees.length) : 0;

  if (!cardId) return null;

  const cardConfig = {
    kpis: { title: 'Executive KPI Metrics Breakdown', subtitle: 'Workforce cohorts, top performers, and risk diagnostics', icon: Users },
    trend: { title: 'Productivity Trend & Predictive Forecast Laboratory', subtitle: 'Historical variance against AI projections', icon: TrendingUp },
    score: { title: 'Enterprise Productivity Score Diagnostics', subtitle: 'Radial gauge and weighted factor breakdown', icon: BarChart3 },
    heatmap: { title: 'Cross-Departmental Performance & Tier Distribution', subtitle: 'Heatmap matrix and workforce tier distribution', icon: Grid },
    employees: { title: 'Employee Productivity Predictions Master Table', subtitle: 'Individual forecasts, attendance velocity, and risk status', icon: Users },
    insights: { title: 'AI Key Strategic Workforce Insights', subtitle: 'Comprehensive actionable recommendations', icon: Lightbulb },
    departments: { title: 'Departmental Performance & Quota Attainment', subtitle: 'Breakdown across engineering, marketing, finance, ops, HR', icon: Cpu }
  };

  const current = cardConfig[cardId];
  const Icon = current.icon;

  const modalFilteredEmployees = employees.filter(e => {
    const matchDept = tableDept === 'All' || e.department === tableDept;
    const matchTier = tableTier === 'All' || e.status === tableTier;
    const matchSearch = tableSearch.trim() === '' || 
      e.name.toLowerCase().includes(tableSearch.toLowerCase()) || 
      e.role.toLowerCase().includes(tableSearch.toLowerCase());
    return matchDept && matchTier && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`relative w-full max-w-6xl max-h-[92vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden transition-all ${
        isDark ? 'bg-[#0b1329] border-slate-700/80 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header Bar */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {current.title}
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 font-semibold uppercase tracking-wider">
                  Maximized View
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{current.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              title="Minimize / Return to Dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Minimize</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Maximized Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 1. KPIS MAXIMIZED */}
          {cardId === 'kpis' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/60 border-blue-500/30' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Total Workforce</span>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{kpis.totalEmployees}</h3>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">+{kpis.totalEmployeesChange}% vs last month</p>
                </div>
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/60 border-cyan-500/30' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Overall Productivity</span>
                  <h3 className="text-3xl font-bold text-cyan-600 dark:text-cyan-400 mt-1">{kpis.productivity}%</h3>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">+{kpis.productivityChange}% vs benchmark</p>
                </div>
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/60 border-emerald-500/30' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-xs text-slate-500 dark:text-slate-400">High Performers</span>
                  <h3 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{kpis.highEmployees}</h3>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">{kpis.highAvgProductivity}% Average Output</p>
                </div>
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/60 border-rose-500/30' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-xs text-slate-500 dark:text-slate-400">At Risk Workforce</span>
                  <h3 className="text-3xl font-bold text-rose-600 dark:text-rose-400 mt-1">{kpis.lowEmployees}</h3>
                  <p className="text-xs text-rose-700 dark:text-rose-300 mt-1">{kpis.lowAvgProductivity}% Average Output</p>
                </div>
              </div>

              {/* Three Tier Breakdown */}
              <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
                  Workforce Cohort Distribution & Averages
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <h5 className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">High Performance Cohort</h5>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{kpis.highEmployees} Employees</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Average Score: <strong className="text-emerald-600 dark:text-emerald-300">{kpis.highAvgProductivity}%</strong></p>
                    <p className="text-[11px] text-slate-400 mt-1">Share: {Math.round((kpis.highEmployees / (kpis.totalEmployees || 1)) * 100)}% of total company</p>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <h5 className="font-bold text-blue-600 dark:text-blue-400 text-sm">Medium Core Cohort</h5>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{kpis.mediumEmployees} Employees</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Average Score: <strong className="text-blue-600 dark:text-blue-300">{kpis.mediumAvgProductivity}%</strong></p>
                    <p className="text-[11px] text-slate-400 mt-1">Share: {Math.round((kpis.mediumEmployees / (kpis.totalEmployees || 1)) * 100)}% of total company</p>
                  </div>

                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                    <h5 className="font-bold text-rose-600 dark:text-rose-400 text-sm">Low / At Risk Cohort</h5>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{kpis.lowEmployees} Employees</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Average Score: <strong className="text-rose-600 dark:text-rose-300">{kpis.lowAvgProductivity}%</strong></p>
                    <p className="text-[11px] text-slate-400 mt-1">Share: {Math.round((kpis.lowEmployees / (kpis.totalEmployees || 1)) * 100)}% of total company</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. PRODUCTIVITY TREND MAXIMIZED */}
          {cardId === 'trend' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Filter Series:</span>
                  <button 
                    onClick={() => setTrendView('all')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      trendView === 'all' 
                        ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500/40' 
                        : isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    All (Actual + Forecast)
                  </button>
                  <button 
                    onClick={() => setTrendView('actual')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      trendView === 'actual' 
                        ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500/40' 
                        : isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    Actual Only
                  </button>
                  <button 
                    onClick={() => setTrendView('forecast')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      trendView === 'forecast' 
                        ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/40' 
                        : isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    AI Forecast Only
                  </button>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">9 Data Points (Jan – Sep 2026)</span>
              </div>

              <div className={`h-80 w-full p-4 rounded-2xl border ${
                isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "rgba(59, 130, 246, 0.15)" : "rgba(226, 232, 240, 0.9)"} />
                    <XAxis dataKey="month" stroke={isDark ? "#94a3b8" : "#64748b"} />
                    <YAxis domain={[30, 100]} stroke={isDark ? "#94a3b8" : "#64748b"} />
                    <Tooltip contentStyle={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', borderColor: isDark ? '#334155' : '#e2e8f0', borderRadius: '12px' }} />
                    <Legend verticalAlign="top" height={36} />
                    {(trendView === 'all' || trendView === 'actual') && (
                      <Line type="monotone" dataKey="actual" name="Actual Productivity" stroke="#06b6d4" strokeWidth={3} dot={{ r: 5 }} />
                    )}
                    {(trendView === 'all' || trendView === 'forecast') && (
                      <Line type="monotone" dataKey="forecast" name="AI Predicted Trajectory" stroke="#3b82f6" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 5 }} />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className={`rounded-2xl border overflow-hidden ${
                isDark ? 'border-slate-800' : 'border-slate-200'
              }`}>
                <table className="w-full text-left text-xs">
                  <thead className={`border-b uppercase text-[10px] ${
                    isDark ? 'bg-slate-900/80 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}>
                    <tr>
                      <th className="p-3">Month</th>
                      <th className="p-3">Actual Output</th>
                      <th className="p-3">AI Forecast</th>
                      <th className="p-3">Variance</th>
                      <th className="p-3">Trajectory</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-slate-800/60' : 'divide-slate-200'}`}>
                    {monthlyTrends.map((t) => {
                      const diff = t.actual - t.forecast;
                      return (
                        <tr key={t.month} className={isDark ? 'hover:bg-slate-900/40' : 'hover:bg-slate-50'}>
                          <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{t.month} 2026</td>
                          <td className="p-3 font-bold text-cyan-600 dark:text-cyan-400">{t.actual}%</td>
                          <td className="p-3 font-bold text-blue-600 dark:text-blue-400">{t.forecast}%</td>
                          <td className="p-3 font-semibold">
                            <span className={diff >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                              {diff >= 0 ? `+${diff}%` : `${diff}%`}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                              {diff >= 0 ? 'Exceeding Forecast' : 'Lagging Model'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. PRODUCTIVITY SCORE MAXIMIZED */}
          {cardId === 'score' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className={`p-6 rounded-2xl border flex flex-col items-center ${
                isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Diagnostic Score Gauge</span>
                <div className="relative w-64 h-36 flex items-center justify-center">
                  <h2 className="text-6xl font-extrabold text-slate-900 dark:text-white">{kpis.productivity}%</h2>
                </div>
                <div className="mt-4 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                  +{kpis.productivityChange}% vs Previous Period
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center max-w-xs">
                  Enterprise workforce performance index exceeds the baseline 80% benchmark target.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Composite Factor Weighting</h4>
                <div className={`p-3.5 rounded-xl border flex justify-between items-center ${
                  isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Task Completion Velocity (40%)</span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Total volume of completed milestone sprint tasks</p>
                  </div>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{avgTasks}%</span>
                </div>

                <div className={`p-3.5 rounded-xl border flex justify-between items-center ${
                  isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Attendance & Punctuality (30%)</span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Active working day participation across logged shifts</p>
                  </div>
                  <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">{avgAttendance}%</span>
                </div>

                <div className={`p-3.5 rounded-xl border flex justify-between items-center ${
                  isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Team Engagement & Collaboration (30%)</span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Peer reviews, cross-functional collaboration and feedback</p>
                  </div>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{avgEngagement}%</span>
                </div>
              </div>
            </div>
          )}

          {/* 4. HEATMAP & DONUT MAXIMIZED */}
          {cardId === 'heatmap' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={`p-5 rounded-2xl border space-y-3 ${
                  isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                    Full 5x5 Cross-Departmental Matrix
                  </h4>
                  <div className="grid grid-cols-6 gap-2 text-center text-xs">
                    <span className="text-slate-500 font-bold">Metric</span>
                    <span className="text-cyan-600 dark:text-cyan-400 font-semibold">Eng</span>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">Mkt</span>
                    <span className="text-purple-600 dark:text-purple-400 font-semibold">Fin</span>
                    <span className="text-amber-600 dark:text-amber-400 font-semibold">HR</span>
                    <span className="text-rose-600 dark:text-rose-400 font-semibold">Ops</span>

                    {['Overall', 'Productivity', 'Engagement', 'Attendance', 'Collaboration'].map(row => (
                      <React.Fragment key={row}>
                        <span className="text-left font-semibold text-slate-700 dark:text-slate-300 py-1.5">{row}</span>
                        {(['Engineering', 'Marketing', 'Finance', 'HR', 'Operations'] as const).map(dept => {
                          const cell = heatmapCells.find(c => c.row === row && c.department === dept);
                          const score = cell?.score || 80;
                          return (
                            <div key={dept} className="p-2 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 font-bold">
                              {score}%
                            </div>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className={`p-5 rounded-2xl border ${
                  isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <EmployeeDistribution kpis={kpis} isDark={isDark} />
                </div>
              </div>
            </div>
          )}

          {/* 5. EMPLOYEES TABLE MAXIMIZED */}
          {cardId === 'employees' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search by name or role..."
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    className={`px-3 py-1.5 rounded-xl border text-xs w-64 focus:outline-none focus:border-cyan-500 ${
                      isDark ? 'bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400'
                    }`}
                  />
                  <select
                    value={tableDept}
                    onChange={(e) => setTableDept(e.target.value)}
                    className={`px-3 py-1.5 rounded-xl border text-xs ${
                      isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <option value="All">All Departments</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="HR">HR</option>
                    <option value="Operations">Operations</option>
                  </select>
                  <select
                    value={tableTier}
                    onChange={(e) => setTableTier(e.target.value)}
                    className={`px-3 py-1.5 rounded-xl border text-xs ${
                      isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <option value="All">All Tiers</option>
                    <option value="High">High (≥80%)</option>
                    <option value="Medium">Medium (65-79%)</option>
                    <option value="At Risk">At Risk (&lt;65%)</option>
                  </select>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  Showing {modalFilteredEmployees.length} of {employees.length} Staff
                </span>
              </div>

              <div className={`border rounded-2xl overflow-hidden ${
                isDark ? 'border-slate-800' : 'border-slate-200'
              }`}>
                <div className="max-h-[55vh] overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className={`border-b text-[11px] uppercase sticky top-0 z-10 ${
                      isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                    }`}>
                      <tr>
                        <th className="p-3">#</th>
                        <th className="p-3">Name</th>
                        <th className="p-3">Department</th>
                        <th className="p-3">Role</th>
                        <th className="p-3 text-center">Productivity</th>
                        <th className="p-3 text-center">Predicted</th>
                        <th className="p-3 text-center">Attendance</th>
                        <th className="p-3 text-center">Status</th>
                        <th className="p-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? 'divide-slate-800/60' : 'divide-slate-100'}`}>
                      {modalFilteredEmployees.map((emp) => (
                        <tr 
                          key={emp.id}
                          onClick={() => { onSelectEmployee(emp); onClose(); }}
                          className={`cursor-pointer transition-colors ${
                            isDark ? 'hover:bg-slate-900/50' : 'hover:bg-slate-50'
                          }`}
                        >
                          <td className="p-3 text-slate-400 font-mono">{emp.num}</td>
                          <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">{emp.name}</td>
                          <td className="p-3 text-slate-500 dark:text-slate-400">{emp.department}</td>
                          <td className="p-3 text-slate-500 dark:text-slate-400">{emp.role}</td>
                          <td className="p-3 text-center font-bold text-cyan-600 dark:text-cyan-400">{emp.currentProductivity}%</td>
                          <td className="p-3 text-center font-bold text-blue-600 dark:text-blue-400">{emp.predictedProductivity}%</td>
                          <td className="p-3 text-center text-slate-700 dark:text-slate-300">{emp.attendance}%</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              emp.status === 'High' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' :
                              emp.status === 'Medium' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' : 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                            }`}>
                              {emp.status}
                            </span>
                          </td>
                          <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                            {onDeleteEmployee && (
                              <button
                                type="button"
                                onClick={() => onDeleteEmployee(emp)}
                                title={`Remove ${emp.name}`}
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/15 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 6. KEY INSIGHTS MAXIMIZED */}
          {cardId === 'insights' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">Filter Category:</span>
                {['all', 'trend', 'performers', 'risk', 'leading', 'forecast'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setInsightCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize border transition-all ${
                      insightCategory === cat 
                        ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500/40' 
                        : isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {insights
                  .filter(item => insightCategory === 'all' || item.category === insightCategory)
                  .map((item) => (
                    <div key={item.id} className={`p-4 rounded-2xl border transition-all space-y-2 ${
                      isDark ? 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/40' : 'bg-slate-50 border-slate-200 hover:border-cyan-500'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 font-semibold border border-cyan-500/30">
                          {item.date}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">{item.category}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* 7. DEPARTMENTS MAXIMIZED */}
          {cardId === 'departments' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {departments.map((dept) => {
                  const deptEmps = employees.filter(e => e.department === dept.name);
                  const high = deptEmps.filter(e => e.status === 'High').length;
                  const low = deptEmps.filter(e => e.status === 'At Risk').length;
                  const med = Math.max(0, deptEmps.length - high - low);

                  return (
                    <div key={dept.name} className={`p-4 rounded-2xl border space-y-2 ${
                      isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{dept.name}</h4>
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">+{dept.change}%</span>
                      </div>
                      <p className="text-3xl font-extrabold text-cyan-600 dark:text-cyan-400">{dept.productivity}%</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{deptEmps.length} Total Members</p>
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 text-[11px] space-y-1">
                        <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold"><span>High:</span> <span>{high}</span></div>
                        <div className="flex justify-between text-blue-600 dark:text-blue-400 font-semibold"><span>Medium:</span> <span>{med}</span></div>
                        <div className="flex justify-between text-rose-600 dark:text-rose-400 font-semibold"><span>Low:</span> <span>{low}</span></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
