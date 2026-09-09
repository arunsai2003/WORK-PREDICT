import React, { useState, useRef } from 'react';
import { 
  Upload, 
  X, 
  FileSpreadsheet, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Employee } from '../../types';
import { parseUploadedFile, downloadSampleCsv } from '../../utils/csvParser';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataLoaded: (employees: Employee[], fileName: string) => void;
  onLoadDemo?: () => void;
  isDark: boolean;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onDataLoaded,
  onLoadDemo,
  isDark
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ count: number; name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileProcess = async (file: File) => {
    setError(null);
    setSuccessInfo(null);
    setIsLoading(true);

    try {
      const result = await parseUploadedFile(file);
      setSuccessInfo({ count: result.employees.length, name: file.name });
      setTimeout(() => {
        onDataLoaded(result.employees, file.name);
        setIsLoading(false);
        onClose();
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Failed to parse the file. Please use the valid template format.');
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`relative w-full max-w-lg rounded-3xl border shadow-2xl p-6 transition-all ${
        isDark 
          ? 'bg-[#0b1329] border-slate-700/80 text-slate-100 shadow-cyan-950/40' 
          : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/50'
      }`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Import Workforce Dataset
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Upload CSV or Excel (.xlsx, .xls) with employee metrics
            </p>
          </div>
        </div>

        {/* Drag & Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-cyan-400 bg-cyan-500/10 scale-[1.01]'
              : isDark
                ? 'border-slate-700/80 bg-slate-900/50 hover:border-cyan-500/50 hover:bg-slate-900'
                : 'border-slate-300 bg-slate-50 hover:border-blue-500 hover:bg-blue-50/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv, .xlsx, .xls"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileProcess(e.target.files[0]);
              }
            }}
          />

          {isLoading ? (
            <div className="flex flex-col items-center py-4">
              <Loader2 className="w-10 h-10 text-cyan-500 animate-spin mb-3" />
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-200">Processing employee data & recalculating models...</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Generating multi-factor predictions</p>
            </div>
          ) : successInfo ? (
            <div className="flex flex-col items-center py-4 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-12 h-12 mb-2 animate-bounce" />
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Successfully Imported {successInfo.count} Employees!</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Updating dashboard visualizations...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="p-3.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 mb-3">
                <FileSpreadsheet className="w-8 h-8" />
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-200 mb-1">
                Drop your CSV or Excel file here, or <span className="text-cyan-600 dark:text-cyan-400 underline">browse</span>
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                Supports .csv, .xlsx, and .xls files up to 10MB
              </p>
            </div>
          )}
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Sample Template Download */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-300">Need the template format?</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Download the standard HR dataset format</p>
          </div>
          <div className="flex items-center gap-2">
            {onLoadDemo && (
              <button
                type="button"
                onClick={onLoadDemo}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-colors"
                title="Load sample demo dataset for testing"
              >
                <span>🎲 Load Demo</span>
              </button>
            )}
            <button
              onClick={downloadSampleCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cyan-500/40 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/10 font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Sample CSV</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
