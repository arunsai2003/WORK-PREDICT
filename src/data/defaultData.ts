import { Employee, MonthlyTrend, KeyInsight, DepartmentSummary, HeatmapCell } from '../types';

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    num: 1,
    name: 'Rahul Sharma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Engineering',
    role: 'Staff Software Engineer',
    currentProductivity: 88,
    predictedProductivity: 92,
    status: 'High',
    attendance: 96,
    engagement: 91,
    collaboration: 89,
    tasksCompleted: 44,
    tasksTotal: 48,
    historicalTrend: [82, 84, 85, 87, 88],
    email: 'rahul.sharma@workpredict.io'
  },
  {
    id: 'emp-2',
    num: 2,
    name: 'Priya Verma',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    department: 'Marketing',
    role: 'Growth Marketing Manager',
    currentProductivity: 76,
    predictedProductivity: 80,
    status: 'Medium',
    attendance: 92,
    engagement: 78,
    collaboration: 82,
    tasksCompleted: 35,
    tasksTotal: 44,
    historicalTrend: [70, 72, 74, 75, 76],
    email: 'priya.verma@workpredict.io'
  },
  {
    id: 'emp-3',
    num: 3,
    name: 'Arjun Patel',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'Finance',
    role: 'Financial Analyst',
    currentProductivity: 62,
    predictedProductivity: 58,
    status: 'At Risk',
    attendance: 78,
    engagement: 60,
    collaboration: 65,
    tasksCompleted: 24,
    tasksTotal: 40,
    historicalTrend: [72, 68, 65, 63, 62],
    email: 'arjun.patel@workpredict.io'
  },
  {
    id: 'emp-4',
    num: 4,
    name: 'Sneha Reddy',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department: 'HR',
    role: 'People Operations Lead',
    currentProductivity: 81,
    predictedProductivity: 85,
    status: 'High',
    attendance: 94,
    engagement: 88,
    collaboration: 90,
    tasksCompleted: 38,
    tasksTotal: 44,
    historicalTrend: [77, 78, 80, 80, 81],
    email: 'sneha.reddy@workpredict.io'
  },
  {
    id: 'emp-5',
    num: 5,
    name: 'Vikram Singh',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    department: 'Operations',
    role: 'Supply Operations Lead',
    currentProductivity: 69,
    predictedProductivity: 72,
    status: 'Medium',
    attendance: 88,
    engagement: 71,
    collaboration: 74,
    tasksCompleted: 31,
    tasksTotal: 42,
    historicalTrend: [64, 66, 67, 68, 69],
    email: 'vikram.singh@workpredict.io'
  },
  {
    id: 'emp-6',
    num: 6,
    name: 'Ananya Gupta',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Marketing',
    role: 'Principal Content Strategist',
    currentProductivity: 93,
    predictedProductivity: 96,
    status: 'High',
    attendance: 98,
    engagement: 95,
    collaboration: 94,
    tasksCompleted: 48,
    tasksTotal: 50,
    historicalTrend: [89, 90, 91, 92, 93],
    email: 'ananya.gupta@workpredict.io'
  },
  {
    id: 'emp-7',
    num: 7,
    name: 'Rohan Mehta',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    department: 'Engineering',
    role: 'Cloud Infrastructure Engineer',
    currentProductivity: 58,
    predictedProductivity: 62,
    status: 'At Risk',
    attendance: 75,
    engagement: 58,
    collaboration: 64,
    tasksCompleted: 22,
    tasksTotal: 38,
    historicalTrend: [65, 62, 60, 59, 58],
    email: 'rohan.mehta@workpredict.io'
  },
  {
    id: 'emp-8',
    num: 8,
    name: 'Neha Kapoor',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    department: 'Finance',
    role: 'Senior Accounting Manager',
    currentProductivity: 87,
    predictedProductivity: 90,
    status: 'High',
    attendance: 95,
    engagement: 89,
    collaboration: 91,
    tasksCompleted: 42,
    tasksTotal: 46,
    historicalTrend: [82, 84, 85, 86, 87],
    email: 'neha.kapoor@workpredict.io'
  }
];

