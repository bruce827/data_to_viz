'use client';

import React from 'react';
import Image from 'next/image';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { StackedAreaIcon } from '@/components/viz/icons';
import { StackedAreaSevScenarioG2 } from '@/components/viz/charts/StackedAreaSevScenarioG2';

export default function StackedAreaSevStory() {
  const outlineItems = [
    { id: 'what-is-stacked-area-sev', label: '什么是堆叠面积图' },
    { id: 'when-to-use-stacked-area-sev', label: '何时使用' },
    { id: 'stacked-area-sev-common-mistakes', label: '常见误区' },
    { id: 'stacked-area-sev-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="堆叠面积图"
      subtitle="展示 IFRS 9 Stage 结构随时间迁移，识别拨备与利润波动的前置信号。"
      icon={StackedAreaIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是堆叠面积图？" id="what-is-stacked-area-sev">
        <p>
          堆叠面积图（Stacked Area Chart）用于同时表达总量变化与结构贡献变化。对 IFRS 9 管理来说，
          它能把 Stage 1/2/3 在同一时间轴上对齐展示，帮助识别风险迁徙路径。
        </p>
        <p>
          当管理目标是提前发现“风险在账面结构中扩散”，而不只是观察不良率终态时，堆叠面积图非常有效。
        </p>
        <p>英文名：Stacked Area Chart</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G2）">
        <Image
          src="/images/stories/stackedarea/stackedarea-example.png"
          alt="堆叠面积图交互示例"
          width={354}
          height={310}
          className="w-full h-auto rounded-md border border-slate-200"
        />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-stacked-area-sev">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要同时观察总 EAD 与 Stage 结构迁移，而不是只看单项指标。</li>
          <li>需要解释“为什么利润波动或拨备上升”背后的结构性原因。</li>
          <li>需要在风险与财务联席管理中提供可追踪、可复盘的时序证据。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="stacked-area-sev-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">只看 Stage 3，不看 Stage 2 扩张</h3>
            <p className="text-sm text-red-700">
              Stage 2 的扩张通常领先于不良暴露，忽视该阶段会导致拨备响应滞后。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">把总量稳定误读为风险稳定</h3>
            <p className="text-sm text-red-700">
              总 EAD 变化不大并不代表风险不变，结构向 Stage 2 迁移本身就是重要预警信号。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="stacked-area-sev-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">IFRS 9 分阶段 EAD/ECL 结构变化监测</h3>
          <p className="text-base text-slate-600">
            对应节点 ID：root/q-sevnum/q-sevnum-ordered/chart-stacked-area（leaf id=chart-stacked-area）
          </p>
          <p>
            通过观察 Stage 1/2/3 在总暴露中的贡献变化，可提前识别“显著信用风险上升（SICR）”
            的扩散趋势，为拨备策略与利润管理提供前置信号。
          </p>
        </div>

        <ChartWrapper title="数据堆叠面积图：IFRS 9 Stage 结构占比迁移（%）">
          <StackedAreaSevScenarioG2 />
        </ChartWrapper>

        <p className="text-sm text-slate-500">
          说明：本场景直接使用 report 提供的 Stage 1/2/3 季度数据（虚构演示数据），并按每季度总 EAD
          换算为占比展示（纵轴为占比 %），未做额外补数。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>Stage 2 占比从 7.8% 上升到 14.3%，说明“显著风险上升”在扩散，风险可能领先于不良率。</li>
          <li>Stage 3 占比相对平稳，但 Stage 2 持续抬升，提示后续 2-3 个季度拨备与利润波动压力上行。</li>
          <li>若 Stage 2 扩张集中于涉房或小微客群，应联动名单管理、重组和风险缓释机制前置处置。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
