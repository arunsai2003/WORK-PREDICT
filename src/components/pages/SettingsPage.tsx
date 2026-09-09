import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Sliders, 
  Save, 
  RotateCcw, 
  Award, 
  Users, 
  AlertTriangle, 
  CheckCircle2,
  Activity,
  LogOut
} from 'lucide-react';
import { Settings, Employee } from '../../types';

interface SettingsPageProps {
  settings: Settings;
  onUpdateSettings: (newSettings: Settings) => void;
  onResetData: () => void;
  employees: Employee[];
  isDark: boolean;
  onLogout?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onUpdateSettings,
  onResetData,
  employees,
  isDark,
  onLogout
}) => {
  const [localSettings, setLocalSettings] = useState<Settings>({ ...settings });
  const [saved, setSaved] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const handleSave = () => {
    onUpdateSettings(localSettings);
    setSaved(true);
    setResetMessage(null);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleResetToDefault = () => {
    const defaultSettings: Settings = {
      highThreshold: 80,
      atRiskThreshold: 65,
      attendanceWeight: 0.3,
      engagementWeight: 0.3,
      tasksWeight: 0.4
    };
    setLocalSettings(defaultSettings);
    onResetData();
    setResetMessage("Successfully cleared dataset to 0 employees!");
    setTimeout(() => setResetMessage(null), 4000);
  };

  const highList = employees.filter(e => e.currentProductivity >= localSettings.highThreshold);
  const lowList = employees.filter(e => e.currentProductivity < localSettings.atRiskThreshold);
  const mediumList = employees.filter(e => 
    e.currentProductivity >= localSettings.atRiskThreshold && 
    e.currentProductivity < localSettings.highThreshold
  );

  const total = employees.length || 1;
  const highPct = Math.round((highList.length / total) * 100);
  const lowPct = Math.round((lowList.length / total) * 100);
  const medPct = Math.max(0, 100 - highPct - lowPct);

  const highAvg = highList.length ? Math.round(highList.reduce((acc, e) => acc + e.currentProductivity, 0) / highList.length) : 0;
  const lowAvg = lowList.length ? Math.round(lowList.reduce((acc, e) => acc + e.currentProductivity, 0) / lowList.length) : 0;
  const medAvg = mediumList.length ? Math.round(mediumList.reduce((acc, e) => acc + e.currentProductivity, 0) / mediumList.length) : 0;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Administrator Account & Session Management */}
      <div className={`p-5 rounded-2xl border transition-all ${
        isDark ? 'glass-card border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-black text-lg flex items-center justify-center shadow-lg shadow-cyan-500/25 flex-shrink-0">
              AR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Arun</h3>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Admin Session
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Role: <strong className="text-slate-800 dark:text-slate-200">HR Analytics Administrator</strong> &bull; arun@workpredict.com
              </p>
            </div>
          </div>

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-md shadow-rose-600/30 transition-all cursor-pointer group"
            >
              <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Log Out of Dashboard</span>
            </button>
          )}
        </div>
      </div>

      {/* Header */}
      <div className={`p-5 rounded-2xl border ${
        isDark ? 'glass-card' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              WorkPredict Analytics Configuration
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure and customize productivity classification thresholds (High, Medium, Low) and AI predictive weights
            </p>
          </div>
        </div>

        {/* Notifications & Feedback */}
        {resetMessage && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span className="font-semibold">{resetMessage}</span>
          </div>
        )}

        {saved && (
          <div className="mt-4 p-3 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-cyan-600 dark:text-cyan-400" />
            <span className="font-semibold">Configuration updated! All employees, KPIs, and charts recalibrated.</span>
          </div>
        )}
      </div>

      {/* Live Workforce Distribution Bar Preview */}
      <div className={`p-5 rounded-2xl border ${
        isDark ? 'glass-card' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Live Workforce Distribution Preview ({employees.length} Total Employees)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">Updates live as you adjust thresholds below</span>
        </div>

        {/* Segmented Bar */}
        <div className="w-full h-3.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex gap-0.5 p-0.5">
          <div 
            style={{ width: `${highPct}%` }}
            className="h-full bg-emerald-500 rounded-l-full transition-all duration-300"
            title={`High: ${highList.length} employees (${highPct}%)`}
          />
          <div 
            style={{ width: `${medPct}%` }}
            className="h-full bg-blue-500 transition-all duration-300"
            title={`Medium: ${mediumList.length} employees (${medPct}%)`}
          />
          <div 
            style={{ width: `${lowPct}%` }}
            className="h-full bg-rose-500 rounded-r-full transition-all duration-300"
            title={`Low / At Risk: ${lowList.length} employees (${lowPct}%)`}
          />
        </div>

        {/* Legend Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 text-xs">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="font-semibold">High (≥{localSettings.highThreshold}%)</span>
            </div>
            <span className="font-bold">{highList.length} ({highPct}%) • {highAvg}% avg</span>
          </div>

          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span className="font-semibold">Medium ({localSettings.atRiskThreshold}%–{localSettings.highThreshold - 1}%)</span>
            </div>
            <span className="font-bold">{mediumList.length} ({medPct}%) • {medAvg}% avg</span>
          </div>

          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="font-semibold">Low (&lt;{localSettings.atRiskThreshold}%)</span>
            </div>
            <span className="font-bold">{lowList.length} ({lowPct}%) • {lowAvg}% avg</span>
          </div>
        </div>
      </div>

      {/* THREE TIER CONFIGURATION CONTROLS (HIGH, MEDIUM, LOW) */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span>Productivity Classification Thresholds</span>
        </h3>

        {/* 1. HIGH PERFORMER THRESHOLD */}
        <div className={`p-4 rounded-2xl border transition-all ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-500" />
              <span className="font-bold text-sm text-slate-900 dark:text-slate-100">High Performer Tier (High)</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-500/30">
                Active: ≥ {localSettings.highThreshold}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">Cut-off:</span>
              <input
                type="number"
                min={localSettings.atRiskThreshold + 5}
                max={95}
                value={localSettings.highThreshold}
                onChange={(e) => {
                  const val = Math.max(localSettings.atRiskThreshold + 1, Math.min(95, Number(e.target.value)));
                  setLocalSettings({ ...localSettings, highThreshold: val });
                }}
                className={`w-16 px-2 py-1 rounded-lg border text-xs font-bold text-emerald-600 dark:text-emerald-400 text-center focus:outline-none focus:border-emerald-500 ${
                  isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'
                }`}
              />
              <span className="text-xs text-slate-400">%</span>
            </div>
          </div>

          <input
            type="range"
            min={localSettings.atRiskThreshold + 5}
            max={95}
            value={localSettings.highThreshold}
            onChange={(e) => setLocalSettings({ ...localSettings, highThreshold: Number(e.target.value) })}
            className="w-full accent-emerald-500 cursor-pointer"
          />

          <div className="flex justify-between text-[11px] text-slate-500 mt-1">
            <span>Minimum {localSettings.atRiskThreshold + 5}%</span>
            <span>Current: {highList.length} staff qualify ({highPct}% of company)</span>
            <span>Maximum 95%</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
            Employees scoring at or above this threshold are recognized as top performers and highlighted for fast-track recognition.
          </p>
        </div>

        {/* 2. MEDIUM PERFORMER TIER */}
        <div className={`p-4 rounded-2xl border transition-all ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="font-bold text-sm text-slate-900 dark:text-slate-100">Core Performance Tier (Medium)</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-700 dark:text-blue-400 font-semibold border border-blue-500/30">
                Range: {localSettings.atRiskThreshold}% to {localSettings.highThreshold - 1}%
              </span>
            </div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
              {mediumList.length} Employees ({medPct}%)
            </span>
          </div>

          <div className={`p-3 rounded-xl border text-xs ${
            isDark ? 'bg-blue-500/5 border-blue-500/20 text-slate-300' : 'bg-blue-50/50 border-blue-200 text-slate-700'
          }`}>
            <p className="leading-relaxed">
              The <strong>Medium tier</strong> automatically encompasses all employees performing reliably between the 
              Low threshold (<span className="text-rose-600 dark:text-rose-400 font-semibold">&lt;{localSettings.atRiskThreshold}%</span>) 
              and High threshold (<span className="text-emerald-600 dark:text-emerald-400 font-semibold">≥{localSettings.highThreshold}%</span>). 
              Adjusting either boundary dynamically recalculates this cohort.
            </p>
          </div>
        </div>

        {/* 3. LOW / AT RISK THRESHOLD */}
        <div className={`p-4 rounded-2xl border transition-all ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span className="font-bold text-sm text-slate-900 dark:text-slate-100">At Risk Warning Tier (Low)</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-700 dark:text-rose-400 font-semibold border border-rose-500/30">
                Active: &lt; {localSettings.atRiskThreshold}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">Cut-off:</span>
              <input
                type="number"
                min={40}
                max={localSettings.highThreshold - 5}
                value={localSettings.atRiskThreshold}
                onChange={(e) => {
                  const val = Math.max(40, Math.min(localSettings.highThreshold - 1, Number(e.target.value)));
                  setLocalSettings({ ...localSettings, atRiskThreshold: val });
                }}
                className={`w-16 px-2 py-1 rounded-lg border text-xs font-bold text-rose-600 dark:text-rose-400 text-center focus:outline-none focus:border-rose-500 ${
                  isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'
                }`}
              />
              <span className="text-xs text-slate-400">%</span>
            </div>
          </div>

          <input
            type="range"
            min={40}
            max={localSettings.highThreshold - 5}
            value={localSettings.atRiskThreshold}
            onChange={(e) => setLocalSettings({ ...localSettings, atRiskThreshold: Number(e.target.value) })}
            className="w-full accent-rose-500 cursor-pointer"
          />

          <div className="flex justify-between text-[11px] text-slate-500 mt-1">
            <span>Minimum 40%</span>
            <span>Current: {lowList.length} staff triggered ({lowPct}% of company)</span>
            <span>Maximum {localSettings.highThreshold - 5}%</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
            Employees scoring strictly below this threshold are flagged for proactive 1:1 check-ins, workload balancing, and remediation.
          </p>
        </div>
      </div>

      {/* Action Buttons: Reset to Default & Save */}
      <div className={`p-4 rounded-2xl border flex items-center justify-between ${
        isDark ? 'glass-card' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <button
          onClick={handleResetToDefault}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition-colors shadow-sm"
          title="Clear dataset to 0 employees"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Dataset (0 Employees)</span>
        </button>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 transition-all"
        >
          {saved ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
          <span>{saved ? 'Saved Successfully!' : 'Save Configuration'}</span>
        </button>
      </div>
    </div>
  );
};
