'use client';

import React from 'react';
import Image from 'next/image';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { GroupedBarIcon } from '@/components/viz/icons';
import { GroupedBarRetailRiskScenarioG2 } from '@/components/viz/charts/GroupedBarScenarioG2';

export default function GroupedBarStory() {
  const outlineItems = [
    { id: 'what-is-grouped-bar', label: '什么是分组条形图' },
    { id: 'when-to-use-grouped-bar', label: '何时使用' },
    { id: 'grouped-bar-common-mistakes', label: '常见误区' },
    { id: 'grouped-bar-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="分组条形图"
      subtitle="在同一类别内并列展示多个系列，适合比较“产品×渠道”这类分组差异。"
      icon={GroupedBarIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是分组条形图？" id="what-is-grouped-bar">
        <p>
          分组条形图（Grouped Barplot）会在每个主类别下并列放置多个条形，用于比较同一维度下不同分组的数值差异。
          它比堆叠条形图更适合做“组间直接对比”。
        </p>
        <p>英文名：Grouped Barplot</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G2）">
        <figure className="rounded-lg border border-slate-200 bg-white p-2">
          <Image
            src="/images/graph/groupedbar/interactive-example-1.png"
            alt="分组条形图交互示例"
            width={1918}
            height={1134}
            className="w-full h-auto rounded-md"
          />
        </figure>
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-grouped-bar">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要比较同一类别下不同子组的指标差异。</li>
          <li>需要在“产品、渠道、客群”之间做快速横向对比。</li>
          <li>需要识别某个子组是否持续高于其他子组并触发策略联动。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="grouped-bar-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">组别过多导致可读性下降</h3>
            <p className="text-sm text-red-700">
              每个主类下分组过多会让条形拥挤。应控制组数，或拆分为小多图展示。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">把分组图当结构占比图</h3>
            <p className="text-sm text-red-700">
              分组条形图强调组间差异，不强调总量构成。看占比结构应使用堆叠百分比图。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="grouped-bar-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">
            零售三大产品线逾期率“渠道×客群”分组对比
          </h3>
          <p className="text-base text-slate-600">
            对应节点 ID：root/q-combo/q-combo-mcat-1num/chart-combo-mcat-1num-grouped-bar（leaf id=chart-combo-mcat-1num-grouped-bar）
          </p>
          <p>
            按产品（信用卡、消费贷、按揭）对比不同渠道-客群组合的 DPD30（30天逾期率）与
            DPD7（7天逾期率）差异，用于识别线上获客策略是否出现风险定价偏差。
            本示例使用 report 给出的 2025-W48（2025年第48周）样例数据，当前粒度仅覆盖“新客”。
          </p>
        </div>

        <ChartWrapper title="数据分组条形图：产品×渠道-客群 DPD30 对比">
          <GroupedBarRetailRiskScenarioG2 />
        </ChartWrapper>

        <p className="text-sm text-slate-500">
          说明：本场景直接使用 `docs/catenum-deep-research-report.md` 中 `GBAR`
          对应样例数据，不额外补充“存量客”数据。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>信用卡与消费贷在“线上-新客”组的 DPD30 均高于“线下-新客”，差异分别为 0.20 和 0.10 个百分点。</li>
          <li>按揭产品中“线上-新客”DPD30 低于“线下-新客”（0.06% vs 0.07%），表现与前两类产品不同。</li>
          <li>信用卡线上新客活跃账户数最高（182,000 户），需要优先关注规模与风险叠加效应。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
