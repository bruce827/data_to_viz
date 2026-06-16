'use client';

import React from 'react';
import { useTheme } from '@/lib/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="relative flex items-center justify-center p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm w-10 h-10"
        disabled
      >
        <div className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center p-2.5 rounded-xl border border-slate-200 dark:border-cyan-500/30 bg-white dark:bg-cyan-950/20 text-slate-700 dark:text-cyan-400 shadow-sm dark:shadow-[0_0_12px_rgba(6,182,212,0.15)] hover:bg-slate-50 dark:hover:bg-cyan-950/40 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
      aria-label="Toggle Theme"
      id="theme-toggle-btn"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5 text-cyan-400" />
      )}
    </button>
  );
}
