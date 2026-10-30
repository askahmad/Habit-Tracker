import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Timer, Sparkles, CheckCircle2 } from 'lucide-react';
import { playSound, triggerConfetti } from '../../utils/audio';

export default function TimerModal({ isOpen, habits = [], selectedHabitId = null, onClose, onFinishTimer, soundEnabled = true }) {
  const [targetHabitId, setTargetHabitId] = useState(selectedHabitId || (habits[0]?.id || ''));
  const [durationMins, setDurationMins] = useState(25);
  const [remainingSecs, setRemainingSecs] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (selectedHabitId) setTargetHabitId(selectedHabitId);
  }, [selectedHabitId]);

  useEffect(() => {
    setRemainingSecs(durationMins * 60);
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [durationMins, isOpen]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setRemainingSecs((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  if (!isOpen) return null;

  const handleComplete = () => {
    playSound('gong', soundEnabled);
    triggerConfetti();
    if (onFinishTimer && targetHabitId) {
      onFinishTimer(targetHabitId, durationMins);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setRemainingSecs(durationMins * 60);
  };

  const minutes = Math.floor(remainingSecs / 60);
  const seconds = remainingSecs % 60;
  const totalSecs = durationMins * 60;
  const progressFraction = (totalSecs - remainingSecs) / totalSecs;
  // Circumference for r=88 is 2 * PI * 88 = 552.92
  const circumference = 552.92;
  const strokeDashoffset = circumference * (1 - progressFraction);

  const activeHabit = habits.find((h) => h.id === targetHabitId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-left">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Timer className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Habit Focus Sprint</h3>
              <p className="text-[11px] text-slate-400">Lock in with deep attention</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Habit Select */}
        <div className="text-left space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Attach to Habit:
          </label>
          <select
            value={targetHabitId}
            onChange={(e) => setTargetHabitId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
          >
            {habits.map((h) => (
              <option key={h.id} value={h.id}>
                {h.icon} {h.name}
              </option>
            ))}
          </select>
        </div>

        {/* Preset Durations */}
        <div className="flex items-center justify-center gap-2">
          {[15, 25, 45, 60].map((mins) => (
            <button
              key={mins}
              onClick={() => {
                setDurationMins(mins);
                playSound('click', soundEnabled);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                durationMins === mins
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {mins}m
            </button>
          ))}
        </div>

        {/* Circular SVG Timer */}
        <div className="relative w-52 h-52 mx-auto flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="88"
              className="text-slate-100 dark:text-slate-800"
              strokeWidth="10"
              stroke="currentColor"
              fill="none"
            />
            <circle
              cx="100"
              cy="100"
              r="88"
              className="text-indigo-600 transition-all duration-300"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-4xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 mt-1">
              {isRunning ? 'Focusing...' : remainingSecs === 0 ? 'Completed 🎉' : 'Ready'}
            </span>
            {activeHabit && (
              <span className="text-[11px] text-slate-400 mt-1 max-w-[140px] truncate">
                {activeHabit.icon} {activeHabit.name}
              </span>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={handleReset}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            title="Reset"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              setIsRunning(!isRunning);
              playSound('click', soundEnabled);
            }}
            className={`px-8 py-3.5 rounded-2xl text-white font-extrabold text-sm shadow-lg flex items-center gap-2 transition-all active:scale-95 ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-white" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-white" />
                <span>Start Sprint</span>
              </>
            )}
          </button>
        </div>

        <p className="text-[11px] text-slate-400">
          💡 Finishing this timer awards <strong className="text-amber-500">+35 XP</strong> and marks the habit complete for today!
        </p>
      </div>
    </div>
  );
}

