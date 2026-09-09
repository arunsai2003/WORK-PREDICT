import React from 'react';
import { 
  Filter, 
  RotateCcw, 
  Search, 
  Building2, 
  Layers, 
  ArrowUpDown,
  X
} from 'lucide-react';
import { Department } from '../../types';

interface DashboardFilterBarProps {
  selectedDept: string;
  onSelectDept: (dept: string) => void;
  selectedTier: string;
  onSelectTier: (tier: string) => void;
  sortBy: string;
  onSelectSort: (sort: string) => void;
  filterSearch: string;
  onSearchChange: (q: string) => void;
  onResetFilters: () => void;
  totalCount: number;
  filteredCount: number;
  isDark: boolean;
}

const DEPARTMENTS: ('All' | Department)[] = [
  'All', 
  'Engineering', 
  'Marketing', 
  'Finance', 
  'HR', 
  'Operations'
];

const TIERS = [
  { id: 'All', label: 'All Tiers' },
  { id: 'High', label: 'High (≥80%)' },
  { id: 'Medium', label: 'Medium (65-79%)' },
  { id: 'At Risk', label: 'At Risk (<65%)' }
];

export const DashboardFilterBar: React.FC<DashboardFilterBarProps> = ({
  selectedDept,
  onSelectDept,
  selectedTier,
  onSelectTier,
  sortBy,
  onSelectSort,
  filterSearch,
  onSearchChange,
  onResetFilters,
  totalCount,
  filteredCount,
  isDark
}) => {
  const isFiltered = selectedDept !== 'All' || selectedTier !== 'All' || sortBy !== 'productivity' || filterSearch.trim() !== '';

  return (
    <div className={`p-4 rounded-2xl border transition-all ${
      isDark ? 'glass-card text-slate-100' : 'bg-white border-slate-200 shadow-sm text-slate-900'
    }`}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        {/* Title & Active Filter Count */}
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <span>Dashboard Filters</span>
              {isFiltered && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border border-cyan-500/30 font-semibold">
                  Filtered: {filteredCount} / {totalCount} Staff
                </span>
              )}
            </h4>
          </div>
        </div>

        {/* Clear Filters Button */}
        {isFiltered && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition-colors"
            title="Reset all filters to default"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Filter Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 1. Department Filter */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Building2 className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
            <span>Department</span>
          </label>
          <select
            value={selectedDept}
            onChange={(e) => onSelectDept(e.target.value)}
            className={`w-full px-3 py-1.5 rounded-xl border text-xs font-medium focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all ${
              isDark 
                ? 'bg-slate-900/80 border-slate-800 text-slate-200' 
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept === 'All' ? 'All Departments' : dept}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Performance Tier Filter */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Layers className="w-3 h-3 text-purple-600 dark:text-purple-400" />
            <span>Performance Tier</span>
          </label>
          <select
            value={selectedTier}
            onChange={(e) => onSelectTier(e.target.value)}
            className={`w-full px-3 py-1.5 rounded-xl border text-xs font-medium focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all ${
              isDark 
                ? 'bg-slate-900/80 border-slate-800 text-slate-200' 
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            {TIERS.map((tier) => (
              <option key={tier.id} value={tier.id}>
                {tier.label}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Sort Order */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>Sort By</span>
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSelectSort(e.target.value)}
            className={`w-full px-3 py-1.5 rounded-xl border text-xs font-medium focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all ${
              isDark 
                ? 'bg-slate-900/80 border-slate-800 text-slate-200' 
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <option value="productivity">Highest Productivity</option>
            <option value="productivity-asc">Lowest Productivity</option>
            <option value="predicted">Highest Predicted Output</option>
            <option value="attendance">Best Attendance</option>
            <option value="engagement">Highest Engagement</option>
          </select>
        </div>

        {/* 4. Quick Keyword Search */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Search className="w-3 h-3 text-amber-500 dark:text-amber-400" />
            <span>Search Filter</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={filterSearch}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filter by name, role, email..."
              className={`w-full pl-8 pr-7 py-1.5 rounded-xl border text-xs font-medium focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all ${
                isDark 
                  ? 'bg-slate-900/80 border-slate-800 text-slate-200 placeholder:text-slate-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400'
              }`}
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            {filterSearch && (
              <button 
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Filter Badges / Chips */}
      <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/60 text-[11px]">
        <span className="text-slate-500 dark:text-slate-400 font-medium">Quick Presets:</span>
        <button
          onClick={() => { onSelectDept('All'); onSelectTier('All'); }}
          className={`px-2 py-0.5 rounded-lg border transition-all ${
            selectedDept === 'All' && selectedTier === 'All'
              ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500/40 font-bold'
              : isDark 
                ? 'bg-slate-800/50 text-slate-400 border-slate-700 hover:bg-slate-800'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
          }`}
        >
          All Workforce
        </button>

        <button
          onClick={() => { onSelectTier('High'); }}
          className={`px-2 py-0.5 rounded-lg border transition-all ${
            selectedTier === 'High'
              ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 font-bold'
              : isDark
                ? 'bg-slate-800/50 text-slate-400 border-slate-700 hover:bg-slate-800'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
          }`}
        >
          ★ High Tier Only
        </button>

        <button
          onClick={() => { onSelectTier('At Risk'); }}
          className={`px-2 py-0.5 rounded-lg border transition-all ${
            selectedTier === 'At Risk'
              ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/40 font-bold'
              : isDark
                ? 'bg-slate-800/50 text-slate-400 border-slate-700 hover:bg-slate-800'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
          }`}
        >
          ⚠ At Risk Only
        </button>

        <button
          onClick={() => { onSelectDept('Engineering'); }}
          className={`px-2 py-0.5 rounded-lg border transition-all ${
            selectedDept === 'Engineering'
              ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500/40 font-bold'
              : isDark
                ? 'bg-slate-800/50 text-slate-400 border-slate-700 hover:bg-slate-800'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
          }`}
        >
          Engineering
        </button>

        <button
          onClick={() => { onSelectDept('Marketing'); }}
          className={`px-2 py-0.5 rounded-lg border transition-all ${
            selectedDept === 'Marketing'
              ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/40 font-bold'
              : isDark
                ? 'bg-slate-800/50 text-slate-400 border-slate-700 hover:bg-slate-800'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
          }`}
        >
          Marketing
        </button>

        <button
          onClick={() => { onSelectDept('Finance'); }}
          className={`px-2 py-0.5 rounded-lg border transition-all ${
            selectedDept === 'Finance'
              ? 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/40 font-bold'
              : isDark
                ? 'bg-slate-800/50 text-slate-400 border-slate-700 hover:bg-slate-800'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
          }`}
        >
          Finance
        </button>
      </div>
    </div>
  );
};
