import React, { useState, useEffect } from 'react';
import {
  Flame, Plus, Target, LayoutGrid, Timer, Headphones, Share2, 
  Sparkles, Award, Volume2, VolumeX, Sun, Moon, LogOut, ChevronLeft, 
  ChevronRight, Search, Check, CheckCheck, Mic, ChevronDown,
  FileText, Edit3
} from 'lucide-react';
import { 
  COLOR_THEMES, STARTER_HABITS, MOTIVATION_QUOTES,
  getTodayKey, toDateKey, calculatePlayerLevel 
} from '../../data/defaultData';
import { playSound, triggerConfetti, toggleAmbientNoise } from '../../utils/audio';

import AddHabitModal from '../modals/AddHabitModal';
import EditHabitModal from '../modals/EditHabitModal';
import TimerModal from '../modals/TimerModal';
import TemplatesModal from '../modals/TemplatesModal';
import BadgesModal from '../modals/BadgesModal';
import NoteModal from '../modals/NoteModal';
import ShareModal from '../modals/ShareModal';

export default function Dashboard({ user, onSignOut, isDarkMode, toggleTheme, soundEnabled, toggleSound }) {
  // Habit State
  const [habits, setHabits] = useState(() => {
    try {
      const saved = localStorage.getItem(`habitpulse_habits_${user.email}`);
      return saved ? JSON.parse(saved) : STARTER_HABITS;
    } catch {
      return STARTER_HABITS;
    }
  });

  const [totalXp, setTotalXp] = useState(() => {
    try {
      const saved = localStorage.getItem(`habitpulse_xp_${user.email}`);
      return saved ? Number(saved) : 100;
    } catch {
      return 100;
    }
  });

  // UI Navigation states
  const [viewMode, setViewMode] = useState('matrix'); // 'matrix' | 'focus'
  const [routineFilter, setRoutineFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [weekOffset, setWeekOffset] = useState(0); // 0 = current week, -1 = last week, etc.

  // Ambient Audio
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);

  // User Dropdown menu
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Toast / Floating XP notification
  const [toastMessage, setToastMessage] = useState(null);

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [timerHabitId, setTimerHabitId] = useState(null);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isBadgesOpen, setIsBadgesOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [noteModalData, setNoteModalData] = useState({ isOpen: false, habit: null, dateKey: null });

  // Save to localStorage when state updates
  useEffect(() => {
    localStorage.setItem(`habitpulse_habits_${user.email}`, JSON.stringify(habits));
  }, [habits, user.email]);

  useEffect(() => {
    localStorage.setItem(`habitpulse_xp_${user.email}`, String(totalXp));
  }, [totalXp, user.email]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const addXp = (amount, reason = '') => {
    setTotalXp((prev) => prev + amount);
    showToast(`⭐ +${amount} XP ${reason ? `(${reason})` : ''}!`);
  };

  // Helper: compute current week days
  const getWeekDays = () => {
    const today = new Date();
    const currentDayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday...
    const distanceToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + distanceToMonday + weekOffset * 7);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const weekDays = getWeekDays();
  const todayKey = getTodayKey();
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Toggle habit on a specific date
  const handleToggleHabitDay = (habitId, dateKey) => {
    const isToday = dateKey === todayKey;
    const isPast = dateKey < todayKey;

    if (isPast) {
      showToast('⚠️ Past days cannot be backfilled. Keep your streak authentic!');
      return;
    }
    if (dateKey > todayKey) {
      showToast('⏳ Future date: you can only log habits for today!');
      return;
    }

    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const currentLog = h.logs ? h.logs[dateKey] : null;
        const updatedLogs = { ...(h.logs || {}) };

        if (!currentLog) {
          // Check-in done
          updatedLogs[dateKey] = true;
          playSound('complete', soundEnabled);
          addXp(20, 'Daily Check-in');
        } else if (currentLog === true) {
          // Freeze shield mode
          updatedLogs[dateKey] = 'freeze';
          playSound('click', soundEnabled);
          showToast('❄️ Streak Freeze Shield active! Preserving streak.');
        } else {
          // Clear
          delete updatedLogs[dateKey];
          playSound('click', soundEnabled);
        }

        return { ...h, logs: updatedLogs };
      })
    );
  };

  // Calculate habit streak
  const calculateStreak = (habit) => {
    if (!habit.logs) return 0;
    let streak = 0;
    let checkDate = new Date();

    while (true) {
      const key = toDateKey(checkDate);
      const val = habit.logs[key];
      if (val === true || val === 'freeze') {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        // If today not yet done, check yesterday
        if (key === todayKey && streak === 0) {
          checkDate.setDate(checkDate.getDate() - 1);
          const yKey = toDateKey(checkDate);
          if (habit.logs[yKey] === true || habit.logs[yKey] === 'freeze') {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
            continue;
          }
        }
        break;
      }
    }
    return streak;
  };

  // Filtered Habits
  const filteredHabits = habits.filter((h) => {
    const matchesRoutine = routineFilter === 'All' || h.routine === routineFilter;
    const matchesCategory = categoryFilter === 'All' || h.category === categoryFilter;
    const matchesSearch =
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (h.stacking && h.stacking.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRoutine && matchesCategory && matchesSearch;
  });

  // KPI Calculations
  let totalWeekPossible = habits.length * 7;
  let totalWeekCompleted = 0;
  let topStreak = 0;
  let todayDoneCount = 0;

  habits.forEach((h) => {
    const s = calculateStreak(h);
    if (s > topStreak) topStreak = s;

    if (h.logs) {
      if (h.logs[todayKey] === true || h.logs[todayKey] === 'freeze') todayDoneCount++;
      weekDays.forEach((d) => {
        const k = toDateKey(d);
        if (h.logs[k] === true || h.logs[k] === 'freeze') totalWeekCompleted++;
      });
    }
  });

  const weeklyRate = totalWeekPossible > 0 ? Math.round((totalWeekCompleted / totalWeekPossible) * 100) : 0;
  const rpg = calculatePlayerLevel(totalXp);

  // Complete All Today action
  const handleCompleteAllToday = () => {
    let newlyDone = 0;
    setHabits((prev) =>
      prev.map((h) => {
        const updatedLogs = { ...(h.logs || {}) };
        if (!updatedLogs[todayKey]) {
          updatedLogs[todayKey] = true;
          newlyDone++;
        }
        return { ...h, logs: updatedLogs };
      })
    );
    if (newlyDone > 0) {
      playSound('victory', soundEnabled);
      triggerConfetti();
      addXp(newlyDone * 20, 'Completed All Today');
      showToast(`🎉 Completed all ${newlyDone} habits for today!`);
    } else {
      showToast('All habits already marked complete for today!');
    }
  };

  // Ambient sound toggle
  const handleToggleAmbient = () => {
    const newState = !isAmbientPlaying;
    const success = toggleAmbientNoise(newState);
    setIsAmbientPlaying(success);
    if (success) {
      showToast('🎧 Ambient Rain & 432Hz Zen audio active');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 pb-20">
      {/* ================= STICKY HEADER ================= */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-white/85 dark:bg-slate-900/85 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Logo & RPG Level */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-amber-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 text-white">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight">HabitPulse</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  Pro
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-black px-1.5 py-0.2 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400">
                  Lv. {rpg.level}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
                  {rpg.rank}
                </span>
                {/* XP Progress Mini-bar */}
                <div className="w-16 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden" title={`${rpg.currentLevelXp}/100 XP to next level`}>
                  <div
                    className="bg-gradient-to-r from-amber-500 to-indigo-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${rpg.currentLevelXp}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('matrix')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  viewMode === 'matrix'
                    ? 'bg-white dark:bg-slate-900 shadow-sm text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="7-Day Matrix View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Matrix</span>
              </button>
              <button
                onClick={() => setViewMode('focus')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  viewMode === 'focus'
                    ? 'bg-white dark:bg-slate-900 shadow-sm text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Today Focus Mode"
              >
                <Target className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Focus</span>
              </button>
            </div>

            {/* Pomodoro Timer button */}
            <button
              onClick={() => {
                setTimerHabitId(habits[0]?.id || null);
                setIsTimerOpen(true);
              }}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all text-slate-700 dark:text-slate-200"
              title="Focus Timer"
            >
              <Timer className="w-4 h-4 text-emerald-500" />
              <span className="hidden lg:inline">Timer</span>
            </button>

            {/* Ambient Focus Audio */}
            <button
              onClick={handleToggleAmbient}
              className={`p-2 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                isAmbientPlaying
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
              }`}
              title="Ambient Focus Sound (Rain & Zen)"
            >
              <Headphones className="w-4 h-4" />
              <span className="hidden xl:inline">Ambient</span>
            </button>

            {/* Share Card Modal */}
            <button
              onClick={() => setIsShareOpen(true)}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-rose-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center gap-1.5 hover:scale-105 transition-all"
              title="Share Streak Card"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Share</span>
            </button>

            {/* Templates */}
            <button
              onClick={() => setIsTemplatesOpen(true)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-amber-500 transition-all"
              title="Habit Templates"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            {/* Achievements Badges */}
            <button
              onClick={() => setIsBadgesOpen(true)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-indigo-500 transition-all"
              title="Milestone Achievements"
            >
              <Award className="w-4 h-4" />
            </button>

            {/* Sound FX Toggle */}
            <button
              onClick={toggleSound}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all"
              title="Toggle Audio Effects"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Dark / Light Mode */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all"
              >
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                  alt="Avatar"
                  className="w-7 h-7 rounded-lg object-cover"
                />
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 pr-0.5" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-slide-up space-y-1">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="font-bold text-xs text-slate-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                      Verified Account ✓
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onSignOut();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out & Lock</span>
                  </button>
                </div>
              )}
            </div>

            {/* New Habit CTA */}
            <button
              onClick={() => setIsAddOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">New Habit</span>
            </button>
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 p-3 px-4 rounded-2xl bg-slate-900/95 text-white border border-slate-700 shadow-2xl flex items-center gap-2 text-xs font-bold animate-slide-up backdrop-blur-md">
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Motivational Banner */}
        <div className="bg-gradient-to-r from-indigo-600/10 via-violet-600/10 to-rose-600/10 border border-indigo-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                "{MOTIVATION_QUOTES[0]}"
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Keep the momentum unbroken today.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              onClick={() => showToast('🎙️ Voice Log: Speak "Water done" to mark habits!')}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Mic className="w-3.5 h-3.5 text-indigo-500" />
              <span>Voice Log</span>
            </button>
            <button
              onClick={handleCompleteAllToday}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Complete All</span>
            </button>
          </div>
        </div>

        {/* KPI Cards Section */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Weekly Rate */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Weekly Rate</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black">{weeklyRate}%</span>
              <span className="text-xs text-slate-400">check-ins</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${weeklyRate}%` }}
              />
            </div>
          </div>

          {/* Card 2: Top Streak */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Top Streak</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-amber-500">{topStreak}</span>
              <span className="text-xs text-amber-500/80 font-bold">days active</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 truncate">Protect unbreakable momentum</p>
          </div>

          {/* Card 3: Today's Goals */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Today's Goals</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-indigo-500">
                {todayDoneCount}/{habits.length}
              </span>
              <span className="text-xs text-slate-400">completed</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: habits.length > 0 ? `${(todayDoneCount / habits.length) * 100}%` : '0%' }}
              />
            </div>
          </div>

          {/* Card 4: Player Level & XP */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">RPG Level</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-violet-500">Lv. {rpg.level}</span>
              <span className="text-xs text-slate-400">{totalXp} XP</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 truncate">{rpg.rank}</p>
          </div>
        </section>

        {/* ================= VIEW 1: 7-DAY MATRIX VIEW ================= */}
        {viewMode === 'matrix' && (
          <div className="space-y-4">
            {/* Filters & Week Navigation Bar */}
            <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Routine filters */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mr-1 hidden sm:inline">
                    Routine:
                  </span>
                  {['All', 'Morning', 'Afternoon', 'Evening'].map((r) => (
                    <button
                      key={r}
                      onClick={() => setRoutineFilter(r)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        routineFilter === r
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {r === 'All' ? 'All Routines' : r}
                    </button>
                  ))}
                </div>

                {/* Week Navigator */}
                <div className="flex items-center justify-between md:justify-end gap-2 border-t md:border-t-0 pt-2 md:pt-0 border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setWeekOffset(weekOffset - 1)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                    title="Previous Week"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="text-center min-w-[150px]">
                    <span className="text-xs sm:text-sm font-bold tracking-tight">
                      {weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} –{' '}
                      {weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <button
                    onClick={() => setWeekOffset(weekOffset + 1)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                    title="Next Week"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  {weekOffset !== 0 && (
                    <button
                      onClick={() => setWeekOffset(0)}
                      className="px-2.5 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 text-xs font-bold transition-all"
                    >
                      Today
                    </button>
                  )}
                </div>
              </div>

              {/* Secondary Category filters & Search */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mr-1 hidden sm:inline">
                    Category:
                  </span>
                  {['All', 'Health', 'Mind', 'Work', 'Fitness'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
                        categoryFilter === cat
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search habits..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </section>

            {/* Matrix Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-200/80 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 pl-6 pr-3 w-[260px]">Habit & Stacking Cue</th>
                    {weekDays.map((d, idx) => {
                      const key = toDateKey(d);
                      const isToday = key === todayKey;
                      const isPast = key < todayKey;

                      return (
                        <th key={key} className="py-3 px-2 text-center">
                          <div
                            className={`inline-flex flex-col items-center px-2.5 py-1 rounded-xl ${
                              isToday
                                ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400/40'
                                : isPast
                                ? 'text-slate-400 dark:text-slate-500 opacity-75'
                                : 'text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            <span className="text-[10px] font-semibold uppercase">{dayNames[idx]}</span>
                            <span className="text-xs font-extrabold mt-0.5">{d.getDate()}</span>
                          </div>
                        </th>
                      );
                    })}
                    <th className="py-3.5 px-3 text-center">Streak</th>
                    <th className="py-3.5 pl-2 pr-6 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
                  {filteredHabits.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-xs text-slate-400">
                        No habits found. Click <strong>+ New Habit</strong> to create one!
                      </td>
                    </tr>
                  ) : (
                    filteredHabits.map((habit) => {
                      const streak = calculateStreak(habit);
                      const theme = COLOR_THEMES[habit.color] || COLOR_THEMES.indigo;

                      return (
                        <tr key={habit.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors">
                          {/* Habit Info */}
                          <td className="py-3.5 pl-6 pr-3">
                            <div className="flex items-center gap-2.5">
                              <span className="text-xl shrink-0">{habit.icon}</span>
                              <div className="min-w-0">
                                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                                  {habit.name}
                                </h4>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${theme.lightBg} ${theme.text}`}>
                                    {habit.category}
                                  </span>
                                  <span className="text-[10px] text-slate-400">{habit.routine}</span>
                                </div>
                                {habit.stacking && (
                                  <p className="text-[10px] text-indigo-500/90 italic truncate mt-0.5">
                                    ⚡ {habit.stacking}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* 7-Day Matrix Interactive Buttons */}
                          {weekDays.map((d) => {
                            const key = toDateKey(d);
                            const isToday = key === todayKey;
                            const isPast = key < todayKey;
                            const isDone = habit.logs && habit.logs[key] === true;
                            const isFrozen = habit.logs && habit.logs[key] === 'freeze';
                            const hasNote = habit.notes && habit.notes[key];

                            let buttonStyle = 'bg-slate-100 dark:bg-slate-800 text-slate-400';
                            let icon = <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />;

                            if (isDone) {
                              buttonStyle = `${theme.bg} text-white shadow-sm`;
                              icon = <Check className="w-3.5 h-3.5 stroke-[3]" />;
                            } else if (isFrozen) {
                              buttonStyle = 'bg-cyan-500/20 border-2 border-cyan-400 text-cyan-400';
                              icon = <span className="text-xs">❄️</span>;
                            } else if (isToday) {
                              buttonStyle = 'bg-slate-100 dark:bg-slate-800 border-2 border-indigo-500/70 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-indigo-500 animate-pulse';
                              icon = <span className="w-2 h-2 rounded-full bg-indigo-500" />;
                            } else if (isPast) {
                              buttonStyle = 'bg-slate-100/50 dark:bg-slate-800/30 text-slate-300 dark:text-slate-600 opacity-60';
                              icon = <span className="text-[10px] font-bold">✕</span>;
                            }

                            return (
                              <td key={key} className="py-2.5 px-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleToggleHabitDay(habit.id, key)}
                                  onContextMenu={(e) => {
                                    e.preventDefault();
                                    setNoteModalData({ isOpen: true, habit, dateKey: key });
                                  }}
                                  title={`${key}: Click to toggle, right-click for reflection note`}
                                  className={`w-8 h-8 rounded-xl mx-auto flex items-center justify-center transition-all relative ${buttonStyle}`}
                                >
                                  {icon}
                                  {hasNote && (
                                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-violet-400 ring-1 ring-white dark:ring-slate-900" />
                                  )}
                                </button>
                              </td>
                            );
                          })}

                          {/* Streak */}
                          <td className="py-3 px-3 text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black ${
                                streak > 0
                                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                              }`}
                            >
                              <Flame className={`w-3.5 h-3.5 ${streak > 0 ? 'fill-amber-500 text-amber-500' : ''}`} />
                              <span>{streak}d</span>
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3 pl-2 pr-6 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => {
                                  setTimerHabitId(habit.id);
                                  setIsTimerOpen(true);
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-500 transition-colors"
                                title="Sprint Timer"
                              >
                                <Timer className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setNoteModalData({ isOpen: true, habit, dateKey: todayKey })}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-violet-500 transition-colors"
                                title="Add Reflection Note"
                              >
                                <FileText className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingHabit(habit);
                                  setIsEditOpen(true);
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                title="Edit Habit"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= VIEW 2: TODAY FOCUS MODE ================= */}
        {viewMode === 'focus' && (
          <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Today's Focus Checklist
                </span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {habits.length - todayDoneCount === 0
                    ? '🎉 All habits completed today! Outstanding work.'
                    : `${habits.length - todayDoneCount} habit(s) left to complete today`}
                </p>
              </div>

              {/* Focus Ring */}
              <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100 dark:text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-indigo-600 transition-all duration-500"
                    strokeWidth="3.5"
                    strokeDasharray={`${habits.length > 0 ? Math.round((todayDoneCount / habits.length) * 100) : 0}, 100`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-sm font-black">
                  {habits.length > 0 ? Math.round((todayDoneCount / habits.length) * 100) : 0}%
                </span>
              </div>
            </div>

            {/* Checklist items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {habits.map((h) => {
                const isDone = h.logs && h.logs[todayKey] === true;
                const isFrozen = h.logs && h.logs[todayKey] === 'freeze';
                const streak = calculateStreak(h);
                const theme = COLOR_THEMES[h.color] || COLOR_THEMES.indigo;

                return (
                  <div
                    key={h.id}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isDone
                        ? 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200/50 dark:border-slate-800 opacity-85'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-400/50'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <button
                        onClick={() => handleToggleHabitDay(h.id, todayKey)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                          isDone
                            ? `${theme.bg} text-white shadow-md`
                            : isFrozen
                            ? 'bg-cyan-500/20 border-2 border-cyan-400 text-cyan-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:border-slate-300 border'
                        }`}
                      >
                        {isFrozen ? '❄️' : <Check className={`w-5 h-5 stroke-[3] ${isDone ? 'opacity-100' : 'opacity-0'}`} />}
                      </button>
                      <div className="min-w-0">
                        <p className={`font-bold text-sm truncate ${isDone ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                          {h.icon} {h.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                          <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold">
                            {h.routine}
                          </span>
                          <span>🔥 {streak}d streak</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setTimerHabitId(h.id);
                        setIsTimerOpen(true);
                      }}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500/10 hover:text-emerald-500 text-slate-500 transition-all"
                      title="Launch Sprint Timer"
                    >
                      <Timer className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* ================= MODALS ================= */}
      <AddHabitModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAddHabit={(newHabit) => {
          setHabits((prev) => [...prev, newHabit]);
          playSound('complete', soundEnabled);
          addXp(25, 'Created New Habit');
        }}
      />

      <EditHabitModal
        isOpen={isEditOpen}
        habit={editingHabit}
        onClose={() => {
          setIsEditOpen(false);
          setEditingHabit(null);
        }}
        onUpdateHabit={(updated) => {
          setHabits((prev) => prev.map((h) => (h.id === updated.id ? updated : h)));
          showToast('Updated habit successfully');
        }}
        onDeleteHabit={(deletedId) => {
          setHabits((prev) => prev.filter((h) => h.id !== deletedId));
          showToast('Habit deleted');
        }}
      />

      <TimerModal
        isOpen={isTimerOpen}
        habits={habits}
        selectedHabitId={timerHabitId}
        soundEnabled={soundEnabled}
        onClose={() => setIsTimerOpen(false)}
        onFinishTimer={(habitId, mins) => {
          setHabits((prev) =>
            prev.map((h) => {
              if (h.id === habitId) {
                const logs = { ...(h.logs || {}) };
                logs[todayKey] = true;
                return { ...h, logs };
              }
              return h;
            })
          );
          addXp(35, `Completed ${mins}m focus sprint`);
        }}
      />

      <TemplatesModal
        isOpen={isTemplatesOpen}
        currentHabits={habits}
        soundEnabled={soundEnabled}
        onClose={() => setIsTemplatesOpen(false)}
        onAddTemplate={(tpl) => {
          const newHabit = {
            id: 'h-' + Date.now(),
            name: tpl.name,
            icon: tpl.icon,
            category: tpl.category,
            routine: tpl.routine,
            stacking: tpl.stacking || '',
            color: tpl.color,
            targetPerWeek: tpl.targetPerWeek,
            logs: {},
            notes: {}
          };
          setHabits((prev) => [...prev, newHabit]);
          addXp(25, 'Added Habit from Template');
        }}
      />

      <BadgesModal
        isOpen={isBadgesOpen}
        habits={habits}
        totalXp={totalXp}
        onClose={() => setIsBadgesOpen(false)}
      />

      <NoteModal
        isOpen={noteModalData.isOpen}
        habit={noteModalData.habit}
        dateKey={noteModalData.dateKey}
        onClose={() => setNoteModalData({ isOpen: false, habit: null, dateKey: null })}
        onSaveNote={(habitId, dateKey, text) => {
          setHabits((prev) =>
            prev.map((h) => {
              if (h.id === habitId) {
                const notes = { ...(h.notes || {}) };
                if (text) notes[dateKey] = text;
                else delete notes[dateKey];
                return { ...h, notes };
              }
              return h;
            })
          );
          showToast('Reflection note saved');
        }}
      />

      <ShareModal
        isOpen={isShareOpen}
        user={user}
        habits={habits}
        totalXp={totalXp}
        onClose={() => setIsShareOpen(false)}
      />
    </div>
  );
}

