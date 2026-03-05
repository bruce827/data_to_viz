'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { AreaIcon } from '@/components/viz/icons';
import { AreaG2 } from '@/components/viz/charts/AreaG2';
import { AreaAlmScenarioG2 } from '@/components/viz/charts/AreaScenarioG2';

export default function AreaStory() {
  const outlineItems = [
    { id: 'what-is-area', label: '什么是差异图' },
    { id: 'when-to-use-area', label: '何时使用' },
    { id: 'area-common-mistakes', label: '常见误区' },
    { id: 'area-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="差异图"
      subtitle="通过两条曲线之间的面积，直观看出差额如何随时间累积。"
      icon={AreaIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是差异图？" id="what-is-area">
        <p>
          差异图（Difference Area Chart）用于展示两个时间序列之间的差值变化。
          与普通折线图相比，它用“填充面积”突出两条曲线之间的距离，更容易感知缺口扩大或收敛。
        </p>
        <p>
          当你关心的不只是“各自趋势”，而是“二者差额累计造成的压力”时，
          差异图通常比单纯双折线更具解释力。
        </p>
        <p>英文名：Difference Area Chart</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G2）">
        <AreaG2 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-area">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要观察两条相关指标的“缺口”如何随时间演化。</li>
          <li>希望突出“累计压力”而非单点波动。</li>
          <li>适用于 ALM、预算偏差、目标达成差值等场景。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="area-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">只看面积不看基线</h3>
            <p className="text-sm text-red-700">
              若忽略两条原始曲线与坐标尺度，容易夸大或低估实际缺口风险。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">忽略时间事件</h3>
            <p className="text-sm text-red-700">
              未标注政策或经营动作节点，会让差额变化“可见但不可解释”。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="area-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">ALM 存贷款缺口差异面积图</h3>
          <p className="text-base text-slate-600">对应节点 ID：root/q-2num/q-2num-ordered/chart-area（leaf id=chart-area）</p>
          <p>
            息差收窄环境下，若贷款扩张速度高于存款增长速度，缺口会推高同业负债与资金成本，
            并进一步压缩 NIM。差异图可直观看到“贷款曲线与存款曲线之间的面积（缺口累积）”。
          </p>
        </div>

        <ChartWrapper title="数据差异图：存贷款余额与缺口累积（万亿元）">
          <AreaAlmScenarioG2 />
        </ChartWrapper>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>7-8 月存款高于贷款（负缺口），9 月后转为正缺口，体现“此消彼长”下的阶段切换。</li>
          <li>10 月正缺口放大最明显，说明资产端扩张快于负债端补充，需关注阶段性资金压力。</li>
          <li>11-12 月缺口收敛，反映负债端回补后压力缓释，但仍需持续监控缺口反弹。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
