'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { StackedBarIcon } from '@/components/viz/icons';
import { StackedBarG2 } from '@/components/viz/charts/StackedBarG2';
import { StackedBarDpdScenarioG2 } from '@/components/viz/charts/StackedBarScenarioG2';

export default function StackedBarStory() {
  const outlineItems = [
    { id: 'what-is-stacked-bar', label: '什么是堆叠条形图' },
    { id: 'when-to-use-stacked-bar', label: '何时使用' },
    { id: 'stacked-bar-common-mistakes', label: '常见误区' },
    { id: 'stacked-bar-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="堆叠条形图"
      subtitle="在同一条形内展示构成结构，适合观察账龄分层占比与结构恶化趋势。"
      icon={StackedBarIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是堆叠条形图？" id="what-is-stacked-bar">
        <p>
          堆叠条形图（Stacked Barplot）将多个子类别在同一条形中分段堆叠，既能看总量，也能看结构构成。
          在风险管理场景中，它常用于观察账龄结构、风险分层与迁徙堆积。
        </p>
        <p>英文名：Stacked Barplot</p>
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full text-sm">
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="w-36 bg-slate-50 px-4 py-3 font-semibold text-slate-700">图表类型</td>
                <td className="px-4 py-3 text-slate-700">垂直堆叠柱状图</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="w-36 bg-slate-50 px-4 py-3 font-semibold text-slate-700">适合的数据</td>
                <td className="px-4 py-3 text-slate-700">
                  多系列分类数据：一个分类数据字段、一个连续数据字段、一个系列分类字段
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="w-36 bg-slate-50 px-4 py-3 font-semibold text-slate-700">功能</td>
                <td className="px-4 py-3 text-slate-700">对比不同类别的总量以及各子类别的构成</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="w-36 bg-slate-50 px-4 py-3 font-semibold text-slate-700">数据与图形的映射</td>
                <td className="px-4 py-3 text-slate-700">
                  分类字段映射到横轴位置；数值字段映射到柱子高度；系列字段映射到颜色，通过堆叠显示在同一柱子中
                </td>
              </tr>
              <tr>
                <td className="w-36 bg-slate-50 px-4 py-3 font-semibold text-slate-700">适合的数据条数</td>
                <td className="px-4 py-3 text-slate-700">主类别不超过 12 条，子类别不超过 8 条</td>
              </tr>
            </tbody>
          </table>
        </div>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G2）">
        <StackedBarG2 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-stacked-bar">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要同时观察总量与内部构成。</li>
          <li>需要比较不同城市/客群的结构差异，而不只看单一指标。</li>
          <li>需要识别高风险分层（如 90+）是否在持续抬升。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="stacked-bar-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">只看总高度，忽略高风险分层</h3>
            <p className="text-sm text-red-700">
              总量稳定并不代表风险稳定。应优先关注 61-90 与 90+ 段是否变厚。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">堆叠类别过多导致比较困难</h3>
            <p className="text-sm text-red-700">
              分层过细会降低可读性。建议先按关键账龄分层展示，再用明细表补充。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="stacked-bar-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">信用卡逾期账龄结构堆叠条形图（DPD Bucket）</h3>
          <p className="text-base text-slate-600">
            对应节点 ID：root/q-combo/q-combo-mcat-1num/chart-combo-mcat-1num-stacked-bar（leaf id=chart-combo-mcat-1num-stacked-bar）
          </p>
          <p>
            对比不同城市层级在 DPD（逾期天数）分层上的余额结构，用于识别“总量变化不大但高账龄占比上升”的风险信号。
            本示例使用 report 给出的 2025-10（2025年10月）样例数据。
          </p>
        </div>

        <ChartWrapper title="数据堆叠条形图：城市层级 DPD 账龄结构">
          <StackedBarDpdScenarioG2 />
        </ChartWrapper>

        <p className="text-sm text-slate-500">
          说明：本场景直接使用 `docs/catenum-deep-research-report.md` 中 `SBAR` 样例数据；
          report 当前仅给出三四线城市的 `0-30` 与 `90+` 两段，图中按原始口径展示，不额外补数。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>三四线城市 `90+`（逾期90天以上）占比达 20.00%，高于一线城市 9.00%。</li>
          <li>一线城市账龄结构更完整，可用于持续监测 `31-60` 与 `61-90` 向 `90+` 的堆积斜率。</li>
          <li>若后续月度数据中 `90+` 段持续增厚，应触发催收策略与授信准入联动复盘。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
