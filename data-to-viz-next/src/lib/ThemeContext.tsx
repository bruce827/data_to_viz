'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Chart as G2Chart } from '@antv/g2';
import { Graph as G6Graph } from '@antv/g6';

// Monkey patch G2 Chart globally to assign dark/light themes dynamically and robustly right before rendering
if (typeof window !== 'undefined') {
  try {
    const originalRender = G2Chart.prototype.render;
    G2Chart.prototype.render = function (this: any, ...args: any[]) {
      try {
        const isDark = document.documentElement.classList.contains('dark');
        const theme = isDark ? 'dark' : 'light';
        
        // Call the official theme API of G2 v5 to refresh text, axis and grids inside Canvas
        if (typeof this.theme === 'function') {
          this.theme({ type: theme });
        }
      } catch (e) {
        // Fallback safely
      }
      return originalRender.apply(this, args);
    };
  } catch (err) {
    console.warn('G2 Chart auto-theme injection failed:', err);
  }

  // Monkey patch G6 Graph globally to assign dark/light themes dynamically
  try {
    const originalG6Render = G6Graph.prototype.render;
    G6Graph.prototype.render = function (this: any) {
      try {
        const isDark = document.documentElement.classList.contains('dark');
        if (this.options) {
          if (!this.options.theme) {
            // Shallow clone root options object only if frozen, avoiding deep clones of canvas DOM elements
            const clonedOpts = Object.isExtensible(this.options) ? this.options : { ...this.options };
            clonedOpts.theme = isDark ? 'dark' : 'light';
            this.options = clonedOpts;
          }
        }
      } catch (e) {
        // Fallback safely
      }
      return originalG6Render.call(this);
    };
  } catch (err) {
    console.warn('G6 Graph auto-theme injection failed:', err);
  }
}

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    setThemeState(initialTheme);
    setMounted(true);

    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
