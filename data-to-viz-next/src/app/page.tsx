'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DecisionGraph } from '@/components/viz/tree/DecisionGraph';
import { MobileDecisionTree } from '@/components/viz/tree/MobileDecisionTree';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TREE_DATA_MAP, isTreeTabKey, type TreeTabKey } from '@/lib/story-navigation';

type HomeShellProps = {
  activeTab: TreeTabKey;
  onTabChange?: (value: string) => void;
};

function HomeShell({ activeTab, onTabChange }: HomeShellProps) {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 bg-white font-sans">
      <div className="z-10 max-w-7xl w-full flex flex-col items-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-4 text-center">
          数据可视化指南
        </h1>
        <p className="text-base md:text-lg text-slate-500 mb-8 max-w-2xl text-center px-4">
          在下方选择一种数据类型，让决策树引导你找到最合适的图表。
        </p>

        <Tabs value={activeTab} className="w-full max-w-4xl h-auto" onValueChange={onTabChange}>
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto p-1 bg-slate-100/80 rounded-xl mb-8">
            <TabsTrigger value="num" className="py-2.5 text-xs md:text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all">数值</TabsTrigger>
            <TabsTrigger value="cat" className="py-2.5 text-xs md:text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all">类别</TabsTrigger>
            <TabsTrigger value="catnum" className="py-2.5 text-xs md:text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all">数值和类别</TabsTrigger>
            <TabsTrigger value="geo" className="py-2.5 text-xs md:text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all">地图</TabsTrigger>
            <TabsTrigger value="relationnal" className="py-2.5 text-xs md:text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all">网络关系</TabsTrigger>
            <TabsTrigger value="time" className="py-2.5 text-xs md:text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all">时间序列</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="w-full max-w-[1600px] rounded-3xl overflow-hidden">
        <div className="hidden md:block shadow-2xl shadow-slate-200/60 border border-slate-200/60 bg-slate-50/30 backdrop-blur-sm rounded-3xl">
          <DecisionGraph data={TREE_DATA_MAP[activeTab]} />
        </div>

        <div className="block md:hidden">
          <MobileDecisionTree data={TREE_DATA_MAP[activeTab]} />
        </div>
      </div>
    </main>
  );
}

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const activeTab: TreeTabKey = isTreeTabKey(tabParam) ? tabParam : 'num';

  const handleTabChange = (value: string) => {
    if (!isTreeTabKey(value)) return;

    const params = new URLSearchParams(searchParams.toString());
    if (value === 'num') {
      params.delete('tab');
    } else {
      params.set('tab', value);
    }

    const query = params.toString();
    router.replace(query ? `/?${query}` : '/', { scroll: false });
  };

  return <HomeShell activeTab={activeTab} onTabChange={handleTabChange} />;
}

export default function Home() {
  return (
    <Suspense fallback={<HomeShell activeTab="num" />}>
      <HomeContent />
    </Suspense>
  );
}
