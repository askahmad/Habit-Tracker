export const COLOR_THEMES = {
  indigo: { bg: 'bg-indigo-600', lightBg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-500' },
  emerald: { bg: 'bg-emerald-600', lightBg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500' },
  rose: { bg: 'bg-rose-600', lightBg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-500' },
  amber: { bg: 'bg-amber-600', lightBg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500' },
  cyan: { bg: 'bg-cyan-600', lightBg: 'bg-cyan-50 dark:bg-cyan-950/40', text: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-500' },
  violet: { bg: 'bg-violet-600', lightBg: 'bg-violet-50 dark:bg-violet-950/40', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-500' },
};

export const HABIT_TEMPLATES_CATALOG = [
  // 💧 Health & Vitality (9 Templates)
  { id: 'tpl-water', name: 'Drink 3L Hydration', icon: '💧', category: 'Health', routine: 'Morning', color: 'cyan', targetPerWeek: 7, stacking: 'Fill 1L bottle upon waking', desc: 'Optimal cellular hydration, sustained energy and cognitive alertness.' },
  { id: 'tpl-sleep', name: '8 Hours Restful Sleep', icon: '💤', category: 'Health', routine: 'Evening', color: 'indigo', targetPerWeek: 7, stacking: 'In bed with lights off by 10:30 PM', desc: 'Crucial hormone recovery, immune defense & neuro-protection.' },
  { id: 'tpl-sunlight', name: '15m Morning Natural Sunlight', icon: '☀️', category: 'Health', routine: 'Morning', color: 'amber', targetPerWeek: 7, stacking: 'Step outside within 30m of waking', desc: 'Circadian rhythm synchronization and natural cortisol awakening spike.' },
  { id: 'tpl-vitamins', name: 'Take Daily Vitamins & Omega-3', icon: '💊', category: 'Health', routine: 'Morning', color: 'emerald', targetPerWeek: 7, stacking: 'Right after finishing breakfast', desc: 'Micronutrient support, joint integrity & cardiovascular protection.' },
  { id: 'tpl-cold-shower', name: 'Cold Shower / Thermal Reset', icon: '🚿', category: 'Health', routine: 'Morning', color: 'cyan', targetPerWeek: 5, stacking: 'Turn water cold for final 60 seconds of shower', desc: 'Massive dopamine baseline spike, norepinephrine release & resilience.' },
  { id: 'tpl-no-sugar', name: 'Zero Refined Sugar Day', icon: '🥗', category: 'Health', routine: 'Anytime', color: 'emerald', targetPerWeek: 6, stacking: 'Swap soda and sugary snacks with whole fruit', desc: 'Stabilize insulin sensitivity, eliminate brain fog & prevent energy crashes.' },
  { id: 'tpl-intermittent-fast', name: '16/8 Intermittent Fasting Window', icon: '⏳', category: 'Health', routine: 'Morning', color: 'violet', targetPerWeek: 5, stacking: 'Close eating window at 8:00 PM dinner', desc: 'Trigger cellular autophagy, lower systemic inflammation & enhance mental clarity.' },
  { id: 'tpl-eye-rest', name: '20-20-20 Digital Eye Rest', icon: '👁️', category: 'Health', routine: 'Afternoon', color: 'amber', targetPerWeek: 7, stacking: 'Look at 20ft distance every 20m of screen work', desc: 'Relieve digital eye fatigue, ciliary muscle strain & chronic tension headaches.' },
  { id: 'tpl-floss', name: 'Nightly Floss & Dental Care', icon: '🪥', category: 'Health', routine: 'Evening', color: 'cyan', targetPerWeek: 7, stacking: 'Right after brushing evening teeth', desc: 'Microbiome balance, gum longevity & arterial cardiovascular health.' },

  // 🏋️ Fitness & Movement (9 Templates)
  { id: 'tpl-workout', name: 'Strength & Gym Workout', icon: '🏋️', category: 'Fitness', routine: 'Afternoon', color: 'rose', targetPerWeek: 5, stacking: 'After closing laptop for the day', desc: '45m resistance training, progressive overload & hypertrophy building.' },
  { id: 'tpl-steps', name: '10,000 Daily Steps', icon: '🚶', category: 'Fitness', routine: 'Anytime', color: 'emerald', targetPerWeek: 7, stacking: 'Take stairs & walk during audio calls', desc: 'Consistent non-exercise activity thermogenesis & active metabolic burn.' },
  { id: 'tpl-stretch', name: 'Morning Mobility & Stretching', icon: '🧘', category: 'Fitness', routine: 'Morning', color: 'violet', targetPerWeek: 7, stacking: 'Right after getting out of bed', desc: '10-15m spine decompress, hip opener & full shoulder mobility flow.' },
  { id: 'tpl-cardio', name: '20-Min Cardio / Zone 2 Run', icon: '🏃', category: 'Fitness', routine: 'Morning', color: 'amber', targetPerWeek: 4, stacking: 'Put running shoes next to bed at night', desc: 'Mitochondrial density, VO2 max endurance & cardiovascular stamina.' },
  { id: 'tpl-pushups', name: '100 Push-ups Daily Sprint', icon: '💪', category: 'Fitness', routine: 'Anytime', color: 'rose', targetPerWeek: 6, stacking: 'Do 20 push-ups between deep work blocks', desc: 'Upper body pushing power, core stability and muscle tone maintenance.' },
  { id: 'tpl-core-plank', name: '5-Minute Core & Plank Circuit', icon: '🧱', category: 'Fitness', routine: 'Afternoon', color: 'amber', targetPerWeek: 5, stacking: 'Unroll yoga mat right before workout', desc: 'Spinal stabilization, abdominal endurance & injury-prevention armor.' },
  { id: 'tpl-evening-walk', name: 'Post-Dinner Walk (20m)', icon: '🌲', category: 'Fitness', routine: 'Evening', color: 'emerald', targetPerWeek: 7, stacking: 'Step out the front door immediately after dinner', desc: 'Blunt glucose spikes, accelerate digestion & lower evening cortisol.' },
  { id: 'tpl-protein', name: 'Hit Daily Protein Target (1.6g/kg)', icon: '🥛', category: 'Fitness', routine: 'Anytime', color: 'indigo', targetPerWeek: 7, stacking: 'Track grams in breakfast, lunch and dinner', desc: 'Fuel muscle protein synthesis, tissue repair & prolonged satiety.' },
  { id: 'tpl-posture', name: 'Posture Check & Wall Angels', icon: '🧍', category: 'Fitness', routine: 'Afternoon', color: 'violet', targetPerWeek: 7, stacking: 'At 2:00 PM afternoon calendar chime', desc: 'Counteract hunching, activate upper rhomboids & prevent neck pain.' },

  // 🧘 Mindfulness & Mental Clarity (9 Templates)
  { id: 'tpl-meditate', name: '10-Min Mindful Breath Meditation', icon: '🧘', category: 'Mind', routine: 'Morning', color: 'violet', targetPerWeek: 7, stacking: 'After morning glass of water', desc: 'Strengthen prefrontal cortex attention, reduce anxiety & anchor inner calm.' },
  { id: 'tpl-gratitude', name: 'Gratitude Journal (3 Specifics)', icon: '✍️', category: 'Mind', routine: 'Evening', color: 'amber', targetPerWeek: 7, stacking: 'After brushing teeth before getting into bed', desc: 'Rewire neural negativity bias for long-term psychological resilience.' },
  { id: 'tpl-digital-sunset', name: 'Digital Sunset (No Screens 45m)', icon: '🕊️', category: 'Mind', routine: 'Evening', color: 'indigo', targetPerWeek: 7, stacking: 'Dock smartphone on charger outside bedroom at 10 PM', desc: 'Eliminate melatonin-blocking blue light for restorative stage 4 sleep.' },
  { id: 'tpl-breathwork', name: 'Box Breathing / 4-4-4-4 Reset', icon: '🌬️', category: 'Mind', routine: 'Afternoon', color: 'cyan', targetPerWeek: 7, stacking: 'Before opening afternoon sprint or high-stakes call', desc: 'Rapid vagus nerve stimulation to down-regulate sympathetic fight-or-flight.' },
  { id: 'tpl-read', name: 'Read 20 Pages Non-Fiction Book', icon: '📚', category: 'Mind', routine: 'Evening', color: 'indigo', targetPerWeek: 7, stacking: 'Sit in reading chair with herbal tea after dinner', desc: 'Compound intellectual wisdom, mental models & expand critical thinking.' },
  { id: 'tpl-reflection', name: 'Daily Wins & Lessons Log', icon: '📝', category: 'Mind', routine: 'Evening', color: 'rose', targetPerWeek: 7, stacking: 'Write 2 sentences in journal before closing eyes', desc: 'Capture micro-victories, consolidate memory & accelerate self-awareness.' },
  { id: 'tpl-language', name: 'Language / Vocab Practice (15m)', icon: '🗣️', category: 'Mind', routine: 'Afternoon', color: 'emerald', targetPerWeek: 7, stacking: 'Open language app during afternoon coffee break', desc: 'Spaced repetition vocabulary building and linguistic neuroplasticity.' },
  { id: 'tpl-dopamine-detox', name: 'Dopamine Detox (Zero Doomscroll)', icon: '🔕', category: 'Mind', routine: 'Morning', color: 'rose', targetPerWeek: 6, stacking: 'Keep social apps off limits until 12:00 PM lunch', desc: 'Reclaim dopamine receptors, focus bandwidth & sovereign attention.' },
  { id: 'tpl-affirmation', name: 'Morning Intentions & Vision', icon: '✨', category: 'Mind', routine: 'Morning', color: 'amber', targetPerWeek: 7, stacking: 'During morning coffee or tea moment', desc: 'Prime subconscious mind for courage, self-discipline & peak performance.' },

  // ⚡ Deep Work & Productivity (9 Templates)
  { id: 'tpl-deepwork', name: '90-Min Focused Deep Work Sprint', icon: '💻', category: 'Work', routine: 'Morning', color: 'indigo', targetPerWeek: 5, stacking: 'Put phone in another room at 9:00 AM sharp', desc: 'Channel uninterrupted cognitive energy into your highest-leverage deliverable.' },
  { id: 'tpl-priorities', name: 'Plan Top 3 MITs (Daily Priorities)', icon: '🎯', category: 'Work', routine: 'Morning', color: 'amber', targetPerWeek: 5, stacking: 'Write MITs before opening email or Slack', desc: 'Ruthless strategic clarity on essential deliverables that move the needle.' },
  { id: 'tpl-inbox-zero', name: 'Zero Inbox & Task Triage', icon: '📥', category: 'Work', routine: 'Afternoon', color: 'cyan', targetPerWeek: 5, stacking: 'Run triage at 4:30 PM daily shutdown', desc: 'Empty communication queue, delegate actionables & keep desk organized.' },
  { id: 'tpl-pomodoro', name: 'Complete 4 Pomodoro Sprint Blocks', icon: '⏱️', category: 'Work', routine: 'Morning', color: 'emerald', targetPerWeek: 5, stacking: 'Trigger 25-minute focus timer at top of work sprint', desc: 'Master uninterrupted flow states with disciplined 25m work / 5m rest intervals.' },
  { id: 'tpl-code', name: 'Code & Technical Skill Building (30m)', icon: '👨‍💻', category: 'Work', routine: 'Anytime', color: 'violet', targetPerWeek: 5, stacking: 'Open code editor before opening YouTube or news', desc: 'Daily compounding engineering skills, problem solving & architecture craft.' },
  { id: 'tpl-shutdown', name: 'End-of-Day Shutdown Ritual', icon: '🔒', category: 'Work', routine: 'Afternoon', color: 'rose', targetPerWeek: 5, stacking: 'Close all open browser tabs and say "Day Done"', desc: 'Clean mental boundary between professional stress and evening relaxation.' },
  { id: 'tpl-organize', name: 'Desktop & Workspace Organization', icon: '🗂️', category: 'Work', routine: 'Evening', color: 'cyan', targetPerWeek: 5, stacking: 'Wipe desk and clear download folder before leaving', desc: 'Enter every morning into a pristine, zero-friction high-focus sanctuary.' },
  { id: 'tpl-weekly-review', name: 'Weekly Retrospective & Planning', icon: '📊', category: 'Work', routine: 'Evening', color: 'indigo', targetPerWeek: 1, stacking: 'On Sunday afternoon with a cup of coffee', desc: 'Calibrate progress metrics, celebrate milestones & strategize the upcoming week.' },
  { id: 'tpl-networking', name: 'Reach Out to 1 Peer or Mentor', icon: '🤝', category: 'Work', routine: 'Afternoon', color: 'emerald', targetPerWeek: 4, stacking: 'Send 1 thoughtful note right after lunch', desc: 'Nurture high-value professional relationships, mutual support & network.' }
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

