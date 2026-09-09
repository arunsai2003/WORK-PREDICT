import { Employee, KpiMetrics, Settings, DepartmentSummary, HeatmapCell, KeyInsight, Department, MonthlyTrend } from '../types';

export const computeKpis = (
  employees: Employee[], 
  settings: Settings, 
  selectedMonth: string = 'Sep 2026'
): KpiMetrics => {
  if (!employees.length) {
    return {
      totalEmployees: 0,
      totalEmployeesChange: 0,
      productivity: 0,
      productivityChange: 0,
      topPerformers: 0,
      topPerformersChange: 0,
      atRisk: 0,
      atRiskChange: 0,
      highEmployees: 0,
      highAvgProductivity: 0,
      mediumEmployees: 0,
      mediumAvgProductivity: 0,
      lowEmployees: 0,
      lowAvgProductivity: 0
    };
  }

  const highList = employees.filter(e => e.currentProductivity >= settings.highThreshold);
  const lowList = employees.filter(e => e.currentProductivity < settings.atRiskThreshold);
  const mediumList = employees.filter(e => 
    e.currentProductivity >= settings.atRiskThreshold && 
    e.currentProductivity < settings.highThreshold
  );

  const totalEmployees = employees.length;
  const avgProd = Math.round(employees.reduce((s, e) => s + e.currentProductivity, 0) / totalEmployees);

  const highAvgProductivity = highList.length 
    ? Math.round(highList.reduce((s, e) => s + e.currentProductivity, 0) / highList.length) 
    : 0;
  const mediumAvgProductivity = mediumList.length 
    ? Math.round(mediumList.reduce((s, e) => s + e.currentProductivity, 0) / mediumList.length) 
    : 0;
  const lowAvgProductivity = lowList.length 
    ? Math.round(lowList.reduce((s, e) => s + e.currentProductivity, 0) / lowList.length) 
    : 0;

  return {
    totalEmployees,
    totalEmployeesChange: 0,
    productivity: avgProd,
    productivityChange: 0,
    topPerformers: highList.length,
    topPerformersChange: 0,
    atRisk: lowList.length,
    atRiskChange: 0,
    highEmployees: highList.length,
    highAvgProductivity,
    mediumEmployees: mediumList.length,
    mediumAvgProductivity,
    lowEmployees: lowList.length,
    lowAvgProductivity
  };
};

export const predictEmployeeProductivity = (emp: Partial<Employee>, settings: Settings): number => {
  const cur = emp.currentProductivity || 0;
  const att = emp.attendance || 0;
  const eng = emp.engagement || 0;
  const col = emp.collaboration || 0;

  if (cur === 0 && att === 0 && eng === 0) return 0;

  const weightedFactor = (att * settings.attendanceWeight) + (eng * settings.engagementWeight) + (col * 0.2) + (cur * 0.2);
  const delta = (weightedFactor - 75) * 0.25;
  const predicted = Math.round(cur * 0.6 + weightedFactor * 0.4 + delta);

  return Math.max(0, Math.min(100, predicted));
};

export const computeDepartmentProgress = (employees: Employee[]): DepartmentSummary[] => {
  const departments: Department[] = ['Engineering', 'Marketing', 'Finance', 'HR', 'Operations'];
  const palette: Record<Department, { color: string; barClass: string }> = {
    Engineering: { color: '#06B6D4', barClass: 'from-cyan-400 to-cyan-500' },
    Marketing: { color: '#3B82F6', barClass: 'from-blue-500 to-blue-600' },
    Finance: { color: '#8B5CF6', barClass: 'from-purple-500 to-purple-600' },
    HR: { color: '#F59E0B', barClass: 'from-amber-400 to-amber-500' },
    Operations: { color: '#F43F5E', barClass: 'from-rose-500 to-rose-600' }
  };

  return departments.map(dept => {
    const deptEmployees = employees.filter(e => e.department === dept);
    const avg = deptEmployees.length
      ? Math.round(deptEmployees.reduce((sum, e) => sum + e.currentProductivity, 0) / deptEmployees.length)
      : 0;

    return {
      name: dept,
      productivity: avg,
      change: 0,
      color: palette[dept].color,
      barClass: palette[dept].barClass
    };
  });
};

