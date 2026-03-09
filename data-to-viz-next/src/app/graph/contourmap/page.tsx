'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { ContourMapIcon } from '@/components/viz/icons';
import { ContourMapL7 } from '@/components/viz/charts/ContourMapL7';
import {
  ContourMapNimScenarioL7,
  contourNimSampleData,
} from '@/components/viz/charts/ContourMapNimScenarioL7';

export default function ContourMapStory() {
  const outlineItems = [
    { id: 'what-is-contour-map', label: '什么是等值线图' },
    { id: 'when-to-use-contour-map', label: '何时使用' },
    { id: 'contour-map-common-mistakes', label: '常见误区' },
    { id: 'contour-map-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="等值线图"
      subtitle="把采样点插值为连续压力面，再用等值线标出阈值边界，适合做经营与风控的阈值管理。"
      icon={ContourMapIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是等值线图？" id="what-is-contour-map">
        <p>
          等值线图（Contour Map）会把离散采样点插值成连续空间场，再用一系列等值线标记相同阈值的位置。
        </p>
        <p>
          它比普通点地图更适合展示“压力边界在哪里”，特别适合高管层关注的利润底线、风险阈值和容量边界。
        </p>
        <p>英文名：Contour Map</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV L7）">
        <ContourMapL7 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-contour-map">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>关心的是阈值边界，而不是每个单点本身。</li>
          <li>需要识别成本上行后哪些区域会先跌破利润底线。</li>
          <li>需要把经营承压和风险成本联动展示给管理层。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="contour-map-common-mistakes">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-red-100 bg-red-50 p-6">
            <h3 className="mb-2 font-bold text-red-800">采样点太少却过度解读曲线细节</h3>
            <p className="text-sm text-red-700">
              等值线本质上依赖插值；采样点不足时，应把它看成阈值趋势图，而不是精确边界图。
            </p>
          </div>
          <div className="rounded-lg border border-red-100 bg-red-50 p-6">
            <h3 className="mb-2 font-bold text-red-800">只看净利差，不看拆解来源</h3>
            <p className="text-sm text-red-700">
              同样的低净利差，可能来自收益率下降，也可能来自 FTP 或 ECL 上升；表格明细必须一并阅读。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="contour-map-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">区域净利差压力面等值线图</h3>
          <p className="text-base text-slate-600">对应节点 ID：root/q-map-line/chart-map-od（leaf id=chart-map-od）</p>
          <p>
            以城市采样点记录贷款收益率、FTP 资金成本与风险成本，并插值得到净利差压力面，用于识别不可持续增长区。
          </p>
        </div>

        <ChartWrapper title="应用场景图：净利差压力面等值线图">
          <ContourMapNimScenarioL7 />
        </ChartWrapper>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h4 className="mb-3 text-base font-semibold text-slate-900">采样点数据表</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                  <th className="px-3 py-2 text-left font-semibold">城市</th>
                  <th className="px-3 py-2 text-right font-semibold">贷款收益率</th>
                  <th className="px-3 py-2 text-right font-semibold">FTP成本</th>
                  <th className="px-3 py-2 text-right font-semibold">风险成本</th>
                  <th className="px-3 py-2 text-right font-semibold">压力净利差</th>
                  <th className="px-3 py-2 text-right font-semibold">分层</th>
                </tr>
              </thead>
              <tbody>
                {contourNimSampleData.map((row) => (
                  <tr key={row.sample_id} className="border-b border-slate-100 text-slate-700">
                    <td className="px-3 py-2">{row.city}</td>
                    <td className="px-3 py-2 text-right">{(row.loan_yield_pct * 100).toFixed(2)}%</td>
                    <td className="px-3 py-2 text-right">{(row.ftp_cost_pct * 100).toFixed(2)}%</td>
                    <td className="px-3 py-2 text-right">{(row.ecl_cost_pct * 100).toFixed(2)}%</td>
                    <td className="px-3 py-2 text-right">{(row.nim_stress_pct * 100).toFixed(2)}%</td>
                    <td className="px-3 py-2 text-right">{row.stress_band}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-sm text-slate-500">
          说明：本场景以 `docs/map-deep-research-report.md` 中 `scn_chart-map-od_alm_nim_stress_contour_v1`
          的字段口径为基础，扩展到 10 个城市采样点，并按相同指标口径插值得到 4 条业务阈值线。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>南宁、郑州已经逼近临界带，说明一旦资金成本再上行，利润空间会率先跌破底线。</li>
          <li>广州、武汉、苏州位于承压带，更适合做定价与期限结构调整，而不是继续靠规模扩张。</li>
          <li>北京、成都、西安仍处于安全或观察带，可作为结构优化时的相对稳定区域。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
