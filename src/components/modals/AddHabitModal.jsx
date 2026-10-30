import React, { useState } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';
import { COLOR_THEMES } from '../../data/defaultData';

const COMMON_ICONS = ['💧', '🏋️', '💻', '📚', '🧘', '🚶', '💤', '🥗', '✍️', '☀️', '💊', '🎯', '🏃', '🥑', '⚡', '🕊️'];

export default function AddHabitModal({ isOpen, onClose, onAddHabit }) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('⚡');
  const [category, setCategory] = useState('Health');
  const [routine, setRoutine] = useState('Morning');
  const [stacking, setStacking] = useState('');
  const [color, setColor] = useState('indigo');
  const [targetPerWeek, setTargetPerWeek] = useState(7);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newHabit = {
      id: 'h-' + Date.now(),
      name: name.trim(),
      icon,
      category,
      routine,
      stacking: stacking.trim(),
      color,
      targetPerWeek: Number(targetPerWeek),
      logs: {},
      notes: {}
    };

    onAddHabit(newHabit);
    setName('');
    setStacking('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Create New Habit</h3>
              <p className="text-xs text-slate-400">Design your routine with habit stacking cues</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Habit Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. 15m Morning Sun & Breathwork"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
            />
          </div>

          {/* Quick Icon Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Choose Icon ({icon})
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {COMMON_ICONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                    icon === emoji
                      ? 'bg-indigo-600 scale-110 shadow-md ring-2 ring-indigo-400'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Routine & Category Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Routine
              </label>
              <select
                value={routine}
                onChange={(e) => setRoutine(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Morning">🌅 Morning</option>
                <option value="Afternoon">☀️ Afternoon</option>
                <option value="Evening">🌙 Evening</option>
                <option value="Anytime">✨ Anytime</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Health">💧 Health</option>
                <option value="Mind">🧘 Mind</option>
                <option value="Work">💻 Work</option>
                <option value="Fitness">🏋️ Fitness</option>
              </select>
            </div>
          </div>

          {/* Habit Stacking Cue */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Habit Stacking Cue (Atomic Habits trigger)
            </label>
            <input
              type="text"
              value={stacking}
              onChange={(e) => setStacking(e.target.value)}
              placeholder="e.g. 'Right after pouring my morning coffee...'"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
            />
          </div>

          {/* Color theme & Target Days */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Color Tag
              </label>
              <div className="flex items-center gap-2 pt-1">
                {Object.keys(COLOR_THEMES).map((cKey) => (
                  <button
                    key={cKey}
                    type="button"
                    onClick={() => setColor(cKey)}
                    className={`w-6 h-6 rounded-full ${COLOR_THEMES[cKey].bg} transition-all ${
                      color === cKey ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : 'opacity-70'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Target Days ({targetPerWeek}x / wk)
              </label>
              <input
                type="range"
                min="1"
                max="7"
                value={targetPerWeek}
                onChange={(e) => setTargetPerWeek(e.target.value)}
                className="w-full accent-indigo-600 mt-2"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Add to Routine (+25 XP)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