export const computeHeatmapMatrix = (employees: Employee[]): HeatmapCell[] => {
  const departments: Department[] = ['Engineering', 'Marketing', 'Finance', 'HR', 'Operations'];
  const rows: { key: string; field: keyof Employee | 'Overall' }[] = [
    { key: 'Overall', field: 'Overall' },
    { key: 'Productivity', field: 'currentProductivity' },
    { key: 'Engagement', field: 'engagement' },
    { key: 'Attendance', field: 'attendance' },
    { key: 'Collaboration', field: 'collaboration' }
  ];

  const cells: HeatmapCell[] = [];

  rows.forEach(r => {
    departments.forEach(dept => {
      const deptList = employees.filter(e => e.department === dept);
      let avg = 0;
      if (deptList.length) {
        if (r.field === 'Overall') {
          avg = Math.round(
            deptList.reduce((s, e) => s + (e.currentProductivity + e.engagement + e.attendance) / 3, 0) / deptList.length
          );
        } else {
          const f = r.field as keyof Employee;
          avg = Math.round(deptList.reduce((s, e) => s + (Number(e[f]) || 0), 0) / deptList.length);
        }
      }

      let tier: 'High' | 'Medium' | 'Low' = 'Low';
      if (avg >= 78) tier = 'High';
      else if (avg >= 60) tier = 'Medium';
      else tier = 'Low';

      cells.push({
        row: r.key,
        department: dept,
        score: avg,
        tier
      });
    });
  });

  return cells;
};

export const computeMonthlyTrends = (employees: Employee[]): MonthlyTrend[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  if (!employees.length) {
    return months.map(m => ({ month: m, actual: 0, forecast: 0 }));
  }

  const currentAvg = Math.round(employees.reduce((s, e) => s + e.currentProductivity, 0) / employees.length);
  const predictedAvg = Math.round(employees.reduce((s, e) => s + e.predictedProductivity, 0) / employees.length);

  return months.map((month, index) => {
    const factor = (index + 1) / months.length;
    const actual = Math.max(0, Math.min(100, Math.round(currentAvg * (0.8 + 0.2 * factor))));
    const forecast = Math.max(0, Math.min(100, Math.round(actual + (predictedAvg - currentAvg) * factor)));
    return { month, actual, forecast };
  });
};

export const generateDynamicInsights = (
  employees: Employee[], 
  kpis: KpiMetrics, 
  selectedMonth: string = 'Sep 2026'
): KeyInsight[] => {
  const parts = selectedMonth.split(' ');
  const m = parts[0] || 'Sep';
  const y = parts[1] || '2026';

  if (!employees.length) {
    return [
      {
        id: 'dyn-0',
        title: 'Workforce Dataset Awaiting Upload',
        description: 'Upload your company CSV or Excel employee dataset to generate real-time AI productivity insights, risk alerts, and department diagnostics.',
        category: 'trend',
        iconName: 'TrendingUp',
        iconBg: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
        iconColor: '#06B6D4',
        date: `${m} 08, ${y}`,
        timeAgo: 'Ready'
      }
    ];
  }

  const depts = computeDepartmentProgress(employees);
  const activeDepts = depts.filter(d => d.productivity > 0);
  const leadingDept = activeDepts.length 
    ? [...activeDepts].sort((a, b) => b.productivity - a.productivity)[0] 
    : { name: 'Engineering', productivity: 0 };
    
  const avgPredicted = Math.round(
    employees.reduce((sum, e) => sum + e.predictedProductivity, 0) / employees.length
  );

  return [
    {
      id: 'dyn-1',
      title: `Average Productivity: ${kpis.productivity}%`,
      description: `Calculated from ${employees.length} active employee records in your uploaded dataset.`,
      category: 'trend',
      iconName: 'TrendingUp',
      iconBg: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
      iconColor: '#22C55E',
      date: `${m} 08, ${y}`,
      timeAgo: 'Calculated'
    },
    {
      id: 'dyn-2',
      title: 'Top Performers',
      description: `${kpis.topPerformers} employees qualify for the top performance tier (≥ 80%).`,
      category: 'performers',
      iconName: 'Users',
      iconBg: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      iconColor: '#3B82F6',
      date: `${m} 07, ${y}`,
      timeAgo: 'Active'
    },
    {
      id: 'dyn-3',
      title: 'At Risk Employees',
      description: `${kpis.atRisk} employees are flagged below target thresholds and need support.`,
      category: 'risk',
      iconName: 'AlertTriangle',
      iconBg: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
      iconColor: '#EF4444',
      date: `${m} 05, ${y}`,
      timeAgo: 'Flagged'
    },
    {
      id: 'dyn-4',
      title: `${leadingDept.name} Department Leading`,
      description: `${leadingDept.name} has the highest department average productivity at ${leadingDept.productivity}%.`,
      category: 'leading',
      iconName: 'Target',
      iconBg: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
      iconColor: '#8B5CF6',
      date: `${m} 03, ${y}`,
      timeAgo: 'Rank 1'
    },
    {
      id: 'dyn-5',
      title: 'AI Forecasted Trajectory',
      description: `Predicted team productivity is estimated to reach ${avgPredicted}% next sprint.`,
      category: 'forecast',
      iconName: 'Calendar',
      iconBg: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
      iconColor: '#06B6D4',
      date: `${m} 01, ${y}`,
      timeAgo: 'Forecast'
    }
  ];
};
