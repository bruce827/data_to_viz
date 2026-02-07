import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface StoryLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}

export function StoryLayout({ title, subtitle, children, icon: Icon }: StoryLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-100 bg-white sticky top-0 z-50 bg-opacity-90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <span className="text-blue-600">●</span> Data to Viz
          </Link>
          <div className="flex gap-2">
             <Button variant="ghost" size="sm" asChild>
                <Link href="/">Back to Tree</Link>
             </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-slate-50 border-b border-slate-100 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          {Icon && (
            <div className="flex justify-center mb-6">
               <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-200">
                  <Icon className="w-16 h-16 text-blue-600" />
               </div>
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            {title}
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p>© 2024 From Data to Viz. Re-engineered with Next.js & AntV.</p>
        </div>
      </footer>
    </div>
  );
}

// --- Content Building Blocks ---

export function StorySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
        <span className="w-1 h-8 bg-blue-500 rounded-full"></span>
        {title}
      </h2>
      <div className="text-lg text-slate-700 leading-8 space-y-6">
        {children}
      </div>
    </section>
  );
}

export function ChartWrapper({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="my-10 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {title && (
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 font-medium text-slate-700">
          {title}
        </div>
      )}
      <div className="p-6">
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
