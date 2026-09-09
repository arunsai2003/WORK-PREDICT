import React, { useState } from 'react';
import { 
  Sparkles, 
  Lock, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Sun, 
  Moon,
  Zap
} from 'lucide-react';

interface AdminLoginProps {
  onLogin: (user: { name: string; role: string; email: string }) => void;
  isDark: boolean;
  setIsDark: (val: boolean) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, isDark, setIsDark }) => {
  const [username, setUsername] = useState('Arun');
  const [password, setPassword] = useState('••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter your admin username or email');
      return;
    }
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin({
        name: username.trim() || 'Arun',
        role: 'HR Analytics',
        email: `${username.toLowerCase().replace(/\s+/g, '')}@workpredict.com`
      });
    }, 600);
  };

  const handleQuickDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin({
        name: 'Arun',
        role: 'HR Analytics',
        email: 'arun@workpredict.com'
      });
    }, 400);
  };

  return (
    <div className={`min-h-screen flex flex-col justify-center items-center p-4 transition-colors duration-200 relative overflow-hidden ${
      isDark ? 'bg-[#070d1e] text-slate-100' : 'bg-slate-50 text-slate-800'
    }`}>
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header Toggle */}
      <div className="absolute top-6 right-6 flex items-center gap-3">
        <button
          onClick={() => setIsDark(!isDark)}
          className={`p-2.5 rounded-xl border transition-all ${
            isDark 
              ? 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-amber-400' 
              : 'bg-white border-slate-200 text-slate-600 hover:text-blue-600 shadow-sm'
          }`}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-500" />}
        </button>
      </div>

      {/* Login Card */}
      <div className={`w-full max-w-md rounded-3xl border p-8 relative z-10 shadow-2xl transition-all ${
        isDark 
          ? 'bg-[#0b1329]/95 border-slate-800/90 shadow-cyan-950/30' 
          : 'bg-white border-slate-200 shadow-slate-200/80'
      }`}>
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-xl shadow-cyan-500/25 text-white font-black text-2xl mb-4">
            <div className="w-7 h-7 flex flex-col justify-between rotate-12">
              <div className="h-2 w-full bg-white rounded-full"></div>
              <div className="h-2 w-3/4 self-end bg-cyan-200 rounded-full"></div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              WorkPredict
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
              Pro
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Workforce Intelligence & Productivity Analytics Portal
          </p>
        </div>

        {/* Security Badge */}
        <div className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-medium mb-6 ${
          isDark ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
        }`}>
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Admin Portal Authentication (HR Analytics)</span>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Admin Username / Email
            </label>
            <div className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition-all ${
              isDark 
                ? 'bg-slate-900/80 border-slate-800 focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500' 
                : 'bg-slate-50 border-slate-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500'
            }`}>
              <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. Arun or arun@workpredict.com"
                className="w-full bg-transparent text-sm focus:outline-none placeholder:text-slate-400 text-slate-900 dark:text-slate-100 font-medium"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <span className="text-[11px] text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer">
                Forgot?
              </span>
            </div>
            <div className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition-all ${
              isDark 
                ? 'bg-slate-900/80 border-slate-800 focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500' 
                : 'bg-slate-50 border-slate-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500'
            }`}>
              <Lock className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-sm focus:outline-none placeholder:text-slate-400 text-slate-900 dark:text-slate-100 font-medium"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 border-slate-300 dark:border-slate-700"
              />
              <span>Remember session</span>
            </label>
            <span className="text-slate-400">v2.4 LTS</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-bold shadow-lg shadow-cyan-500/25 transition-all mt-2 disabled:opacity-70"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Access Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
          </div>
          <span className={`relative px-3 text-[11px] font-semibold uppercase tracking-wider ${
            isDark ? 'bg-[#0b1329] text-slate-500' : 'bg-white text-slate-400'
          }`}>
            Quick Demo Access
          </span>
        </div>

        {/* 1-Click Fast Login */}
        <button
          type="button"
          onClick={handleQuickDemoLogin}
          className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all ${
            isDark 
              ? 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800 hover:border-cyan-500/40 text-slate-200' 
              : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-blue-400 text-slate-700'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <div className="font-bold text-slate-900 dark:text-white">Quick Login as Arun</div>
              <div className="text-[10px] text-slate-400 font-normal">Role: HR Analytics Admin</div>
            </div>
          </div>
          <span className="text-cyan-600 dark:text-cyan-400 text-[11px] font-bold">1-Click &rarr;</span>
        </button>
      </div>

      <p className="text-[11px] text-slate-400 mt-6 text-center">
        WorkPredict Pro &copy; 2026. Enterprise HR Analytics & Productivity Intelligence.
      </p>
    </div>
  );
};
