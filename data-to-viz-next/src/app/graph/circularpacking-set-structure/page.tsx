'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { CircularPackingIcon } from '@/components/viz/icons';
import { CircularPackingSetG2 } from '@/components/viz/charts/CircularPackingSetG2';
import { CircularPackingSetStructureScenarioG2 } from '@/components/viz/charts/CircularPackingSetStructureScenarioG2';

const scenarioTableRows = [
  { month: '2025-12', riskBucket: 'AML可疑交易', eventCnt: 8200, loss10k: 0, closeRate: 0.91 },
  { month: '2025-12', riskBucket: '客户投诉', eventCnt: 12600, loss10k: 180, closeRate: 0.88 },
  { month: '2025-12', riskBucket: '操作风险事件', eventCnt: 430, loss10k: 520, closeRate: 0.76 },
  { month: '2025-12', riskBucket: '数据安全告警', eventCnt: 980, loss10k: 0, closeRate: 0.84 },
  { month: '2025-12', riskBucket: '授信合规缺陷', eventCnt: 210, loss10k: 60, closeRate: 0.72 },
  { month: '2025-12', riskBucket: '交易异常/欺诈', eventCnt: 1600, loss10k: 240, closeRate: 0.79 },
];

export default function CircularPackingSetStructureStory() {
  const outlineItems = [
    { id: 'what-is-circular-packing-set-structure', label: '什么是圆形填充图' },
    { id: 'when-to-use-circular-packing-set-structure', label: '何时使用' },
    { id: 'circular-packing-set-structure-common-mistakes', label: '常见误区' },
    { id: 'circular-packing-set-structure-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="圆形填充图（集合视角）"
      subtitle="展示多类风险事件桶的规模分布，适合识别“事件量大”与“损失高”的治理优先级。"
      icon={CircularPackingIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是圆形填充图？" id="what-is-circular-packing-set-structure">
        <p>
          圆形填充图（Circular Packing）用嵌套圆展示集合及子集合规模，圆面积映射数值大小。
          在集合分析中，它适合对多个事件桶做规模对比，并保留分组层级。
        </p>
        <p>英文名：Circular Packing</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G2）">
        <CircularPackingSetG2 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-circular-packing-set-structure">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要在一图内比较多个风险事件桶的规模。</li>
          <li>需要按关注等级对事件桶分层展示，支持排班与治理优先级。</li>
          <li>需要把事件数量、损失和整改完成率放到同一分析视角。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="circular-packing-set-structure-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">只看事件量，不看损失</h3>
            <p className="text-sm text-red-700">
              事件量高不一定损失最高，需结合损失金额与整改完成率确定优先级。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">忽略长尾高损失事件</h3>
            <p className="text-sm text-red-700">
              某些事件桶数量小但单笔损失高，若只盯大圆会漏掉关键风险点。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="circular-packing-set-structure-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">多类合规风险事件规模对比</h3>
          <p className="text-base text-slate-600">
            对应节点 ID：root/q-structure/q-structure-set/chart-structure-set-circular-packing（leaf id=chart-structure-set-circular-packing）
          </p>
          <p>
            以 2025-12（2025年12月）为窗口，展示 AML 可疑交易、客户投诉、操作风险事件、数据安全告警等风险桶的事件规模，
            并按“高关注/中关注/低关注”分组，用于明确治理优先级。
          </p>
        </div>

        <ChartWrapper title="数据圆形填充图：风险事件桶规模与关注等级">
          <CircularPackingSetStructureScenarioG2 />
        </ChartWrapper>

        <p className="text-sm text-slate-500">
          说明：本场景直接使用 `docs/catenum-deep-research-report.md` 中 `CPAKS` 样例数据，
          无额外补数；仅补充“关注等级”分组以形成层级 pack 结构。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>客户投诉事件量最大（12,600 条），占总事件池约 52.46%，是规模主导风险桶。</li>
          <li>高关注组事件仅占 9.33%，但损失金额占比约 82.00%，应优先投入治理资源。</li>
          <li>操作风险事件整改完成率 76.00%，低于 80% 阈值，需专项整改跟踪。</li>
        </ul>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h4 className="text-base font-semibold text-slate-900 mb-3">场景数据表（单位：条/万元，month=2025-12）</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                  <th className="px-3 py-2 text-left font-semibold">风险桶</th>
                  <th className="px-3 py-2 text-right font-semibold">事件数</th>
                  <th className="px-3 py-2 text-right font-semibold">损失金额</th>
                  <th className="px-3 py-2 text-right font-semibold">整改完成率</th>
                </tr>
              </thead>
              <tbody>
                {scenarioTableRows.map((row) => (
                  <tr key={row.riskBucket} className="border-b border-slate-100 text-slate-700">
                    <td className="px-3 py-2">{row.riskBucket}</td>
                    <td className="px-3 py-2 text-right">{row.eventCnt.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right">{row.loss10k.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right">{(row.closeRate * 100).toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </StorySection>
    </StoryLayout>
  );
}
