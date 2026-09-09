import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  FileText, 
  Settings as SettingsIcon, 
  LogOut,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isDark: boolean;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab, isDark, onLogout }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'predictions', label: 'Predictions', icon: TrendingUp },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <aside className={`w-64 min-w-[16rem] flex flex-col justify-between p-4 border-r transition-colors duration-200 select-none ${
      isDark ? 'bg-[#070d1e] border-slate-800/80 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'
    }`}>
      {/* Top Brand Logo */}
      <div>
        <div className="flex items-center gap-3 px-3 py-3 mb-6">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20 text-white font-black text-xl tracking-wider">
            <div className="w-5 h-5 flex flex-col justify-between rotate-12">
              <div className="h-1.5 w-full bg-white rounded-full"></div>
              <div className="h-1.5 w-3/4 self-end bg-cyan-200 rounded-full"></div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                WorkPredict
              </span>
              <span className="text-[11px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                Pro
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
              Employee Productivity Analytics
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1.5 px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-500/90 via-cyan-500/90 to-blue-600/90 text-white font-semibold shadow-lg shadow-cyan-500/25'
                    : isDark
                      ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Direct Logout in Navigation */}
          {onLogout && (
            <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-800/80">
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-500/10 transition-all duration-200 group"
              >
                <LogOut className="w-4 h-4 text-rose-500 group-hover:-translate-x-0.5 transition-transform" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </nav>
      </div>

      {/* Middle/Bottom AI Promo Card & User Profile */}
      <div className="space-y-3 px-1 pt-3">
        {/* Smarter Insights Promo Box */}
        <div className={`relative overflow-hidden rounded-2xl p-4 border transition-all ${
          isDark 
            ? 'bg-gradient-to-br from-slate-900/90 via-[#0d1c3e] to-[#07132c] border-cyan-500/20 shadow-lg' 
            : 'bg-gradient-to-br from-blue-50 to-indigo-50/70 border-blue-100 text-slate-800'
        }`}>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl pointer-events-none"></div>
          <svg className="absolute bottom-0 right-0 w-32 h-16 opacity-25 text-cyan-400 pointer-events-none" viewBox="0 0 100 50" fill="none">
            <path d="M0 40 C 20 20, 40 50, 60 30 C 80 10, 90 40, 100 20" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M0 45 C 30 35, 50 25, 70 35 C 85 45, 95 30, 100 25" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
          </svg>

          <div className="flex items-center gap-1.5 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
            <h4 className="text-xs font-bold text-cyan-600 dark:text-cyan-400 tracking-wide uppercase">AI Workforce Engine</h4>
          </div>
          <p className="text-sm font-bold leading-tight mb-1 text-slate-900 dark:text-white">
            Smarter Insights.<br />Higher Productivity.
          </p>
          <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
            AI-powered workforce intelligence for enterprise teams.
          </p>
        </div>

        {/* Admin Profile Layout (Arun - HR Analytics - No Photo) */}
        <div className={`p-3 rounded-2xl border transition-all ${
          isDark 
            ? 'bg-slate-900/80 border-slate-800/90 shadow-md' 
            : 'bg-slate-50 border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-black text-sm flex items-center justify-center shadow-md shadow-cyan-500/20 flex-shrink-0">
              AR
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold truncate text-slate-900 dark:text-slate-100">
                  Arun
                </p>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                HR Analytics Admin
              </p>
            </div>
          </div>

          {/* Dedicated Full-Width Logout Button */}
          <button 
            title="Log out of session"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-rose-500 hover:text-white bg-rose-500/10 hover:bg-rose-500 border border-rose-500/20 hover:border-rose-500 rounded-xl transition-all shadow-sm group cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Log Out Session</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
