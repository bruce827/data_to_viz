'use client';

import React from 'react';
import Image from 'next/image';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { PieIcon } from '@/components/viz/icons';
import { PieLtvScenarioG2 } from '@/components/viz/charts/PieScenarioG2';

export default function PieStory() {
  const outlineItems = [
    { id: 'what-is-pie', label: '什么是饼图' },
    { id: 'when-to-use-pie', label: '何时使用' },
    { id: 'pie-common-mistakes', label: '常见误区' },
    { id: 'pie-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="饼图"
      subtitle="适合做结构占比总览，帮助管理层快速把握“整体由哪些部分构成”。"
      icon={PieIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是饼图？" id="what-is-pie">
        <p>
          饼图（Pie Chart）通过圆形扇区表达各类别在整体中的占比，常用于“结构型问题”的快速沟通。
          当类别数量较少且份额差异明显时，饼图能在一屏内传递清晰的比例关系。
        </p>
        <p>英文名：Pie Chart</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G2）">
        <figure className="rounded-lg border border-slate-200 bg-white p-2">
          <Image
            src="/images/graph/pie/interactive-example-1.png"
            alt="饼图交互示例"
            width={590}
            height={522}
            className="w-full h-auto rounded-md"
          />
        </figure>
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-pie">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要展示单一总体的构成比例。</li>
          <li>类别数量不多，且主要目的是做结构总览而非精确比较。</li>
          <li>需要在管理汇报中快速传达“主要构成在哪里”。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="pie-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">用饼图做精确比较</h3>
            <p className="text-sm text-red-700">
              饼图适合看结构，不适合比较相近份额的细微差异；若需要精确比较应改用条形图。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">类别过多导致可读性下降</h3>
            <p className="text-sm text-red-700">
              扇区过多会造成标签拥挤，建议合并长尾或仅标注 Top 类别，其他信息放到 tooltip。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="pie-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">按揭新投放 LTV 结构与风险偏好检视</h3>
          <p className="text-base text-slate-600">
            对应节点 ID：root/q-1cat/chart-pie（leaf id=chart-pie）
          </p>
          <p>
            将按揭新投放按 LTV（Loan-to-Value，贷款价值比）分段展示占比，
            用于识别高 LTV 尾部集中度，辅助评估零售资产结构是否偏离既定风险偏好。
          </p>
        </div>

        <ChartWrapper title="数据饼图：按揭新投放 LTV 分段占比">
          <PieLtvScenarioG2 />
        </ChartWrapper>

        <p className="text-sm text-slate-500">
          说明：本场景直接使用 `docs/cate-deep-research-report.md` 中 `chart-pie` 样例数据；
          `share` 字段可直接映射饼图，不需要额外补数。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>`60-70%` 与 `70-80%` 是主力区间（合计约 48.31%），整体结构仍以中等 LTV 为主。</li>
          <li>`90-100%` 与 `100%+` 尾部占比合计约 5.77%，规模不大但需要单独跟踪准入与贷后。</li>
          <li>建议将本图作为结构总览，并与可排序条形图联动做季度变化监测。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
