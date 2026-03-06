'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { CircularPackingIcon } from '@/components/viz/icons';
import { CircularPackingHierarchyG2 } from '@/components/viz/charts/CircularPackingHierarchyG2';
import { CircularPackingStructureSegmentScenarioG2 } from '@/components/viz/charts/CircularPackingStructureScenarioG2';

const scenarioTableRows = [
  { month: '2025-12', segment: '新市民', riskBand: '高', customerCnt: 180000, balance100m: 920, pd: 0.022 },
  { month: '2025-12', segment: '新市民', riskBand: '中', customerCnt: 420000, balance100m: 1460, pd: 0.014 },
  { month: '2025-12', segment: '大众', riskBand: '中', customerCnt: 980000, balance100m: 3100, pd: 0.011 },
  { month: '2025-12', segment: '大众', riskBand: '低', customerCnt: 760000, balance100m: 2850, pd: 0.006 },
  { month: '2025-12', segment: '高净值', riskBand: '低', customerCnt: 120000, balance100m: 2100, pd: 0.003 },
  { month: '2025-12', segment: '高净值', riskBand: '中', customerCnt: 45000, balance100m: 980, pd: 0.007 },
];

export default function CircularPackingStructureStory() {
  const outlineItems = [
    { id: 'what-is-circular-packing-structure', label: '什么是圆形填充图' },
    { id: 'when-to-use-circular-packing-structure', label: '何时使用' },
    { id: 'circular-packing-structure-common-mistakes', label: '常见误区' },
    { id: 'circular-packing-structure-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="圆形填充图"
      subtitle="用嵌套圆表达客群与风险等级的规模结构，适合识别“规模大且风险高”的细分群体。"
      icon={CircularPackingIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是圆形填充图？" id="what-is-circular-packing-structure">
        <p>
          圆形填充图（Circular Packing）通过父子嵌套圆表达层级结构，圆面积映射数值大小。
          它适合展示“总盘-群体-风险层级”的结构分布，便于快速定位重点群体。
        </p>
        <p>英文名：Circular Packing</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G2）">
        <CircularPackingHierarchyG2 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-circular-packing-structure">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要在一图中同时查看客群规模和风险等级结构。</li>
          <li>需要识别“高风险且规模不小”的重点治理人群。</li>
          <li>需要联动定价、额度和贷后策略做分层经营。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="circular-packing-structure-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">只看圆大小，不看风险层级</h3>
            <p className="text-sm text-red-700">
              同一客群中不同风险层级策略完全不同，必须结合“客群+风险”双层级解读。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">只看客户数，不看余额和PD</h3>
            <p className="text-sm text-red-700">
              客户数大不代表风险最大，需同时关注余额暴露与平均 PD。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="circular-packing-structure-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">零售客户分群（规模 × 风险等级）</h3>
          <p className="text-base text-slate-600">
            对应节点 ID：root/q-structure/q-structure-hierarchy/chart-structure-hierarchy-circular-packing（leaf id=chart-structure-hierarchy-circular-packing）
          </p>
          <p>
            以 2025-12（2025年12月）为窗口，展示新市民、大众、高净值三类客群在高/中/低风险层级下的客户规模和风险特征，
            用于支持分层授信与贷后策略。
          </p>
        </div>

        <ChartWrapper title="数据圆形填充图：客群与风险分层结构">
          <CircularPackingStructureSegmentScenarioG2 />
        </ChartWrapper>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h4 className="text-base font-semibold text-slate-900 mb-3">场景数据表（单位：户/亿元，month=2025-12）</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                  <th className="px-3 py-2 text-left font-semibold">客群</th>
                  <th className="px-3 py-2 text-left font-semibold">风险等级</th>
                  <th className="px-3 py-2 text-right font-semibold">客户数</th>
                  <th className="px-3 py-2 text-right font-semibold">贷款余额</th>
                  <th className="px-3 py-2 text-right font-semibold">平均PD</th>
                </tr>
              </thead>
              <tbody>
                {scenarioTableRows.map((row) => (
                  <tr key={`${row.segment}-${row.riskBand}`} className="border-b border-slate-100 text-slate-700">
                    <td className="px-3 py-2">{row.segment}</td>
                    <td className="px-3 py-2">{row.riskBand}</td>
                    <td className="px-3 py-2 text-right">{row.customerCnt.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right">{(row.balance100m / 10).toFixed(1)}</td>
                    <td className="px-3 py-2 text-right">{(row.pd * 100).toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-sm text-slate-500">
          说明：本场景直接使用 `docs/catenum-deep-research-report.md` 中 `CPAK` 样例数据，
          无额外补数，仅转换为 `客群 到 风险等级` 的层级结构。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>大众客群合计 174 万户，占总盘约 69.46%，是零售规模主力人群。</li>
          <li>新市民高风险人群 18 万户，平均 PD 为 2.20%，应优先纳入强化贷后策略。</li>
          <li>高净值低风险客群客户数较小（12 万户），但余额规模 210 亿元，需重视高价值客户稳定性。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
