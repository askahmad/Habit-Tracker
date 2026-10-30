import React, { useState } from 'react';
import { X, Plus, Check, Sparkles, Search } from 'lucide-react';
import { HABIT_TEMPLATES_CATALOG, COLOR_THEMES } from '../../data/defaultData';
import { playSound } from '../../utils/audio';

export default function TemplatesModal({ isOpen, currentHabits = [], onClose, onAddTemplate, soundEnabled = true }) {
  const [selectedCat, setSelectedCat] = useState('All');
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const categories = ['All', 'Health', 'Fitness', 'Mind', 'Work'];

  const filtered = HABIT_TEMPLATES_CATALOG.filter((t) => {
    const matchesCat = selectedCat === 'All' || t.category === selectedCat;
    const matchesSearch =
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.desc.toLowerCase().includes(query.toLowerCase()) ||
      t.category.toLowerCase().includes(query.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Habit Templates Library</h3>
              <p className="text-xs text-slate-400">Scientifically proven routines to adopt with 1-click</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedCat === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search routines..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Templates Grid (Scrollable) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto pr-1 flex-1">
          {filtered.map((t) => {
            const alreadyAdded = currentHabits.some((h) => h.name.toLowerCase() === t.name.toLowerCase());
            const theme = COLOR_THEMES[t.color] || COLOR_THEMES.indigo;

            return (
              <div
                key={t.id}
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850 hover:border-indigo-500/50 transition-all flex flex-col justify-between gap-2 shadow-sm"
              >
                <div className="flex items-start gap-2.5">
                  <span className="text-2xl mt-0.5 shrink-0">{t.icon}</span>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                      {t.name}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${theme.lightBg} ${theme.text}`}>
                        {t.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{t.routine}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{t.targetPerWeek}x/wk</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {t.desc}
                    </p>
                    {t.stacking && (
                      <span className="text-[10px] text-indigo-500/90 block mt-1 italic truncate">
                        ⚡ {t.stacking}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400">+25 XP on log</span>
                  {alreadyAdded ? (
                    <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Added</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        onAddTemplate(t);
                        playSound('complete', soundEnabled);
                      }}
                      className="px-3 py-1 rounded-xl text-[11px] font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm flex items-center gap-1 active:scale-95 transition-all"
                    >
                      <Plus className="w-3 h-3 stroke-[2.5]" />
                      <span>Add Habit</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

