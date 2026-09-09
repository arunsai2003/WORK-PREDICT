import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon 
} from 'lucide-react';

interface CalendarPickerProps {
  selectedMonth: string;
  onSelectMonth: (monthStr: string) => void;
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

export const CalendarPicker: React.FC<CalendarPickerProps> = ({
  selectedMonth,
  onSelectMonth,
  isOpen,
  onClose,
  isDark
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const shortMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const initialParts = selectedMonth.split(' ');
  const initialMonthIdx = Math.max(0, shortMonthNames.indexOf(initialParts[0]));
  const initialYear = parseInt(initialParts[1], 10) || 2026;

  const [viewYear, setViewYear] = useState<number>(initialYear);
  const [viewMonthIdx, setViewMonthIdx] = useState<number>(initialMonthIdx >= 0 ? initialMonthIdx : 8);
  const [selectedDay, setSelectedDay] = useState<number>(8);
  const [viewMode, setViewMode] = useState<'days' | 'months'>('days');

  useEffect(() => {
    const parts = selectedMonth.split(' ');
    const mIdx = shortMonthNames.indexOf(parts[0]);
    if (mIdx !== -1) setViewMonthIdx(mIdx);
    const y = parseInt(parts[1], 10);
    if (!isNaN(y)) setViewYear(y);
  }, [selectedMonth]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonthIdx === 0) {
      setViewMonthIdx(11);
      setViewYear(prev => prev - 1);
    } else {
      setViewMonthIdx(prev => prev - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonthIdx === 11) {
      setViewMonthIdx(0);
      setViewYear(prev => prev + 1);
    } else {
      setViewMonthIdx(prev => prev + 1);
    }
  };

  const daysInMonth = new Date(viewYear, viewMonthIdx + 1, 0).getDate();
  const firstDayWeekday = (new Date(viewYear, viewMonthIdx, 1).getDay() + 6) % 7;
  const prevMonthDays = new Date(viewYear, viewMonthIdx, 0).getDate();

  const handleSelectDay = (day: number) => {
    setSelectedDay(day);
    const monthStr = `${shortMonthNames[viewMonthIdx]} ${viewYear}`;
    onSelectMonth(monthStr);
    onClose();
  };

  const handleSelectPreset = (mIdx: number, y: number, day: number) => {
    setViewMonthIdx(mIdx);
    setViewYear(y);
    setSelectedDay(day);
    onSelectMonth(`${shortMonthNames[mIdx]} ${y}`);
    onClose();
  };

  return (
    <div
      ref={containerRef}
      className={`absolute right-0 top-full mt-2 w-80 sm:w-88 rounded-2xl border shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150 ${
        isDark 
          ? 'bg-[#0b1329] border-slate-700/80 text-slate-100 shadow-cyan-950/40' 
          : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/50'
      }`}
    >
      {/* Calendar Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-3">
        <div className="flex items-center gap-1.5">
          <CalendarIcon className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <button
            onClick={() => setViewMode(viewMode === 'days' ? 'months' : 'days')}
            className="text-xs font-bold hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1 text-slate-900 dark:text-slate-100"
          >
            <span>{monthNames[viewMonthIdx]} {viewYear}</span>
            <span className="text-[10px] text-slate-400 font-normal">({viewMode === 'days' ? 'Month View' : 'Back'})</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {viewMode === 'months' ? (
        <div className="grid grid-cols-3 gap-2 py-2">
          {shortMonthNames.map((m, idx) => {
            const isCurrent = idx === viewMonthIdx;
            return (
              <button
                key={m}
                onClick={() => {
                  setViewMonthIdx(idx);
                  setViewMode('days');
                  onSelectMonth(`${m} ${viewYear}`);
                }}
                className={`py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isCurrent
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md shadow-cyan-500/20'
                    : isDark
                      ? 'text-slate-300 hover:bg-slate-800'
                      : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {monthNames[idx]}
              </button>
            );
          })}
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-7 text-center mb-1.5 text-[11px] font-semibold text-slate-400">
            <span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {Array.from({ length: firstDayWeekday }).map((_, i) => {
              const dayNum = prevMonthDays - firstDayWeekday + i + 1;
              return (
                <div key={`prev-${i}`} className="py-1.5 text-slate-300 dark:text-slate-600 text-[11px] select-none">
                  {dayNum}
                </div>
              );
            })}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isSelected = day === selectedDay && viewMonthIdx === initialMonthIdx && viewYear === initialYear;
              const isCurrentPeriod = day === 8 && viewMonthIdx === 8 && viewYear === 2026;

              return (
                <button
                  key={`day-${day}`}
                  onClick={() => handleSelectDay(day)}
                  className={`py-1.5 rounded-lg text-xs font-medium transition-all relative ${
                    isSelected
                      ? 'bg-cyan-500 text-white font-bold shadow-md shadow-cyan-500/40'
                      : isCurrentPeriod
                        ? 'border border-cyan-500 text-cyan-600 dark:text-cyan-300 font-semibold'
                        : isDark
                          ? 'text-slate-200 hover:bg-slate-800'
                          : 'text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {day}
                  {isCurrentPeriod && !isSelected && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-500"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Selection Presets Footer */}
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-1 text-[11px]">
        <span className="text-slate-500 dark:text-slate-400 font-medium">Quick Select:</span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleSelectPreset(8, 2026, 8)}
            className="px-2 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/25 font-semibold transition-colors"
          >
            Today (Sep 8)
          </button>
          <button
            onClick={() => handleSelectPreset(7, 2026, 31)}
            className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Aug 2026
          </button>
          <button
            onClick={() => handleSelectPreset(6, 2026, 31)}
            className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Jul 2026
          </button>
        </div>
      </div>
    </div>
  );
};
