import React from 'react';
import { 
  X, 
  Building2, 
  Mail, 
  Sparkles 
} from 'lucide-react';
import { Employee } from '../../types';

interface EmployeeDetailModalProps {
  employee: Employee | null;
  onClose: () => void;
  isDark: boolean;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  employee,
  onClose,
  isDark
}) => {
  if (!employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`relative w-full max-w-lg rounded-3xl border shadow-2xl p-6 transition-all ${
        isDark 
          ? 'bg-[#0b1329] border-slate-700/80 text-slate-100 shadow-cyan-950/40' 
          : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/50'
      }`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-6">
          <img
            src={employee.avatar}
            alt={employee.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-cyan-500/40 shadow-lg"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {employee.name}
              </h2>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                employee.status === 'High' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' :
                employee.status === 'Medium' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30' :
                'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30'
              }`}>
                {employee.status}
              </span>
            </div>
            <p className="text-xs text-cyan-600 dark:text-cyan-400 font-medium">{employee.role}</p>
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                {employee.department}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                {employee.email}
              </span>
            </div>
          </div>
        </div>

        {/* Productivity Comparison Cards */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className={`p-3.5 rounded-2xl border ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Current Productivity</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {employee.currentProductivity}%
              </span>
            </div>
          </div>

          <div className={`p-3.5 rounded-2xl border ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Predicted Next Month</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-cyan-600 dark:text-cyan-400">
                {employee.predictedProductivity}%
              </span>
              <span className={`text-xs font-semibold ${
                employee.predictedProductivity >= employee.currentProductivity ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}>
                {employee.predictedProductivity >= employee.currentProductivity ? '▲' : '▼'}{' '}
                {Math.abs(employee.predictedProductivity - employee.currentProductivity)}%
              </span>
            </div>
          </div>
        </div>

        {/* Performance Metrics Breakdown */}
        <div className="space-y-3 mb-5">
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Attendance Rate</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{employee.attendance}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${employee.attendance}%` }}></div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Engagement Index</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{employee.engagement}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${employee.engagement}%` }}></div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Task Completion Velocity</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{employee.tasksCompleted} / {employee.tasksTotal} tasks</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-purple-500 rounded-full" 
                style={{ width: `${Math.round((employee.tasksCompleted / employee.tasksTotal) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* AI Recommendation Box */}
        <div className={`p-4 rounded-2xl border ${
          isDark 
            ? 'bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border-cyan-500/30' 
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <h4 className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">AI Work Recommendation</h4>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {employee.status === 'High'
              ? 'Consistently exceeds performance benchmarks. Candidate for leadership mentorship and critical path engineering initiatives.'
              : employee.status === 'At Risk'
              ? 'Early warning indicator triggered by declining task completion velocity. Recommend scheduling a 1:1 check-in to balance workload and unblock dependencies.'
              : 'Performance is steady and reliable. Provide targeted skill development opportunities to boost output into top tier.'}
          </p>
        </div>
      </div>
    </div>
  );
};
