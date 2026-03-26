'use client';

import { Fragment, useDeferredValue, useMemo, useState, useTransition } from 'react';
import { CrosshairIcon, FileSearchIcon, FileTextIcon, HashIcon, LayersIcon } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import searchDocsJson from '@/generated/search-docs.json';
import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { searchDocs } from '@/lib/search/search-engine';
import type { SearchDoc, SearchResult } from '@/lib/search/types';
import {
  buildStoryHref,
  getDecisionTreeTabByStoryPath,
  isTreeTabKey,
} from '@/lib/story-navigation';
import { buildLocateHref } from '@/lib/navigation-flow.mjs';

const SEARCH_DOCS = searchDocsJson as SearchDoc[];

const TAB_LABELS = {
  num: '数值',
  cat: '类别',
  catnum: '数值和类别',
  geo: '地图',
  relationnal: '网络关系',
  time: '时间序列',
} as const;

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getQueryTerms(query: string) {
  return query
    .trim()
    .split(/\s+/)
    .map((term) => term.trim())
    .filter(Boolean);
}

function HighlightedText({
  text,
  terms,
  className,
}: {
  text: string;
  terms: string[];
  className?: string;
}) {
  if (!text) return null;
  if (terms.length === 0) return <span className={className}>{text}</span>;

  const pattern = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'gi');
  const fragments = text.split(pattern);

  return (
    <span className={className}>
      {fragments.map((fragment, index) => {
        const isMatch = terms.some((term) => fragment.toLowerCase() === term.toLowerCase());

        if (!isMatch) {
          return <Fragment key={`${fragment}-${index}`}>{fragment}</Fragment>;
        }

        return (
          <mark key={`${fragment}-${index}`} className="rounded bg-amber-100 px-0.5 text-slate-900">
            {fragment}
          </mark>
        );
      })}
    </span>
  );
}

function limitSectionResults(sectionResults: SearchResult[], perRouteLimit: number, totalLimit: number) {
  const counts = new Map<string, number>();
  const limitedResults: SearchResult[] = [];

  for (const result of sectionResults) {
    const count = counts.get(result.route) ?? 0;
    if (count >= perRouteLimit) continue;

    limitedResults.push(result);
    counts.set(result.route, count + 1);

    if (limitedResults.length >= totalLimit) break;
  }

  return limitedResults;
}

function SearchResultItem({
  result,
  terms,
  onSelect,
  onLocate,
}: {
  result: SearchResult;
  terms: string[];
  onSelect: () => void;
  onLocate: (result: SearchResult) => void;
}) {
  const description =
    result.kind === 'section'
      ? `${result.sectionTitle} · ${result.snippet}`
      : result.scenarioName || result.subtitle || result.snippet;

  return (
    <CommandItem
      key={result.id}
      value={result.id}
      onSelect={onSelect}
      className="items-start gap-3 rounded-lg px-3 py-3"
    >
      <div className="mt-0.5 rounded-md border border-slate-200 bg-slate-50 p-2 text-slate-500">
        {result.kind === 'story' ? <LayersIcon className="size-4" /> : <HashIcon className="size-4" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <HighlightedText
            text={result.title}
            terms={terms}
            className="truncate font-medium text-slate-900"
          />
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">
            {TAB_LABELS[result.tab]}
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-slate-500">
          <HighlightedText text={description} terms={terms} />
        </p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="xs"
        className="mt-0.5 text-slate-500 hover:text-blue-700"
        onMouseDown={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onLocate(result);
        }}
      >
        <CrosshairIcon className="size-3.5" />
        定位
      </Button>
      <CommandShortcut>{result.kind === 'section' ? '章节' : '图表'}</CommandShortcut>
    </CommandItem>
  );
}

export function GlobalSearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [isPending, startTransition] = useTransition();
  const queryTerms = useMemo(() => getQueryTerms(deferredQuery), [deferredQuery]);
  const originTab = useMemo(() => {
    const explicitOriginTab = searchParams.get('originTab');
    if (isTreeTabKey(explicitOriginTab)) return explicitOriginTab;

    if (pathname === '/') {
      const homeTab = searchParams.get('tab');
      return isTreeTabKey(homeTab) ? homeTab : 'num';
    }

    if (!pathname) return undefined;
    return getDecisionTreeTabByStoryPath(pathname);
  }, [pathname, searchParams]);
  const originFocus = useMemo(() => {
    const explicitOriginFocus = searchParams.get('originFocus');
    if (explicitOriginFocus) return explicitOriginFocus;

    if (pathname === '/') {
      const homeFocus = searchParams.get('focus');
      return homeFocus || undefined;
    }

    return undefined;
  }, [pathname, searchParams]);

  const results = searchDocs(SEARCH_DOCS, deferredQuery, 20);
  const storyResults = results.filter((result) => result.kind === 'story');
  const sectionResults = limitSectionResults(
    results.filter((result) => result.kind === 'section'),
    1,
    deferredQuery ? 6 : 4,
  );

  const handleSelect = (result: SearchResult) => {
    onOpenChange(false);
    startTransition(() => {
      router.push(
        buildStoryHref(result.route, {
          anchor: result.anchor,
          originTab,
          originFocus,
        }),
        { scroll: true },
      );
    });
  };

  const handleLocate = (result: SearchResult) => {
    onOpenChange(false);
    startTransition(() => {
      router.push(buildLocateHref({ ownerTab: result.tab, nodeId: result.nodeId }), { scroll: true });
    });
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="全局搜索"
      description="搜索图表、应用场景与 story 正文内容"
      className="overflow-hidden border border-slate-200 p-0 sm:max-w-2xl"
      commandProps={{ shouldFilter: false }}
    >
      <CommandInput
        value={query}
        onValueChange={setQuery}
        placeholder="搜索图表、场景、节点 ID、关键词..."
      />
      <CommandList className="max-h-[60vh]">
        <CommandEmpty>
          <div className="flex flex-col items-center gap-2 py-8 text-slate-500">
            <FileSearchIcon className="size-5" />
            <p>没有找到匹配结果</p>
          </div>
        </CommandEmpty>

        {storyResults.length > 0 ? (
          <CommandGroup heading={deferredQuery ? '图表结果' : '推荐图表'}>
            {storyResults.map((result) => (
              <SearchResultItem
                key={result.id}
                result={result}
                terms={queryTerms}
                onSelect={() => handleSelect(result)}
                onLocate={handleLocate}
              />
            ))}
          </CommandGroup>
        ) : null}

        {sectionResults.length > 0 ? <CommandSeparator /> : null}

        {sectionResults.length > 0 ? (
          <CommandGroup heading="正文命中">
            {sectionResults.map((result) => (
              <SearchResultItem
                key={result.id}
                result={result}
                terms={queryTerms}
                onSelect={() => handleSelect(result)}
                onLocate={handleLocate}
              />
            ))}
          </CommandGroup>
        ) : null}

        {isPending ? (
          <>
            <CommandSeparator />
            <CommandGroup heading="状态">
              <CommandItem value="search-pending" disabled className="gap-3 rounded-lg px-3 py-3 text-slate-500">
                <FileTextIcon className="size-4" />
                正在跳转...
              </CommandItem>
            </CommandGroup>
          </>
        ) : null}
      </CommandList>
    </CommandDialog>
  );
}
