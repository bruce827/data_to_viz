'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { SankeyIcon } from '@/components/viz/icons';
import { SankeyG2 } from '@/components/viz/charts/SankeyG2';
import { SankeyStructureMigrationScenarioG2 } from '@/components/viz/charts/SankeyStructureScenarioG2';

const scenarioTableRows = [
  { quarter: '2025Q3', source: '正常', target: '关注', flow: 240 },
  { quarter: '2025Q3', source: '关注', target: '不良', flow: 110 },
  { quarter: '2025Q3', source: '不良', target: '核销', flow: 65 },
  { quarter: '2025Q3', source: '不良', target: '现金清收', flow: 28 },
  { quarter: '2025Q3', source: '关注', target: '重组/展期', flow: 54 },
  { quarter: '2025Q3', source: '重组/展期', target: '不良', flow: 22 },
];

export default function SankeyStructureStory() {
  const outlineItems = [
    { id: 'what-is-sankey-structure', label: '什么是桑基图' },
    { id: 'when-to-use-sankey-structure', label: '何时使用' },
    { id: 'sankey-structure-common-mistakes', label: '常见误区' },
    { id: 'sankey-structure-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="桑基图"
      subtitle="以流线宽度表达迁徙规模，适合做贷款状态迁徙与风险出清路径分析。"
      icon={SankeyIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是桑基图？" id="what-is-sankey-structure">
        <p>
          桑基图（Sankey）通过连接带宽展示从来源节点到目标节点的流量大小，
          适合表达“状态迁徙”与“结构流向”。在风控场景中，常用于观察贷款从正常到关注、再到不良与处置的迁徙链路。
        </p>
        <p>英文名：Sankey</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G2）">
        <SankeyG2 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-sankey-structure">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要同时看“迁徙方向”和“迁徙规模”，而不只是看期末余额。</li>
          <li>需要识别关注类贷款向不良迁徙的主通道。</li>
          <li>需要联动核销、清收与重组策略，判断风险是堆积还是出清。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="sankey-structure-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">只看节点，不看路径回流</h3>
            <p className="text-sm text-red-700">
              仅看不良规模会漏掉“重组/展期回流不良”等高风险反复迁徙路径。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">忽略来源占比口径</h3>
            <p className="text-sm text-red-700">
              同样是 100 亿元，不同来源基数下风险含义不同，应结合占来源状态比例一起看。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="sankey-structure-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">
            贷款五级分类迁徙（正常→关注→不良→处置）
          </h3>
          <p className="text-base text-slate-600">
            对应节点 ID：root/q-structure/q-structure-flow/chart-structure-flow-sankey（leaf id=chart-structure-flow-sankey）
          </p>
          <p>
            以 2025Q3（2025年第三季度）为窗口，展示贷款迁徙到关注、不良、核销和现金清收的流向结构，
            用于识别关键恶化路径与处置效率。
          </p>
        </div>

        <ChartWrapper title="数据桑基图：贷款状态迁徙流向">
          <SankeyStructureMigrationScenarioG2 />
        </ChartWrapper>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200 text-slate-700">
                <th className="px-4 py-3 text-left font-semibold">季度</th>
                <th className="px-4 py-3 text-left font-semibold">来源状态</th>
                <th className="px-4 py-3 text-left font-semibold">目标状态</th>
                <th className="px-4 py-3 text-right font-semibold">迁徙金额（亿元）</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {scenarioTableRows.map((row) => (
                <tr key={`${row.source}-${row.target}`} className="border-b border-slate-100 last:border-b-0">
                  <td className="px-4 py-3">{row.quarter}</td>
                  <td className="px-4 py-3">{row.source}</td>
                  <td className="px-4 py-3">{row.target}</td>
                  <td className="px-4 py-3 text-right">{row.flow}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-sm text-slate-500">
          说明：本场景直接使用 `docs/catenum-deep-research-report.md` 中 `SANK` 样例边表数据，
          无额外补数，仅补充 tooltip 占比字段以解释迁徙强度。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>关注→不良为 110 亿元，占关注类流出的 67.07%，是核心恶化路径。</li>
          <li>不良→核销为 65 亿元，占不良类流出的 69.89%，当前以核销作为主要处置方式。</li>
          <li>重组/展期→不良为 22 亿元，显示重组资产仍有再次下迁风险，需要专项复盘。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
