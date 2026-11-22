import React, { useState, useEffect } from 'react';
import { X, Clock, Play, Plus, Minus, RotateCcw, Check, Sparkles, CheckCircle2 } from 'lucide-react';
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
  const targetMinutes = habit?.targetMinutes || 60;
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

  const targetHours = Math.floor(targetMinutes / 60);
  const targetRestMins = targetMinutes % 60;
  const targetDisplay = `${targetHours > 0 ? `${targetHours}h ` : ''}${targetRestMins > 0 ? `${targetRestMins}m` : ''}`.trim() || `${targetMinutes}m`;

  const hours = Math.floor(loggedMins / 60);
  const minutes = loggedMins % 60;
  const currentDisplay = `${hours > 0 ? `${hours}h ` : ''}${minutes > 0 ? `${minutes}m` : '0m'}`.trim();

  // Smart partial preset options based on the habit's exact target duration
  const smartPresets = [
    {
      label: formatPresetLabel(Math.round(targetMinutes * 0.25)),
      mins: Math.max(5, Math.round(targetMinutes * 0.25)),
      xp: Math.round(0.25 * maxPossibleXp)
    },
    {
      label: formatPresetLabel(Math.round(targetMinutes * 0.5)),
      mins: Math.max(10, Math.round(targetMinutes * 0.5)),
      xp: Math.round(0.5 * maxPossibleXp)
    },
    {
      label: formatPresetLabel(Math.round(targetMinutes * 0.75)),
      mins: Math.max(15, Math.round(targetMinutes * 0.75)),
      xp: Math.round(0.75 * maxPossibleXp)
    }
  ];

  function formatPresetLabel(mins) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0 && m > 0) return `${h}h ${m}m`;
    if (h > 0) return `${h}h`;
    return `${m}m`;
  }

  const handleQuickAdd = (mins) => {
    setLoggedMins((prev) => Math.max(0, prev + mins));
    playSound('click', soundEnabled);
  };

  const handleSelectExact = (mins) => {
    setLoggedMins(mins);
    playSound('click', soundEnabled);
  };

  const handleInstantFullComplete = () => {
    playSound('victory', soundEnabled);
    onSaveDuration(habit.id, dateKey, targetMinutes);
    onClose();
  };

  const handleSave = (e) => {
    e?.preventDefault();
    onSaveDuration(habit.id, dateKey, loggedMins);
    onClose();
  };

  const handleResetToZero = () => {
    onSaveDuration(habit.id, dateKey, 0);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 animate-slide-up text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-2xl shrink-0">
              {habit.icon || '⏱️'}
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white truncate">
                {habit.name}
              </h3>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Target Goal: <strong>{targetDisplay}</strong> ({targetMinutes} mins)</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Question Banner */}
        <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/70 dark:border-indigo-800/60">
          <p className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
            ❓ Aap ne yeh task kitni der complete kiya?
          </p>
          <p className="text-[11px] text-indigo-700/80 dark:text-indigo-300/80 mt-0.5">
            Pura <strong>{targetDisplay}</strong> complete kiya hai ya is se kam? Time ke hisab se points (XP) milenge.
          </p>
        </div>

        {/* 1. Fast Full Completion Button */}
        <button
          type="button"
          onClick={handleInstantFullComplete}
          className="w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/25 flex items-center justify-between group transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-sm">Ji Haan, Pura {targetDisplay} Kiya!</h4>
              <p className="text-xs text-emerald-100 opacity-90">Full 100% Goal Complete • Claim Full Points</p>
            </div>
          </div>
          <span className="font-black text-sm bg-white/20 px-3 py-1 rounded-xl">
            +{maxPossibleXp} XP 🏆
          </span>
        </button>

        {/* 2. Partial Time Selection */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span>⏱️ Kam time kiya? (Partial Duration)</span>
            </span>
            <span className="text-xs font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
              +{earnedXp} XP ({percentage}%)
            </span>
          </div>

          {/* Quick preset chips based on target */}
          <div className="grid grid-cols-3 gap-2">
            {smartPresets.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => handleSelectExact(p.mins)}
                className={`p-2.5 rounded-xl text-center border transition-all ${
                  loggedMins === p.mins
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md ring-2 ring-indigo-400/50'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                }`}
              >
                <div className="text-xs font-black">{p.label}</div>
                <div className={`text-[10px] mt-0.5 ${loggedMins === p.mins ? 'text-indigo-200' : 'text-amber-500'}`}>
                  +{p.xp} XP
                </div>
              </button>
            ))}
          </div>

          {/* Time adjustment slider & manual minutes */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-400">Selected Time:</span>
              <span className="font-black font-mono text-sm text-slate-900 dark:text-white">
                {currentDisplay} <span className="text-slate-400 font-sans text-xs">/ {targetDisplay}</span>
              </span>
            </div>
            <input
              type="range"
              min="0"
              max={Math.max(targetMinutes, loggedMins)}
              step="5"
              value={loggedMins}
              onChange={(e) => setLoggedMins(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>

          {/* Micro +/- adjusters */}
          <div className="flex items-center justify-between gap-1.5 pt-1">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickAdd(-15)}
                className="px-2 py-1 rounded-lg text-xs font-bold bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-600 dark:text-slate-300"
              >
                -15m
              </button>
              <button
                type="button"
                onClick={() => handleQuickAdd(-5)}
                className="px-2 py-1 rounded-lg text-xs font-bold bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-600 dark:text-slate-300"
              >
                -5m
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickAdd(15)}
                className="px-2 py-1 rounded-lg text-xs font-bold bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-600 dark:text-slate-300"
              >
                +15m
              </button>
              <button
                type="button"
                onClick={() => handleQuickAdd(30)}
                className="px-2 py-1 rounded-lg text-xs font-bold bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-600 dark:text-slate-300"
              >
                +30m
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            {initialLogged > 0 ? (
              <button
                type="button"
                onClick={handleResetToZero}
                className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1"
                title="Mark this habit as not done and revert points"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Mark Incomplete (0 XP)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onLaunchTimer) onLaunchTimer(habit.id);
                }}
                className="text-xs font-bold text-indigo-500 hover:text-indigo-400 flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Focus Timer</span>
              </button>
            )}
          </div>

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
              <span>Save ({loggedMins > 0 ? `+${earnedXp} XP` : '0m'})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
