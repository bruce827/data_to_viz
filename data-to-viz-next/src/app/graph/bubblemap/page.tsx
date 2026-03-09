'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { BubbleMapIcon } from '@/components/viz/icons';
import { BubbleMapL7 } from '@/components/viz/charts/BubbleMapL7';
import { BubbleMapCreditScenarioL7, bubbleMapCreditScenarioData } from '@/components/viz/charts/BubbleMapCreditScenarioL7';

export default function BubbleMapStory() {
  const outlineItems = [
    { id: 'what-is-bubble-map', label: '什么是气泡地图' },
    { id: 'when-to-use-bubble-map', label: '何时使用' },
    { id: 'bubble-map-common-mistakes', label: '常见误区' },
    { id: 'bubble-map-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="气泡地图"
      subtitle="在地图坐标上叠加规模编码，适合同时观察“空间位置 + 敞口大小 + 质量分层”。"
      icon={BubbleMapIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是气泡地图？" id="what-is-bubble-map">
        <p>
          气泡地图（Bubble Map）是在点地图基础上增加“大小编码”的地图图表。
          每个气泡都有位置，同时还可以用面积表达敞口、交易额或客户数等规模指标。
        </p>
        <p>
          当分析目标不只是“哪里有”，而是还要比较“哪里更大、哪里更值得关注”时，气泡地图会比普通点地图更有效。
        </p>
        <p>英文名：Bubble Map</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV L7）">
        <BubbleMapL7 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-bubble-map">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要在地图上同时表达位置与规模。</li>
          <li>需要识别大敞口是否集中在少数城市、园区或产业带。</li>
          <li>需要把空间集中度和收益质量一起呈现给管理层。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="bubble-map-common-mistakes">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-red-100 bg-red-50 p-6">
            <h3 className="mb-2 font-bold text-red-800">只看气泡大，不看颜色分层</h3>
            <p className="text-sm text-red-700">
              大气泡可能只是敞口大，不代表回报高或风险低；必须结合颜色语义一起看。
            </p>
          </div>
          <div className="rounded-lg border border-red-100 bg-red-50 p-6">
            <h3 className="mb-2 font-bold text-red-800">把半径当成数值本身</h3>
            <p className="text-sm text-red-700">
              气泡图比较的是面积感知，不是半径数值；解释给业务方时要明确“大小映射的是EAD规模”。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="bubble-map-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">园区企业授信敞口与 RAROC 空间分布</h3>
          <p className="text-base text-slate-600">对应节点 ID：root/q-map-point/chart-map-bubble（leaf id=chart-map-bubble）</p>
          <p>
            以园区企业为粒度，将 EAD 映射为气泡大小，将 RAROC 分层映射为颜色，用于同时观察“敞口集中在哪”
            和“资本回报是否覆盖风险与资本占用”。
          </p>
        </div>

        <ChartWrapper title="应用场景图：园区授信敞口—RAROC 气泡地图">
          <BubbleMapCreditScenarioL7 />
        </ChartWrapper>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h4 className="mb-3 text-base font-semibold text-slate-900">场景数据表（单位：百万元）</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                  <th className="px-3 py-2 text-left font-semibold">城市</th>
                  <th className="px-3 py-2 text-left font-semibold">园区</th>
                  <th className="px-3 py-2 text-left font-semibold">行业</th>
                  <th className="px-3 py-2 text-right font-semibold">EAD</th>
                  <th className="px-3 py-2 text-right font-semibold">RAROC</th>
                  <th className="px-3 py-2 text-right font-semibold">PD</th>
                  <th className="px-3 py-2 text-right font-semibold">分层</th>
                </tr>
              </thead>
              <tbody>
                {bubbleMapCreditScenarioData.map((row) => (
                  <tr key={row.obligor_id} className="border-b border-slate-100 text-slate-700">
                    <td className="px-3 py-2">{row.city}</td>
                    <td className="px-3 py-2">{row.park_name}</td>
                    <td className="px-3 py-2">{row.industry_lv2}</td>
                    <td className="px-3 py-2 text-right">{(row.ead_cny / 1000000).toFixed(1)}</td>
                    <td className="px-3 py-2 text-right">{(row.raroc * 100).toFixed(1)}%</td>
                    <td className="px-3 py-2 text-right">{(row.pd_1y * 100).toFixed(2)}%</td>
                    <td className="px-3 py-2 text-right">{row.raroc_band}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-sm text-slate-500">
          说明：本场景以 `docs/map-deep-research-report.md` 中
          `scn_chart-map-bubble_corp_credit_raroc_exposure_v1` 的字段口径与首批样例为基础，
          扩展到 10 个园区企业点位，以满足气泡地图的横向比较表达。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>上海张江和深圳南山是“大敞口 + 高回报”组合，可继续作为重点支持园区。</li>
          <li>北京中关村、广州黄埔和武汉光谷呈现“中大敞口 + 低回报”，更适合优先做提价或增信。</li>
          <li>苏州、合肥、杭州等园区处于中间区间，适合做结构调优而不是简单抽贷。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
