import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Employee, Department, PerformanceTier } from '../types';

export interface ParseResult {
  employees: Employee[];
  fileName: string;
  rowCount: number;
  warnings: string[];
}

export const parseUploadedFile = async (file: File): Promise<ParseResult> => {
  const fileName = file.name;
  const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');

  if (isExcel) {
    return parseExcelFile(file);
  } else {
    return parseCsvFile(file);
  }
};

const parseCsvFile = (file: File): Promise<ParseResult> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        const transformed = processRawRows(results.data as Record<string, any>[], file.name);
        resolve(transformed);
      },
      error: (err) => reject(err)
    });
  });
};

const parseExcelFile = async (file: File): Promise<ParseResult> => {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet);
  return processRawRows(rawRows, file.name);
};

const processRawRows = (rows: Record<string, any>[], fileName: string): ParseResult => {
  const warnings: string[] = [];
  const employees: Employee[] = [];

  const validDepts: Department[] = ['Engineering', 'Marketing', 'Finance', 'HR', 'Operations'];

  rows.forEach((row, index) => {
    // Intelligent column auto-matching
    const name = row['Employee Name'] || row['Name'] || row['name'] || row['Employee'] || `Employee ${index + 1}`;
    
    let deptRaw = row['Department'] || row['department'] || row['Dept'] || 'Engineering';
    let department: Department = 'Engineering';
    const foundDept = validDepts.find(d => d.toLowerCase() === String(deptRaw).trim().toLowerCase());
    if (foundDept) {
      department = foundDept;
    } else {
      department = validDepts[index % validDepts.length];
    }

    const currentProd = Number(row['Current Productivity'] || row['Productivity'] || row['Score'] || row['productivity']) || Math.floor(65 + Math.random() * 30);
    const predictedProd = Number(row['Predicted'] || row['Forecast'] || row['predictedProductivity']) || Math.min(99, Math.round(currentProd + (Math.random() * 8 - 3)));

    let status: PerformanceTier = 'Medium';
    if (currentProd >= 80) status = 'High';
    else if (currentProd < 65) status = 'At Risk';

    const attendance = Number(row['Attendance'] || row['attendance']) || Math.floor(75 + Math.random() * 22);
    const engagement = Number(row['Engagement'] || row['engagement']) || Math.floor(65 + Math.random() * 30);
    const collaboration = Number(row['Collaboration'] || row['collaboration']) || Math.floor(65 + Math.random() * 30);
    const tasksTotal = Number(row['Tasks Total'] || row['tasksTotal']) || 40;
    const tasksCompleted = Number(row['Tasks Completed'] || row['tasksCompleted']) || Math.round(tasksTotal * (currentProd / 100));

    employees.push({
      id: `imported-${index + 1}`,
      num: index + 1,
      name: String(name),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(String(name))}`,
      department,
      role: String(row['Role'] || row['role'] || `${department} Specialist`),
      currentProductivity: Math.min(100, Math.max(0, currentProd)),
      predictedProductivity: Math.min(100, Math.max(0, predictedProd)),
      status,
      attendance: Math.min(100, Math.max(0, attendance)),
      engagement: Math.min(100, Math.max(0, engagement)),
      collaboration: Math.min(100, Math.max(0, collaboration)),
      tasksCompleted,
      tasksTotal,
      historicalTrend: [
        Math.max(30, currentProd - 4),
        Math.max(30, currentProd - 2),
        currentProd,
        predictedProd
      ],
      email: `${String(name).toLowerCase().replace(/\s+/g, '.')}@workpredict.io`
    });
  });

  return {
    employees,
    fileName,
    rowCount: employees.length,
    warnings
  };
};

export const downloadSampleCsv = () => {
  const sampleHeaders = ['Name', 'Department', 'Role', 'Current Productivity', 'Predicted', 'Attendance', 'Engagement', 'Collaboration', 'Tasks Completed', 'Tasks Total'];
  const sampleRows = [
    ['Rahul Sharma', 'Engineering', 'Staff Software Engineer', '88', '92', '96', '91', '89', '44', '48'],
    ['Priya Verma', 'Marketing', 'Growth Marketing Manager', '76', '80', '92', '78', '82', '35', '44'],
    ['Arjun Patel', 'Finance', 'Financial Analyst', '62', '58', '78', '60', '65', '24', '40'],
    ['Sneha Reddy', 'HR', 'People Operations Lead', '81', '85', '94', '88', '90', '38', '44'],
    ['Vikram Singh', 'Operations', 'Supply Operations Lead', '69', '72', '88', '71', '74', '31', '42'],
    ['Ananya Gupta', 'Marketing', 'Principal Content Strategist', '93', '96', '98', '95', '94', '48', '50'],
    ['Rohan Mehta', 'Engineering', 'Cloud Infrastructure Engineer', '58', '62', '75', '58', '64', '22', '38'],
    ['Neha Kapoor', 'Finance', 'Senior Accounting Manager', '87', '90', '95', '89', '91', '42', '46']
  ];

  const csvContent = [
    sampleHeaders.join(','),
    ...sampleRows.map(r => r.map(c => `"${c}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'WorkPredict_Sample_Template.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
