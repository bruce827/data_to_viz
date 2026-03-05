'use client';

import React from 'react';
import Image from 'next/image';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { VennIcon } from '@/components/viz/icons';
import { VennChannelScenarioG2 } from '@/components/viz/charts/VennScenarioG2';

const scenarioTableRows = [
  { segmentLabel: '移动银行独占', countK: 6800, share: 0.4722 },
  { segmentLabel: '网银独占', countK: 950, share: 0.0660 },
  { segmentLabel: '柜面独占', countK: 1200, share: 0.0833 },
  { segmentLabel: '移动银行∩网银', countK: 2100, share: 0.1458 },
  { segmentLabel: '移动银行∩柜面', countK: 1750, share: 0.1215 },
  { segmentLabel: '网银∩柜面', countK: 620, share: 0.0431 },
  { segmentLabel: '移动银行∩网银∩柜面', countK: 980, share: 0.0681 },
];

export default function VennStory() {
  const outlineItems = [
    { id: 'what-is-venn', label: '什么是韦恩图' },
    { id: 'when-to-use-venn', label: '何时使用' },
    { id: 'venn-common-mistakes', label: '常见误区' },
    { id: 'venn-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="韦恩图"
      subtitle="用于展示集合重叠关系，适合识别“独占客群”与“多渠道交集客群”的结构分布。"
      icon={VennIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是韦恩图？" id="what-is-venn">
        <p>
          韦恩图（Venn Diagram）通过重叠圆形表达集合关系，可直观看到独占部分与交集部分。
          对于渠道运营、客群重叠、产品持有重合分析，韦恩图能快速回答“谁只在一个集合里、谁跨集合出现”。
        </p>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="px-3 py-2 w-44 font-semibold text-slate-700">图表类型</td>
                  <td className="px-3 py-2 text-slate-700">基础韦恩图</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="px-3 py-2 w-44 font-semibold text-slate-700">适合的数据</td>
                  <td className="px-3 py-2 text-slate-700">
                    集合数据：包含集合名称、集合大小、交集关系的数据
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="px-3 py-2 w-44 font-semibold text-slate-700">功能</td>
                  <td className="px-3 py-2 text-slate-700">
                    展示不同集合之间的交集、并集和独立关系
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="px-3 py-2 w-44 font-semibold text-slate-700">数据与图形的映射</td>
                  <td className="px-3 py-2 text-slate-700">
                    集合名称映射到圆形区域；集合大小映射到圆形面积；交集关系通过重叠区域表示
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 w-44 font-semibold text-slate-700">适合的场景</td>
                  <td className="px-3 py-2 text-slate-700">
                    2-4 个集合的关系分析，用户群体分析，产品功能对比
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <p>英文名：Venn Diagram</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G2）">
        <figure className="rounded-lg border border-slate-200 bg-white p-2">
          <Image
            src="/images/graph/venn/interactive-example-1.png"
            alt="韦恩图交互示例"
            width={949}
            height={601}
            className="w-full h-auto rounded-md"
          />
        </figure>
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-venn">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要展示 2-3 个集合之间的重叠关系。</li>
          <li>需要同时比较“独占客群”和“交集客群”的规模。</li>
          <li>需要在一张图里表达渠道迁移与多渠道渗透程度。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="venn-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">把韦恩图当精确比较图</h3>
            <p className="text-sm text-red-700">
              韦恩图主要表达关系结构，不适合对接近数值做精确比较；精确对比建议配套条形图或数据表。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">忽略交集客群的经营动作</h3>
            <p className="text-sm text-red-700">
              只看“圈大小”不够，需要把交集客群映射到迁移策略与服务成本优化动作。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="venn-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">渠道重叠与数字化迁移（移动银行×网银×柜面）</h3>
          <p className="text-base text-slate-600">
            对应节点 ID：root/q-2cat/q-2cat-set/chart-venn（leaf id=chart-venn）
          </p>
          <p>
            通过韦恩图展示移动银行、网银与柜面三类活跃客群的独占与交集规模，
            用于识别“纯柜面”迁移机会和“多渠道”深度经营机会，支持网点优化与数字化转化策略。
          </p>
        </div>

        <ChartWrapper title="数据韦恩图：渠道交集客群分布">
          <VennChannelScenarioG2 />
        </ChartWrapper>

        <p className="text-sm text-slate-500">
          说明：本场景使用 `docs/cate-deep-research-report.md` 中 `chart-venn` 样例数据；
          原始 segment 数据可直接映射为 `sets + size`，不需要额外补数。
        </p>
        <p className="text-sm text-slate-500">
          为避免标签拥挤，图上仅展示单渠道与三渠道交集标签；双渠道交集请通过悬停 tooltip 或下方数据表查看。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>移动银行相关客群（含独占与交集）占比约 80.76%，是渠道经营主阵地。</li>
          <li>柜面独占客群约 8.33%，可作为“线下向线上迁移”重点人群。</li>
          <li>三渠道交集客群约 6.81%，通常具备更高综合服务价值，可配置专属经营策略。</li>
        </ul>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h4 className="text-base font-semibold text-slate-900 mb-3">场景数据表（单位：千人，as_of=2025-12-31）</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                  <th className="px-3 py-2 text-left font-semibold">分段</th>
                  <th className="px-3 py-2 text-right font-semibold">客户规模</th>
                  <th className="px-3 py-2 text-right font-semibold">占比</th>
                </tr>
              </thead>
              <tbody>
                {scenarioTableRows.map((row) => (
                  <tr key={row.segmentLabel} className="border-b border-slate-100 text-slate-700">
                    <td className="px-3 py-2">{row.segmentLabel}</td>
                    <td className="px-3 py-2 text-right">{row.countK.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right">{(row.share * 100).toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </StorySection>
    </StoryLayout>
  );
}
