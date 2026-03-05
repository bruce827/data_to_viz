'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { LineIcon } from '@/components/viz/icons';
import { LineG2 } from '@/components/viz/charts/LineG2';
import { LineNplScenarioG2 } from '@/components/viz/charts/LineScenarioG2';

export default function LineStory() {
  const outlineItems = [
    { id: 'what-is-line', label: '什么是折线图' },
    { id: 'when-to-use-line', label: '何时使用' },
    { id: 'line-common-mistakes', label: '常见误区' },
    { id: 'line-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="折线图"
      subtitle="用于展示单指标在时间序列上的变化趋势与拐点。"
      icon={LineIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是折线图？" id="what-is-line">
        <p>
          折线图（Line Chart）通过把不同时间点的数值连接起来，展示指标随时间的变化轨迹。
          它特别适合观察趋势方向、波动幅度和关键拐点。
        </p>
        <p>
          当核心问题是“指标是否在改善、恶化或震荡”时，折线图通常是最直接的表达方式。
        </p>
        <p>英文名：Line Chart</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G2）">
        <LineG2 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-line">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要持续监控单个核心指标（如不良率、转化率、留存率）。</li>
          <li>需要识别拐点并回溯对应事件。</li>
          <li>需要与阈值线或目标线结合做预警展示。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="line-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">只看点位不看结构</h3>
            <p className="text-sm text-red-700">
              表面稳定不代表风险消失，应同步观察相关领先指标与结构变量。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">时间粒度混用</h3>
            <p className="text-sm text-red-700">
              季度、年度等口径混在同一轴上，会造成趋势误读。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="line-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">行业 NPL 比率趋势监控</h3>
          <p className="text-base text-slate-600">对应节点 ID：root/q-2num/q-2num-ordered/chart-line（leaf id=chart-line）</p>
          <p>
            对董事会与风险管理委员会而言，NPL 比率是最常见的资产质量趋势指标。
            折线图可将监管披露时点串联，辅助判断“不良率稳定”是否只是表象。
          </p>
        </div>

        <ChartWrapper title="数据折线图：行业 NPL 比率（%）">
          <LineNplScenarioG2 />
        </ChartWrapper>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>NPL 在 1.50%-1.59% 区间窄幅波动，趋势整体平稳但结构风险仍需跟踪。</li>
          <li>2025Q3 到 2025Q4 出现小幅回落，反映阶段性改善，但不能替代穿透式监测。</li>
          <li>建议与早期逾期率、关注率等前瞻指标联动，避免“低波动即低风险”的误判。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
