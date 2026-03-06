'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { VennIcon } from '@/components/viz/icons';
import { VennG2 } from '@/components/viz/charts/VennG2';
import { VennStructureRiskIntersectionScenarioG2 } from '@/components/viz/charts/VennStructureScenarioG2';

const scenarioTableRows = [
  { customer: 'SME_A', highLeverage: true, cashflowDown: true, dpd7Plus: false, balance10k: 260 },
  { customer: 'SME_B', highLeverage: true, cashflowDown: true, dpd7Plus: true, balance10k: 180 },
  { customer: 'SME_C', highLeverage: false, cashflowDown: true, dpd7Plus: true, balance10k: 95 },
  { customer: 'SME_D', highLeverage: true, cashflowDown: false, dpd7Plus: true, balance10k: 120 },
  { customer: 'SME_E', highLeverage: false, cashflowDown: false, dpd7Plus: true, balance10k: 60 },
  { customer: 'SME_F', highLeverage: true, cashflowDown: true, dpd7Plus: true, balance10k: 310 },
];

export default function VennStructureStory() {
  const outlineItems = [
    { id: 'what-is-venn-structure', label: '什么是韦恩图' },
    { id: 'when-to-use-venn-structure', label: '何时使用' },
    { id: 'venn-structure-common-mistakes', label: '常见误区' },
    { id: 'venn-structure-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="韦恩图"
      subtitle="展示风险标签交集关系，适合定位“多标签叠加”的高危客户池。"
      icon={VennIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是韦恩图？" id="what-is-venn-structure">
        <p>
          韦恩图（Venn Diagram）通过重叠圆展示集合关系，适合判断“独立命中”“双重命中”“三重命中”等交集结构。
          在风控场景中，常用于发现多风险标签叠加的重点客户群。
        </p>
        <p>英文名：Venn Diagram</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G2）">
        <VennG2 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-venn-structure">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要展示 2-3 个风险标签之间的交集结构。</li>
          <li>需要定位多标签叠加的高危客户池并优先处置。</li>
          <li>需要把标签交集分析联动到贷后和额度策略。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="venn-structure-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">只看单标签命中量</h3>
            <p className="text-sm text-red-700">
              单标签命中高不一定最危险，真正需要优先干预的是多标签叠加交集。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">忽视交集余额暴露</h3>
            <p className="text-sm text-red-700">
              交集客户数与余额暴露必须同时看，否则会低估高余额小客群风险。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="venn-structure-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">小微预警标签三集合交集（高负债×现金流转弱×DPD7+）</h3>
          <p className="text-base text-slate-600">
            对应节点 ID：root/q-structure/q-structure-set/chart-structure-set-venn（leaf id=chart-structure-set-venn）
          </p>
          <p>
            以 2025-W50（2025年第50周）样本为窗口，展示小微客户在“高负债、现金流转弱、DPD7+”三类标签下的交集关系，
            用于识别多标签叠加客户并触发优先处置。
          </p>
        </div>

        <ChartWrapper title="数据韦恩图：小微客户风险标签交集">
          <VennStructureRiskIntersectionScenarioG2 />
        </ChartWrapper>

        <p className="text-sm text-slate-500">
          说明：本场景直接使用 `docs/catenum-deep-research-report.md` 中 `VENN` 样例数据，
          无额外补数；仅将客户明细聚合为 `sets + size` 的韦恩图结构。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>DPD7+ 标签命中 5/6 户（83.33%），是当前样本的主导风险标签。</li>
          <li>三标签交集为 2 户（33.33%），贷款余额合计 490 万元，应作为优先干预池。</li>
          <li>高负债∩现金流转弱交集为 3 户（50.00%），其中 2 户已叠加 DPD7+，存在下迁风险。</li>
        </ul>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h4 className="text-base font-semibold text-slate-900 mb-3">场景样本表（单位：万元，week=2025-W50）</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                  <th className="px-3 py-2 text-left font-semibold">客户ID</th>
                  <th className="px-3 py-2 text-center font-semibold">高负债</th>
                  <th className="px-3 py-2 text-center font-semibold">现金流转弱</th>
                  <th className="px-3 py-2 text-center font-semibold">DPD7+</th>
                  <th className="px-3 py-2 text-right font-semibold">贷款余额</th>
                </tr>
              </thead>
              <tbody>
                {scenarioTableRows.map((row) => (
                  <tr key={row.customer} className="border-b border-slate-100 text-slate-700">
                    <td className="px-3 py-2">{row.customer}</td>
                    <td className="px-3 py-2 text-center">{row.highLeverage ? '是' : '否'}</td>
                    <td className="px-3 py-2 text-center">{row.cashflowDown ? '是' : '否'}</td>
                    <td className="px-3 py-2 text-center">{row.dpd7Plus ? '是' : '否'}</td>
                    <td className="px-3 py-2 text-right">{row.balance10k}</td>
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
