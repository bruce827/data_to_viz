'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { HexbinMapIcon } from '@/components/viz/icons';
import { HexbinMapG2 } from '@/components/viz/charts/HexbinMapG2';
import {
  HexbinMapSupplychainScenarioG2,
  hexbinSupplychainScenarioData,
} from '@/components/viz/charts/HexbinMapSupplychainScenarioL7';

export default function HexbinMapStory() {
  const outlineItems = [
    { id: 'what-is-hexbin-map', label: '什么是六边形地图' },
    { id: 'when-to-use-hexbin-map', label: '何时使用' },
    { id: 'hexbin-map-common-mistakes', label: '常见误区' },
    { id: 'hexbin-map-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="六边形地图"
      subtitle="把海量离散点聚合成蜂窝单元，适合比较密度与异常强度，而不是逐笔追踪单点。"
      icon={HexbinMapIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是六边形地图？" id="what-is-hexbin-map">
        <p>
          六边形地图（Hexbin Map）把大量点位按照固定大小的六边形单元聚合，并在每个蜂窝里统计数量或强度。
        </p>
        <p>
          它比连续热力图更适合做离散网格比较，也比逐点散点更适合在高密度场景下稳定呈现结构性风险。
        </p>
        <p>英文名：Hexbin Map</p>
      </StorySection>

      <ChartWrapper title="交互示例">
        <HexbinMapG2 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-hexbin-map">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>点位很多，需要稳定比较“哪个区域更密、更异常”。</li>
          <li>需要把异常交易、登录或供应链记录压缩成可操作的空间单元。</li>
          <li>需要为贷后抽查、资源投放和区域排查设定优先级。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="hexbin-map-common-mistakes">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-red-100 bg-red-50 p-6">
            <h3 className="mb-2 font-bold text-red-800">只看蜂窝数量，不看权重口径</h3>
            <p className="text-sm text-red-700">
              蜂窝颜色可以表示数量，也可以表示异常分、金额或综合权重。业务解释时必须先讲清楚编码口径。
            </p>
          </div>
          <div className="rounded-lg border border-red-100 bg-red-50 p-6">
            <h3 className="mb-2 font-bold text-red-800">蜂窝尺寸设得过大</h3>
            <p className="text-sm text-red-700">
              尺寸过大会吞掉园区级差异，导致“看起来都差不多”；尺寸过小又会回到逐点噪声。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="hexbin-map-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">供应链交易异常蜂窝密度风险图</h3>
          <p className="text-base text-slate-600">对应节点 ID：root/q-map-polygon/chart-map-hexbin（leaf id=chart-map-hexbin）</p>
          <p>
            以供应链金融交易为明细，将空间邻近的异常交易聚合为蜂窝单元，用颜色表达每个蜂窝内的聚合交易笔数，
            用于识别园区内“同址多户、循环交易、虚假贸易”的空间聚集特征。
          </p>
        </div>

        <ChartWrapper title="应用场景图：供应链异常六边形地图">
          <HexbinMapSupplychainScenarioG2 />
        </ChartWrapper>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h4 className="mb-3 text-base font-semibold text-slate-900">场景数据表（单位：元）</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                  <th className="px-3 py-2 text-left font-semibold">交易ID</th>
                  <th className="px-3 py-2 text-left font-semibold">时间</th>
                  <th className="px-3 py-2 text-left font-semibold">核心企业</th>
                  <th className="px-3 py-2 text-left font-semibold">供应商</th>
                  <th className="px-3 py-2 text-right font-semibold">发票金额</th>
                  <th className="px-3 py-2 text-right font-semibold">异常分</th>
                  <th className="px-3 py-2 text-right font-semibold">蜂窝分组</th>
                </tr>
              </thead>
              <tbody>
                {hexbinSupplychainScenarioData.map((row) => (
                  <tr key={row.trx_id} className="border-b border-slate-100 text-slate-700">
                    <td className="px-3 py-2">{row.trx_id}</td>
                    <td className="px-3 py-2">{row.trx_time.slice(0, 16).replace('T', ' ')}</td>
                    <td className="px-3 py-2">{row.anchor_id}</td>
                    <td className="px-3 py-2">{row.supplier_id}</td>
                    <td className="px-3 py-2 text-right">{row.invoice_amt_cny.toLocaleString('zh-CN')}</td>
                    <td className="px-3 py-2 text-right">{row.anomaly_score.toFixed(2)}</td>
                    <td className="px-3 py-2 text-right">{row.cluster}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-sm text-slate-500">
          说明：本场景以 `docs/map-deep-research-report.md` 中 `scn_chart-map-hexbin_corp_supplychain_anomaly_v1`
          的字段口径为基础，扩展为 14 条交易明细，形成“杭州核心蜂窝 + 苏州观察蜂窝 + 宁波跟踪蜂窝”三层结构；
          图中颜色编码为每个六边形内的聚合交易笔数，表格补充发票金额与异常分口径。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>杭州蜂窝最深，说明交易频次与异常分同时抬升，应优先做贸易背景核验与集中抽查。</li>
          <li>苏州蜂窝处于观察带，更像“量不低但尚未爆发”的园区异常，应联动授信敞口做提前预警。</li>
          <li>宁波蜂窝虽弱，但持续出现中等异常分，适合纳入贷后巡检名单，而不是完全忽略。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
