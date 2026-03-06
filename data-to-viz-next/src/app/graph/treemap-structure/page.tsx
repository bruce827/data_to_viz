'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { TreemapIcon } from '@/components/viz/icons';
import { TreemapG2 } from '@/components/viz/charts/TreemapG2';
import { TreemapStructureExposureScenarioG2 } from '@/components/viz/charts/TreemapStructureScenarioG2';

const scenarioTableRows = [
  { asOf: '2025-12-31', lvl1: '房地产相关', lvl2: '开发贷', ead100m: 5200, npl: 0.03, esg: '高' },
  { asOf: '2025-12-31', lvl1: '房地产相关', lvl2: '建筑施工', ead100m: 3100, npl: 0.024, esg: '中' },
  { asOf: '2025-12-31', lvl1: '制造业', lvl2: '先进制造', ead100m: 6800, npl: 0.012, esg: '中' },
  { asOf: '2025-12-31', lvl1: '制造业', lvl2: '高耗能行业', ead100m: 2400, npl: 0.016, esg: '高' },
  { asOf: '2025-12-31', lvl1: '基建公用', lvl2: '交通基建', ead100m: 2900, npl: 0.01, esg: '中' },
  { asOf: '2025-12-31', lvl1: '批发零售', lvl2: '大宗贸易', ead100m: 2100, npl: 0.018, esg: '中' },
];

export default function TreemapStructureStory() {
  const outlineItems = [
    { id: 'what-is-treemap-structure', label: '什么是矩形树图' },
    { id: 'when-to-use-treemap-structure', label: '何时使用' },
    { id: 'treemap-structure-common-mistakes', label: '常见误区' },
    { id: 'treemap-structure-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="矩形树图"
      subtitle="在一屏内展示行业-子行业层级的规模与风险集中度，适合敞口穿透分析。"
      icon={TreemapIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是矩形树图？" id="what-is-treemap-structure">
        <p>
          矩形树图（Treemap）用嵌套矩形表达层级结构，面积映射规模，颜色映射风险属性，
          适合在一张图中同时观察“行业集中度”和“风险分层”。
        </p>
        <p>英文名：Treemap</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G2）">
        <TreemapG2 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-treemap-structure">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要同时对比行业规模与子行业风险分布。</li>
          <li>需要识别“规模大+风险高”的集中敞口组合。</li>
          <li>需要将行业结构分析联动授信限额与组合调整策略。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="treemap-structure-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">只看面积，不看颜色含义</h3>
            <p className="text-sm text-red-700">
              面积只代表敞口规模，风险等级需要结合颜色和 NPL 才能完整判断。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">只看一级行业，不看子行业分化</h3>
            <p className="text-sm text-red-700">
              一级行业稳定不代表内部稳定，子行业结构差异可能才是风险真正来源。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="treemap-structure-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">对公风险敞口集中度（行业→子行业）</h3>
          <p className="text-base text-slate-600">
            对应节点 ID：root/q-structure/q-structure-hierarchy/chart-structure-hierarchy-treemap（leaf id=chart-structure-hierarchy-treemap）
          </p>
          <p>
            以 2025-12-31（2025年12月31日）为窗口，展示行业与子行业的 EAD（敞口）规模，并用颜色表示风险分层（ESG等级 + NPL），
            用于识别房地产链条和高碳行业的集中暴露。
          </p>
        </div>

        <ChartWrapper title="数据矩形树图：行业与子行业敞口分布">
          <TreemapStructureExposureScenarioG2 />
        </ChartWrapper>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h4 className="text-base font-semibold text-slate-900 mb-3">场景数据表（单位：亿元，as_of=2025-12-31）</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                  <th className="px-3 py-2 text-left font-semibold">一级行业</th>
                  <th className="px-3 py-2 text-left font-semibold">子行业</th>
                  <th className="px-3 py-2 text-right font-semibold">EAD</th>
                  <th className="px-3 py-2 text-right font-semibold">NPL</th>
                  <th className="px-3 py-2 text-right font-semibold">ESG风险等级</th>
                </tr>
              </thead>
              <tbody>
                {scenarioTableRows.map((row) => (
                  <tr key={`${row.lvl1}-${row.lvl2}`} className="border-b border-slate-100 text-slate-700">
                    <td className="px-3 py-2">{row.lvl1}</td>
                    <td className="px-3 py-2">{row.lvl2}</td>
                    <td className="px-3 py-2 text-right">{(row.ead100m / 10).toFixed(1)}</td>
                    <td className="px-3 py-2 text-right">{(row.npl * 100).toFixed(2)}%</td>
                    <td className="px-3 py-2 text-right">{row.esg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-sm text-slate-500">
          说明：本场景直接使用 `docs/catenum-deep-research-report.md` 中 `TREE` 样例数据，
          无额外补数，仅将二维表转换为 treemap 层级结构以满足图表渲染格式。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>房地产相关总敞口 830 亿元且 NPL 加权约 2.78%，属于高关注组合。</li>
          <li>制造业总敞口 920 亿元为最大块，其中“高耗能行业”ESG 风险等级为高，需要分层治理。</li>
          <li>批发零售和基建公用规模较小，但仍应关注单点子行业的风险变化与限额占用。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
