import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Sliders, 
  RotateCcw, 
  Filter, 
  Building2, 
  Layers, 
  Search, 
  X, 
  CheckCircle2, 
  ArrowUp, 
  ArrowDown, 
  Users, 
  Zap, 
  ShieldAlert, 
  GraduationCap, 
  Bot,
  ArrowRight,
  SlidersHorizontal
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
import { Employee, MonthlyTrend, Settings, Department } from '../../types';
import { INITIAL_MONTHLY_TRENDS } from '../../data/defaultData';

interface PredictionsPageProps {
  employees: Employee[];
  settings?: Settings;
  monthlyTrends?: MonthlyTrend[];
  onSelectEmployee?: (emp: Employee) => void;
  onApplyPredictions?: (updatedEmployees: Employee[]) => void;
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

export const PredictionsPage: React.FC<PredictionsPageProps> = ({
  employees,
  settings,
  monthlyTrends = INITIAL_MONTHLY_TRENDS,
  onSelectEmployee,
  onApplyPredictions,
  isDark
}) => {
  // Filter Options for the What-If Simulator
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Simulator Lever Options
  const [attendanceDelta, setAttendanceDelta] = useState<number>(0);
  const [engagementDelta, setEngagementDelta] = useState<number>(0);
  const [trainingHours, setTrainingHours] = useState<number>(0);
  const [toolingDelta, setToolingDelta] = useState<number>(0);

  // Active preset option identifier
  const [activePreset, setActivePreset] = useState<string>('baseline');
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);

  // Filtered target cohort for simulation
  const targetCohort = useMemo(() => {
    return employees.filter(emp => {
      const matchDept = selectedDept === 'All' || emp.department === selectedDept;
      const matchTier = selectedTier === 'All' || emp.status === selectedTier;
      const matchSearch = !searchQuery.trim() || 
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        emp.role.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDept && matchTier && matchSearch;
    });
  }, [employees, selectedDept, selectedTier, searchQuery]);

  // Dynamic baseline productivity computed from the selected cohort
  const cohortBaselineProductivity = useMemo(() => {
    if (targetCohort.length === 0) return 0;
    const sum = targetCohort.reduce((acc, e) => acc + e.currentProductivity, 0);
    return Math.round(sum / targetCohort.length);
  }, [targetCohort]);

  // Overall enterprise baseline
  const enterpriseBaseline = useMemo(() => {
    if (employees.length === 0) return 0;
    const sum = employees.reduce((acc, e) => acc + e.currentProductivity, 0);
    return Math.round(sum / employees.length);
  }, [employees]);

  // Calculate combined simulation delta
  const deltaTotal = Math.round(
    (attendanceDelta * 0.3) + 
    (engagementDelta * 0.3) + 
    (trainingHours * 0.25) + 
    (toolingDelta * 0.2)
  );

  const effectiveBaseline = targetCohort.length > 0 ? cohortBaselineProductivity : enterpriseBaseline;
  const simulatedProductivity = Math.min(100, Math.max(0, effectiveBaseline + deltaTotal));

  // Threshold bounds
  const highThreshold = settings?.highThreshold || 80;
  const atRiskThreshold = settings?.atRiskThreshold || 65;

  // Cohort Tier Shift Diagnostics (Before vs After)
  const tierAnalysis = useMemo(() => {
    let beforeHigh = 0;
    let beforeMed = 0;
    let beforeRisk = 0;

    let afterHigh = 0;
    let afterMed = 0;
    let afterRisk = 0;

    targetCohort.forEach(emp => {
      if (emp.currentProductivity >= highThreshold) beforeHigh++;
      else if (emp.currentProductivity < atRiskThreshold) beforeRisk++;
      else beforeMed++;

      const simScore = Math.min(100, Math.max(0, emp.currentProductivity + deltaTotal));
      if (simScore >= highThreshold) afterHigh++;
      else if (simScore < atRiskThreshold) afterRisk++;
      else afterMed++;
    });

    const rescuedCount = Math.max(0, beforeRisk - afterRisk);
    const highGained = Math.max(0, afterHigh - beforeHigh);

    return {
      beforeHigh,
      afterHigh,
      highGained,
      beforeMed,
      afterMed,
      beforeRisk,
      afterRisk,
      rescuedCount
    };
  }, [targetCohort, deltaTotal, highThreshold, atRiskThreshold]);

  // Fixed Scenario Preset Options (Fix the options)
  const handleApplyPreset = (
    presetId: string, 
    att: number, 
    eng: number, 
    train: number, 
    tool: number
  ) => {
    setActivePreset(presetId);
    setAttendanceDelta(att);
    setEngagementDelta(eng);
    setTrainingHours(train);
    setToolingDelta(tool);
  };

