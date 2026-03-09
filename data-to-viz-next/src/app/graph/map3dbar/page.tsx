'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { Map3DBarIcon } from '@/components/viz/icons';
import { Map3DBarL7 } from '@/components/viz/charts/Map3DBarL7';
import { Map3DBarInclusiveScenarioL7, map3DBarInclusiveScenarioData } from '@/components/viz/charts/Map3DBarInclusiveScenarioL7';

export default function Map3DBarStory() {
  const outlineItems = [
    { id: 'what-is-map3dbar', label: '什么是3D柱状图' },
    { id: 'when-to-use-map3dbar', label: '何时使用' },
    { id: 'map3dbar-common-mistakes', label: '常见误区' },
    { id: 'map3dbar-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="3D柱状图"
      subtitle="在地图点位上用柱高表达规模，用颜色叠加质量分层，适合做区域产能与风险并读。"
      icon={Map3DBarIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是3D柱状图？" id="what-is-map3dbar">
        <p>
          3D柱状图（3D Bar Map）是在地图点位上拉起立体柱体，柱高通常映射交易额、投放额、客流量等规模指标。
        </p>
        <p>
          相比普通点地图，它更强调“哪里更高、更集中”，适合在管理层场景里快速突出区域产能差异。
        </p>
        <p>英文名：3D Bar Map</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV L7）">
        <Map3DBarL7 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-map3dbar">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要在空间维度上突出规模差异。</li>
          <li>需要同时看区域投放产能与质量分层。</li>
          <li>需要在多城市、多网点之间快速识别异常高柱区域。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="map3dbar-common-mistakes">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-red-100 bg-red-50 p-6">
            <h3 className="mb-2 font-bold text-red-800">只看柱高，不看质量颜色</h3>
            <p className="text-sm text-red-700">
              高柱不一定是好事。如果 DQ 同步抬升，柱子越高反而意味着风险累积越快。
            </p>
          </div>
          <div className="rounded-lg border border-red-100 bg-red-50 p-6">
            <h3 className="mb-2 font-bold text-red-800">点位太少却硬做3D</h3>
            <p className="text-sm text-red-700">
              3D柱状图适合做空间比较；如果只有极少点位，普通点图或气泡图通常更直接。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="map3dbar-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">普惠网点日度投放产能与早期逾期监控</h3>
          <p className="text-base text-slate-600">对应节点 ID：root/q-map-point/chart-map-heat（leaf id=chart-map-heat）</p>
          <p>
            以网点为粒度，将当日普惠小微新增投放金额映射为柱高，将 30 天 DQ 分层映射为颜色，
            用于同时识别“哪个网点投得猛”和“哪个网点投放质量在恶化”。
          </p>
        </div>

        <ChartWrapper title="应用场景图：网点投放产能—DQ 3D柱状图">
          <Map3DBarInclusiveScenarioL7 />
        </ChartWrapper>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h4 className="mb-3 text-base font-semibold text-slate-900">场景数据表（单位：百万元）</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                  <th className="px-3 py-2 text-left font-semibold">网点</th>
                  <th className="px-3 py-2 text-left font-semibold">日期</th>
                  <th className="px-3 py-2 text-right font-semibold">新发放金额</th>
                  <th className="px-3 py-2 text-right font-semibold">笔数</th>
                  <th className="px-3 py-2 text-right font-semibold">30天DQ</th>
                  <th className="px-3 py-2 text-right font-semibold">通过率</th>
                  <th className="px-3 py-2 text-right font-semibold">分层</th>
                </tr>
              </thead>
              <tbody>
                {map3DBarInclusiveScenarioData.map((row) => (
                  <tr key={row.branch_id} className="border-b border-slate-100 text-slate-700">
                    <td className="px-3 py-2">{row.branch_name}</td>
                    <td className="px-3 py-2">{row.biz_date}</td>
                    <td className="px-3 py-2 text-right">{(row.new_loan_amt_cny / 1000000).toFixed(1)}</td>
                    <td className="px-3 py-2 text-right">{row.new_loan_cnt}</td>
                    <td className="px-3 py-2 text-right">{(row.dq_30d_rate * 100).toFixed(2)}%</td>
                    <td className="px-3 py-2 text-right">{(row.approval_rate * 100).toFixed(0)}%</td>
                    <td className="px-3 py-2 text-right">{row.dq_band}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-sm text-slate-500">
          说明：本场景以 `docs/map-deep-research-report.md` 中
          `scn_chart-map-heat_inclusive_micro_branch_daily_v1` 的字段口径与首批样例为基础，
          扩展到 10 个网点，用于满足 3D 柱状图的空间比较表达。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>深圳、上海、杭州柱高明显更高，是当前普惠投放产能中心。</li>
          <li>广州、武汉、郑州虽然柱高不低，但已进入“高压力”分层，说明投放质量开始承压。</li>
          <li>成都、西安处于“观察”带，适合用额度、阈值和人工复核比例联动做前置修正。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
