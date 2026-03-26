'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

type GlobalSearchContextValue = {
  openSearch: () => void;
};

const GlobalSearchContext = createContext<GlobalSearchContextValue | null>(null);

const LazyGlobalSearchDialog = dynamic(
  () => import('@/components/search/GlobalSearchDialog').then((mod) => mod.GlobalSearchDialog),
  { ssr: false },
);

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;

  const tagName = target.tagName.toLowerCase();
  return tagName === 'input' || tagName === 'textarea' || tagName === 'select';
}

export function GlobalSearchProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return;
      if (!(event.metaKey || event.ctrlKey)) return;
      if (event.key.toLowerCase() !== 'k') return;

      event.preventDefault();
      setOpen(true);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <GlobalSearchContext.Provider value={{ openSearch: () => setOpen(true) }}>
      {children}
      {open ? <LazyGlobalSearchDialog open={open} onOpenChange={setOpen} /> : null}
    </GlobalSearchContext.Provider>
  );
}

export function useGlobalSearch() {
  const context = useContext(GlobalSearchContext);
  if (!context) {
    throw new Error('useGlobalSearch must be used within GlobalSearchProvider');
  }

  return context;
}