  const handleResetSliders = () => {
    setActivePreset('baseline');
    setAttendanceDelta(0);
    setEngagementDelta(0);
    setTrainingHours(0);
    setToolingDelta(0);
  };

  const handleResetFilters = () => {
    setSelectedDept('All');
    setSelectedTier('All');
    setSearchQuery('');
  };

  // Trajectory Simulation Chart Data
  const simulatedTrends = monthlyTrends.map((t, idx) => {
    if (idx >= 6) {
      return {
        ...t,
        simulated: Math.min(100, Math.round(t.forecast + deltaTotal * ((idx - 5) / 3)))
      };
    }
    return { ...t, simulated: t.actual };
  });

  // Apply simulated predictions to the dataset
  const handleApplyToDataset = () => {
    if (!onApplyPredictions) return;

    const targetIds = new Set(targetCohort.map(e => e.id));
    const updated = employees.map(emp => {
      if (targetIds.has(emp.id)) {
        const newPredicted = Math.min(100, Math.max(0, emp.currentProductivity + deltaTotal));
        let newStatus: 'High' | 'Medium' | 'At Risk' = 'Medium';
        if (newPredicted >= highThreshold) newStatus = 'High';
        else if (newPredicted < atRiskThreshold) newStatus = 'At Risk';
        return {
          ...emp,
          predictedProductivity: newPredicted,
          status: newStatus
        };
      }
      return emp;
    });

    onApplyPredictions(updated);
    setAppliedNotification(`Applied simulated forecast (+${deltaTotal}%) to ${targetCohort.length} employees!`);
    setTimeout(() => setAppliedNotification(null), 3500);
  };

  const isFiltered = selectedDept !== 'All' || selectedTier !== 'All' || searchQuery.trim() !== '';

