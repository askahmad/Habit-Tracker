import React, { useState, useEffect } from 'react';
import { X, Clock, Play, Plus, Minus, RotateCcw, Check, Sparkles, Zap } from 'lucide-react';
import { playSound } from '../../utils/audio';

export default function LogTimeModal({
  isOpen,
  habit,
  dateKey,
  onClose,
  onSaveDuration,
  onLaunchTimer,
  soundEnabled = true
}) {
  const targetMinutes = habit?.targetMinutes || 120; // Default 2 hours if not set
  const initialLogged = habit?.durations?.[dateKey] || (habit?.logs?.[dateKey] === true ? targetMinutes : 0);

  const [loggedMins, setLoggedMins] = useState(initialLogged);

  useEffect(() => {
    if (habit && dateKey) {
      const current = habit.durations?.[dateKey] || (habit.logs?.[dateKey] === true ? targetMinutes : 0);
      setLoggedMins(current);
    }
  }, [habit, dateKey, targetMinutes]);

  if (!isOpen || !habit) return null;

  // Proportional XP Calculation:
  // Full target = 40 XP. Proportional points calculated precisely based on percentage.
  const maxPossibleXp = 40;
  const percentage = Math.min(100, Math.round((loggedMins / targetMinutes) * 100));
  const earnedXp = loggedMins > 0 ? Math.min(50, Math.round((loggedMins / targetMinutes) * maxPossibleXp)) : 0;

  const handleAddMinutes = (mins) => {
    setLoggedMins((prev) => Math.max(0, prev + mins));
    playSound('click', soundEnabled);
  };

  const handleSetExact = (mins) => {
    setLoggedMins(Math.max(0, mins));
    playSound('click', soundEnabled);
  };

  const hours = Math.floor(loggedMins / 60);
  const minutes = loggedMins % 60;

  const targetHours = Math.floor(targetMinutes / 60);
  const targetRestMins = targetMinutes % 60;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveDuration(habit.id, dateKey, loggedMins);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 animate-slide-up text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-xl shrink-0">
              {habit.icon || '⏱️'}
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white truncate">
                {habit.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>
                  Target: <strong>{targetHours > 0 ? `${targetHours}h ` : ''}{targetRestMins > 0 ? `${targetRestMins}m` : ''}</strong> ({targetMinutes} mins)
                </span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Time Display & Live Progress Bar */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 text-center space-y-3">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Time Completed Today</span>
            <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
              {hours}h {minutes}m
              <span className="text-sm font-semibold text-slate-400 font-sans ml-2">
                / {targetHours}h {targetRestMins > 0 ? `${targetRestMins}m` : ''}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-500 dark:text-slate-400">Progress:</span>
              <span className={percentage >= 100 ? 'text-emerald-500' : 'text-indigo-500'}>
                {percentage}% Completed {percentage >= 100 ? '🎉' : ''}
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  percentage >= 100
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-sm shadow-emerald-500/50'
                    : 'bg-gradient-to-r from-indigo-500 to-violet-500'
                }`}
                style={{ width: `${Math.min(100, percentage)}%` }}
              />
            </div>
          </div>

          {/* Proportional Points Live Card */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Proportional XP:</span>
            </span>
            <span className="font-extrabold text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/20">
              +{earnedXp} XP <span className="text-[10px] text-slate-400 font-normal">/ {maxPossibleXp} Max</span>
            </span>
          </div>
        </div>

        {/* Quick Add Presets */}
        <div className="space-y-2">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Quick Time Adjustments:
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: '+15m', mins: 15 },
              { label: '+30m', mins: 30 },
              { label: '+45m', mins: 45 },
              { label: '+1 Hour', mins: 60 }
            ].map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => handleAddMinutes(p.mins)}
                className="py-2 px-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-700 dark:text-slate-200 transition-all active:scale-95 border border-slate-200/60 dark:border-slate-700"
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleSetExact(targetMinutes)}
              className="py-2 px-3 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/30 transition-all flex items-center justify-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Full Goal ({targetHours > 0 ? `${targetHours}h` : ''}{targetRestMins > 0 ? `${targetRestMins}m` : ''})</span>
            </button>
            <button
              type="button"
              onClick={() => handleSetExact(0)}
              className="py-2 px-3 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 border border-slate-200/60 dark:border-slate-700 transition-all flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to 0m</span>
            </button>
          </div>
        </div>

        {/* Live Timer Shortcut */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onLaunchTimer) onLaunchTimer(habit.id);
            }}
            className="text-xs font-bold text-indigo-500 hover:text-indigo-400 flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Open Focus Timer</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Save & Claim Points</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
