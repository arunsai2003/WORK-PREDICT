import React, { useState, useMemo } from 'react';
import { Upload } from 'lucide-react';
import { KpiCards } from '../dashboard/KpiCards';
import { ProductivityTrend } from '../dashboard/ProductivityTrend';
import { ProductivityScore } from '../dashboard/ProductivityScore';
import { DepartmentHeatmap } from '../dashboard/DepartmentHeatmap';
import { EmployeeOverviewTable } from '../dashboard/EmployeeOverviewTable';
import { KeyInsights } from '../dashboard/KeyInsights';
import { DepartmentProgress } from '../dashboard/DepartmentProgress';
import { DashboardFilterBar } from '../dashboard/DashboardFilterBar';
import { MaximizedCardModal } from '../dashboard/MaximizedCardModal';
import { 
  KpiMetrics, 
  MonthlyTrend, 
  HeatmapCell, 
  Employee, 
  KeyInsight, 
  DepartmentSummary 
} from '../../types';

interface DashboardPageProps {
  kpis: KpiMetrics;
  monthlyTrends: MonthlyTrend[];
  heatmapCells: HeatmapCell[];
  employees: Employee[];
  insights: KeyInsight[];
  departments: DepartmentSummary[];
  onViewAllEmployees: () => void;
  onSelectEmployee: (emp: Employee) => void;
  onDeleteEmployee?: (emp: Employee) => void;
  onUploadClick?: () => void;
  isDark: boolean;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  kpis,
  monthlyTrends,
  heatmapCells,
  employees,
  insights,
  departments,
  onViewAllEmployees,
  onSelectEmployee,
  onDeleteEmployee,
  onUploadClick,
  isDark
}) => {
  // Filter States
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('productivity');
  const [filterSearch, setFilterSearch] = useState<string>('');

  // Maximized Card State
  const [maximizedCard, setMaximizedCard] = useState<
    'kpis' | 'trend' | 'score' | 'heatmap' | 'employees' | 'insights' | 'departments' | null
  >(null);

  // Filter employees according to user selections
  const filteredEmployees = useMemo(() => {
    let result = [...employees];

    if (selectedDept !== 'All') {
      result = result.filter(e => e.department === selectedDept);
    }

    if (selectedTier !== 'All') {
      result = result.filter(e => e.status === selectedTier);
    }

    if (filterSearch.trim()) {
      const q = filterSearch.toLowerCase();
      result = result.filter(e => 
        e.name.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q) ||
        e.role.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q)
      );
    }

    // Sort order
    result.sort((a, b) => {
      if (sortBy === 'productivity') return b.currentProductivity - a.currentProductivity;
      if (sortBy === 'productivity-asc') return a.currentProductivity - b.currentProductivity;
      if (sortBy === 'predicted') return b.predictedProductivity - a.predictedProductivity;
      if (sortBy === 'attendance') return b.attendance - a.attendance;
      if (sortBy === 'engagement') return b.engagement - a.engagement;
      return 0;
    });

    return result;
  }, [employees, selectedDept, selectedTier, filterSearch, sortBy]);

  const handleResetFilters = () => {
    setSelectedDept('All');
    setSelectedTier('All');
    setSortBy('productivity');
    setFilterSearch('');
  };

  return (
    <div className="space-y-5">
      {/* Clean Zero-Data Workspace Banner */}
      {employees.length === 0 && (
        <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
          isDark ? 'glass-card border-cyan-500/30' : 'bg-cyan-50/60 border-cyan-200 shadow-sm'
        }`}>
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 flex-shrink-0">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Clean Analytics Workspace — Ready for Your Data</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
                  0 Mock Data
                </span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                All mock employee records have been removed. Upload your organization's CSV or Excel (.xlsx) file to calculate live productivity KPIs and predictions.
              </p>
            </div>
          </div>
          {onUploadClick && (
            <button
              onClick={onUploadClick}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 transition-all flex-shrink-0 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Dataset (CSV/XLSX)</span>
            </button>
          )}
        </div>
      )}

      {/* Top Row: 4 KPI Cards with High, Medium, Low employee counts & Maximize buttons */}
      <KpiCards 
        kpis={kpis} 
        isDark={isDark} 
        onMaximize={() => setMaximizedCard('kpis')}
      />

      {/* Dashboard Filter Bar (All Filter Options) */}
      <DashboardFilterBar
        selectedDept={selectedDept}
        onSelectDept={setSelectedDept}
        selectedTier={selectedTier}
        onSelectTier={setSelectedTier}
        sortBy={sortBy}
        onSelectSort={setSortBy}
        filterSearch={filterSearch}
        onSearchChange={setFilterSearch}
        onResetFilters={handleResetFilters}
        totalCount={employees.length}
        filteredCount={filteredEmployees.length}
        isDark={isDark}
      />

      {/* Middle Row: Trend Chart (50%), Productivity Score (25%), Department Heatmap / Donut Distribution (25%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-5">
          <ProductivityTrend 
            data={monthlyTrends} 
            isDark={isDark} 
            onMaximize={() => setMaximizedCard('trend')}
          />
        </div>
        <div className="lg:col-span-3">
          <ProductivityScore 
            score={kpis.productivity} 
            change={kpis.productivityChange} 
            isDark={isDark} 
            onMaximize={() => setMaximizedCard('score')}
          />
        </div>
        <div className="lg:col-span-4">
          <DepartmentHeatmap 
            cells={heatmapCells} 
            kpis={kpis} 
            isDark={isDark} 
            onMaximize={() => setMaximizedCard('heatmap')}
          />
        </div>
      </div>

      {/* Bottom Row: Employee Prediction Overview (50%), Key Insights (25%), Department Progress (25%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-5">
          <EmployeeOverviewTable
            employees={filteredEmployees}
            onViewAll={onViewAllEmployees}
            onSelectEmployee={onSelectEmployee}
            onDeleteEmployee={onDeleteEmployee}
            isDark={isDark}
            onMaximize={() => setMaximizedCard('employees')}
          />
        </div>
        <div className="lg:col-span-3">
          <KeyInsights
            insights={insights}
            onViewAll={onViewAllEmployees}
            isDark={isDark}
            onMaximize={() => setMaximizedCard('insights')}
          />
        </div>
        <div className="lg:col-span-4">
          <DepartmentProgress 
            departments={departments} 
            isDark={isDark} 
            onMaximize={() => setMaximizedCard('departments')}
          />
        </div>
      </div>

      {/* Maximized Card Full-Screen Modal */}
      <MaximizedCardModal
        cardId={maximizedCard}
        onClose={() => setMaximizedCard(null)}
        kpis={kpis}
        monthlyTrends={monthlyTrends}
        heatmapCells={heatmapCells}
        employees={filteredEmployees}
        insights={insights}
        departments={departments}
        onSelectEmployee={onSelectEmployee}
        onDeleteEmployee={onDeleteEmployee}
        isDark={isDark}
      />
    </div>
  );
};
