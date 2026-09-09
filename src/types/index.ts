export type Department = 'Engineering' | 'Marketing' | 'Finance' | 'HR' | 'Operations';
export type PerformanceTier = 'High' | 'Medium' | 'At Risk';

export interface WorkAllocation {
  projectName: string;
  allocatedHours: number; // e.g. 40 hrs/wk
  allocationPercentage: number; // e.g. 100%
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  shiftType: 'Remote' | 'Hybrid' | 'On-site';
  assignedManager?: string;
  sprintTasks?: number;
  deadline?: string;
}

export interface Employee {
  id: string;
  num: number;
  name: string;
  avatar: string;
  department: Department;
  role: string;
  currentProductivity: number; // 0-100
  predictedProductivity: number; // 0-100
  status: PerformanceTier;
  attendance: number; // 0-100
  engagement: number; // 0-100
  collaboration: number; // 0-100
  tasksCompleted: number;
  tasksTotal: number;
  historicalTrend?: number[];
  email: string;
  allocation?: WorkAllocation;
}

export interface KpiMetrics {
  totalEmployees: number;
  totalEmployeesChange: number;
  productivity: number;
  productivityChange: number;
  topPerformers: number;
  topPerformersChange: number;
  atRisk: number;
  atRiskChange: number;
  highEmployees: number;
  highAvgProductivity: number;
  mediumEmployees: number;
  mediumAvgProductivity: number;
  lowEmployees: number;
  lowAvgProductivity: number;
}

export interface MonthlyTrend {
  month: string;
  actual: number;
  forecast: number;
}

export interface DepartmentSummary {
  name: Department;
  productivity: number;
  change: number;
  color: string;
  barClass: string;
}

export interface HeatmapCell {
  row: string; // 'Overall' | 'Productivity' | 'Engagement' | 'Attendance' | 'Collaboration'
  department: Department;
  score: number;
  tier: 'High' | 'Medium' | 'Low';
}

export interface KeyInsight {
  id: string;
  title: string;
  description: string;
  category: 'trend' | 'performers' | 'risk' | 'leading' | 'forecast';
  iconName: 'TrendingUp' | 'Users' | 'AlertTriangle' | 'Target' | 'Calendar';
  iconBg: string;
  iconColor: string;
  date: string;
  timeAgo?: string;
}

export interface Settings {
  highThreshold: number; // default 80
  atRiskThreshold: number; // default 65
  attendanceWeight: number; // default 0.3
  engagementWeight: number; // default 0.3
  tasksWeight: number; // default 0.4
}
