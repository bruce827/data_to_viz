'use client';

import React, { useSyncExternalStore } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { isTreeTabKey, type TreeTabKey } from '@/lib/story-navigation';
import { resolveStoryReturnHref } from '@/lib/navigation-flow.mjs';
import { SearchTrigger } from '@/components/search/SearchTrigger';

interface StoryLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  outlineItems?: Array<{ id: string; label: string }>;
  decisionTreeTab?: TreeTabKey;
}

export function StoryLayout({ title, subtitle, children, icon: Icon, outlineItems, decisionTreeTab }: StoryLayoutProps) {
  const hasOutline = Boolean(outlineItems && outlineItems.length > 0);
  const locationSearch = useSyncExternalStore(
    () => () => undefined,
    () => window.location.search,
    () => '',
  );
  const params = new URLSearchParams(locationSearch);
  const originTabParam = params.get('originTab');
  const originFocusParam = params.get('originFocus');
  const originTab: TreeTabKey | undefined = isTreeTabKey(originTabParam) ? originTabParam : undefined;
  const originFocus = originFocusParam || undefined;

  const decisionTreeHref = resolveStoryReturnHref({
    fallbackTab: decisionTreeTab,
    originTab,
    originFocus,
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-100 bg-white sticky top-0 z-50 bg-opacity-90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 md:h-16 flex items-center justify-between">
	          <Link href="/" className="font-bold text-base md:text-lg text-slate-900 flex items-center gap-2">
	            <span className="text-blue-600">●</span> 数据可视化指南
	          </Link>
	          <div className="flex gap-2">
               <SearchTrigger compact />
	             <Button variant="ghost" size="sm" asChild>
	                <Link href={decisionTreeHref}>返回决策树</Link>
	             </Button>
	          </div>
	        </div>
	      </header>

      {/* Hero Section */}
      <div className="bg-slate-50 border-b border-slate-100 py-5 md:py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-1.5">
            {Icon && (
              <div className="p-1.5 bg-white rounded-lg shadow-sm border border-slate-200">
                <Icon className="w-6 h-6 text-blue-600" />
              </div>
            )}
            <h1 className="text-xl md:text-2xl font-semibold text-slate-900 tracking-tight">
              {title}
            </h1>
          </div>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Content */}
      {hasOutline ? (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-10">
          <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8">
            <aside className="hidden lg:block">
              <div className="sticky top-24 rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase mb-3">大纲导航</p>
                <nav className="space-y-2">
                  {outlineItems?.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="block text-sm text-slate-600 hover:text-blue-600 transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
            <div className="min-w-0">{children}</div>
          </div>
        </main>
      ) : (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
          {children}
        </main>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 md:py-12 mt-12 md:mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p>© 2026 数据可视化指南 with Next.js & AntV.</p>
        </div>
      </footer>
    </div>
  );
}

// --- Content Building Blocks ---

export function StorySection({
  title,
  children,
  id,
}: {
  title: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="mb-10 md:mb-16 scroll-mt-24">
      <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
        <span className="w-1 h-6 md:h-8 bg-blue-500 rounded-full"></span>
        {title}
      </h2>
      <div className="text-base md:text-lg text-slate-700 leading-7 md:leading-8 space-y-5 md:space-y-6">
        {children}
      </div>
    </section>
  );
}

export function ChartWrapper({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="my-6 md:my-10 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {title && (
        <div className="bg-slate-50 px-4 md:px-6 py-2.5 md:py-3 border-b border-slate-100 font-medium text-sm md:text-base text-slate-700">
          {title}
        </div>
      )}
      <div className="p-4 md:p-6">
        {children}
      </div>
    </div>
  );
}

export function CodeBlock({ code, language = 'javascript' }: { code: string; language?: string }) {
  return (
    <div className="my-6 rounded-lg overflow-hidden bg-slate-900 text-slate-100 text-sm font-mono">
      <div className="px-4 py-2 bg-slate-800 text-xs text-slate-400 border-b border-slate-700 flex justify-between">
         <span>{language}</span>
         <button className="hover:text-white transition-colors">Copy</button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre>{code}</pre>
      </div>
    </div>
  );
}
