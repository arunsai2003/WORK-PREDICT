import React, { useState, useEffect, useMemo } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardPage } from './components/pages/DashboardPage';
import { EmployeesPage } from './components/pages/EmployeesPage';
import { PredictionsPage } from './components/pages/PredictionsPage';
import { DataEntryPage } from './components/pages/DataEntryPage';
import { ReportsPage } from './components/pages/ReportsPage';
import { SettingsPage } from './components/pages/SettingsPage';
import { UploadModal } from './components/modals/UploadModal';
import { EmployeeDetailModal } from './components/modals/EmployeeDetailModal';
import { RemoveEmployeeModal } from './components/modals/RemoveEmployeeModal';
import { AdminLogin } from './components/auth/AdminLogin';
import { LogoutConfirmModal } from './components/auth/LogoutConfirmModal';
import { 
  generateFullEmployeeDataset, 
  INITIAL_MONTHLY_TRENDS, 
  INITIAL_DEPARTMENTS, 
  INITIAL_HEATMAP, 
  INITIAL_INSIGHTS 
} from './data/defaultData';
import { 
  computeKpis, 
  computeDepartmentProgress, 
  computeHeatmapMatrix, 
  computeMonthlyTrends,
  generateDynamicInsights 
} from './utils/analytics';
import { Employee, Settings, KeyInsight, DepartmentSummary, HeatmapCell, MonthlyTrend } from './types';

