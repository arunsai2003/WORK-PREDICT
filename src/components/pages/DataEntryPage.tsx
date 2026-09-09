import React, { useState, useMemo } from 'react';
import { 
  UserPlus, 
  Briefcase, 
  Clock, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  Plus, 
  Search, 
  Filter, 
  Building2, 
  Calendar, 
  UserCheck, 
  TrendingUp, 
  ShieldAlert,
  ArrowRight,
  Sliders,
  Check
} from 'lucide-react';
import { Employee, Department, PerformanceTier, WorkAllocation, Settings } from '../../types';

interface DataEntryPageProps {
  employees: Employee[];
  onAddEmployee: (newEmployee: Employee) => void;
  onUpdateEmployee?: (updatedEmployee: Employee) => void;
  settings?: Settings;
  isDark: boolean;
}

const POPULAR_PROJECTS = [
  'Project Titan - Cloud Migration',
  'Q4 Growth & Acquisition Campaign',
  'Core Platform Microservices Refactor',
  'Customer Self-Service Portal V2',
  'Compliance & SOX Security Audit 2026',
  'HR Workflow Digitization & Automation',
  'AI Productivity Co-Pilot Integration',
  'Global Supply Chain Optimization'
];

const SAMPLE_ROLES: Record<Department, string[]> = {
  Engineering: ['Staff Software Engineer', 'Frontend Architect', 'Backend Developer', 'DevOps Specialist', 'QA Engineer'],
  Marketing: ['Growth Marketing Manager', 'Content Strategist', 'SEO Director', 'Performance Marketer', 'Brand Lead'],
  Finance: ['Financial Analyst', 'Senior Controller', 'Risk Assessment Lead', 'Accounts Strategist', 'Tax Consultant'],
  HR: ['HR Business Partner', 'Talent Acquisition Lead', 'People Operations Specialist', 'L&D Director'],
  Operations: ['Operations Lead', 'Project Delivery Manager', 'Supply Chain Analyst', 'Logistics Director']
};

