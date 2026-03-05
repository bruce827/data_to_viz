'use client';

import React from 'react';
import Image from 'next/image';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { BarplotIcon } from '@/components/viz/icons';
import { BarplotRegionRiskScenarioG2 } from '@/components/viz/charts/BarplotScenarioG2';

export default function BarplotStory() {
  const outlineItems = [
    { id: 'what-is-barplot', label: '什么是条形图' },
    { id: 'when-to-use-barplot', label: '何时使用' },
    { id: 'barplot-common-mistakes', label: '常见误区' },
    { id: 'barplot-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="条形图"
      subtitle="用于比较离散类别指标差异，适合管理驾驶舱做排名、阈值预警与区域对标。"
      icon={BarplotIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是条形图？" id="what-is-barplot">
        <p>
          条形图（Barplot）是对分类指标做横向比较最常用的图表。每个条形长度直接对应数值大小，
          适合快速回答“哪个高、哪个低、差多少”。
        </p>
        <p>
          在银行管理场景中，区域、行业、产品、客群等维度通常都是离散分类，条形图可以稳定支撑排名分析、
          对标分析和阈值预警。
        </p>
        <p>英文名：Barplot</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G2）">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <figure className="rounded-lg border border-slate-200 bg-white p-2">
            <Image
              src="/images/graph/barplot/interactive-example-1.jpg"
              alt="条形图交互示例 1"
              width={1508}
              height={1180}
              className="w-full h-auto rounded-md"
            />
          </figure>
          <figure className="rounded-lg border border-slate-200 bg-white p-2">
            <Image
              src="/images/graph/barplot/interactive-example-2.jpg"
              alt="条形图交互示例 2"
              width={1564}
              height={1238}
              className="w-full h-auto rounded-md"
            />
          </figure>
        </div>
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-barplot">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要比较多个分类在单个关键指标上的高低差异。</li>
          <li>需要做排序展示并快速定位异常类别。</li>
          <li>需要将分类指标与管理阈值联动做告警分层。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="barplot-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">分类太多却不排序</h3>
            <p className="text-sm text-red-700">
              未排序会降低可读性，管理层难以在第一眼识别高风险区和尾部异常。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">只看单指标不看辅助指标</h3>
            <p className="text-sm text-red-700">
              比如只看 NPL（不良贷款率）不看 Stage 2（阶段二贷款）占比，容易低估早期风险压力。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="barplot-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">区域信用风险条形看板</h3>
          <p className="text-base text-slate-600">
            对应节点 ID：root/q-1cat/chart-barplot（leaf id=chart-barplot）
          </p>
          <p>
            以区域为分类，按 NPL（不良贷款率）降序对比，同时在 tooltip 中联动
            Stage 2（阶段二贷款）占比、拨备覆盖率与贷款余额，用于总行月度风险例会快速识别
            “高风险区”和“关注区”。
          </p>
        </div>

        <ChartWrapper title="数据条形图：区域 NPL（不良贷款率）分层对比">
          <BarplotRegionRiskScenarioG2 />
        </ChartWrapper>

        <p className="text-sm text-slate-500">
          说明：本场景数据直接对应 `docs/cate-deep-research-report.md` 中 `chart-barplot` 样例，
          字段可直接满足条形图渲染，不需要额外补数。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>东北（1.95%）和西北（1.82%）已处高风险区，应优先纳入重点清单。</li>
          <li>中部（1.64%）与成渝（1.56%）处关注区，且 Stage 2 占比偏高，需前置贷后排查。</li>
          <li>长三角（1.21%）与珠三角（1.28%）整体稳健，可作为区域对标基线。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
