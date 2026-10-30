export const COLOR_THEMES = {
  indigo: { bg: 'bg-indigo-600', lightBg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-500' },
  emerald: { bg: 'bg-emerald-600', lightBg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500' },
  rose: { bg: 'bg-rose-600', lightBg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-500' },
  amber: { bg: 'bg-amber-600', lightBg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500' },
  cyan: { bg: 'bg-cyan-600', lightBg: 'bg-cyan-50 dark:bg-cyan-950/40', text: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-500' },
  violet: { bg: 'bg-violet-600', lightBg: 'bg-violet-50 dark:bg-violet-950/40', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-500' },
};

export const HABIT_TEMPLATES_CATALOG = [
  // 🏋️ Fitness & Movement
  { id: 'tpl-workout', name: 'Strength & Gym Workout', icon: '🏋️', category: 'Fitness', routine: 'Afternoon', color: 'rose', targetPerWeek: 5, stacking: 'After closing laptop for the day', desc: '45m resistance training or bodyweight circuit' },
  { id: 'tpl-steps', name: '10,000 Daily Steps', icon: '🚶', category: 'Fitness', routine: 'Anytime', color: 'emerald', targetPerWeek: 7, stacking: 'Take stairs & walk during phone calls', desc: 'Consistent non-exercise activity thermogenesis' },
  { id: 'tpl-stretch', name: 'Morning Mobility & Stretching', icon: '🧘', category: 'Fitness', routine: 'Morning', color: 'violet', targetPerWeek: 7, stacking: 'Right after getting out of bed', desc: '10-15m spine, hip & shoulder mobility' },
  { id: 'tpl-cardio', name: '20-Min Cardio / Zone 2 Run', icon: '🏃', category: 'Fitness', routine: 'Morning', color: 'amber', targetPerWeek: 4, stacking: 'Put running shoes next to bed', desc: 'Heart health and aerobic stamina building' },

  // 💧 Health & Vitality
  { id: 'tpl-water', name: 'Drink 3L Hydration', icon: '💧', category: 'Health', routine: 'Morning', color: 'cyan', targetPerWeek: 7, stacking: 'Fill 1L bottle upon waking', desc: 'Optimal cellular hydration and mental clarity' },
  { id: 'tpl-sleep', name: '8 Hours Restful Sleep', icon: '💤', category: 'Health', routine: 'Evening', color: 'indigo', targetPerWeek: 7, stacking: 'In bed with lights off by 10:30 PM', desc: 'Crucial hormone recovery & neuro-protection' },
  { id: 'tpl-sunlight', name: '15m Morning Natural Sunlight', icon: '☀️', category: 'Health', routine: 'Morning', color: 'amber', targetPerWeek: 7, stacking: 'Step outside within 30m of waking', desc: 'Circadian rhythm reset & mood enhancement' },
  { id: 'tpl-vitamins', name: 'Take Daily Vitamins & Omega-3', icon: '💊', category: 'Health', routine: 'Morning', color: 'emerald', targetPerWeek: 7, stacking: 'Right after finishing breakfast', desc: 'Micronutrient support & immune defense' },

  // 🧘 Mindfulness & Calm
  { id: 'tpl-meditate', name: '10-Min Mindful Breath Meditation', icon: '🧘', category: 'Mind', routine: 'Morning', color: 'violet', targetPerWeek: 7, stacking: 'After morning glass of water', desc: 'Train attention, reduce stress and center mind' },
  { id: 'tpl-gratitude', name: 'Gratitude Journal (3 Things)', icon: '✍️', category: 'Mind', routine: 'Evening', color: 'amber', targetPerWeek: 7, stacking: 'After brushing teeth at night', desc: 'Rewire neural pathways for positivity' },
  { id: 'tpl-digital-sunset', name: 'Digital Sunset (No Screens 45m Bed)', icon: '🕊️', category: 'Mind', routine: 'Evening', color: 'violet', targetPerWeek: 7, stacking: 'At 10:00 PM phone alarm', desc: 'Eliminate blue light for deep sleep cycles' },
  { id: 'tpl-breathwork', name: 'Box Breathing / Reset Pause', icon: '🌬️', category: 'Mind', routine: 'Afternoon', color: 'cyan', targetPerWeek: 7, stacking: 'Before starting afternoon sprint', desc: '4-4-4-4 nervous system down-regulation' },

  // ⚡ Deep Work & Productivity
  { id: 'tpl-deepwork', name: '90-Min Focused Deep Work Sprint', icon: '💻', category: 'Work', routine: 'Morning', color: 'indigo', targetPerWeek: 5, stacking: 'Phone in another room at 9:00 AM', desc: 'Tackle the #1 hardest cognitive task first' },
  { id: 'tpl-priorities', name: 'Plan Top 3 MITs (Daily Priorities)', icon: '🎯', category: 'Work', routine: 'Morning', color: 'amber', targetPerWeek: 5, stacking: 'Before opening email or Slack', desc: 'Clarity on essential daily deliverables' },
  { id: 'tpl-inbox-zero', name: 'Zero Inbox & Task Triage', icon: '📥', category: 'Work', routine: 'Afternoon', color: 'cyan', targetPerWeek: 5, stacking: 'At 4:30 PM daily review', desc: 'Organize correspondence and clear backlog' },
  { id: 'tpl-pomodoro', name: 'Complete 4 Pomodoro Sprint Blocks', icon: '⏱️', category: 'Work', routine: 'Morning', color: 'emerald', targetPerWeek: 5, stacking: 'Start timer at top of every hour', desc: 'Laser focus with 25/5 rhythm' },

  // 📚 Learning & Growth
  { id: 'tpl-read', name: 'Read 20 Pages Non-Fiction Book', icon: '📚', category: 'Mind', routine: 'Evening', color: 'indigo', targetPerWeek: 7, stacking: 'After dinner sitting in reading chair', desc: 'Compound wisdom, 30+ books a year' },
  { id: 'tpl-code', name: 'Code / Learn Tech Skill 30m', icon: '👨‍💻', category: 'Work', routine: 'Anytime', color: 'violet', targetPerWeek: 5, stacking: 'Open IDE before opening YouTube', desc: 'Deliberate practice on real engineering' },
  { id: 'tpl-language', name: 'Daily Language Lesson / Vocab', icon: '🗣️', category: 'Mind', routine: 'Afternoon', color: 'emerald', targetPerWeek: 7, stacking: 'During afternoon tea break', desc: 'Fluency momentum with daily spaced repetition' },
  { id: 'tpl-reflection', name: 'Daily Wins & Lessons Log', icon: '📝', category: 'Mind', routine: 'Evening', color: 'rose', targetPerWeek: 7, stacking: 'Write 2 sentences before sleep', desc: 'Capture micro-victories and key insights' }
];

export const STARTER_HABITS = [
  {
    id: 'h-1',
    name: 'Morning Hydration (1L)',
    icon: '💧',
    category: 'Health',
    routine: 'Morning',
    stacking: 'Right after waking up',
    color: 'cyan',
    targetPerWeek: 7,
    logs: {},
    notes: {}
  },
  {
    id: 'h-2',
    name: '90-Min Focused Deep Work',
    icon: '💻',
    category: 'Work',
    routine: 'Morning',
    stacking: 'After morning coffee at desk',
    color: 'indigo',
    targetPerWeek: 5,
    logs: {},
    notes: {}
  },
  {
    id: 'h-3',
    name: '30-Min Workout or Walk',
    icon: '🏃',
    category: 'Fitness',
    routine: 'Afternoon',
    stacking: 'After closing laptop',
    color: 'rose',
    targetPerWeek: 5,
    logs: {},
    notes: {}
  },
  {
    id: 'h-4',
    name: 'Read 20 Pages of a Book',
    icon: '📚',
    category: 'Mind',
    routine: 'Evening',
    stacking: 'Before sleeping in bed',
    color: 'amber',
    targetPerWeek: 7,
    logs: {},
    notes: {}
  }
];

export const BADGES = [
  { id: 'first_checkin', name: 'First Ignition', icon: '⚡', desc: 'Complete your first habit check-in', target: 1 },
  { id: 'streak_3', name: 'Momentum Builder', icon: '🔥', desc: 'Maintain an active 3-day streak', target: 3 },
  { id: 'streak_7', name: 'Weekly Champion', icon: '🛡️', desc: 'Reach a solid 7-day streak', target: 7 },
  { id: 'streak_21', name: 'Neuro Habit Formed', icon: '🧠', desc: '21 consecutive days of discipline', target: 21 },
  { id: 'habits_5', name: 'Diverse Routine', icon: '🎯', desc: 'Track 5 or more distinct habits', target: 5 },
  { id: 'perfect_week', name: 'Flawless Week', icon: '👑', desc: 'Achieve 100% completion in a week', target: 100 }
];

export const MOTIVATION_QUOTES = [
  "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
  "You do not rise to the level of your goals. You fall to the level of your systems.",
  "Small daily improvements over time lead to stunning results.",
  "Discipline equals freedom.",
  "The secret of your future is hidden in your daily routine."
];

export function getTodayKey() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calculatePlayerLevel(xp = 0) {
  const level = Math.floor(xp / 100) + 1;
  const currentLevelXp = xp % 100;
  let rank = 'Novice Striver';
  if (level >= 10) rank = 'Titan of Mastery';
  else if (level >= 7) rank = 'Discipline Grandmaster';
  else if (level >= 5) rank = 'Momentum Paragon';
  else if (level >= 3) rank = 'Habit Virtuoso';
  else if (level >= 2) rank = 'Consistent Apprentice';

  return { level, currentLevelXp, rank, totalXp: xp };
}

