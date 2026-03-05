'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { TreemapIcon } from '@/components/viz/icons';
import { TreemapG2 } from '@/components/viz/charts/TreemapG2';
import { TreemapCorpExposureScenarioG2 } from '@/components/viz/charts/TreemapScenarioG2';

const scenarioTableRows = [
  { industry: '制造业', subIndustry: '高端装备', eadYi: 820, rwaYi: 520, pd: 0.018, lgd: 0.35, expectedLossYi: 5.17 },
  { industry: '制造业', subIndustry: '汽车零部件', eadYi: 610, rwaYi: 380, pd: 0.022, lgd: 0.38, expectedLossYi: 5.1 },
  { industry: '制造业', subIndustry: '化工/新材料', eadYi: 540, rwaYi: 410, pd: 0.028, lgd: 0.45, expectedLossYi: 6.8 },
  { industry: '基建', subIndustry: '市政公用', eadYi: 760, rwaYi: 390, pd: 0.016, lgd: 0.3, expectedLossYi: 3.65 },
  { industry: '基建', subIndustry: '交通运输', eadYi: 680, rwaYi: 360, pd: 0.019, lgd: 0.32, expectedLossYi: 4.13 },
  { industry: '房地产', subIndustry: '住宅开发', eadYi: 420, rwaYi: 610, pd: 0.045, lgd: 0.55, expectedLossYi: 10.4 },
  { industry: '房地产', subIndustry: '商业地产', eadYi: 260, rwaYi: 390, pd: 0.052, lgd: 0.6, expectedLossYi: 8.11 },
  { industry: '能源', subIndustry: '新能源', eadYi: 590, rwaYi: 340, pd: 0.021, lgd: 0.33, expectedLossYi: 4.09 },
  { industry: '能源', subIndustry: '传统能源', eadYi: 310, rwaYi: 260, pd: 0.03, lgd: 0.4, expectedLossYi: 3.72 },
  { industry: '批发零售', subIndustry: '连锁零售', eadYi: 370, rwaYi: 280, pd: 0.026, lgd: 0.42, expectedLossYi: 4.04 },
  { industry: '科技', subIndustry: '软件服务', eadYi: 450, rwaYi: 240, pd: 0.02, lgd: 0.35, expectedLossYi: 3.15 },
  { industry: '普惠', subIndustry: '小微工商户', eadYi: 520, rwaYi: 420, pd: 0.034, lgd: 0.5, expectedLossYi: 8.84 },
];

export default function TreemapStory() {
  const outlineItems = [
    { id: 'what-is-treemap', label: '什么是矩形树图' },
    { id: 'when-to-use-treemap', label: '何时使用' },
    { id: 'treemap-common-mistakes', label: '常见误区' },
    { id: 'treemap-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="矩形树图"
      subtitle="通过嵌套矩形同时展示层级与规模，适合识别“规模大且风险密度高”的行业组合。"
      icon={TreemapIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是矩形树图？" id="what-is-treemap">
        <p>
          矩形树图（Treemap）使用嵌套矩形表达层级结构，矩形面积对应数值大小。
          它可以在同一视图里同时表达“父子层级 + 规模对比”，适合行业-子行业、产品-子产品这类层级型业务数据。
        </p>
        <p>英文名：Treemap</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G2）">
        <TreemapG2 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-treemap">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要同时展示层级结构和规模占比。</li>
          <li>类别很多，条形图容易拥挤，难以一屏表达全貌。</li>
          <li>需要快速识别“面积大 + 风险高”的重点对象。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="treemap-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">只看面积不看风险密度</h3>
            <p className="text-sm text-red-700">
              面积大代表规模大，但不一定风险高；需要叠加颜色表达风险密度（例如 EL/EAD）。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">层级标签过多导致不可读</h3>
            <p className="text-sm text-red-700">
              深层节点标签拥挤会影响可读性，建议主图保留关键标签，详细指标放到 tooltip 与数据表。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="treemap-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">对公行业敞口与资本占用（RWA）穿透</h3>
          <p className="text-base text-slate-600">
            对应节点 ID：root/q-1cat/chart-treemap（leaf id=chart-treemap）
          </p>
          <p>
            以行业 → 子行业展示 EAD（风险暴露）规模，并用颜色标记风险密度（EL/EAD）。
            在资本约束增强背景下，该视图可快速定位“规模大且资本消耗高”的资产组合，支撑授信限额与结构调整。
          </p>
        </div>

        <ChartWrapper title="数据矩形树图：行业敞口规模与风险密度分层">
          <TreemapCorpExposureScenarioG2 />
        </ChartWrapper>

        <p className="text-sm text-slate-500">
          说明：本场景使用 `docs/cate-deep-research-report.md` 中 `chart-treemap` 样例数据；
          原始为二维明细（行业/子行业），通过层级聚合转换为 treemap 结构，未改变指标口径。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>房地产相关子行业虽然 EAD 规模并非最大，但 EL/EAD 明显偏高，属于高风险密度区域。</li>
          <li>制造业与基建 EAD 合计占比过半，是组合规模主力；但制造业内部存在分化（如化工/新材料风险密度偏高），需做子行业精细化跟踪。</li>
          <li>建议将本图与行业限额策略联动，优先压降“高 RWA 高 EL 密度”子行业敞口。</li>
        </ul>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h4 className="text-base font-semibold text-slate-900 mb-3">场景数据表（单位：亿元，as_of=2025-12-31）</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                  <th className="px-3 py-2 text-left font-semibold">行业</th>
                  <th className="px-3 py-2 text-left font-semibold">子行业</th>
                  <th className="px-3 py-2 text-right font-semibold">EAD</th>
                  <th className="px-3 py-2 text-right font-semibold">RWA</th>
                  <th className="px-3 py-2 text-right font-semibold">PD</th>
                  <th className="px-3 py-2 text-right font-semibold">LGD</th>
                  <th className="px-3 py-2 text-right font-semibold">EL</th>
                </tr>
              </thead>
              <tbody>
                {scenarioTableRows.map((row) => (
                  <tr key={`${row.industry}-${row.subIndustry}`} className="border-b border-slate-100 text-slate-700">
                    <td className="px-3 py-2">{row.industry}</td>
                    <td className="px-3 py-2">{row.subIndustry}</td>
                    <td className="px-3 py-2 text-right">{row.eadYi.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right">{row.rwaYi.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right">{(row.pd * 100).toFixed(2)}%</td>
                    <td className="px-3 py-2 text-right">{(row.lgd * 100).toFixed(2)}%</td>
                    <td className="px-3 py-2 text-right">{row.expectedLossYi.toFixed(2)}</td>
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
