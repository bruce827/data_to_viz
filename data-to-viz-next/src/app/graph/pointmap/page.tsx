'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { PointMapIcon } from '@/components/viz/icons';
import { PointMapL7 } from '@/components/viz/charts/PointMapL7';
import { PointMapFraudScenarioL7, pointMapFraudScenarioData } from '@/components/viz/charts/PointMapFraudScenarioL7';

export default function PointMapStory() {
  const outlineItems = [
    { id: 'what-is-point-map', label: '什么是点地图' },
    { id: 'when-to-use-point-map', label: '何时使用' },
    { id: 'point-map-common-mistakes', label: '常见误区' },
    { id: 'point-map-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="点地图"
      subtitle="把事件、客户或网点按空间位置直接落点，适合观察分布、聚集和异常位置。"
      icon={PointMapIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是点地图？" id="what-is-point-map">
        <p>
          点地图（Point Map）将每一条记录按经纬度直接放到地图上，最适合表达“事件发生在哪里”。
        </p>
        <p>
          与热力图不同，点地图保留了单条记录粒度，便于结合时间、渠道、处置结果等字段做逐点核查。
        </p>
        <p>英文名：Point Map</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV L7）">
        <PointMapL7 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-point-map">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要保留单条交易、客户或网点的空间位置。</li>
          <li>需要快速识别异常事件是否在同一商圈、园区或城市聚集。</li>
          <li>需要把地图视图和明细核查、名单处置联动起来。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="point-map-common-mistakes">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-red-100 bg-red-50 p-6">
            <h3 className="mb-2 font-bold text-red-800">把空间聚集直接当成欺诈结论</h3>
            <p className="text-sm text-red-700">
              地理聚集只是线索，不是结论。还需要结合设备、时序、交易链路和客户行为共同判断。
            </p>
          </div>
          <div className="rounded-lg border border-red-100 bg-red-50 p-6">
            <h3 className="mb-2 font-bold text-red-800">点太多却不做分层</h3>
            <p className="text-sm text-red-700">
              如果同时堆太多点而不区分颜色或大小，地图只会变成噪声，无法支撑处置优先级排序。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="point-map-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">零售反欺诈疑似盗刷交易落点图</h3>
          <p className="text-base text-slate-600">
            对应节点 ID：root/q-map-point/chart-map-point（leaf id=chart-map-point）
          </p>
          <p>
            以 2026-03-05（2026年3月5日）晚间的疑似盗刷交易为例，将交易按商户经纬度落点，颜色表示处置结果，
            点大小表示风险评分，用于快速定位高风险商圈与需要优先复核的异常交易。
          </p>
        </div>

        <ChartWrapper title="应用场景图：疑似盗刷交易空间落点">
          <PointMapFraudScenarioL7 />
        </ChartWrapper>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h4 className="mb-3 text-base font-semibold text-slate-900">场景数据表（report 明细）</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                  <th className="px-3 py-2 text-left font-semibold">交易流水</th>
                  <th className="px-3 py-2 text-left font-semibold">时间</th>
                  <th className="px-3 py-2 text-left font-semibold">城市</th>
                  <th className="px-3 py-2 text-left font-semibold">渠道</th>
                  <th className="px-3 py-2 text-right font-semibold">金额（元）</th>
                  <th className="px-3 py-2 text-right font-semibold">风险评分</th>
                  <th className="px-3 py-2 text-right font-semibold">处置</th>
                </tr>
              </thead>
              <tbody>
                {pointMapFraudScenarioData.map((row) => (
                  <tr key={row.txn_id} className="border-b border-slate-100 text-slate-700">
                    <td className="px-3 py-2">{row.txn_id}</td>
                    <td className="px-3 py-2">{row.event_time.slice(0, 16).replace('T', ' ')}</td>
                    <td className="px-3 py-2">{row.city}</td>
                    <td className="px-3 py-2">{row.channel}</td>
                    <td className="px-3 py-2 text-right">{row.amount_cny.toFixed(2)}</td>
                    <td className="px-3 py-2 text-right">{row.risk_score.toFixed(2)}</td>
                    <td className="px-3 py-2 text-right">{row.decision}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-sm text-slate-500">
          说明：本场景以 `docs/map-deep-research-report.md` 中
          `scn_chart-map-point_retail_fraud_hotspots_v1` 的字段口径与首批样例为基础，
          按同日晚间疑似盗刷交易明细扩展到 11 条，用于满足点地图的空间聚集表达。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>深圳在一小时内集中出现 5 笔异常交易，且覆盖 POS 与 ATM，说明商圈级排查应优先落在该区域。</li>
          <li>上海与广州各自形成次级聚集区，其中上海线上交易金额最高，广州则呈现线下取现与消费混合特征。</li>
          <li>“放行-人工复核-拒绝”三层点位同时存在，说明当前策略已形成分层处置，而不是单阈值硬拦截。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
