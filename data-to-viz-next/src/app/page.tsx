'use client';

import { useState } from 'react';
import { DecisionGraph } from '@/components/viz/tree/DecisionGraph';
import { MobileDecisionTree } from '@/components/viz/tree/MobileDecisionTree';
import treeNumeric from '@/data/tree-numeric.json';
import treeCategoric from '@/data/tree-categoric.json';
import treeCatNum from '@/data/tree-catnum.json';
import treeMaps from '@/data/tree-maps.json';
import treeNetwork from '@/data/tree-network.json';
import treeTime from '@/data/tree-time.json';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const treeDataMap = {
  num: treeNumeric,
  cat: treeCategoric,
  catnum: treeCatNum,
  geo: treeMaps,
  relationnal: treeNetwork,
  time: treeTime,
};

export default function Home() {
  const [activeTab, setActiveTab] = useState('num');

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 bg-white font-sans">
      <div className="z-10 max-w-7xl w-full flex flex-col items-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-4 text-center">
          数据可视化指南 
        </h1>
        <p className="text-base md:text-lg text-slate-500 mb-8 max-w-2xl text-center px-4">
        在下方选择一种数据类型，让决策树引导你找到最合适的图表。
        </p>
        
        <Tabs defaultValue="num" className="w-full max-w-4xl h-auto" onValueChange={setActiveTab}>
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
        {/* Desktop View: G6 Graph */}
        <div className="hidden md:block shadow-2xl shadow-slate-200/60 border border-slate-200/60 bg-slate-50/30 backdrop-blur-sm rounded-3xl">
           <DecisionGraph data={treeDataMap[activeTab as keyof typeof treeDataMap]} />
        </div>

        {/* Mobile View: Accordion List */}
        <div className="block md:hidden">
           <MobileDecisionTree data={treeDataMap[activeTab as keyof typeof treeDataMap]} />
        </div>
      </div>
    </main>
  );
}
