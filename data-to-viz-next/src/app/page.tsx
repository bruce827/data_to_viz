'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DecisionGraph } from '@/components/viz/tree/DecisionGraph';
import { MobileDecisionTree } from '@/components/viz/tree/MobileDecisionTree';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TREE_DATA_MAP, isTreeTabKey, type TreeTabKey } from '@/lib/story-navigation';
import { SearchTrigger } from '@/components/search/SearchTrigger';
import { ThemeToggle } from '@/components/ThemeToggle';

type HomeShellProps = {
  activeTab: TreeTabKey;
  focusNodeId?: string;
  focusNodeLabel?: string;
  onTabChange?: (value: string) => void;
};

function HomeShell({ activeTab, focusNodeId, focusNodeLabel, onTabChange }: HomeShellProps) {
  return (
    <main className="relative flex min-h-screen flex-col items-center p-4 md:p-8 bg-transparent font-sans">
      {/* Theme Toggle Button at top right */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 z-50">
        <ThemeToggle />
      </div>

      <div className="z-10 max-w-7xl w-full flex flex-col items-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-cyan-600 dark:from-cyan-400 dark:to-blue-400 dark:drop-shadow-[0_0_15px_rgba(6,182,212,0.3)] mb-4 text-center">
          数据可视化决策系统
        </h1>
        <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 mb-8 max-w-2xl text-center px-4">
          在下方选择一种数据类型，让决策树引导你找到最合适的图表。
        </p>

        <div className="mb-8 w-full max-w-2xl px-4">
          <SearchTrigger />
        </div>

        {focusNodeId && focusNodeLabel ? (
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-cyan-500/30 bg-blue-50 dark:bg-cyan-950/40 px-4 py-2 text-sm text-blue-700 dark:text-cyan-300 shadow-sm dark:shadow-[0_0_12px_rgba(6,182,212,0.1)]">
            <span className="font-medium">已定位节点</span>
            <span>{focusNodeLabel}</span>
          </div>
        ) : null}

        <Tabs value={activeTab} className="w-full max-w-4xl h-auto" onValueChange={onTabChange}>
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto p-1 bg-slate-100/60 dark:bg-cyan-950/20 backdrop-blur border border-slate-200/40 dark:border-cyan-500/20 shadow-sm rounded-xl mb-8">
            <TabsTrigger value="num" className="py-2.5 text-xs md:text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-cyan-500/20 dark:data-[state=active]:text-cyan-300 dark:text-slate-400 rounded-lg transition-all cursor-pointer">数值</TabsTrigger>
            <TabsTrigger value="cat" className="py-2.5 text-xs md:text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-cyan-500/20 dark:data-[state=active]:text-cyan-300 dark:text-slate-400 rounded-lg transition-all cursor-pointer">类别</TabsTrigger>
            <TabsTrigger value="catnum" className="py-2.5 text-xs md:text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-cyan-500/20 dark:data-[state=active]:text-cyan-300 dark:text-slate-400 rounded-lg transition-all cursor-pointer">数值和类别</TabsTrigger>
            <TabsTrigger value="geo" className="py-2.5 text-xs md:text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-cyan-500/20 dark:data-[state=active]:text-cyan-300 dark:text-slate-400 rounded-lg transition-all cursor-pointer">地图</TabsTrigger>
            <TabsTrigger value="relationnal" className="py-2.5 text-xs md:text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-cyan-500/20 dark:data-[state=active]:text-cyan-300 dark:text-slate-400 rounded-lg transition-all cursor-pointer">网络关系</TabsTrigger>
            <TabsTrigger value="time" className="py-2.5 text-xs md:text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-cyan-500/20 dark:data-[state=active]:text-cyan-300 dark:text-slate-400 rounded-lg transition-all cursor-pointer">时间序列</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="w-full max-w-[1600px] rounded-3xl overflow-hidden">
        <div className="hidden md:block border border-slate-200/50 dark:border-cyan-500/20 bg-white/80 dark:bg-cyan-950/5 backdrop-blur shadow-lg shadow-slate-200/40 rounded-3xl">
          <DecisionGraph data={TREE_DATA_MAP[activeTab]} focusNodeId={focusNodeId} activeTab={activeTab} />
        </div>

        <div className="block md:hidden">
          <MobileDecisionTree data={TREE_DATA_MAP[activeTab]} focusNodeId={focusNodeId} activeTab={activeTab} />
        </div>
      </div>
    </main>
  );
}

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const focusParam = searchParams.get('focus');
  const activeTab: TreeTabKey = isTreeTabKey(tabParam) ? tabParam : 'num';
  const activeTreeData = TREE_DATA_MAP[activeTab];
  const focusedNode =
    typeof focusParam === 'string'
      ? activeTreeData.nodes.find((node) => node.id === focusParam && node.type === 'decision-chart')
      : undefined;

  const handleTabChange = (value: string) => {
    if (!isTreeTabKey(value)) return;

    const params = new URLSearchParams(searchParams.toString());
    params.delete('focus');
    if (value === 'num') {
      params.delete('tab');
    } else {
      params.set('tab', value);
    }

    const query = params.toString();
    router.replace(query ? `/?${query}` : '/', { scroll: false });
  };

  return (
    <HomeShell
      activeTab={activeTab}
      focusNodeId={focusedNode?.id}
      focusNodeLabel={focusedNode?.data['label-cn'] || focusedNode?.data.label}
      onTabChange={handleTabChange}
    />
  );
}

export default function Home() {
  return (
    <Suspense fallback={<HomeShell activeTab="num" />}>
      <HomeContent />
    </Suspense>
  );
}
