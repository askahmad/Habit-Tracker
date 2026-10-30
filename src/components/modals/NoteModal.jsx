import React, { useState, useEffect } from 'react';
import { X, FileText, Save } from 'lucide-react';

export default function NoteModal({ isOpen, habit, dateKey, onClose, onSaveNote }) {
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    if (habit && dateKey && habit.notes) {
      setNoteText(habit.notes[dateKey] || '');
    } else {
      setNoteText('');
    }
  }, [habit, dateKey]);

  if (!isOpen || !habit) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveNote(habit.id, dateKey, noteText.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Reflection Note</h3>
              <p className="text-[11px] text-slate-400">
                {habit.icon} {habit.name} • {dateKey}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Note input */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <textarea
              rows="4"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="What went well? Any obstacles, insights, or mood notes?"
              className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Note</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

