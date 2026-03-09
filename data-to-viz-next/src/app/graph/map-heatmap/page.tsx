'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { MapHeatmapIcon } from '@/components/viz/icons';
import { HeatmapMapL7 } from '@/components/viz/charts/HeatmapMapL7';
import { MapHeatmapFraudScenarioL7, mapHeatmapFraudScenarioData } from '@/components/viz/charts/MapHeatmapFraudScenarioL7';

export default function MapHeatmapStory() {
  const outlineItems = [
    { id: 'what-is-map-heatmap', label: '什么是热力图' },
    { id: 'when-to-use-map-heatmap', label: '何时使用' },
    { id: 'map-heatmap-common-mistakes', label: '常见误区' },
    { id: 'map-heatmap-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="热力图"
      subtitle="把高频点位聚合成连续密度场，适合观察热点区域和风险资源投放方向。"
      icon={MapHeatmapIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是热力图？" id="what-is-map-heatmap">
        <p>
          地图热力图（Heat Map）把大量点位按空间邻近关系叠加成连续颜色场，用颜色强度表达某一区域的事件密度或风险强度。
        </p>
        <p>
          与点地图相比，它更适合识别“热区在哪里”；与六边形或网格聚合相比，它更强调连续热点的轮廓，而不是离散网格单元的精确比较。
        </p>
        <p>英文名：Heat Map</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV L7）">
        <HeatmapMapL7 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-map-heatmap">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>地图上有大量位置点，需要先识别热点区域而不是逐点核查。</li>
          <li>需要快速判断风险资源应优先投向哪些城市、商圈或园区。</li>
          <li>需要表达连续的热点轮廓，而不是固定网格里的离散强度。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="map-heatmap-common-mistakes">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-red-100 bg-red-50 p-6">
            <h3 className="mb-2 font-bold text-red-800">把热区直接当作欺诈结论</h3>
            <p className="text-sm text-red-700">
              热力图回答的是“哪里更密、更热”，不是“谁一定有问题”。热区只能作为复核和资源投放的优先线索。
            </p>
          </div>
          <div className="rounded-lg border border-red-100 bg-red-50 p-6">
            <h3 className="mb-2 font-bold text-red-800">颜色很深就以为金额最大</h3>
            <p className="text-sm text-red-700">
              本页颜色并不直接表示申请金额，而是表示由风险评分与多头命中构成的热力权重。颜色语义必须先看清楚。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="map-heatmap-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">零售授信高风险申请密度热力图</h3>
          <p className="text-base text-slate-600">对应节点 ID：root/q-map-point/chart-map-heatmap（leaf id=chart-map-heatmap）</p>
          <p>
            以授信申请明细为粒度，将申请地理位置投影到地图，按 `model_score × multi_loan_hits` 生成热力权重，
            用于识别黑产聚集区、异常中介活跃区和需要提升人工复核比例的重点城市。
          </p>
        </div>

        <ChartWrapper title="应用场景图：高风险申请密度热力图">
          <MapHeatmapFraudScenarioL7 />
        </ChartWrapper>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h4 className="mb-3 text-base font-semibold text-slate-900">场景数据表（按补数口径扩展）</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                  <th className="px-3 py-2 text-left font-semibold">申请单号</th>
                  <th className="px-3 py-2 text-left font-semibold">时间</th>
                  <th className="px-3 py-2 text-left font-semibold">城市</th>
                  <th className="px-3 py-2 text-left font-semibold">产品</th>
                  <th className="px-3 py-2 text-right font-semibold">申请金额</th>
                  <th className="px-3 py-2 text-right font-semibold">风险评分</th>
                  <th className="px-3 py-2 text-right font-semibold">多头命中</th>
                  <th className="px-3 py-2 text-right font-semibold">热力权重</th>
                </tr>
              </thead>
              <tbody>
                {mapHeatmapFraudScenarioData.map((row) => (
                  <tr key={row.app_id} className="border-b border-slate-100 text-slate-700">
                    <td className="px-3 py-2">{row.app_id}</td>
                    <td className="px-3 py-2">{row.app_time.slice(0, 16).replace('T', ' ')}</td>
                    <td className="px-3 py-2">{row.city}</td>
                    <td className="px-3 py-2">{row.product}</td>
                    <td className="px-3 py-2 text-right">{row.req_amt_cny.toLocaleString('zh-CN')}</td>
                    <td className="px-3 py-2 text-right">{row.model_score.toFixed(2)}</td>
                    <td className="px-3 py-2 text-right">{row.multi_loan_hits}</td>
                    <td className="px-3 py-2 text-right">{row.heat_weight.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-sm text-slate-500">
          说明：本场景以 `docs/map-deep-research-report.md` 中 `scn_chart-map-heatmap_retail_app_fraud_density_v1`
          的字段口径与首批样例为基础，经你确认后扩展到 20 条申请点，形成“成都主热区 + 重庆次热区 + 西安观察区”。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>成都形成最强热区，说明该区域同时具备更高的风险评分与更多的多头命中，需要优先加严人工复核和冷启动策略。</li>
          <li>重庆热区次之，代表异常申请在空间上开始扩散，但整体强度尚低于成都，更适合做前置限额和设备校验。</li>
          <li>西安目前仍是观察区，虽然点数较少，但已有多笔中高权重点位，适合纳入持续监控名单而不是简单忽略。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
