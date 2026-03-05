'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { CircularPackingIcon } from '@/components/viz/icons';
import { CircularPackingHierarchyG2 } from '@/components/viz/charts/CircularPackingHierarchyG2';
import { CircularPackingHierarchyScenarioG2 } from '@/components/viz/charts/CircularPackingHierarchyScenarioG2';

const scenarioTableRows = [
  { level: '一级分类', item: '零售贷款', valueYi: 11200, share: 0.3733 },
  { level: '一级分类', item: '对公贷款', valueYi: 14000, share: 0.4667 },
  { level: '一级分类', item: '普惠贷款', valueYi: 3800, share: 0.1267 },
  { level: '一级分类', item: '资金业务', valueYi: 1000, share: 0.0333 },
  { level: '二级分类', item: '按揭贷款', valueYi: 6200, share: 0.2067 },
  { level: '二级分类', item: '制造业', valueYi: 4200, share: 0.1400 },
  { level: '二级分类', item: '基建', valueYi: 3600, share: 0.1200 },
  { level: '二级分类', item: '小微经营贷', valueYi: 2400, share: 0.0800 },
];

export default function CircularPackingHierarchyStory() {
  const outlineItems = [
    { id: 'what-is-circular-packing-hierarchy', label: '什么是圆形填充图' },
    { id: 'when-to-use-circular-packing-hierarchy', label: '何时使用' },
    { id: 'circular-packing-hierarchy-common-mistakes', label: '常见误区' },
    { id: 'circular-packing-hierarchy-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="圆形填充图（层级关系）"
      subtitle="用嵌套圆面积展示贷款组合结构，适合快速识别资产投向与结构集中度。"
      icon={CircularPackingIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是圆形填充图？" id="what-is-circular-packing-hierarchy">
        <p>
          圆形填充图（Circular Packing）通过父子嵌套圆表达层级结构，圆面积映射数值大小。
          相比矩形树图，它更强调“结构关系”与“簇状分布”，适合做总盘到细分结构的全景审视。
        </p>
        <p>英文名：Circular Packing</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G2）">
        <CircularPackingHierarchyG2 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-circular-packing-hierarchy">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要展示“总盘 → 一级分类 → 二级分类”的层级结构。</li>
          <li>需要识别结构集中度与长尾占比，支持投向调整。</li>
          <li>需要在管理层页面中用一图快速传达整体资产组合。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="circular-packing-hierarchy-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">只看大圆，不看细分结构</h3>
            <p className="text-sm text-red-700">
              一级分类规模大并不代表结构健康，必须下钻到二级产品看集中度与分散度。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">把面积当作精确比较工具</h3>
            <p className="text-sm text-red-700">
              面积感知不如长度精确。需要精确比较时，应结合下方数据表或条形图交叉验证。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="circular-packing-hierarchy-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">
            资产结构对标“五篇大文章”（贷款组合层级结构一图看全）
          </h3>
          <p className="text-base text-slate-600">
            对应节点 ID：root/q-2cat/q-2cat-nested/chart-circular-packing（leaf id=chart-circular-packing）
          </p>
          <p>
            以贷款总盘为根节点，分解到零售、对公、普惠、资金业务，再展开至细分产品结构。
            用于评估资产投向是否与战略方向一致，并辅助风险管理与资源配置决策。
          </p>
        </div>

        <ChartWrapper title="数据圆形填充图：贷款组合层级结构">
          <CircularPackingHierarchyScenarioG2 />
        </ChartWrapper>

        <p className="text-sm text-slate-500">
          说明：本场景使用 `docs/cate-deep-research-report.md` 中 `chart-circular-packing` 样例数据；
          原始 `id-parent-value_yi` 结构可直接构建层级树用于 pack 渲染，无需额外补数。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>对公贷款占总盘 46.67%，是当前资产结构的最大板块。</li>
          <li>零售贷款占比 37.33%，其中按揭贷款占总盘 20.67%，是零售核心底座。</li>
          <li>普惠贷款占比 12.67%，与战略导向一致，但仍有继续提升空间。</li>
        </ul>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h4 className="text-base font-semibold text-slate-900 mb-3">场景数据摘要表（单位：亿元，as_of=2025-12-31）</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                  <th className="px-3 py-2 text-left font-semibold">层级</th>
                  <th className="px-3 py-2 text-left font-semibold">分类/产品</th>
                  <th className="px-3 py-2 text-right font-semibold">余额</th>
                  <th className="px-3 py-2 text-right font-semibold">占总盘比例</th>
                </tr>
              </thead>
              <tbody>
                {scenarioTableRows.map((row) => (
                  <tr key={`${row.level}-${row.item}`} className="border-b border-slate-100 text-slate-700">
                    <td className="px-3 py-2">{row.level}</td>
                    <td className="px-3 py-2">{row.item}</td>
                    <td className="px-3 py-2 text-right">{row.valueYi.toLocaleString()}</td>
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
