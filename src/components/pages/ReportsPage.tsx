import React from 'react';
import { 
  FileText, 
  Printer, 
  Download
} from 'lucide-react';
import { Employee, DepartmentSummary, Settings, KpiMetrics } from '../../types';

interface ReportsPageProps {
  employees: Employee[];
  departments: DepartmentSummary[];
  settings: Settings;
  kpis: KpiMetrics;
  isDark: boolean;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  employees,
  departments,
  settings,
  kpis,
  isDark
}) => {
  const handlePrint = () => {
    window.print();
  };

  const exportFullExcel = () => {
    const headers = ['#', 'Name', 'Department', 'Role', 'Email', 'Current Productivity (%)', 'Predicted Productivity (%)', 'Attendance (%)', 'Engagement (%)', 'Status'];
    const csvRows = [headers.join(',')];

    employees.forEach(e => {
      const row = [
        e.num,
        `"${e.name}"`,
        `"${e.department}"`,
        `"${e.role}"`,
        `"${e.email}"`,
        e.currentProductivity,
        e.predictedProductivity,
        e.attendance,
        e.engagement,
        `"${e.status}"`
      ];
      csvRows.push(row.join(','));
    });

    const csvData = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const csvUrl = URL.createObjectURL(csvData);
    const link = document.createElement('a');
    link.href = csvUrl;
    link.setAttribute('download', `WorkPredict_Pro_Workforce_Report_Sep_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const total = employees.length || 1;
  const highPct = Math.round((kpis.highEmployees / total) * 100);
  const lowPct = Math.round((kpis.lowEmployees / total) * 100);
  const medPct = Math.max(0, 100 - highPct - lowPct);

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className={`p-5 rounded-2xl border flex items-center justify-between ${
        isDark ? 'glass-card' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Executive Workforce Productivity Audit
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Generated report for September 2026 with predictive analytics & department breakdown
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
          <button
            onClick={exportFullExcel}
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export to Excel</span>
          </button>
        </div>
      </div>

      {/* Printable Executive Summary Sheet */}
      <div className={`p-6 rounded-2xl border ${
        isDark ? 'glass-card' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        {/* Brief Header */}
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">WorkPredict Pro – Monthly Performance Brief</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">Reporting Period: Jan 2026 – Sep 2026 • Real-time AI Calibrated</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-cyan-600 dark:text-cyan-400 font-semibold">Status: AI Verified</span>
            <p className="text-[11px] text-slate-400">{employees.length} Employees Audited</p>
          </div>
        </div>

        {/* Top 5 Key Executive Metrics (Overall, Forecast, High, Medium, Low) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 mb-6">
          <div className={`p-3 rounded-xl border ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-xs text-slate-500 dark:text-slate-400">Overall Productivity</span>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{kpis.productivity}%</p>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">+{kpis.productivityChange}% vs last month</span>
          </div>

          <div className={`p-3 rounded-xl border ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-xs text-slate-500 dark:text-slate-400">Next Month Forecast</span>
            <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mt-1">87%</p>
            <span className="text-[11px] text-cyan-700 dark:text-cyan-300 font-medium">Target on track</span>
          </div>

          {/* High Performers */}
          <div className={`p-3 rounded-xl border ${
            isDark ? 'bg-slate-900/60 border-emerald-500/30' : 'bg-emerald-50/50 border-emerald-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">High Performers</span>
              <span className="text-[10px] text-slate-400">≥{settings.highThreshold}%</span>
            </div>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{kpis.highEmployees}</p>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">{highPct}% of workforce • {kpis.highAvgProductivity}% avg</span>
          </div>

          {/* Medium Performers */}
          <div className={`p-3 rounded-xl border ${
            isDark ? 'bg-slate-900/60 border-blue-500/30' : 'bg-blue-50/50 border-blue-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Medium Performers</span>
              <span className="text-[10px] text-slate-400">{settings.atRiskThreshold}–{settings.highThreshold - 1}%</span>
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{kpis.mediumEmployees}</p>
            <span className="text-[11px] text-blue-700 dark:text-blue-300 font-medium">{medPct}% of workforce • {kpis.mediumAvgProductivity}% avg</span>
          </div>

          {/* Low / At Risk */}
          <div className={`p-3 rounded-xl border ${
            isDark ? 'bg-slate-900/60 border-rose-500/30' : 'bg-rose-50/50 border-rose-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold">At Risk (Low)</span>
              <span className="text-[10px] text-slate-400">&lt;{settings.atRiskThreshold}%</span>
            </div>
            <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">{kpis.lowEmployees}</p>
            <span className="text-[11px] text-rose-700 dark:text-rose-300 font-medium">{lowPct}% of workforce • {kpis.lowAvgProductivity}% avg</span>
          </div>
        </div>

        {/* Workforce Tier Classification Overview (Segmented Bar) */}
        <div className={`p-4 rounded-xl border mb-6 ${
          isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">
              Workforce Tier Distribution (High, Medium, Low)
            </h4>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Total: {total} Staff</span>
          </div>

          {/* Visual 3-Color Segmented Bar */}
          <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex gap-0.5 p-0.5 mb-2.5">
            <div 
              style={{ width: `${highPct}%` }}
              className="h-full bg-emerald-500 rounded-l-full"
              title={`High: ${kpis.highEmployees} (${highPct}%)`}
            />
            <div 
              style={{ width: `${medPct}%` }}
              className="h-full bg-blue-500"
              title={`Medium: ${kpis.mediumEmployees} (${medPct}%)`}
            />
            <div 
              style={{ width: `${lowPct}%` }}
              className="h-full bg-rose-500 rounded-r-full"
              title={`Low: ${kpis.lowEmployees} (${lowPct}%)`}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">High Tier (≥{settings.highThreshold}%):</span>
              <span>{kpis.highEmployees} employees ({highPct}%) • {kpis.highAvgProductivity}% avg output</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">Medium Tier ({settings.atRiskThreshold}%–{settings.highThreshold - 1}%):</span>
              <span>{kpis.mediumEmployees} employees ({medPct}%) • {kpis.mediumAvgProductivity}% avg output</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="font-semibold text-rose-600 dark:text-rose-400">Low / At Risk (&lt;{settings.atRiskThreshold}%):</span>
              <span>{kpis.lowEmployees} employees ({lowPct}%) • {kpis.lowAvgProductivity}% avg output</span>
            </div>
          </div>
        </div>

        {/* Department Comparison Table with High / Med / Low Breakdown */}
        <div className="mt-4">
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-300 uppercase tracking-wider mb-3">
            Department Performance Audit & Workforce Tiers
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 uppercase">
                  <th className="py-2.5">Department</th>
                  <th className="py-2.5">Staff Count</th>
                  <th className="py-2.5">Avg Productivity</th>
                  <th className="py-2.5">High / Medium / Low Breakdown</th>
                  <th className="py-2.5">Monthly Delta</th>
                  <th className="py-2.5">Target Compliance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {departments.map((dept) => {
                  const deptEmps = employees.filter(e => e.department === dept.name);
                  const count = deptEmps.length;
                  const dHigh = deptEmps.filter(e => e.currentProductivity >= settings.highThreshold).length;
                  const dLow = deptEmps.filter(e => e.currentProductivity < settings.atRiskThreshold).length;
                  const dMed = Math.max(0, count - dHigh - dLow);

                  return (
                    <tr key={dept.name}>
                      <td className="py-2.5 font-semibold text-slate-800 dark:text-slate-200">{dept.name}</td>
                      <td className="py-2.5 text-slate-500 dark:text-slate-400">{count} members</td>
                      <td className="py-2.5 font-bold text-slate-900 dark:text-slate-100">{dept.productivity}%</td>
                      <td className="py-2.5">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                            {dHigh} High
                          </span>
                          <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-600 dark:text-blue-400 font-semibold border border-blue-500/20">
                            {dMed} Med
                          </span>
                          <span className="px-2 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 font-semibold border border-rose-500/20">
                            {dLow} Low
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 text-emerald-600 dark:text-emerald-400 font-semibold">+{dept.change}%</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          dept.productivity >= 75 
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' 
                            : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                        }`}>
                          {dept.productivity >= 75 ? 'Meets Benchmark' : 'Review Needed'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