export default function App() {
  const [isDark, setIsDark] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedMonth, setSelectedMonth] = useState<string>('Sep 2026');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Core dataset state - Clean workspace with 0 mock data
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrend[]>(() => computeMonthlyTrends([]));
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);

  // Recalculate monthly trends when employees dataset changes
  useEffect(() => {
    setMonthlyTrends(computeMonthlyTrends(employees));
  }, [employees]);

  // Settings configuration
  const [settings, setSettings] = useState<Settings>({
    highThreshold: 80,
    atRiskThreshold: 65,
    attendanceWeight: 0.3,
    engagementWeight: 0.3,
    tasksWeight: 0.4
  });

  // Admin authentication & logout state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState({
    name: 'Arun',
    role: 'HR Analytics',
    email: 'arun@workpredict.com'
  });

  // Keep HTML root dark class in sync
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [isDark]);

  // Dynamically recalculated KPIs based on dataset & selectedMonth
  const kpis = useMemo(() => {
    return computeKpis(employees, settings, selectedMonth);
  }, [employees, settings, selectedMonth]);

  // Dynamically recalculated Department performance
  const departments: DepartmentSummary[] = useMemo(() => {
    return computeDepartmentProgress(employees);
  }, [employees]);

  // Dynamically recalculated Heatmap matrix
  const heatmapCells: HeatmapCell[] = useMemo(() => {
    return computeHeatmapMatrix(employees);
  }, [employees]);

  // Dynamically recalculated Insights
  const insights: KeyInsight[] = useMemo(() => {
    return generateDynamicInsights(employees, kpis, selectedMonth);
  }, [employees, kpis, selectedMonth]);

  // Filter employees on dashboard if search query is active
  const dashboardEmployees = useMemo(() => {
    if (!searchQuery.trim()) return employees;
    const q = searchQuery.toLowerCase();
    return employees.filter(e => 
      e.name.toLowerCase().includes(q) ||
      e.department.toLowerCase().includes(q) ||
      e.role.toLowerCase().includes(q)
    );
  }, [employees, searchQuery]);

  // Handler when new CSV / XLSX is uploaded
  const handleDataLoaded = (newEmployees: Employee[], fileName: string) => {
    setEmployees(newEmployees);
  };

  // Employee removal handlers
  const handlePromptDelete = (emp: Employee) => {
    setEmployeeToDelete(emp);
  };

  const handleConfirmDelete = (id: string) => {
    const target = employees.find(e => e.id === id);
    setEmployees(prev => prev.filter(e => e.id !== id));
    if (selectedEmployee?.id === id) {
      setSelectedEmployee(null);
    }
    setEmployeeToDelete(null);
    if (target) {
      setToastMessage(`Removed ${target.name} from workforce dataset`);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  // Reset data handler: resets dataset to empty 0 baseline and standard thresholds
  const handleResetData = () => {
    const defaultSettings: Settings = {
      highThreshold: 80,
      atRiskThreshold: 65,
      attendanceWeight: 0.3,
      engagementWeight: 0.3,
      tasksWeight: 0.4
    };
    setSettings(defaultSettings);
    setEmployees([]);
  };

  // Handler when settings are updated: recalibrates employee status tags
  const handleUpdateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    setEmployees(prev => prev.map(emp => {
      let status: 'High' | 'Medium' | 'At Risk' = 'Medium';
      if (emp.currentProductivity >= newSettings.highThreshold) {
        status = 'High';
      } else if (emp.currentProductivity < newSettings.atRiskThreshold) {
        status = 'At Risk';
      }
      return { ...emp, status };
    }));
  };

  if (!isAuthenticated) {
    return (
      <AdminLogin
        onLogin={(user) => {
          setAdminUser(user);
          setIsAuthenticated(true);
        }}
        isDark={isDark}
        setIsDark={setIsDark}
      />
    );
  }

  return (
    <div className={`min-h-screen flex relative overflow-hidden transition-colors duration-200 ${
      isDark ? 'bg-[#070d1e] text-slate-100' : 'bg-[#F5F7FB] text-slate-900'
    }`}>
      {/* Atmospheric ambient glow layers for dark mode */}
      {isDark && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-32 left-[18%] w-[650px] h-[550px] bg-cyan-500/10 rounded-full blur-[140px]" />
          <div className="absolute top-[28%] -right-24 w-[550px] h-[550px] bg-blue-600/10 rounded-full blur-[160px]" />
          <div className="absolute -bottom-24 left-[28%] w-[700px] h-[450px] bg-purple-600/5 rounded-full blur-[160px]" />
        </div>
      )}

      {/* Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isDark={isDark}
        onLogout={() => setIsLogoutModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden relative z-10">
        {/* Top Header */}
        <Header
          isDark={isDark}
          setIsDark={setIsDark}
          onOpenUpload={() => setIsUploadOpen(true)}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          employees={employees}
          onSelectEmployee={(emp) => setSelectedEmployee(emp)}
          onLogout={() => setIsLogoutModalOpen(true)}
          adminUser={adminUser}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-5 lg:p-6 max-w-[1640px] w-full mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardPage
              kpis={kpis}
              monthlyTrends={monthlyTrends}
              heatmapCells={heatmapCells}
              employees={dashboardEmployees}
              insights={insights}
              departments={departments}
              onViewAllEmployees={() => setCurrentTab('employees')}
              onSelectEmployee={(emp) => setSelectedEmployee(emp)}
              onDeleteEmployee={handlePromptDelete}
              onUploadClick={() => setIsUploadOpen(true)}
              isDark={isDark}
            />
          )}

          {currentTab === 'employees' && (
            <EmployeesPage
              employees={employees}
              onSelectEmployee={(emp) => setSelectedEmployee(emp)}
              onDeleteEmployee={handlePromptDelete}
              isDark={isDark}
            />
          )}

          {currentTab === 'predictions' && (
            <PredictionsPage
              employees={employees}
              settings={settings}
              onSelectEmployee={setSelectedEmployee}
              onApplyPredictions={setEmployees}
              isDark={isDark}
            />
          )}

          {currentTab === 'data-entry' && (
            <DataEntryPage
              employees={employees}
              onAddEmployee={(newEmp) => setEmployees(prev => [newEmp, ...prev])}
              onDeleteEmployee={handlePromptDelete}
              settings={settings}
              isDark={isDark}
            />
          )}

          {currentTab === 'reports' && (
            <ReportsPage
              employees={employees}
              kpis={kpis}
              departments={departments}
              settings={settings}
              isDark={isDark}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsPage
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onResetData={handleResetData}
              employees={employees}
              isDark={isDark}
              onLogout={() => setIsLogoutModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Upload CSV/XLSX Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onDataLoaded={handleDataLoaded}
        onLoadDemo={() => {
          setEmployees(generateFullEmployeeDataset());
          setIsUploadOpen(false);
        }}
        isDark={isDark}
      />

      {/* Detailed Employee Profile Modal */}
      <EmployeeDetailModal
        employee={selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        onDelete={handlePromptDelete}
        isDark={isDark}
      />

      {/* Remove Employee Confirmation Modal */}
      <RemoveEmployeeModal
        employee={employeeToDelete}
        isOpen={!!employeeToDelete}
        onClose={() => setEmployeeToDelete(null)}
        onConfirm={handleConfirmDelete}
        isDark={isDark}
      />

      {/* Admin Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => setIsAuthenticated(false)}
        isDark={isDark}
        adminName={adminUser.name}
      />

      {/* Floating Action Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-emerald-600 text-white text-xs font-semibold shadow-xl shadow-emerald-950/40 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
          <span>{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)} 
            className="ml-2 text-white/70 hover:text-white p-0.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