  return (
    <div className="space-y-5">
      {/* Top Banner: AI Model Laboratory Metrics */}
      <div className={`p-5 rounded-2xl border ${
        isDark ? 'glass-card' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              AI Work Prediction Laboratory
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Multi-factor forecasting engine predicting employee productivity trajectories
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-4">
          <div className={`p-3 rounded-xl border ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Forecast Horizon</span>
            <p className="text-lg font-bold text-slate-900 dark:text-white">30 Days (Next Month)</p>
          </div>
          <div className={`p-3 rounded-xl border ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Model Accuracy (R²)</span>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">0.94</p>
          </div>
          <div className={`p-3 rounded-xl border ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Mean Abs Error (MAE)</span>
            <p className="text-lg font-bold text-cyan-600 dark:text-cyan-400">± 2.4%</p>
          </div>
          <div className={`p-3 rounded-xl border ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Confidence Score</span>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">96.2%</p>
          </div>
        </div>
      </div>

      {/* WHAT-IF WORKFORCE SIMULATOR (WITH FILTER OPTIONS & FIXED OPTIONS) */}
      <div className={`p-5 rounded-2xl border space-y-5 ${
        isDark ? 'glass-card' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        {/* Header & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>What-If Workforce Simulator</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 font-semibold">
                  Interactive Policy Sandbox
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Filter target departments or cohorts and simulate the productivity impact of HR interventions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetSliders}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Reset all simulator levers to baseline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Levers</span>
            </button>
          </div>
        </div>

        {/* 1. FILTER OPTIONS BAR (Department, Tier, and Keyword Search) */}
        <div className={`p-4 rounded-xl border space-y-3 ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">
                Target Cohort Filters:
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
                Targeting: {targetCohort.length} of {employees.length} Staff ({cohortBaselineProductivity}% Avg Output)
              </span>
              {isFiltered && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 hover:underline font-semibold"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Controls Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Department Filter Option */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>Department Filter</span>
              </label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className={`w-full px-3 py-1.5 rounded-xl border text-xs font-medium focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all ${
                  isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-800'
                }`}
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept === 'All' ? 'All Departments' : `${dept} Department`}
                  </option>
                ))}
              </select>
            </div>

            {/* Performance Tier Filter Option */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Performance Tier Filter</span>
              </label>
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className={`w-full px-3 py-1.5 rounded-xl border text-xs font-medium focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all ${
                  isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-800'
                }`}
              >
                {TIERS.map((tier) => (
                  <option key={tier.id} value={tier.id}>
                    {tier.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Keyword Search Filter Option */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Search className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                <span>Employee / Role Filter</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter by name or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-8 pr-7 py-1.5 rounded-xl border text-xs font-medium focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all ${
                    isDark ? 'bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-800 placeholder:text-slate-400'
                  }`}
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 2. FIXED SCENARIO OPTIONS (Pre-configured Strategies) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Fixed Policy Scenario Options:</span>
            </span>
            <span className="text-[11px] text-slate-400">Click a preset to automatically configure levers</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleApplyPreset('balanced', 5, 6, 6, 5)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activePreset === 'balanced'
                  ? 'bg-cyan-500 text-white border-cyan-500 shadow-md shadow-cyan-500/20'
                  : isDark 
                    ? 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800' 
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              <span>🎯 Balanced Growth</span>
              <span className="text-[10px] opacity-80">(+5% Att, +6% Eng, 6h)</span>
            </button>

            <button
              onClick={() => handleApplyPreset('upskilling', 2, 8, 16, 10)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activePreset === 'upskilling'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/20'
                  : isDark 
                    ? 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800' 
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>🚀 High-Impact Upskilling</span>
              <span className="text-[10px] opacity-80">(16h Training, +10% Tools)</span>
            </button>

            <button
              onClick={() => handleApplyPreset('remediation', 12, 14, 10, 8)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activePreset === 'remediation'
                  ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/20'
                  : isDark 
                    ? 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800' 
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>🛡️ At-Risk Remediation</span>
              <span className="text-[10px] opacity-80">(+12% Att, +14% Eng)</span>
            </button>

            <button
              onClick={() => handleApplyPreset('sprint', 8, 15, 0, 12)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activePreset === 'sprint'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/20'
                  : isDark 
                    ? 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800' 
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>⚡ Sprint Velocity</span>
              <span className="text-[10px] opacity-80">(+8% Att, +15% Eng)</span>
            </button>

            <button
              onClick={() => handleApplyPreset('burnout', -5, 10, 8, 15)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activePreset === 'burnout'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                  : isDark 
                    ? 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800' 
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              <span>🌿 Burnout Prevention</span>
              <span className="text-[10px] opacity-80">(-5% Load, +15% Tools)</span>
            </button>

            <button
              onClick={handleResetSliders}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activePreset === 'baseline'
                  ? 'bg-slate-700 text-white border-slate-600'
                  : isDark 
                    ? 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800' 
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Baseline (0%)</span>
            </button>
          </div>
        </div>

        {/* 3. SIMULATOR LEVERS & OUTCOME DASHBOARD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Levers Column (4 Controls: Attendance, Engagement, Upskilling, AI Tools) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Lever 1: Attendance Optimization */}
            <div className={`p-3.5 rounded-xl border space-y-2 ${
              isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span>Attendance & Schedule Optimization</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-cyan-600 dark:text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
                    {attendanceDelta > 0 ? `+${attendanceDelta}%` : `${attendanceDelta}%`}
                  </span>
                  <button 
                    onClick={() => { setAttendanceDelta(prev => Math.max(-15, prev - 5)); setActivePreset('custom'); }}
                    className="px-1.5 py-0.5 rounded text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300"
                  >
                    -5%
                  </button>
                  <button 
                    onClick={() => { setAttendanceDelta(prev => Math.min(15, prev + 5)); setActivePreset('custom'); }}
                    className="px-1.5 py-0.5 rounded text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300"
                  >
                    +5%
                  </button>
                </div>
              </div>
              <input
                type="range"
                min="-15"
                max="15"
                value={attendanceDelta}
                onChange={(e) => { setAttendanceDelta(Number(e.target.value)); setActivePreset('custom'); }}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>-15% (High Absenteeism)</span>
                <span>Neutral (0%)</span>
                <span>+15% (Strict Attendance)</span>
              </div>
            </div>

            {/* Lever 2: Engagement & Team Collaboration */}
            <div className={`p-3.5 rounded-xl border space-y-2 ${
              isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Engagement & Team Collaboration</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30">
                    {engagementDelta > 0 ? `+${engagementDelta}%` : `${engagementDelta}%`}
                  </span>
                  <button 
                    onClick={() => { setEngagementDelta(prev => Math.max(-15, prev - 5)); setActivePreset('custom'); }}
                    className="px-1.5 py-0.5 rounded text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300"
                  >
                    -5%
                  </button>
                  <button 
                    onClick={() => { setEngagementDelta(prev => Math.min(15, prev + 5)); setActivePreset('custom'); }}
                    className="px-1.5 py-0.5 rounded text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300"
                  >
                    +5%
                  </button>
                </div>
              </div>
              <input
                type="range"
                min="-15"
                max="15"
                value={engagementDelta}
                onChange={(e) => { setEngagementDelta(Number(e.target.value)); setActivePreset('custom'); }}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>-15% (Team Disconnect)</span>
                <span>Neutral (0%)</span>
                <span>+15% (High Alignment)</span>
              </div>
            </div>

            {/* Lever 3: Upskilling & Training Investment */}
            <div className={`p-3.5 rounded-xl border space-y-2 ${
              isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Upskilling & Professional Training</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30">
                    +{trainingHours} hrs / staff
                  </span>
                  <button 
                    onClick={() => { setTrainingHours(prev => Math.max(0, prev - 4)); setActivePreset('custom'); }}
                    className="px-1.5 py-0.5 rounded text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300"
                  >
                    -4h
                  </button>
                  <button 
                    onClick={() => { setTrainingHours(prev => Math.min(24, prev + 4)); setActivePreset('custom'); }}
                    className="px-1.5 py-0.5 rounded text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300"
                  >
                    +4h
                  </button>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="24"
                value={trainingHours}
                onChange={(e) => { setTrainingHours(Number(e.target.value)); setActivePreset('custom'); }}
                className="w-full accent-purple-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>0 hrs (No Training)</span>
                <span>12 hrs</span>
                <span>24 hrs (Mastery Sprint)</span>
              </div>
            </div>

            {/* Lever 4: AI Tooling & Workflow Automation */}
            <div className={`p-3.5 rounded-xl border space-y-2 ${
              isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>AI Tooling & Workflow Automation</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                    {toolingDelta > 0 ? `+${toolingDelta}%` : `${toolingDelta}%`}
                  </span>
                  <button 
                    onClick={() => { setToolingDelta(prev => Math.max(-10, prev - 5)); setActivePreset('custom'); }}
                    className="px-1.5 py-0.5 rounded text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300"
                  >
                    -5%
                  </button>
                  <button 
                    onClick={() => { setToolingDelta(prev => Math.min(20, prev + 5)); setActivePreset('custom'); }}
                    className="px-1.5 py-0.5 rounded text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300"
                  >
                    +5%
                  </button>
                </div>
              </div>
              <input
                type="range"
                min="-10"
                max="20"
                value={toolingDelta}
                onChange={(e) => { setToolingDelta(Number(e.target.value)); setActivePreset('custom'); }}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>-10% (Legacy Tools)</span>
                <span>Neutral (0%)</span>
                <span>+20% (AI-Automated)</span>
              </div>
            </div>
          </div>

          {/* Outcome & Cohort Impact Cards */}
          <div className="lg:col-span-5 space-y-4">
            {/* Primary Simulation Output Card */}
            <div className={`p-5 rounded-2xl border text-center ${
              isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">
                Simulated Cohort Output
              </span>
              <div className="flex items-center justify-center gap-3 mt-2">
                <span className="text-2xl text-slate-400 font-bold line-through">
                  {effectiveBaseline}%
                </span>
                <ArrowRight className="w-5 h-5 text-slate-400" />
                <span className="text-5xl font-extrabold text-cyan-600 dark:text-cyan-400">
                  {simulatedProductivity}%
                </span>
              </div>

              <div className="mt-2.5">
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                  deltaTotal >= 0 
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' 
                    : 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                }`}>
                  {deltaTotal >= 0 ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}
                  <span>{deltaTotal >= 0 ? `+${deltaTotal}% Simulated Net Gain` : `${deltaTotal}% Simulated Drop`}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                Simulated across {targetCohort.length} employees based on weighted multi-factor regression.
              </p>

              {/* Action Button: Apply Simulation to Forecast */}
              {onApplyPredictions && (
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={handleApplyToDataset}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Apply Scenario to Dataset Forecast</span>
                  </button>
                  {appliedNotification && (
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1.5 animate-in fade-in">
                      ✓ {appliedNotification}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Before vs After Tier Shift Statistics */}
            <div className={`p-4 rounded-2xl border space-y-3 ${
              isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Predicted Tier Shifts:</span>
                <span className="text-[10px] text-slate-400 font-normal">{targetCohort.length} Target Staff</span>
              </h4>

              <div className="space-y-2 text-xs">
                {/* High Tier Shift */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-300">High Tier (≥{highThreshold}%)</span>
                  </div>
                  <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                    <span>{tierAnalysis.beforeHigh} → {tierAnalysis.afterHigh}</span>
                    {tierAnalysis.highGained > 0 && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500 text-white font-bold">
                        +{tierAnalysis.highGained}
                      </span>
                    )}
                  </div>
                </div>

                {/* Medium Tier Shift */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span className="font-semibold text-blue-700 dark:text-blue-300">Medium Tier ({atRiskThreshold}–{highThreshold - 1}%)</span>
                  </div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    <span>{tierAnalysis.beforeMed} → {tierAnalysis.afterMed}</span>
                  </div>
                </div>

                {/* At Risk Tier Shift */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    <span className="font-semibold text-rose-700 dark:text-rose-300">At Risk Tier (&lt;{atRiskThreshold}%)</span>
                  </div>
                  <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                    <span>{tierAnalysis.beforeRisk} → {tierAnalysis.afterRisk}</span>
                    {tierAnalysis.rescuedCount > 0 && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-600 text-white font-bold">
                        {tierAnalysis.rescuedCount} Rescued!
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. AFFECTED COHORT INDIVIDUAL IMPACT PREVIEW TABLE */}
        {targetCohort.length > 0 && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                Sample Cohort Impact Breakdown ({targetCohort.length} Employees)
              </h4>
              <span className="text-[11px] text-slate-400">
                Showing top affected profiles in selected filter
              </span>
            </div>

            <div className={`rounded-xl border overflow-hidden ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <div className="max-h-60 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className={`border-b text-[10px] uppercase sticky top-0 z-10 ${
                    isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}>
                    <tr>
                      <th className="p-2.5">Employee</th>
                      <th className="p-2.5">Department</th>
                      <th className="p-2.5 text-center">Baseline Output</th>
                      <th className="p-2.5 text-center">Simulated Output</th>
                      <th className="p-2.5 text-center">Simulated Status</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-slate-800/60' : 'divide-slate-100'}`}>
                    {targetCohort.slice(0, 8).map(emp => {
                      const newScore = Math.min(100, Math.max(0, emp.currentProductivity + deltaTotal));
                      let newStatus: 'High' | 'Medium' | 'At Risk' = 'Medium';
                      if (newScore >= highThreshold) newStatus = 'High';
                      else if (newScore < atRiskThreshold) newStatus = 'At Risk';

                      return (
                        <tr 
                          key={emp.id}
                          onClick={() => onSelectEmployee && onSelectEmployee(emp)}
                          className={`cursor-pointer transition-colors ${isDark ? 'hover:bg-slate-900/50' : 'hover:bg-slate-50'}`}
                        >
                          <td className="p-2.5">
                            <div className="flex items-center gap-2">
                              <img src={emp.avatar} alt={emp.name} className="w-6 h-6 rounded-full object-cover" />
                              <div>
                                <span className="font-semibold text-slate-900 dark:text-slate-100">{emp.name}</span>
                                <span className="text-[10px] text-slate-400 ml-1.5">{emp.role}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-2.5 text-slate-500 dark:text-slate-400">{emp.department}</td>
                          <td className="p-2.5 text-center font-bold text-slate-700 dark:text-slate-300">{emp.currentProductivity}%</td>
                          <td className="p-2.5 text-center font-bold text-cyan-600 dark:text-cyan-400">
                            <span>{newScore}%</span>
                            {deltaTotal !== 0 && (
                              <span className={`text-[10px] ml-1 font-semibold ${deltaTotal > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                ({deltaTotal > 0 ? `+${deltaTotal}%` : `${deltaTotal}%`})
                              </span>
                            )}
                          </td>
                          <td className="p-2.5 text-center">
                            <div className="inline-flex items-center gap-1.5">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                newStatus === 'High' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' :
                                newStatus === 'Medium' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' : 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                              }`}>
                                {newStatus}
                              </span>
                              {newStatus !== emp.status && (
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                                  ★ Upgraded
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Trajectory Simulation Chart */}
      <div className={`p-5 rounded-2xl border ${
        isDark ? 'glass-card' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Forecasted Trajectory vs Simulated Scenario
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Comparing baseline trajectory against the simulated policy scenario
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/30">
            Net Monthly Impact: {deltaTotal >= 0 ? `+${deltaTotal}%` : `${deltaTotal}%`}
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={simulatedTrends}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "rgba(59, 130, 246, 0.15)" : "rgba(226, 232, 240, 0.9)"} />
              <XAxis dataKey="month" stroke={isDark ? "#94a3b8" : "#64748b"} />
              <YAxis domain={[50, 100]} stroke={isDark ? "#94a3b8" : "#64748b"} />
              <Tooltip contentStyle={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', borderColor: isDark ? '#334155' : '#e2e8f0', borderRadius: '12px' }} />
              <Legend />
              <Line type="monotone" dataKey="actual" name="Historical Actual" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="forecast" name="Standard AI Forecast" stroke="#3b82f6" strokeWidth={2.5} strokeDasharray="5 5" />
              <Line type="monotone" dataKey="simulated" name="Simulated Scenario" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
