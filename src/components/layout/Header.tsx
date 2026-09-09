import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Calendar, 
  ChevronDown, 
  Bell, 
  Moon, 
  Sun, 
  Upload, 
  X,
  LogOut,
  User
} from 'lucide-react';
import { Employee } from '../../types';
import { CalendarPicker } from '../common/CalendarPicker';

interface HeaderProps {
  isDark: boolean;
  setIsDark: (val: boolean) => void;
  onOpenUpload: () => void;
  selectedMonth: string;
  setSelectedMonth: (m: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  employees: Employee[];
  onSelectEmployee: (emp: Employee) => void;
  onLogout?: () => void;
  adminUser?: { name: string; role: string; email: string };
}

export const Header: React.FC<HeaderProps> = ({
  isDark,
  setIsDark,
  onOpenUpload,
  selectedMonth,
  setSelectedMonth,
  searchQuery,
  setSearchQuery,
  employees,
  onSelectEmployee,
  onLogout,
  adminUser = { name: 'Arun', role: 'HR Analytics', email: 'arun@workpredict.com' }
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCalendarPicker, setShowCalendarPicker] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = searchQuery.trim() === ''
    ? []
    : employees.filter(e => 
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.role.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6);

  const notifications = [
    { id: 1, title: 'AI Forecast Generated', desc: `${selectedMonth} productivity forecast generated successfully`, time: '10m ago', unread: true },
    { id: 2, title: 'At Risk Alert', desc: 'Arjun Patel flagged below 65% productivity threshold', time: '1h ago', unread: false },
    { id: 3, title: 'Dataset Synced', desc: `${employees.length} employee records updated successfully`, time: '2h ago', unread: false },
  ];

  return (
    <header className={`h-16 px-6 flex items-center justify-between border-b relative z-30 transition-colors duration-200 ${
      isDark ? 'bg-[#070d1e]/90 border-slate-800/80 backdrop-blur-md' : 'bg-white border-slate-200 shadow-sm'
    }`}>
      {/* Search Bar */}
      <div ref={searchRef} className="relative w-80 sm:w-96 max-w-md">
        <div className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border transition-all ${
          isDark 
            ? 'bg-slate-900/60 border-slate-800 focus-within:border-cyan-500/60 focus-within:ring-1 focus-within:ring-cyan-500/40 text-slate-200' 
            : 'bg-slate-50 border-slate-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 text-slate-800'
        }`}>
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
            placeholder="Search employees, departments, roles..."
            className="w-full bg-transparent text-xs sm:text-sm focus:outline-none placeholder:text-slate-400"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Autocomplete Search Results */}
        {showSearchResults && filtered.length > 0 && (
          <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl border shadow-2xl overflow-hidden z-50 ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className={`p-2 text-[11px] font-semibold uppercase tracking-wider ${
              isDark ? 'text-slate-400 bg-slate-800/30' : 'text-slate-500 bg-slate-100'
            }`}>
              Matching Employees ({filtered.length})
            </div>
            {filtered.map(emp => (
              <button
                key={emp.id}
                onClick={() => {
                  onSelectEmployee(emp);
                  setShowSearchResults(false);
                  setSearchQuery('');
                }}
                className={`w-full flex items-center justify-between p-2.5 text-left text-xs transition-colors ${
                  isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <img src={emp.avatar} alt={emp.name} className="w-6 h-6 rounded-full object-cover" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{emp.name}</span>
                    <span className="text-slate-400 ml-1.5">({emp.department})</span>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  emp.status === 'High' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' :
                  emp.status === 'Medium' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' : 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                }`}>
                  {emp.currentProductivity}%
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Upload Dataset Button */}
        <button
          onClick={onOpenUpload}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 transition-all"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Dataset</span>
        </button>

        {/* Calendar Picker Trigger & Modal */}
        <div className="relative">
          <button
            onClick={() => setShowCalendarPicker(!showCalendarPicker)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
              showCalendarPicker
                ? 'border-cyan-500/80 ring-2 ring-cyan-500/30 text-cyan-600 dark:text-cyan-300'
                : isDark 
                  ? 'bg-slate-900/80 border-slate-800 text-slate-200 hover:border-slate-700' 
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
            title="Open Interactive Calendar"
          >
            <Calendar className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span className="font-semibold">{selectedMonth}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${showCalendarPicker ? 'rotate-180 text-cyan-600 dark:text-cyan-400' : ''}`} />
          </button>

          {/* Interactive Rich Calendar Popover */}
          <CalendarPicker
            selectedMonth={selectedMonth}
            onSelectMonth={(m) => {
              setSelectedMonth(m);
              setShowCalendarPicker(false);
            }}
            isOpen={showCalendarPicker}
            onClose={() => setShowCalendarPicker(false)}
            isDark={isDark}
          />
        </div>

        {/* Notification Bell */}
        <div ref={notificationsRef} className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-xl border transition-all ${
              isDark 
                ? 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700' 
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
            title="View Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-900 animate-pulse"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className={`absolute right-0 top-full mt-2 w-80 rounded-2xl border shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150 ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-200 shadow-cyan-950/40' : 'bg-white border-slate-200 text-slate-800 shadow-slate-300/50'
            }`}>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/50 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Notifications</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-semibold">1 New</span>
              </div>
              <div className="space-y-2">
                {notifications.map(n => (
                  <div key={n.id} className={`p-2.5 rounded-xl border text-xs transition-all ${
                    n.unread 
                      ? isDark ? 'bg-slate-800/60 border-cyan-500/30' : 'bg-blue-50 border-blue-200'
                      : isDark ? 'bg-slate-900/40 border-slate-800/40' : 'bg-slate-50 border-slate-100'
                  }`}>
                    <div className="flex items-center justify-between font-semibold mb-0.5 text-slate-900 dark:text-slate-100">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle (Dark/Light) */}
        <button
          onClick={() => setIsDark(!isDark)}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className={`p-2 rounded-xl border transition-all ${
            isDark 
              ? 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-amber-400 hover:border-slate-700' 
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-slate-100'
          }`}
        >
          {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-500" />}
        </button>

        {/* Direct Quick Logout Header Action */}
        {onLogout && (
          <button
            onClick={onLogout}
            title="Log Out of Dashboard"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-500 text-xs font-bold transition-all shadow-sm group cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        )}

        {/* Admin User Profile Pill & Dropdown */}
        <div ref={userMenuRef} className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={`flex items-center gap-2 pl-2.5 pr-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              showUserMenu
                ? 'border-cyan-500/80 ring-2 ring-cyan-500/30'
                : isDark 
                  ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-200' 
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
              {adminUser.name.charAt(0)}
            </div>
            <span className="max-w-[80px] truncate">{adminUser.name}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180 text-cyan-500' : ''}`} />
          </button>

          {showUserMenu && (
            <div className={`absolute right-0 top-full mt-2 w-56 rounded-2xl border shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-200 shadow-cyan-950/40' : 'bg-white border-slate-200 text-slate-800 shadow-slate-300/50'
            }`}>
              <div className="p-2.5 border-b border-slate-100 dark:border-slate-800/60 mb-1">
                <div className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>{adminUser.name}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">{adminUser.role}</div>
                <div className="text-[10px] text-cyan-600 dark:text-cyan-400 truncate">{adminUser.email}</div>
              </div>

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  if (onLogout) onLogout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
