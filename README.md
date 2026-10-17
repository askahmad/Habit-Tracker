# Habit-Tracker ⚡

**HabitPulse** is a modern, high-performance daily habits and streak-building web app engineered for everyday personal productivity, routine consistency, and long-term momentum.

🌐 **Live Demo:** [https://askahmad.github.io/Habit-Tracker/](https://askahmad.github.io/Habit-Tracker/)

---

## ✨ Key Features for Everyday Users

### 📱 1. PWA & Offline Support
- **Install as Native App:** Add to iOS / Android home screens or desktop taskbars via Progressive Web App (`manifest.webmanifest`).
- **Offline First:** Cached via Service Worker (`sw.js`) so you can log your goals anywhere, even without an internet connection.

### 🛡️ 2. Data Safety & Backup (Never Lose Streaks)
- **Export Backup (JSON):** 1-click download of your entire habit history, streaks, and reflections.
- **Export for Excel (CSV):** Clean spreadsheet-compatible data logs.
- **Restore / Import:** Easily migrate or restore progress on any device.

### 🌅 3. Routine & Time-of-Day Categorization
- Group habits by **Morning 🌅**, **Afternoon ☀️**, **Evening 🌙**, or **Anytime ⚡**.
- Filter your view dynamically to focus strictly on what needs to get done right now.
- Live search to instantly find habits.

### ✏️ 4. Full Habit Customization & Notes
- **Edit Habits:** Rename, change weekly target (3x-7x/wk), adjust category, emoji icon, or color themes without losing historical data.
- **Daily Reflection Notes:** Right-click or tap to attach quick reflection notes to any day's log.
- **❄️ Streak Freeze Shield:** Protect your streak on rest or illness days without breaking momentum.

### 🏆 5. Dopamine & Gamification Loops
- **Annual 365-Day Heatmap:** GitHub-style consistency grid visualizing habit intensity across all 52 weeks of the year.
- **Milestone Badges:** Unlock achievements for hitting 7-day, 14-day, 30-day, and 100-day streaks.
- **Confetti Celebrations:** Rich full-screen confetti bursts upon completing all daily goals.
- **Micro-Audio Feedback:** Synthesizer chimes for check-ins, edits, and victory states.

### 💡 6. Starter Templates Library
- 1-click curated routines:
  - **🌅 5 AM High Performer**
  - **💻 Deep Focus & Productivity**
  - **🥗 Health & Longevity**
  - **🌙 Evening Wind-down & Zen**

---

## ⌨️ Power-User Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `N` | Open Create Habit Modal |
| `T` | Jump back to Today / Current Week |
| `M` | Mark all habits complete for Today |
| `D` | Toggle Dark / Light Theme |
| `P` | Open Starter Templates Library |
| `A` | Open Milestone Badges & Achievements |
| `B` | Open Data Backup / Export / Import |
| `1` – `9` | Quick-toggle daily goal for habit #1 to #9 |
| `Esc` | Close any open modal |
| `?` | Show Shortcuts cheatsheet |

---

## 🚀 Running Locally
Simply open `index.html` directly in any web browser, or serve it using:
```bash
# Using python
python -m http.server 8000

# Or using npx serve
npx serve .
```