export const DataEntryPage: React.FC<DataEntryPageProps> = ({
  employees,
  onAddEmployee,
  onUpdateEmployee,
  settings = { highThreshold: 80, atRiskThreshold: 65, attendanceWeight: 0.3, engagementWeight: 0.3, tasksWeight: 0.4 },
  isDark
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'entry' | 'roster'>('entry');
  
  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState<Department>('Engineering');
  const [role, setRole] = useState(SAMPLE_ROLES.Engineering[0]);
  const [projectName, setProjectName] = useState(POPULAR_PROJECTS[0]);
  const [customProject, setCustomProject] = useState('');
  const [allocatedHours, setAllocatedHours] = useState<number>(40);
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('High');
  const [shiftType, setShiftType] = useState<'Remote' | 'Hybrid' | 'On-site'>('Hybrid');
  const [assignedManager, setAssignedManager] = useState('Arun (HR Analytics)');
  const [sprintTasks, setSprintTasks] = useState<number>(14);

  // Performance Levers
  const [attendance, setAttendance] = useState<number>(94);
  const [engagement, setEngagement] = useState<number>(88);
  const [taskRate, setTaskRate] = useState<number>(90);

  // Success Alert
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Roster Filter State
  const [rosterSearch, setRosterSearch] = useState('');
  const [rosterDept, setRosterDept] = useState<string>('All');
  const [rosterPriority, setRosterPriority] = useState<string>('All');

  // Next Employee ID
  const nextNum = useMemo(() => {
    return employees.length + 1;
  }, [employees.length]);

  // Capacity calculation (40 hours = 100% capacity)
  const capacityPct = useMemo(() => {
    return Math.round((allocatedHours / 40) * 100);
  }, [allocatedHours]);

  // Live Predicted Productivity score calculation
  const computedProductivity = useMemo(() => {
    const score = Math.round(
      (attendance * settings.attendanceWeight) +
      (engagement * settings.engagementWeight) +
      (taskRate * settings.tasksWeight)
    );
    return Math.min(100, Math.max(0, score));
  }, [attendance, engagement, taskRate, settings]);

  const computedTier: PerformanceTier = useMemo(() => {
    if (computedProductivity >= settings.highThreshold) return 'High';
    if (computedProductivity < settings.atRiskThreshold) return 'At Risk';
    return 'Medium';
  }, [computedProductivity, settings]);

  // Auto-generate email when name changes
  const handleNameChange = (val: string) => {
    setName(val);
    if (val.trim()) {
      const sanitized = val.toLowerCase().replace(/[^a-z0-9]/g, '.');
      setEmail(`${sanitized}@workpredict.io`);
    } else {
      setEmail('');
    }
  };

  const handleDeptChange = (dept: Department) => {
    setDepartment(dept);
    setRole(SAMPLE_ROLES[dept][0] || 'Specialist');
  };

  const handleLoadSample = () => {
    const samples = [
      { name: 'Kavita Menon', dept: 'Engineering' as Department, role: 'Cloud Infrastructure Lead', project: 'Project Titan - Cloud Migration', hrs: 42, priority: 'Critical' as const, tasks: 18, att: 96, eng: 92, taskR: 94 },
      { name: 'Sameer Rao', dept: 'Marketing' as Department, role: 'Senior Performance Marketer', project: 'Q4 Growth & Acquisition Campaign', hrs: 38, priority: 'High' as const, tasks: 12, att: 90, eng: 85, taskR: 88 },
      { name: 'Ananya Deshmukh', dept: 'Finance' as Department, role: 'Risk Assessment Lead', project: 'Compliance & SOX Security Audit 2026', hrs: 40, priority: 'Medium' as const, tasks: 10, att: 94, eng: 88, taskR: 90 },
      { name: 'Vikram Joshi', dept: 'Operations' as Department, role: 'Project Delivery Manager', project: 'Global Supply Chain Optimization', hrs: 45, priority: 'High' as const, tasks: 16, att: 92, eng: 86, taskR: 89 }
    ];
    const pick = samples[Math.floor(Math.random() * samples.length)];
    handleNameChange(pick.name);
    setDepartment(pick.dept);
    setRole(pick.role);
    setProjectName(pick.project);
    setAllocatedHours(pick.hrs);
    setPriority(pick.priority);
    setSprintTasks(pick.tasks);
    setAttendance(pick.att);
    setEngagement(pick.eng);
    setTaskRate(pick.taskR);
  };

  const handleResetForm = () => {
    setName('');
    setEmail('');
    setDepartment('Engineering');
    setRole(SAMPLE_ROLES.Engineering[0]);
    setProjectName(POPULAR_PROJECTS[0]);
    setCustomProject('');
    setAllocatedHours(40);
    setPriority('High');
    setShiftType('Hybrid');
    setSprintTasks(14);
    setAttendance(94);
    setEngagement(88);
    setTaskRate(90);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter employee name.');
      return;
    }

    const finalProject = customProject.trim() ? customProject.trim() : projectName;
    const completedTasks = Math.round(sprintTasks * (taskRate / 100));

    const newEmployee: Employee = {
      id: `emp-${nextNum}`,
      num: nextNum,
      name: name.trim(),
      avatar: `https://images.unsplash.com/photo-${1500000000000 + (nextNum * 1234567 % 50000000)}?w=150&auto=format&fit=crop&q=80`,
      department,
      role,
      currentProductivity: computedProductivity,
      predictedProductivity: Math.min(100, computedProductivity + Math.floor(Math.random() * 5) - 2),
      status: computedTier,
      attendance,
      engagement,
      collaboration: Math.round((engagement + attendance) / 2),
      tasksCompleted: completedTasks,
      tasksTotal: sprintTasks,
      historicalTrend: [
        Math.max(40, computedProductivity - 8),
        Math.max(40, computedProductivity - 5),
        Math.max(40, computedProductivity - 3),
        Math.max(40, computedProductivity - 1),
        computedProductivity
      ],
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@workpredict.io`,
      allocation: {
        projectName: finalProject,
        allocatedHours,
        allocationPercentage: capacityPct,
        priority,
        shiftType,
        assignedManager,
        sprintTasks
      }
    };

    onAddEmployee(newEmployee);
    setSuccessMessage(`Employee ${newEmployee.name} (EMP-${String(nextNum).padStart(4, '0')}) successfully added and allocated to ${finalProject}!`);
    setTimeout(() => setSuccessMessage(null), 5000);
    handleResetForm();
  };

  // Filtered Roster
  const filteredRoster = useMemo(() => {
    return employees.filter(emp => {
      const matchSearch = emp.name.toLowerCase().includes(rosterSearch.toLowerCase()) ||
        emp.role.toLowerCase().includes(rosterSearch.toLowerCase()) ||
        (emp.allocation?.projectName || '').toLowerCase().includes(rosterSearch.toLowerCase());
      const matchDept = rosterDept === 'All' || emp.department === rosterDept;
      const matchPriority = rosterPriority === 'All' || emp.allocation?.priority === rosterPriority;
      return matchSearch && matchDept && matchPriority;
    });
  }, [employees, rosterSearch, rosterDept, rosterPriority]);

  // Capacity stats
  const totalAllocatedHours = useMemo(() => {
    return employees.reduce((acc, emp) => acc + (emp.allocation?.allocatedHours || 40), 0);
  }, [employees]);

  const avgUtilization = useMemo(() => {
    return Math.round((totalAllocatedHours / (employees.length * 40)) * 100) || 100;
  }, [totalAllocatedHours, employees.length]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className={`p-6 rounded-3xl border transition-all relative overflow-hidden ${
        isDark ? 'glass-card border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                <UserPlus className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Workforce Data Entry & Work Allocation Hub
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
              Register new team members, configure weekly project commitments, adjust capacity levers, and predict performance impact dynamically.
            </p>
          </div>

          {/* Quick Stats Chips */}
          <div className="flex flex-wrap items-center gap-3">
            <div className={`px-3.5 py-2 rounded-2xl border text-xs ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="text-slate-400 text-[11px] block">Total Staff</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{employees.length} Members</span>
            </div>
            <div className={`px-3.5 py-2 rounded-2xl border text-xs ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="text-slate-400 text-[11px] block">Allocated Workload</span>
              <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">{totalAllocatedHours.toLocaleString()} hrs/wk</span>
            </div>
            <div className={`px-3.5 py-2 rounded-2xl border text-xs ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="text-slate-400 text-[11px] block">Avg Capacity Utilization</span>
              <span className={`text-sm font-bold ${
                avgUtilization > 105 ? 'text-amber-500' : 'text-emerald-500'
              }`}>{avgUtilization}%</span>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <button
            onClick={() => setActiveSubTab('entry')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'entry'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>New Employee & Work Allocation</span>
          </button>
          <button
            onClick={() => setActiveSubTab('roster')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'roster'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Allocation Roster & Capacity Board ({employees.length})</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between shadow-lg shadow-emerald-500/10 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button 
            onClick={() => setActiveSubTab('roster')} 
            className="text-[11px] underline font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700"
          >
            View in Roster &rarr;
          </button>
        </div>
      )}

      {/* VIEW 1: DATA ENTRY FORM */}
      {activeSubTab === 'entry' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Personal & Organizational Details (Col 6) */}
            <div className={`lg:col-span-6 p-6 rounded-3xl border space-y-5 transition-all ${
              isDark ? 'glass-card border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-cyan-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    1. Employee Identity & Department
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">
                  EMP-{String(nextNum).padStart(4, '0')}
                </span>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Meera Krishnan"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    isDark 
                      ? 'bg-slate-900/80 border-slate-800 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  }`}
                />
              </div>

              {/* Corporate Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Corporate Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="meera.krishnan@workpredict.io"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                    isDark 
                      ? 'bg-slate-900/80 border-slate-800 text-slate-300 focus:border-cyan-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-700 focus:border-blue-500'
                  }`}
                />
              </div>

              {/* Department Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Department
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {(['Engineering', 'Marketing', 'Finance', 'HR', 'Operations'] as Department[]).map((dept) => (
                    <button
                      type="button"
                      key={dept}
                      onClick={() => handleDeptChange(dept)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                        department === dept
                          ? 'bg-cyan-500 text-white border-cyan-500 shadow-sm shadow-cyan-500/30'
                          : isDark
                            ? 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                            : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </div>

              {/* Job Title / Role */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Job Role / Title
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    isDark 
                      ? 'bg-slate-900/90 border-slate-800 text-white focus:border-cyan-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
                  }`}
                >
                  {(SAMPLE_ROLES[department] || []).map((r) => (
                    <option key={r} value={r} className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Shift / Work Arrangement */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Work Arrangement
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Remote', 'Hybrid', 'On-site'] as const).map((shift) => (
                    <button
                      type="button"
                      key={shift}
                      onClick={() => setShiftType(shift)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                        shiftType === shift
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-600/30'
                          : isDark
                            ? 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                            : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {shift}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Work & Project Allocation Inputs (Col 6) */}
            <div className={`lg:col-span-6 p-6 rounded-3xl border space-y-5 transition-all ${
              isDark ? 'glass-card border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-cyan-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    2. Project Allocation & Workload
                  </h3>
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  capacityPct > 110 
                    ? 'bg-rose-500/20 text-rose-500' 
                    : capacityPct < 80 
                      ? 'bg-amber-500/20 text-amber-500' 
                      : 'bg-emerald-500/20 text-emerald-500'
                }`}>
                  {capacityPct}% Capacity
                </span>
              </div>

              {/* Primary Project Assignment */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Assigned Project / Initiative
                </label>
                <select
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all mb-2 ${
                    isDark 
                      ? 'bg-slate-900/90 border-slate-800 text-white focus:border-cyan-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
                  }`}
                >
                  {POPULAR_PROJECTS.map((proj) => (
                    <option key={proj} value={proj} className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>
                      {proj}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={customProject}
                  onChange={(e) => setCustomProject(e.target.value)}
                  placeholder="Or enter custom project name..."
                  className={`w-full px-3.5 py-2 rounded-xl border text-xs font-medium transition-all ${
                    isDark 
                      ? 'bg-slate-900/60 border-slate-800 text-slate-300 placeholder:text-slate-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-700 placeholder:text-slate-400'
                  }`}
                />
              </div>

              {/* Weekly Allocated Hours & Capacity Slider */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-500" />
                    Weekly Allocated Hours
                  </span>
                  <span className="text-sm font-extrabold text-cyan-600 dark:text-cyan-400">
                    {allocatedHours} hrs / week ({capacityPct}% capacity)
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={60}
                  step={2}
                  value={allocatedHours}
                  onChange={(e) => setAllocatedHours(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Part-time (10h)</span>
                  <span className="font-bold text-emerald-500">Standard Full-time (40h)</span>
                  <span className="font-bold text-rose-400">Overtime (60h)</span>
                </div>
              </div>

              {/* Priority & Sprint Target Deliverables */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Project Priority
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(['Low', 'Medium', 'High', 'Critical'] as const).map((pri) => (
                      <button
                        type="button"
                        key={pri}
                        onClick={() => setPriority(pri)}
                        className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                          priority === pri
                            ? pri === 'Critical' 
                              ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                              : pri === 'High'
                                ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                                : 'bg-cyan-500 text-white border-cyan-500 shadow-sm'
                            : isDark
                              ? 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                              : 'bg-slate-100 border-slate-200 text-slate-600'
                        }`}
                      >
                        {pri}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Sprint Target Deliverables
                  </label>
                  <input
                    type="number"
                    min={4}
                    max={60}
                    value={sprintTasks}
                    onChange={(e) => setSprintTasks(Math.max(1, Number(e.target.value)))}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-bold transition-all ${
                      isDark 
                        ? 'bg-slate-900/90 border-slate-800 text-white focus:border-cyan-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
                    }`}
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Expected tasks / sprint</span>
                </div>
              </div>

              {/* Assigned Reporting Manager */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Reporting Manager / Lead
                </label>
                <input
                  type="text"
                  value={assignedManager}
                  onChange={(e) => setAssignedManager(e.target.value)}
                  placeholder="Arun (HR Analytics)"
                  className={`w-full px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all ${
                    isDark 
                      ? 'bg-slate-900/80 border-slate-800 text-slate-200' 
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>

            </div>

          </div>

          {/* Bottom Card: Expected Performance Levers & Live Productivity Output */}
          <div className={`p-6 rounded-3xl border space-y-5 transition-all ${
            isDark ? 'glass-card border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  3. Performance Baseline & Live Productivity Calculation
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                Formula: Attendance (30%) + Engagement (30%) + Task Completion (40%)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Attendance Lever */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-700 dark:text-slate-300">Expected Attendance</span>
                  <span className="text-cyan-500 font-extrabold">{attendance}%</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={100}
                  value={attendance}
                  onChange={(e) => setAttendance(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              {/* Engagement Lever */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-700 dark:text-slate-300">Team Engagement</span>
                  <span className="text-blue-500 font-extrabold">{engagement}%</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={100}
                  value={engagement}
                  onChange={(e) => setEngagement(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              {/* Task Completion Rate Lever */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-700 dark:text-slate-300">Task Completion Rate</span>
                  <span className="text-purple-500 font-extrabold">{taskRate}%</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={100}
                  value={taskRate}
                  onChange={(e) => setTaskRate(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Computed Productivity Banner */}
            <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              computedTier === 'High'
                ? isDark ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'
                : computedTier === 'Medium'
                  ? isDark ? 'bg-blue-950/20 border-blue-500/30' : 'bg-blue-50 border-blue-200'
                  : isDark ? 'bg-rose-950/20 border-rose-500/30' : 'bg-rose-50 border-rose-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${
                  computedTier === 'High' ? 'bg-emerald-500/20 text-emerald-500' :
                  computedTier === 'Medium' ? 'bg-blue-500/20 text-blue-500' : 'bg-rose-500/20 text-rose-500'
                }`}>
                  {computedProductivity}%
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Calculated Baseline Productivity
                    </h4>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                      computedTier === 'High' ? 'bg-emerald-500 text-white' :
                      computedTier === 'Medium' ? 'bg-blue-600 text-white' : 'bg-rose-600 text-white'
                    }`}>
                      {computedTier} Performer
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Est. Deliverables Completed: <strong>{Math.round(sprintTasks * (taskRate / 100))} of {sprintTasks} tasks</strong>
                  </p>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleLoadSample}
                  className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    isDark 
                      ? 'border-slate-700 text-slate-300 hover:bg-slate-800' 
                      : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  🎲 Load Sample
                </button>
                <button
                  type="button"
                  onClick={handleResetForm}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    isDark 
                      ? 'border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800' 
                      : 'border-slate-200 text-slate-500 hover:bg-slate-100'
                  }`}
                  title="Reset Form"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Save Employee & Allocate Work</span>
                </button>
              </div>
            </div>

          </div>
        </form>
      )}

      {/* VIEW 2: ALLOCATION ROSTER & CAPACITY BOARD */}
      {activeSubTab === 'roster' && (
        <div className={`p-6 rounded-3xl border space-y-5 transition-all ${
          isDark ? 'glass-card border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          {/* Roster Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={rosterSearch}
                onChange={(e) => setRosterSearch(e.target.value)}
                placeholder="Search staff, role, project..."
                className={`w-full pl-9 pr-4 py-2 rounded-xl border text-xs font-medium ${
                  isDark ? 'bg-slate-900/80 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={rosterDept}
                onChange={(e) => setRosterDept(e.target.value)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold ${
                  isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <option value="All">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
                <option value="HR">HR</option>
                <option value="Operations">Operations</option>
              </select>

              <select
                value={rosterPriority}
                onChange={(e) => setRosterPriority(e.target.value)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold ${
                  isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <option value="All">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <button
                onClick={() => { setRosterSearch(''); setRosterDept('All'); setRosterPriority('All'); }}
                className="text-xs text-slate-400 hover:text-cyan-500 px-2 py-1"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Allocation Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className={`border-b ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                  <th className="py-3 px-3 font-semibold">Employee</th>
                  <th className="py-3 px-3 font-semibold">Department</th>
                  <th className="py-3 px-3 font-semibold">Allocated Project</th>
                  <th className="py-3 px-3 font-semibold">Weekly Load</th>
                  <th className="py-3 px-3 font-semibold">Capacity</th>
                  <th className="py-3 px-3 font-semibold">Priority</th>
                  <th className="py-3 px-3 font-semibold text-right">Productivity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredRoster.slice(0, 15).map((emp) => {
                  const alloc = emp.allocation || {
                    projectName: 'Core Operations & Maintenance',
                    allocatedHours: 40,
                    allocationPercentage: 100,
                    priority: 'Medium',
                    shiftType: 'Hybrid',
                    sprintTasks: emp.tasksTotal
                  };

                  return (
                    <tr key={emp.id} className={`transition-colors ${
                      isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                    }`}>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <img src={emp.avatar} alt={emp.name} className="w-7 h-7 rounded-full object-cover" />
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">{emp.name}</span>
                            <span className="text-[10px] text-slate-400">{emp.role}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300 font-medium">
                        {emp.department}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-cyan-600 dark:text-cyan-400 block truncate max-w-[200px]">
                          {alloc.projectName}
                        </span>
                        <span className="text-[10px] text-slate-400">{alloc.shiftType} &bull; {alloc.sprintTasks || emp.tasksTotal} Tasks</span>
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                        {alloc.allocatedHours}h / wk
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                alloc.allocationPercentage > 110 
                                  ? 'bg-rose-500' 
                                  : alloc.allocationPercentage < 80 
                                    ? 'bg-amber-400' 
                                    : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(100, alloc.allocationPercentage)}%` }}
                            />
                          </div>
                          <span className="font-bold text-[11px]">{alloc.allocationPercentage}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          alloc.priority === 'Critical' ? 'bg-rose-500/20 text-rose-500' :
                          alloc.priority === 'High' ? 'bg-amber-500/20 text-amber-500' :
                          alloc.priority === 'Medium' ? 'bg-blue-500/20 text-blue-500' : 'bg-slate-500/20 text-slate-400'
                        }`}>
                          {alloc.priority}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className={`px-2 py-0.5 rounded-md font-extrabold text-[11px] ${
                          emp.status === 'High' ? 'bg-emerald-500/20 text-emerald-500' :
                          emp.status === 'Medium' ? 'bg-blue-500/20 text-blue-500' : 'bg-rose-500/20 text-rose-500'
                        }`}>
                          {emp.currentProductivity}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span>Showing top 15 of {filteredRoster.length} allocated employees</span>
            <button
              onClick={() => setActiveSubTab('entry')}
              className="font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
            >
              + Add Another Employee
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
