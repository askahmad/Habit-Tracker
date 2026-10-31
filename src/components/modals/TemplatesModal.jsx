import React, { useState } from 'react';
import { X, Plus, Check, Sparkles, Search, Zap, Layers } from 'lucide-react';
import { HABIT_TEMPLATES_CATALOG, COLOR_THEMES } from '../../data/defaultData';
import { playSound } from '../../utils/audio';

export default function TemplatesModal({ isOpen, currentHabits = [], onClose, onAddTemplate, soundEnabled = true }) {
  const [selectedCat, setSelectedCat] = useState('All');
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const categories = ['All', 'Health', 'Fitness', 'Mind', 'Work'];

  // Calculate counts per category
  const getCatCount = (cat) => {
    if (cat === 'All') return HABIT_TEMPLATES_CATALOG.length;
    return HABIT_TEMPLATES_CATALOG.filter((t) => t.category === cat).length;
  };

  const filtered = HABIT_TEMPLATES_CATALOG.filter((t) => {
    const matchesCat = selectedCat === 'All' || t.category === selectedCat;
    const matchesSearch =
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.desc.toLowerCase().includes(query.toLowerCase()) ||
      t.category.toLowerCase().includes(query.toLowerCase()) ||
      (t.stacking && t.stacking.toLowerCase().includes(query.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center shadow-inner shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight">
                  Habit Templates Library
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                  {HABIT_TEMPLATES_CATALOG.length} Proven Routines
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Scientifically engineered daily habits to adopt with 1-click
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const count = getCatCount(cat);
              const isSelected = selectedCat === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750 border border-transparent dark:border-slate-750'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected
                        ? 'bg-indigo-700/60 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by habit or keyword..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white placeholder-slate-400"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Templates Grid (Scrollable with crystal-clear contrast) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 overflow-y-auto pr-1 flex-1 py-1">
          {filtered.length === 0 ? (
            <div className="col-span-full py-12 text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <p className="font-bold text-sm text-slate-300">No habit routines found</p>
              <p className="text-xs text-slate-500">
                No templates matched "{query}". Try a different keyword or category.
              </p>
            </div>
          ) : (
            filtered.map((t) => {
              const alreadyAdded = currentHabits.some(
                (h) => h.name.toLowerCase() === t.name.toLowerCase()
              );
              const theme = COLOR_THEMES[t.color] || COLOR_THEMES.indigo;

              return (
                <div
                  key={t.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/80 hover:border-indigo-500/60 dark:hover:border-indigo-500/50 hover:shadow-xl dark:hover:shadow-indigo-500/5 transition-all flex flex-col justify-between gap-3 group relative"
                >
                  {/* Top content */}
                  <div>
                    <div className="flex items-start gap-3">
                      <div className="text-2xl sm:text-3xl p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shrink-0 group-hover:scale-105 transition-transform">
                        {t.icon}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight leading-snug">
                          {t.name}
                        </h4>

                        {/* Badges Bar */}
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span
                            className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${theme.lightBg} ${theme.text}`}
                          >
                            {t.category}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                            {t.routine}
                          </span>
                          <span className="text-slate-400 dark:text-slate-600">•</span>
                          <span className="text-[11px] text-indigo-500 dark:text-indigo-400 font-semibold">
                            {t.targetPerWeek}x / week
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Description - High Contrast */}
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal mt-2.5">
                      {t.desc}
                    </p>

                    {/* Atomic Habit Stacking Cue */}
                    {t.stacking && (
                      <div className="mt-2.5 px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-300 text-[11px] font-medium flex items-center gap-1.5">
                        <span className="text-amber-500 shrink-0 font-bold flex items-center gap-0.5">
                          <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>Stacking:</span>
                        </span>
                        <span className="truncate">{t.stacking}</span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 mt-1">
                    <span className="text-xs font-black text-amber-500 flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                      <span>⚡</span>
                      <span>+25 XP</span>
                    </span>

                    {alreadyAdded ? (
                      <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Already In Routine</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          onAddTemplate(t);
                          playSound('complete', soundEnabled);
                        }}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 flex items-center gap-1.5 active:scale-95 transition-all hover:scale-[1.02]"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Add Habit</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
