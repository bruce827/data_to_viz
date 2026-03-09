'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { MapGridHeatmapIcon } from '@/components/viz/icons';
import { GridHeatmapMapL7 } from '@/components/viz/charts/GridHeatmapMapL7';
import {
  GridHeatmapLoginScenarioL7,
  gridHeatmapLoginScenarioData,
} from '@/components/viz/charts/GridHeatmapLoginScenarioL7';

export default function GridHeatmapMapStory() {
  const outlineItems = [
    { id: 'what-is-grid-heatmap', label: '什么是网格热力图' },
    { id: 'when-to-use-grid-heatmap', label: '何时使用' },
    { id: 'grid-heatmap-common-mistakes', label: '常见误区' },
    { id: 'grid-heatmap-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="网格热力图"
      subtitle="把事件聚合到固定网格后再着色，适合做审计友好的区域强度比较与异常回放。"
      icon={MapGridHeatmapIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是网格热力图？" id="what-is-grid-heatmap">
        <p>
          网格热力图（Grid Heatmap）会先把点位聚合进规则网格，再用颜色深浅表示每个网格的强度。
        </p>
        <p>
          它比连续热力图更方便审计复盘，因为每个格子都对应稳定的空间单元，也更适合和时间窗、事件数做联动。
        </p>
        <p>英文名：Grid Heatmap</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV L7）">
        <GridHeatmapMapL7 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-grid-heatmap">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要比较固定空间单元中的异常强弱，而不是只看连续热点轮廓。</li>
          <li>需要按时间窗回放同一网格里的攻击、登录或欺诈事件。</li>
          <li>需要为审计、运维和值守团队提供稳定的区域编号与排查单元。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="grid-heatmap-common-mistakes">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-red-100 bg-red-50 p-6">
            <h3 className="mb-2 font-bold text-red-800">网格太粗导致信号被平均</h3>
            <p className="text-sm text-red-700">
              如果把城市级事件硬聚合成超大格子，商圈和机房级差异会被抹平，无法指导一线排查。
            </p>
          </div>
          <div className="rounded-lg border border-red-100 bg-red-50 p-6">
            <h3 className="mb-2 font-bold text-red-800">把深色格子等同于单个高危账号</h3>
            <p className="text-sm text-red-700">
              深色格子表达的是区域累计强度，不是单一账户结论；仍需下钻到明细日志和链路ID做证据闭环。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="grid-heatmap-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">移动银行异常登录网格热力图</h3>
          <p className="text-base text-slate-600">对应节点 ID：root/q-map-polygon/chart-map-grid-heatmap（leaf id=chart-map-grid-heatmap）</p>
          <p>
            以登录事件为明细，将失败次数、跨省跳点距离和异常分合成为网格风险权重，用于识别撞库、代理池和脚本集群的地域特征。
          </p>
        </div>

        <ChartWrapper title="应用场景图：异常登录网格热力图">
          <GridHeatmapLoginScenarioL7 />
        </ChartWrapper>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h4 className="mb-3 text-base font-semibold text-slate-900">场景数据表</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                  <th className="px-3 py-2 text-left font-semibold">登录事件</th>
                  <th className="px-3 py-2 text-left font-semibold">时间</th>
                  <th className="px-3 py-2 text-left font-semibold">城市</th>
                  <th className="px-3 py-2 text-right font-semibold">10分钟失败</th>
                  <th className="px-3 py-2 text-right font-semibold">跳点距离(km)</th>
                  <th className="px-3 py-2 text-right font-semibold">异常分</th>
                  <th className="px-3 py-2 text-right font-semibold">网格权重</th>
                </tr>
              </thead>
              <tbody>
                {gridHeatmapLoginScenarioData.map((row) => (
                  <tr key={row.login_id} className="border-b border-slate-100 text-slate-700">
                    <td className="px-3 py-2">{row.login_id}</td>
                    <td className="px-3 py-2">{row.login_time.slice(0, 16).replace('T', ' ')}</td>
                    <td className="px-3 py-2">{row.city}</td>
                    <td className="px-3 py-2 text-right">{row.failed_cnt_10m}</td>
                    <td className="px-3 py-2 text-right">{row.geo_jump_km}</td>
                    <td className="px-3 py-2 text-right">{row.anomaly_score.toFixed(2)}</td>
                    <td className="px-3 py-2 text-right">{row.risk_weight.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-sm text-slate-500">
          说明：本场景以 `docs/map-deep-research-report.md` 中
          `scn_chart-map-grid-heatmap_mobilebank_abnormal_login_v1` 的字段口径为基础，扩展到 14 条登录事件，
          形成“广州主异常区 + 深圳次异常区 + 成都观察区”。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>广州主异常区同时具备大跳点、高失败和高异常分，更像撞库与代理池叠加攻击。</li>
          <li>深圳次异常区强度略低，但出现多设备复用迹象，适合提升设备绑定校验和夜间限流。</li>
          <li>成都观察区目前仍可控，但已出现连续异常样本，适合作为审计抽样与规则回放对象。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
