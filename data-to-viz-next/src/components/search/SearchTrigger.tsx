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
      <Button variant="outline" size="sm" className={cn('gap-2', className)} onClick={openSearch}>
        <SearchIcon className="size-4" />
        搜索
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      className={cn(
        'h-11 w-full justify-between rounded-xl border-slate-200 bg-white px-4 text-slate-500 shadow-sm hover:bg-slate-50',
        className,
      )}
      onClick={openSearch}
    >
      <span className="flex items-center gap-3">
        <SearchIcon className="size-4 text-slate-400" />
        搜索图表、场景、story 正文内容
      </span>
      <span className="hidden rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-400 md:inline-flex">
        Ctrl/Cmd + K
      </span>
    </Button>
  );
}
