'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// 动态引入 AntV 组件，禁用 SSR
const AntVGraph = dynamic(
  () => import('@/components/viz/AntVGraph').then((mod) => mod.AntVGraph),
  { ssr: false, loading: () => <div className="p-10 text-slate-400">Loading Visualization Engine...</div> }
);

// 定义可用的分组 (需与 extracted_nodes_v2.json 中的 group 字段一致)
type GroupType = 'num' | 'cat' | 'catnum' | 'geo' | 'time' | 'relationnal';

export default function Home() {
  const [activeTab, setActiveTab] = useState<GroupType>('num');
  
  const tabs: { id: GroupType; label: string }[] = [
    { id: 'num', label: '数值型 (Numeric)' },
    { id: 'cat', label: '分类型 (Categoric)' },
    { id: 'catnum', label: '数值&分类' },
    { id: 'geo', label: '地图 (Maps)' },
    { id: 'time', label: '时间序列' },
    { id: 'relationnal', label: '网络关系' },
  ];

  return (
    <main className="flex h-screen w-screen flex-col items-center p-4 bg-white font-sans overflow-hidden">
      <div className="z-10 w-full max-w-7xl items-center justify-between text-sm lg:flex mb-4">
        <h1 className="text-2xl font-bold text-slate-800">
          Data to Viz <span className="text-[#69b3a2]">(Editor Mode)</span>
        </h1>
        <div className="text-xs text-slate-400">Powered by AntV X6</div>
      </div>

      {/* 顶部 Tab 切换 */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center z-10">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id 
                ? 'bg-[#69b3a2] text-white shadow-md transform scale-105' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 w-full max-w-[1600px] border rounded-xl overflow-hidden shadow-sm bg-[#f8f9fa] relative mx-auto">
        <AntVGraph group={activeTab} />
      </div>
    </main>
  );
}
