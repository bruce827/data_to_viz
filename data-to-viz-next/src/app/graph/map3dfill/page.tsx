'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { Map3DFillIcon } from '@/components/viz/icons';
import { ExtrudedPolygonMapL7 } from '@/components/viz/charts/ExtrudedPolygonMapL7';
import {
  Map3DFillPressureScenarioL7,
  map3DFillPressureScenarioData,
} from '@/components/viz/charts/Map3DFillPressureScenarioL7';

export default function Map3DFillStory() {
  const outlineItems = [
    { id: 'what-is-map3dfill', label: '什么是3D填充图' },
    { id: 'when-to-use-map3dfill', label: '何时使用' },
    { id: 'map3dfill-common-mistakes', label: '常见误区' },
    { id: 'map3dfill-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="3D填充图"
      subtitle="把区域面挤出为立体地形，适合强调结构性约束和“距离红线还有多远”。"
      icon={Map3DFillIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是3D填充图？" id="what-is-map3dfill">
        <p>
          3D填充图（3D Filled Map）会把区域面按某个指标拉伸成立体高度，从而把结构性差异转成一眼可见的“压力地形”。
        </p>
        <p>
          它特别适合表现监管上限、资源承载度、集中度压力这类“越接近阈值越危险”的区域指标。
        </p>
        <p>英文名：3D Filled Map</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV L7）">
        <ExtrudedPolygonMapL7 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-map3dfill">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要强调区域与监管上限或容量边界的距离。</li>
          <li>需要把结构性约束从表格转成直观地形供管理层快速识别。</li>
          <li>需要同时表达“哪里更接近红线、哪里仍有缓冲”。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="map3dfill-common-mistakes">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-red-100 bg-red-50 p-6">
            <h3 className="mb-2 font-bold text-red-800">柱高表达绝对规模而不是压力</h3>
            <p className="text-sm text-red-700">
              在监管型场景中，最值得放大的不是规模本身，而是距离阈值还有多近；否则图会失去决策焦点。
            </p>
          </div>
          <div className="rounded-lg border border-red-100 bg-red-50 p-6">
            <h3 className="mb-2 font-bold text-red-800">颜色和高度各讲各的</h3>
            <p className="text-sm text-red-700">
              3D 图已经有高度编码，颜色语义必须和高度一致，否则用户会同时读到两套互相冲突的信息。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="map3dfill-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">房地产贷款集中度压力 3D 填充图</h3>
          <p className="text-base text-slate-600">对应节点 ID：root/q-map-polygon/chart-map-3d-fill（leaf id=chart-map-3d-fill）</p>
          <p>
            以省级区域为底座，将“距离监管上限的 bp 距离”映射为立体高度，用于识别最接近红线的区域并安排结构调整节奏。
          </p>
        </div>

        <ChartWrapper title="应用场景图：房地产贷款集中度压力 3D 填充图">
          <Map3DFillPressureScenarioL7 />
        </ChartWrapper>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h4 className="mb-3 text-base font-semibold text-slate-900">场景数据表</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                  <th className="px-3 py-2 text-left font-semibold">区域</th>
                  <th className="px-3 py-2 text-left font-semibold">季度</th>
                  <th className="px-3 py-2 text-right font-semibold">房地产贷款占比</th>
                  <th className="px-3 py-2 text-right font-semibold">按揭占比</th>
                  <th className="px-3 py-2 text-right font-semibold">监管上限</th>
                  <th className="px-3 py-2 text-right font-semibold">距上限(bp)</th>
                  <th className="px-3 py-2 text-right font-semibold">分层</th>
                </tr>
              </thead>
              <tbody>
                {map3DFillPressureScenarioData.map((row) => (
                  <tr key={row.region_adcode} className="border-b border-slate-100 text-slate-700">
                    <td className="px-3 py-2">{row.region_name}</td>
                    <td className="px-3 py-2">{row.stat_quarter}</td>
                    <td className="px-3 py-2 text-right">{(row.re_loan_ratio * 100).toFixed(1)}%</td>
                    <td className="px-3 py-2 text-right">{(row.mortgage_ratio * 100).toFixed(1)}%</td>
                    <td className="px-3 py-2 text-right">{(row.limit_ratio * 100).toFixed(1)}%</td>
                    <td className="px-3 py-2 text-right">{row.over_limit_bp}</td>
                    <td className="px-3 py-2 text-right">{row.pressure_band}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-sm text-slate-500">
          说明：本场景以 `docs/map-deep-research-report.md` 中
          `scn_chart-map-3d-fill_realestate_concentration_pressure_v1` 的字段口径为基础，扩展到 8 个重点区域，
          用立体高度优先表达“距离上限还有多近”。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>福建和海南已进入接近红线层，最适合优先做结构再平衡而不是继续推高房地产敞口。</li>
          <li>广东、江苏、重庆处于高压监测带，虽然尚未超线，但缓冲已经明显收窄。</li>
          <li>上海仍保留相对安全边际，可作为“精准支持白名单项目而不放松总体约束”的对照区域。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
