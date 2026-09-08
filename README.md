# WorkPredict Pro - Employee Productivity Analytics Dashboard

[![Live Dashboard](https://img.shields.io/badge/Live%20Demo-Open%20Dashboard-blue?style=for-the-badge&logo=githubpages&logoColor=white)](https://arunsai2003.github.io/WORK-PREDICT/)

> 🌐 **Official Live URL**: **[https://arunsai2003.github.io/WORK-PREDICT/](https://arunsai2003.github.io/WORK-PREDICT/)**  
> ⚡ **Direct Access Link**: **[https://arunsai2003.github.io/WORK-PREDICT/?v=2](https://arunsai2003.github.io/WORK-PREDICT/?v=2)**

# WorkPredict Pro - Employee Productivity Analytics Dashboard

A professional, enterprise-grade Employee Work Prediction & Productivity Analytics web application built with **React 18**, **TypeScript**, **Tailwind CSS**, and **Vite**.

---

## 💻 How to Open and Run in Visual Studio Code (VS Code)

### Step 1: Open the Folder in VS Code
1. Open **VS Code**.
2. Click **File** > **Open Folder...** (or press `Ctrl + K, Ctrl + O`).
3. Select the folder:
   ```
   C:\Users\Y Arunsai\.gemini\antigravity\scratch\workpredict-dashboard
   ```
   *(Or open your terminal, navigate to the folder, and type `code .`)*

---

### Step 2: Open Terminal in VS Code
- Press `Ctrl + \`` (backtick) or go to **Terminal** > **New Terminal**.

---

### Step 3: Start the Development Server
In the terminal, run:

```powershell
npm.cmd run dev
```

> **Note for Windows Users:**
> If you encounter `npm.ps1 cannot be loaded because running scripts is disabled on this system`, either:
> 1. Use `npm.cmd run dev` (works immediately on all Windows systems)
> 2. Or run: `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` in PowerShell to enable standard `npm run dev`.

---

### Step 4: Open in Browser
Once Vite starts, click the link in your terminal or open:
👉 **[http://localhost:5173/](http://localhost:5173/)**

---

## ⚡ Quick One-Click Task in VS Code
A `.vscode/tasks.json` has been configured for you:
- Press `Ctrl + Shift + B` in VS Code to immediately launch the dev server!

---

## 🛠️ Available Scripts

| Command | Description |
|---|---|
| `npm.cmd run dev` | Starts the Vite local development server with hot-module reload |
| `npm.cmd run build` | Compiles TypeScript and creates optimized production bundle in `dist/` |
| `npm.cmd run preview` | Previews the production build locally |

---

## 🌟 Key Features
- **Admin**: Configured for **Arun** (*HR Analytics*) with executive portrait avatar.
- **Top 4 KPI Cards**: Real-time calculated counts (Total Employees: 312, Productivity: 84%, Top Performers: 96, At Risk: 18).
- **Interactive Calendar**: Full month and day selector (1-31) that dynamically synchronizes KPIs, scores, and dates.
- **Productivity Trend Chart**: Spline curves for Actual vs AI Forecast with hover tooltips (Jan–Sep).
- **Productivity Score Gauge**: Semi-circular glowing radial gauge with delta badges.
- **Department Performance Matrix**: 5×5 multi-metric heatmap with High/Medium/Low indicators.
- **Real CSV / XLSX Ingestion**: Drag-and-drop file upload with column auto-matching and live model recalculation.
- **What-If Scenario Simulator**: Sliders to simulate attendance, engagement, and workload stress impact on productivity.
- **Executive Reporting**: One-click Excel export and printable audit sheet.
- **Dark & Light Mode**: 1-click theme switch toggle in the top header.
