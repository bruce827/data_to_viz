'use client';

import React from 'react';
import { ChartWrapper, StoryLayout, StorySection } from '@/components/viz/story/StoryComponents';
import { NETWORK_STORY_CONFIGS } from '@/lib/network-story-configs';

type NetworkStoryPageProps = {
  storyKey: string;
};

export function NetworkStoryPage({ storyKey }: NetworkStoryPageProps) {
  const config = NETWORK_STORY_CONFIGS[storyKey];

  if (!config) return null;

  const Icon = config.icon;
  const InteractionComponent = config.interactionComponent;
  const ScenarioComponent = config.scenarioComponent;
  const outlineItems = [
    { id: 'network-what-is', label: `什么是${config.title}` },
    { id: 'network-interaction-example', label: '交互示例' },
    { id: 'network-when-to-use', label: '何时使用' },
    { id: 'network-common-mistakes', label: '常见误区' },
    { id: 'network-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title={config.title}
      subtitle={config.subtitle}
      icon={Icon}
      outlineItems={outlineItems}
      decisionTreeTab="relationnal"
    >
      <StorySection title={`什么是${config.title}？`} id="network-what-is">
        {config.whatIs.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </StorySection>

      <StorySection title="交互示例" id="network-interaction-example">
        <p>
          该示例使用 {config.interactionLibrary} 官方图形语义展示 {config.title}
          的基础结构与交互方式，用于对照下方业务场景图的视觉编码。
        </p>
        <ChartWrapper title={`交互示例（${config.interactionLibrary}）`}>
          <InteractionComponent />
        </ChartWrapper>
      </StorySection>

      <StorySection title="何时使用" id="network-when-to-use">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          {config.whenToUse.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="network-common-mistakes">
        <div className="grid gap-6 md:grid-cols-2">
          {config.mistakes.map((item) => (
            <div key={item.title} className="rounded-lg border border-red-100 bg-red-50 p-6">
              <h3 className="mb-2 font-bold text-red-800">{item.title}</h3>
              <p className="text-sm text-red-700">{item.description}</p>
            </div>
          ))}
        </div>
      </StorySection>

      <StorySection title="应用场景" id="network-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">{config.scenarioName}</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-500">决策树节点</p>
              <p className="mt-1 text-sm text-slate-700">{config.nodePath}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-500">业务条线</p>
              <p className="mt-1 text-sm text-slate-700">{config.businessLine}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-500">报告节点 ID</p>
              <p className="mt-1 text-sm text-slate-700">{config.reportNodeId}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-500">页面路由</p>
              <p className="mt-1 text-sm text-slate-700">{config.route}</p>
            </div>
          </div>
          <p>{config.scenarioDescription}</p>
        </div>

        <ChartWrapper title={`应用场景图：${config.scenarioName}`}>
          <ScenarioComponent />
        </ChartWrapper>

        <p className="text-sm text-slate-500">
          说明：
          {config.dataNote ??
            `本场景直接对齐 docs/network-deep-research-report.md 中 ${config.reportNodeId} 的数据口径与业务结论，不额外补充无依据字段。`}
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          {config.insights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
