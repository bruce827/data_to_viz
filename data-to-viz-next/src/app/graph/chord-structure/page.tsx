'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { ChordIcon } from '@/components/viz/icons';
import { ChordG2 } from '@/components/viz/charts/ChordG2';
import { ChordRegionalFlowScenarioG2 } from '@/components/viz/charts/ChordStructureScenarioG2';

const scenarioTableRows = [
  { week: '2025-W52', from: '广东', to: '上海', amount: 120 },
  { week: '2025-W52', from: '上海', to: '江苏', amount: 85 },
  { week: '2025-W52', from: '北京', to: '广东', amount: 70 },
  { week: '2025-W52', from: '江苏', to: '四川', amount: 45 },
  { week: '2025-W52', from: '四川', to: '上海', amount: 32 },
  { week: '2025-W52', from: '广东', to: '北京', amount: 58 },
];

export default function ChordStructureStory() {
  const outlineItems = [
    { id: 'what-is-chord-structure', label: '什么是和弦图' },
    { id: 'when-to-use-chord-structure', label: '何时使用' },
    { id: 'chord-structure-common-mistakes', label: '常见误区' },
    { id: 'chord-structure-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="和弦图"
      subtitle="展示区域间双向流动关系，适合分析资金回流、沉淀与净流出压力。"
      icon={ChordIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是和弦图？" id="what-is-chord-structure">
        <p>
          和弦图（Chord Diagram）把多个实体放在同一圆环上，通过弦带展示来源实体到目标实体的流量强度。
          弦带越宽表示流量越大，适合观察多主体之间的双向流动网络。
        </p>
        <p>英文名：Chord Diagram</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G2）">
        <ChordG2 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-chord-structure">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要在同一视图里比较多个区域之间的双向流动关系。</li>
          <li>需要识别净流入中心与净流出压力区域。</li>
          <li>需要把资金流向分析联动到流动性管理策略。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="chord-structure-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">只看单条最大流，不看净流量</h3>
            <p className="text-sm text-red-700">
              单条弦带宽不代表区域资金状态健康，需结合“流入-流出”净额判断结构压力。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">忽视来源占比</h3>
            <p className="text-sm text-red-700">
              相同金额在不同来源基数下含义不同，应同时关注“占来源流出比例”。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="chord-structure-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">
            跨区域资金流向（现金管理与流动性洞察）
          </h3>
          <p className="text-base text-slate-600">
            对应节点 ID：root/q-structure/q-structure-network/chart-structure-network-chord（leaf id=chart-structure-network-chord）
          </p>
          <p>
            以 2025-W52（2025年第52周）为窗口，展示广东、上海、江苏、北京、四川之间的资金流向强度，
            用于识别区域资金回流、沉淀和净流出压力。
          </p>
        </div>

        <ChartWrapper title="数据和弦图：跨区域资金流向网络">
          <ChordRegionalFlowScenarioG2 />
        </ChartWrapper>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200 text-slate-700">
                <th className="px-4 py-3 text-left font-semibold">周次</th>
                <th className="px-4 py-3 text-left font-semibold">来源区域</th>
                <th className="px-4 py-3 text-left font-semibold">目标区域</th>
                <th className="px-4 py-3 text-right font-semibold">流量金额（亿元）</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {scenarioTableRows.map((row) => (
                <tr key={`${row.from}-${row.to}`} className="border-b border-slate-100 last:border-b-0">
                  <td className="px-4 py-3">{row.week}</td>
                  <td className="px-4 py-3">{row.from}</td>
                  <td className="px-4 py-3">{row.to}</td>
                  <td className="px-4 py-3 text-right">{row.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-sm text-slate-500">
          说明：本场景直接使用 `docs/catenum-deep-research-report.md` 中 `CHRD` 样例数据，
          无额外补数，仅补充来源占比用于 tooltip 解读。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>广东周流出合计 178 亿元、流入 70 亿元，净流出 108 亿元，需重点关注流动性补位。</li>
          <li>上海周流入 152 亿元、流出 85 亿元，净流入 67 亿元，是当前资金回流中心。</li>
          <li>江苏→四川（45亿元）与四川→上海（32亿元）形成跨区域链式流动，需要联动监控传导压力。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
