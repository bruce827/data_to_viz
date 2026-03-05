'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { SunburstIcon } from '@/components/viz/icons';
import { SunburstG2 } from '@/components/viz/charts/SunburstG2';
import { SunburstEsgScenarioG2 } from '@/components/viz/charts/SunburstScenarioG2';

const scenarioTableRows = [
  { level: '一级分类', category: '绿色减缓', balanceYi: 2400, share: 0.4615 },
  { level: '一级分类', category: '转型金融', balanceYi: 1300, share: 0.25 },
  { level: '一级分类', category: '绿色适应', balanceYi: 900, share: 0.1731 },
  { level: '一级分类', category: '社会包容', balanceYi: 600, share: 0.1154 },
  { level: '二级赛道', category: '清洁能源', balanceYi: 980, share: 0.1885 },
  { level: '二级赛道', category: '能效提升', balanceYi: 740, share: 0.1423 },
  { level: '二级赛道', category: '钢铁低碳改造', balanceYi: 420, share: 0.0808 },
  { level: '二级赛道', category: '煤电灵活性改造', balanceYi: 320, share: 0.0615 },
];

export default function SunburstStory() {
  const outlineItems = [
    { id: 'what-is-sunburst', label: '什么是旭日图' },
    { id: 'when-to-use-sunburst', label: '何时使用' },
    { id: 'sunburst-common-mistakes', label: '常见误区' },
    { id: 'sunburst-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="旭日图"
      subtitle="通过同心环表达层级结构与占比，适合展示 ESG 组合在不同主题与赛道上的分布。"
      icon={SunburstIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是旭日图？" id="what-is-sunburst">
        <p>
          旭日图（Sunburst）使用同心圆环展示层级结构，外圈表示更细粒度层级，扇区角度（面积）对应数值大小。
          它适合回答“总盘如何分层分配、每层中谁占主导”这类结构问题。
        </p>
        <p>英文名：Sunburst</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G2）">
        <SunburstG2 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-sunburst">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要展示“总盘 → 一级分类 → 二级赛道”的层级占比。</li>
          <li>需要一屏对比多个分支的结构差异与主导赛道。</li>
          <li>需要在管理汇报中同时表达“规模与结构”而非单指标排名。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="sunburst-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">只看外圈赛道不看上层结构</h3>
            <p className="text-sm text-red-700">
              旭日图必须结合父层级解读，外圈大扇区也可能来自一个整体占比较小的一级分类。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">标签过多导致视觉拥挤</h3>
            <p className="text-sm text-red-700">
              层级较深时应只显示关键标签，其余信息通过 tooltip 与数据表补充。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="sunburst-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">
            ESG（环境、社会与治理）信贷与转型金融组合
          </h3>
          <p className="text-base text-slate-600">
            对应节点 ID：root/q-2cat/q-2cat-nested/chart-sunburst（leaf id=chart-sunburst）
          </p>
          <p>
            以旭日图展示 ESG（环境、社会与治理）信贷组合：
            总盘 → 绿色减缓/绿色适应/转型金融/社会包容 → 细分赛道。
            该视图可快速识别资金投向是否集中于目标方向，并为结构调整提供依据。
          </p>
        </div>

        <ChartWrapper title="数据旭日图：ESG 信贷组合层级结构">
          <SunburstEsgScenarioG2 />
        </ChartWrapper>

        <p className="text-sm text-slate-500">
          说明：本场景直接使用 `docs/cate-deep-research-report.md` 中 `chart-sunburst` 样例数据；
          原始 `id-parent-loan_balance_yi` 层级结构可直接用于旭日图，不需要额外补数。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>绿色减缓占比 46.15% 为主力板块，清洁能源与能效提升是核心赛道。</li>
          <li>转型金融占比 25.00%，需持续跟踪钢铁/煤电等高碳行业的转型质量。</li>
          <li>社会包容占比 11.54%，可与普惠经营目标联动优化投向结构。</li>
        </ul>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h4 className="text-base font-semibold text-slate-900 mb-3">场景数据摘要表（单位：亿元，as_of=2025-12-31）</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                  <th className="px-3 py-2 text-left font-semibold">层级</th>
                  <th className="px-3 py-2 text-left font-semibold">分类/赛道</th>
                  <th className="px-3 py-2 text-right font-semibold">贷款余额</th>
                  <th className="px-3 py-2 text-right font-semibold">占 ESG 总盘比例</th>
                </tr>
              </thead>
              <tbody>
                {scenarioTableRows.map((row) => (
                  <tr key={`${row.level}-${row.category}`} className="border-b border-slate-100 text-slate-700">
                    <td className="px-3 py-2">{row.level}</td>
                    <td className="px-3 py-2">{row.category}</td>
                    <td className="px-3 py-2 text-right">{row.balanceYi.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right">{(row.share * 100).toFixed(2)}%</td>
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
