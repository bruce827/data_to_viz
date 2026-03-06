'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { SunburstIcon } from '@/components/viz/icons';
import { SunburstG2 } from '@/components/viz/charts/SunburstG2';
import { SunburstStructureAssetScenarioG2 } from '@/components/viz/charts/SunburstStructureScenarioG2';

const scenarioTableRows = [
  { month: '2025-12', product: '存款', channel: '手机银行', aum100m: 3700, segmentCnt: 3 },
  { month: '2025-12', product: '存款', channel: '网点', aum100m: 2500, segmentCnt: 2 },
  { month: '2025-12', product: '存款', channel: '客户经理', aum100m: 450, segmentCnt: 1 },
  { month: '2025-12', product: '理财', channel: '手机银行', aum100m: 2650, segmentCnt: 3 },
  { month: '2025-12', product: '理财', channel: '网点', aum100m: 1000, segmentCnt: 2 },
  { month: '2025-12', product: '理财', channel: '客户经理', aum100m: 760, segmentCnt: 1 },
  { month: '2025-12', product: '基金', channel: '手机银行', aum100m: 1180, segmentCnt: 2 },
  { month: '2025-12', product: '基金', channel: '客户经理', aum100m: 420, segmentCnt: 1 },
  { month: '2025-12', product: '基金', channel: '网点', aum100m: 210, segmentCnt: 1 },
  { month: '2025-12', product: '保险', channel: '客户经理', aum100m: 780, segmentCnt: 2 },
  { month: '2025-12', product: '保险', channel: '网点', aum100m: 180, segmentCnt: 1 },
  { month: '2025-12', product: '保险', channel: '手机银行', aum100m: 140, segmentCnt: 1 },
];

export default function SunburstStructureStory() {
  const outlineItems = [
    { id: 'what-is-sunburst-structure', label: '什么是旭日图' },
    { id: 'when-to-use-sunburst-structure', label: '何时使用' },
    { id: 'sunburst-structure-common-mistakes', label: '常见误区' },
    { id: 'sunburst-structure-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="旭日图"
      subtitle="用同心环展示资产结构层级，适合做“业务线→产品→渠道”的组合穿透分析。"
      icon={SunburstIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是旭日图？" id="what-is-sunburst-structure">
        <p>
          旭日图（Sunburst）通过同心圆环表示层级关系，扇区角度映射规模，适合在一屏内观察多层结构的占比差异。
          在经营分析里，常用于拆解“总盘-产品-渠道”这类层级数据。
        </p>
        <p>英文名：Sunburst</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G2）">
        <SunburstG2 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-sunburst-structure">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要同时查看层级结构和占比，不只是单维度排名。</li>
          <li>需要识别产品层与渠道层的结构偏重。</li>
          <li>需要将资产结构复盘与渠道经营策略联动。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="sunburst-structure-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">只看外圈，不看父层级</h3>
            <p className="text-sm text-red-700">
              外圈渠道规模必须结合所属产品解释，否则会误判结构权重。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">颜色映射口径不清晰</h3>
            <p className="text-sm text-red-700">
              颜色应固定映射到产品类别，避免同一类别在不同扇区出现不同语义。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="sunburst-structure-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">
            AUM/客户资产结构（业务线→产品→渠道）
          </h3>
          <p className="text-base text-slate-600">
            对应节点 ID：root/q-structure/q-structure-hierarchy/chart-structure-hierarchy-sunburst（leaf id=chart-structure-hierarchy-sunburst）
          </p>
          <p>
            以 2025-12（2025年12月）为窗口，展示资产总盘在存款、理财、基金、保险上的分布，
            并进一步下钻到“渠道→客群”（大众客/新市民/高净值）三级结构，用于评估产品结构与渠道客群匹配度。
          </p>
        </div>

        <ChartWrapper title="数据旭日图：资产总盘的产品与渠道结构">
          <SunburstStructureAssetScenarioG2 />
        </ChartWrapper>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h4 className="text-base font-semibold text-slate-900 mb-3">场景数据摘要表（单位：亿元，month=2025-12）</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                  <th className="px-3 py-2 text-left font-semibold">产品</th>
                  <th className="px-3 py-2 text-left font-semibold">渠道</th>
                  <th className="px-3 py-2 text-right font-semibold">AUM</th>
                  <th className="px-3 py-2 text-right font-semibold">覆盖客群数</th>
                </tr>
              </thead>
              <tbody>
                {scenarioTableRows.map((row) => (
                  <tr key={`${row.product}-${row.channel}`} className="border-b border-slate-100 text-slate-700">
                    <td className="px-3 py-2">{row.product}</td>
                    <td className="px-3 py-2">{row.channel}</td>
                    <td className="px-3 py-2 text-right">{row.aum100m.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right">{row.segmentCnt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-sm text-slate-500">
          说明：本场景基于 `docs/catenum-deep-research-report.md` 中 `SUN` 的产品与渠道口径，
          按你的要求补充“客群”层数据，构造成 `产品→渠道→客群` 三级旭日结构，以更好体现旭日图层级特征。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>存款总量 6,650 亿元，占总盘约 47.60%，仍是资产结构主力。</li>
          <li>手机银行渠道合计 7,670 亿元，占总盘约 54.90%，线上贡献已超过一半。</li>
          <li>理财中高净值客群规模为 2,140 亿元，占理财板块约 48.53%，适合重点配置顾问式经营策略。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
