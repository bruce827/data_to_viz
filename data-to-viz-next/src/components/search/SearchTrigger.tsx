'use client';

import { SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useGlobalSearch } from '@/components/search/GlobalSearchProvider';

type SearchTriggerProps = {
  className?: string;
  compact?: boolean;
};

export function SearchTrigger({ className, compact = false }: SearchTriggerProps) {
  const { openSearch } = useGlobalSearch();

  if (compact) {
    return (
      <Button
        variant="outline"
        size="sm"
        className={cn('gap-2 dark:border-cyan-500/30 dark:hover:bg-cyan-950/40 dark:text-cyan-300 cursor-pointer', className)}
        onClick={openSearch}
      >
        <SearchIcon className="size-4 dark:text-cyan-400" />
        搜索
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      className={cn(
        'h-11 w-full justify-between rounded-xl border-slate-200 dark:border-cyan-500/30 bg-white dark:bg-cyan-950/15 px-4 text-slate-500 dark:text-cyan-300 shadow-sm dark:shadow-[0_0_12px_rgba(6,182,212,0.08)] hover:bg-slate-50 dark:hover:bg-cyan-950/30 transition-all duration-200 cursor-pointer',
        className,
      )}
      onClick={openSearch}
    >
      <span className="flex items-center gap-3">
        <SearchIcon className="size-4 text-slate-400 dark:text-cyan-500" />
        搜索图表、场景、story 正文内容
      </span>
      <span className="hidden rounded-md border border-slate-200 dark:border-cyan-500/20 bg-slate-50 dark:bg-cyan-950/30 px-2 py-1 text-xs text-slate-400 dark:text-cyan-600 md:inline-flex">
        Ctrl/Cmd + K
      </span>
    </Button>
  );
}
