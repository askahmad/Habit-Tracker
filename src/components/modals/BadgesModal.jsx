import React from 'react';
import { X, Award, CheckCircle2, Lock } from 'lucide-react';
import { BADGES } from '../../data/defaultData';

export default function BadgesModal({ isOpen, habits = [], totalXp = 0, onClose }) {
  if (!isOpen) return null;

  // Compute unlocked status
  let totalLogs = 0;

  habits.forEach((h) => {
    if (h.logs) {
      const logsCount = Object.values(h.logs).filter((v) => v === true).length;
      totalLogs += logsCount;
    }
  });

  const isUnlocked = (badge) => {
    if (badge.id === 'first_checkin') return totalLogs >= 1;
    if (badge.id === 'habits_5') return habits.length >= 5;
    if (badge.id === 'streak_3') return totalLogs >= 3;
    if (badge.id === 'streak_7') return totalLogs >= 7;
    if (badge.id === 'streak_21') return totalLogs >= 21;
    if (badge.id === 'perfect_week') return totalLogs >= 14;
    return false;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Milestone Achievements</h3>
              <p className="text-xs text-slate-400">Unlock trophies by keeping unstoppable consistency</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {BADGES.map((b) => {
            const unlocked = isUnlocked(b);

            return (
              <div
                key={b.id}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-2 ${
                  unlocked
                    ? 'bg-amber-500/10 border-amber-500/30 text-slate-900 dark:text-white'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{b.icon}</span>
                  {unlocked ? (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-500 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>Locked</span>
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mt-1">
                    {b.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                    {b.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

