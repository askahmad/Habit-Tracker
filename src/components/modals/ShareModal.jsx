import React, { useRef, useEffect } from 'react';
import { X, Share2, Download } from 'lucide-react';
import { calculatePlayerLevel } from '../../data/defaultData';

export default function ShareModal({ isOpen, user, habits = [], totalXp = 0, onClose }) {
  const canvasRef = useRef(null);

  // Calculate highest streak
  let maxStreak = 0;
  habits.forEach((h) => {
    if (h.logs) {
      let current = 0;
      const sortedKeys = Object.keys(h.logs).sort();
      for (const k of sortedKeys) {
        if (h.logs[k] === true) current++;
        else current = 0;
        if (current > maxStreak) maxStreak = current;
      }
    }
  });

  const rpg = calculatePlayerLevel(totalXp);

  const drawCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#090d16');
    grad.addColorStop(0.5, '#0f172a');
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Decorative radial glow
    const glow = ctx.createRadialGradient(w / 2, 220, 20, w / 2, 220, 200);
    glow.addColorStop(0, 'rgba(99, 102, 241, 0.35)');
    glow.addColorStop(0.8, 'rgba(245, 158, 11, 0.1)');
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 50, w, 350);

    // Header Branding
    ctx.fillStyle = '#6366f1';
    ctx.beginPath();
    ctx.arc(50, 50, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Inter, sans-serif';
    ctx.fillText('HabitPulse', 75, 57);

    ctx.fillStyle = '#818cf8';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillText('PRO STREAK PASS', w - 150, 57);

    // User Subtitle
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 13px Inter, sans-serif';
    ctx.fillText(`${user?.name || 'Habit Builder'}'s Consistency Journey`, 50, 95);

    // Huge Streak Number
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 64px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`🔥 ${maxStreak || 1}`, w / 2, 190);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Inter, sans-serif';
    ctx.fillText('DAY ACTIVE STREAK', w / 2, 225);

    // Level Badge Pill
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.roundRect(w / 2 - 120, 245, 240, 36, 18);
    ctx.fill();

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.fillText(`⭐ Lv. ${rpg.level} • ${rpg.rank}`, w / 2, 268);

    // Stats Row
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.beginPath();
    ctx.roundRect(40, 305, 360, 60, 16);
    ctx.fill();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.fillText(`${habits.length}`, 65, 335);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px Inter, sans-serif';
    ctx.fillText('ACTIVE HABITS', 65, 350);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.fillText(`${totalXp} XP`, 185, 335);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px Inter, sans-serif';
    ctx.fillText('TOTAL EARNED', 185, 350);

    ctx.fillStyle = '#f43f5e';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.fillText(`PRO`, 305, 335);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px Inter, sans-serif';
    ctx.fillText('MEMBERSHIP', 305, 350);
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(drawCard, 50);
    }
  }, [isOpen, maxStreak, totalXp]);

  if (!isOpen) return null;

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.download = `HabitPulse-${user?.name || 'Streak'}.png`;
    a.href = url;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-center animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Share Streak Card</h3>
              <p className="text-[11px] text-slate-400">Export high-res social story card</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Canvas Display */}
        <div className="flex justify-center overflow-hidden rounded-2xl border border-slate-800 shadow-xl bg-slate-950">
          <canvas ref={canvasRef} width={440} height={390} className="w-full max-w-[360px] h-auto" />
        </div>

        {/* Download action */}
        <button
          onClick={handleDownload}
          className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Download Card Image</span>
        </button>
      </div>
    </div>
  );
}

