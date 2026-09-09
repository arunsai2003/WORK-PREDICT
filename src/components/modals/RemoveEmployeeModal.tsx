import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Employee } from '../../types';

interface RemoveEmployeeModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (employeeId: string) => void;
  isDark: boolean;
}

export const RemoveEmployeeModal: React.FC<RemoveEmployeeModalProps> = ({
  employee,
  isOpen,
  onClose,
  onConfirm,
  isDark
}) => {
  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`relative w-full max-w-md rounded-3xl border shadow-2xl p-6 transition-all ${
          isDark 
            ? 'bg-[#0b1329] border-rose-500/30 text-slate-100 shadow-rose-950/30' 
            : 'bg-white border-rose-200 text-slate-900 shadow-slate-300/50'
        }`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon */}
        <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-500 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        {/* Header */}
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
          Remove Employee
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
          Are you sure you want to remove <span className="font-semibold text-slate-700 dark:text-slate-200">{employee.name}</span> from the workforce dataset? This will update team metrics, department allocations, and dashboard KPIs.
        </p>

        {/* Employee Summary Card */}
        <div className={`p-3.5 rounded-2xl border flex items-center gap-3 mb-6 ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <img 
            src={employee.avatar} 
            alt={employee.name} 
            className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-700/50" 
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {employee.name}
            </h4>
            <p className="text-xs text-slate-400 truncate">
              {employee.role} &bull; {employee.department}
            </p>
          </div>
          <div className="text-right">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              employee.status === 'High' ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30' :
              employee.status === 'Medium' ? 'bg-blue-500/20 text-blue-500 border border-blue-500/30' :
              'bg-rose-500/20 text-rose-500 border border-rose-500/30'
            }`}>
              {employee.currentProductivity}%
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(employee.id);
              onClose();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove Employee</span>
          </button>
        </div>
      </div>
    </div>
  );
};
