'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { ArcIcon } from '@/components/viz/icons';
import { ArcDiagramG2 } from '@/components/viz/charts/ArcDiagramG2';
import { ArcGroupExposureScenarioG2 } from '@/components/viz/charts/ArcScenarioG2';

const scenarioTableRows = [
  { quarter: '2025Q4', center: '集团B', node: '子公司B1', relation: '授信', ead: 18.0, pd: '1.20%' },
  { quarter: '2025Q4', center: '集团B', node: '子公司B2', relation: '授信', ead: 22.5, pd: '1.50%' },
  { quarter: '2025Q4', center: '集团B', node: '项目公司P2', relation: '授信', ead: 35.0, pd: '2.80%' },
  { quarter: '2025Q4', center: '集团B', node: '供应商S3', relation: '担保', ead: 6.0, pd: '2.00%' },
  { quarter: '2025Q4', center: '集团B', node: '供应商S4', relation: '担保', ead: 4.5, pd: '1.80%' },
  { quarter: '2025Q4', center: '集团B', node: '关联方R1', relation: '关联交易', ead: 9.0, pd: '2.20%' },
];

export default function ArcStory() {
  const outlineItems = [
    { id: 'what-is-arc', label: '什么是弧形关系图' },
    { id: 'when-to-use-arc', label: '何时使用' },
    { id: 'arc-common-mistakes', label: '常见误区' },
    { id: 'arc-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="弧形关系图"
      subtitle="将节点按一维顺序排布并用弧线连接，适合查看中心节点向外辐射的集中关系。"
      icon={ArcIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是弧形关系图？" id="what-is-arc">
        <p>
          弧形关系图（Arc Diagram）会把节点放在同一基线上，用弧线连接存在关系的节点。
          它特别适合“中心节点-外围节点”的穿透式结构分析，能直观看到哪些连接最粗、最集中。
        </p>
        <p>英文名：Arc Diagram</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G2）">
        <ArcDiagramG2 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-arc">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要围绕单一集团或核心客户，查看对外授信/担保/关联交易分布。</li>
          <li>需要快速识别“长弧+粗弧”的高强度关系，定位集中敞口风险。</li>
          <li>需要在相同节点集合下对比不同季度的关系结构变化。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="arc-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">只看连接条数，不看连接宽度</h3>
            <p className="text-sm text-red-700">
              连接数量多不代表集中度高。应优先关注 EAD 更大的粗弧关系。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">忽视中心节点合并敞口</h3>
            <p className="text-sm text-red-700">
              单条关系可控不等于整体可控。需叠加中心节点总 EAD 与资本约束判断。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="arc-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">
            集团客户“中心-子公司/供应链”授信关系集中度
          </h3>
          <p className="text-base text-slate-600">
            对应节点 ID：root/q-structure/q-structure-network/chart-structure-network-arc（leaf id=chart-structure-network-arc）
          </p>
          <p>
            以 2025Q4（2025年第四季度）为窗口，展示集团B作为中心节点与子公司、项目公司、供应商、
            关联方之间的授信与担保关系。弧线宽度映射 EAD（违约风险暴露额），用于识别集中度红线。
          </p>
        </div>

        <ChartWrapper title="数据弧形关系图：集团B辐射关系与敞口强度">
          <ArcGroupExposureScenarioG2 />
        </ChartWrapper>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200 text-slate-700">
                <th className="px-4 py-3 text-left font-semibold">季度</th>
                <th className="px-4 py-3 text-left font-semibold">中心节点</th>
                <th className="px-4 py-3 text-left font-semibold">关联节点</th>
                <th className="px-4 py-3 text-left font-semibold">关系类型</th>
                <th className="px-4 py-3 text-right font-semibold">EAD（亿元）</th>
                <th className="px-4 py-3 text-right font-semibold">PD</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {scenarioTableRows.map((row) => (
                <tr key={row.node} className="border-b border-slate-100 last:border-b-0">
                  <td className="px-4 py-3">{row.quarter}</td>
                  <td className="px-4 py-3">{row.center}</td>
                  <td className="px-4 py-3">{row.node}</td>
                  <td className="px-4 py-3">{row.relation}</td>
                  <td className="px-4 py-3 text-right">{row.ead.toFixed(1)}</td>
                  <td className="px-4 py-3 text-right">{row.pd}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-sm text-slate-500">
          说明：本场景直接使用 `docs/catenum-deep-research-report.md` 中 `ARCD` 样例数据，
          未额外补数，仅做 arc 渲染所需的节点顺序编排与 tooltip 字段格式化。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>项目公司P2 的单点 EAD 最高（35.0 亿元），且 PD 达 2.80%，是第一优先监测对象。</li>
          <li>集团B 对外总 EAD 为 95.0 亿元，其中授信关系占比约 79.47%，集中在子公司与项目公司。</li>
          <li>担保与关联交易合计 19.5 亿元，虽然规模较小，但对应 PD 均高于 1.80%，需纳入穿透监控。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