// Generate remainder of 312 employees with realistic distributions
export const generateFullEmployeeDataset = (): Employee[] => {
  const list = [...INITIAL_EMPLOYEES];
  const departments: ('Engineering' | 'Marketing' | 'Finance' | 'HR' | 'Operations')[] = [
    'Engineering', 'Marketing', 'Finance', 'HR', 'Operations'
  ];
  
  const firstNames = [
    'Aditya', 'Aarav', 'Diya', 'Ishaan', 'Kabir', 'Meera', 'Riya', 'Siddharth', 
    'Tanvi', 'Varun', 'Kavya', 'Dev', 'Tara', 'Karan', 'Pooja', 'Nikhil',
    'Simran', 'Akash', 'Shreya', 'Amit', 'Sunita', 'Manish', 'Kritika', 'Abhishek'
  ];
  const lastNames = [
    'Verma', 'Kumar', 'Nair', 'Iyer', 'Chopra', 'Bose', 'Menon', 'Joshi', 
    'Saxena', 'Deshmukh', 'Das', 'Chatterjee', 'Rao', 'Bhatia', 'Malhotra', 'Sen'
  ];

  // Target exactly 312 total employees
  // Top performers target: 96 (status = 'High')
  // At risk target: 18 (status = 'At Risk')
  // Medium target: 312 - 96 - 18 = 198
  let highCount = INITIAL_EMPLOYEES.filter(e => e.status === 'High').length; // 4
  let riskCount = INITIAL_EMPLOYEES.filter(e => e.status === 'At Risk').length; // 2
  
  for (let i = 9; i <= 312; i++) {
    const dept = departments[(i * 3 + 1) % departments.length];
    const fName = firstNames[(i * 7 + 2) % firstNames.length];
    const lName = lastNames[(i * 11 + 5) % lastNames.length];
    const fullName = `${fName} ${lName}`;
    
    let status: 'High' | 'Medium' | 'At Risk' = 'Medium';
    let currentProd = 72;
    let predProd = 75;
    let attendance = 86;
    let engagement = 76;
    let collab = 78;

    if (highCount < 96 && (i % 3 === 0 || highCount < 50)) {
      status = 'High';
      highCount++;
      currentProd = 82 + ((i * 13) % 16); // 82 to 97
      predProd = Math.min(99, currentProd + 2 + (i % 4));
      attendance = 92 + (i % 7);
      engagement = 85 + (i % 14);
      collab = 84 + (i % 15);
    } else if (riskCount < 18 && (i % 15 === 0 || (312 - i <= 18 - riskCount))) {
      status = 'At Risk';
      riskCount++;
      currentProd = 52 + ((i * 7) % 12); // 52 to 63
      predProd = Math.max(48, currentProd - 3 + (i % 6));
      attendance = 68 + (i % 12);
      engagement = 55 + (i % 12);
      collab = 58 + (i % 14);
    } else {
      status = 'Medium';
      currentProd = 68 + ((i * 17) % 12); // 68 to 79
      predProd = Math.min(84, currentProd + ((i % 5) - 1));
      attendance = 82 + (i % 12);
      engagement = 70 + (i % 16);
      collab = 72 + (i % 15);
    }

    const tasksTotal = 35 + (i % 20);
    const tasksCompleted = Math.round(tasksTotal * (currentProd / 100));

    list.push({
      id: `emp-${i}`,
      num: i,
      name: fullName,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`,
      department: dept,
      role: dept === 'Engineering' ? 'Software Engineer' :
            dept === 'Marketing' ? 'Marketing Specialist' :
            dept === 'Finance' ? 'Financial Analyst' :
            dept === 'HR' ? 'HR Coordinator' : 'Operations Associate',
      currentProductivity: currentProd,
      predictedProductivity: predProd,
      status,
      attendance,
      engagement,
      collaboration: collab,
      tasksCompleted,
      tasksTotal,
      historicalTrend: [
        currentProd - 4,
        currentProd - 2,
        currentProd - 1,
        currentProd,
        currentProd + 1
      ],
      email: `${fName.toLowerCase()}.${lName.toLowerCase()}@workpredict.io`
    });
  }

  return list;
};

// Monthly trend data matching the line chart in reference image
export const INITIAL_MONTHLY_TRENDS: MonthlyTrend[] = [
  { month: 'Jan', actual: 42, forecast: 40 },
  { month: 'Feb', actual: 53, forecast: 48 },
  { month: 'Mar', actual: 48, forecast: 46 },
  { month: 'Apr', actual: 64, forecast: 56 },
  { month: 'May', actual: 60, forecast: 54 },
  { month: 'Jun', actual: 68, forecast: 62 },
  { month: 'Jul', actual: 67, forecast: 60 },
  { month: 'Aug', actual: 76, forecast: 71 },
  { month: 'Sep', actual: 88, forecast: 76 },
];

// Department progress bars matching reference image
export const INITIAL_DEPARTMENTS: DepartmentSummary[] = [
  { name: 'Engineering', productivity: 88, change: 5, color: '#06B6D4', barClass: 'from-cyan-400 to-cyan-500' },
  { name: 'Marketing', productivity: 76, change: 4, color: '#3B82F6', barClass: 'from-blue-500 to-blue-600' },
  { name: 'Finance', productivity: 70, change: 6, color: '#8B5CF6', barClass: 'from-purple-500 to-purple-600' },
  { name: 'HR', productivity: 68, change: 3, color: '#F59E0B', barClass: 'from-amber-400 to-amber-500' },
  { name: 'Operations', productivity: 65, change: 2, color: '#F43F5E', barClass: 'from-rose-500 to-rose-600' },
];

// Heatmap matrix matching reference image grid
// Engineering, Marketing, Finance, HR, Operations x Overall, Productivity, Engagement, Attendance, Collaboration
export const INITIAL_HEATMAP: HeatmapCell[] = [
  // Overall
  { row: 'Overall', department: 'Engineering', score: 88, tier: 'High' },
  { row: 'Overall', department: 'Marketing', score: 78, tier: 'High' },
  { row: 'Overall', department: 'Finance', score: 68, tier: 'Medium' },
  { row: 'Overall', department: 'HR', score: 82, tier: 'High' },
  { row: 'Overall', department: 'Operations', score: 80, tier: 'High' },

  // Productivity
  { row: 'Productivity', department: 'Engineering', score: 62, tier: 'Medium' }, // blue accent in image
  { row: 'Productivity', department: 'Marketing', score: 84, tier: 'High' },
  { row: 'Productivity', department: 'Finance', score: 69, tier: 'Medium' },
  { row: 'Productivity', department: 'HR', score: 55, tier: 'Medium' },
  { row: 'Productivity', department: 'Operations', score: 85, tier: 'High' },

  // Engagement
  { row: 'Engagement', department: 'Engineering', score: 64, tier: 'Medium' },
  { row: 'Engagement', department: 'Marketing', score: 79, tier: 'High' },
  { row: 'Engagement', department: 'Finance', score: 85, tier: 'High' },
  { row: 'Engagement', department: 'HR', score: 68, tier: 'Medium' },
  { row: 'Engagement', department: 'Operations', score: 72, tier: 'Medium' },

  // Attendance
  { row: 'Attendance', department: 'Engineering', score: 86, tier: 'High' },
  { row: 'Attendance', department: 'Marketing', score: 70, tier: 'Medium' },
  { row: 'Attendance', department: 'Finance', score: 82, tier: 'High' },
  { row: 'Attendance', department: 'HR', score: 67, tier: 'Medium' },
  { row: 'Attendance', department: 'Operations', score: 71, tier: 'Medium' },

  // Collaboration
  { row: 'Collaboration', department: 'Engineering', score: 82, tier: 'High' },
  { row: 'Collaboration', department: 'Marketing', score: 48, tier: 'Low' }, // red/pink in image
  { row: 'Collaboration', department: 'Finance', score: 84, tier: 'High' },
  { row: 'Collaboration', department: 'HR', score: 81, tier: 'High' },
  { row: 'Collaboration', department: 'Operations', score: 79, tier: 'High' },
];

export const INITIAL_INSIGHTS: KeyInsight[] = [
  {
    id: 'insight-1',
    title: 'Productivity is up 6%',
    description: 'Overall productivity increased by 6% compared to last month.',
    category: 'trend',
    iconName: 'TrendingUp',
    iconBg: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    iconColor: '#22C55E',
    date: 'Sep 08, 2026',
    timeAgo: 'Today, 10:30 AM'
  },
  {
    id: 'insight-2',
    title: 'Top Performers',
    description: '96 employees are in the top performance tier (≥ 90%).',
    category: 'performers',
    iconName: 'Users',
    iconBg: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    iconColor: '#3B82F6',
    date: 'Sep 07, 2026',
    timeAgo: 'Yesterday, 04:15 PM'
  },
  {
    id: 'insight-3',
    title: 'At Risk Employees',
    description: '18 employees are at risk of low performance.',
    category: 'risk',
    iconName: 'AlertTriangle',
    iconBg: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
    iconColor: '#EF4444',
    date: 'Sep 05, 2026',
    timeAgo: 'Sep 05, 2026'
  },
  {
    id: 'insight-4',
    title: 'Engineering Leading',
    description: 'Engineering has the highest productivity at 88%.',
    category: 'leading',
    iconName: 'Target',
    iconBg: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    iconColor: '#8B5CF6',
    date: 'Sep 03, 2026',
    timeAgo: 'Sep 03, 2026'
  },
  {
    id: 'insight-5',
    title: 'Next Month Forecast',
    description: 'Overall productivity is predicted to reach 87%.',
    category: 'forecast',
    iconName: 'Calendar',
    iconBg: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
    iconColor: '#06B6D4',
    date: 'Sep 01, 2026',
    timeAgo: 'Sep 01, 2026'
  }
];
