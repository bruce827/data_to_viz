'use client';

import React from 'react';
import Image from 'next/image';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { HistogramIcon } from '@/components/viz/icons';
import { HistogramDpdScenarioG2 } from '@/components/viz/charts/HistogramScenariosG2';

export default function HistogramStory() {
  const outlineItems = [
    { id: 'what-is-histogram', label: '什么是直方图' },
    { id: 'when-to-use-histogram', label: '何时使用' },
    { id: 'histogram-common-mistakes', label: '常见误区' },
    { id: 'histogram-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="直方图"
      subtitle="用于近似展示数值型数据分布的基础图表。"
      icon={HistogramIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是直方图？" id="what-is-histogram">
        <p>
          直方图，形状类似柱状图却有着与柱状图完全不同的含义。
          直方图牵涉统计学的概念，首先要对数据进行分组，然后统计每个分组内数据元的数量。
        </p>
        <p>
          在平面直角坐标系中，横轴标出每个组的端点，纵轴表示频数，每个矩形的高代表对应的频数，
          称这样的统计图为频数分布直方图。
        </p>
        <p>
          频数分布直方图需要经过“频数乘以组距”的计算过程才能得出每个分组的数量，
          同一个直方图的组距是一个固定不变的值，所以如果直接用纵轴表示数量，每个矩形的高代表对应的数据元数量，
          既能保持分布状态不变，又能直观地看出每个分组的数量。本文的例子全部使用纵轴表示数量的非标准直方图绘制。
        </p>

        <div className="space-y-3">
          <h3 className="text-xl font-bold text-slate-900">相关概念</h3>
          <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
            <li>组数：在统计数据时，我们把数据按照不同的范围分成几个组，分成的组的个数称为组数。</li>
            <li>组距：每一组两个端点的差。</li>
            <li>频数：分组内的数据元的数量除以组距。</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-bold text-slate-900">直方图的作用</h3>
          <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
            <li>能够显示各组频数或数量分布的情况。</li>
            <li>易于显示各组之间频数或数量的差别。</li>
            <li>通过直方图还可以观察和估计哪些数据比较集中，异常或者孤立的数据分布在何处。</li>
          </ul>
        </div>
        <p>
          英文名：Histogram
        </p>
      </StorySection>

      <ChartWrapper title="示例图">
        <Image
          src="/images/stories/histogram-example.png"
          alt="直方图示例"
          width={766}
          height={470}
          className="w-full h-auto rounded-md border border-slate-200"
          priority
        />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-histogram">
        <p>
          直方图非常适合展示变量的整体分布形态，
          能帮助你回答这类问题：
        </p>
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>最常见的取值是什么？（众数）</li>
          <li>数据分布是对称的，还是偏斜的？</li>
          <li>是否存在离群值？</li>
          <li>数据的大致范围有多大？</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="histogram-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
           <div className="bg-red-50 p-6 rounded-lg border border-red-100">
              <h3 className="font-bold text-red-800 mb-2">分箱过大</h3>
              <p className="text-sm text-red-700">
                 分箱设置得过大时，会丢失细节，可能看不到重要模式，或忽略数据中的多峰特征。
              </p>
           </div>
           <div className="bg-red-50 p-6 rounded-lg border border-red-100">
              <h3 className="font-bold text-red-800 mb-2">分箱过小</h3>
              <p className="text-sm text-red-700">
                 分箱设置得过小时，图形会显得过于噪声化，更容易反映随机波动，而不是底层分布趋势。
              </p>
           </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="histogram-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">零售贷款 DPD 分布监控</h3>
          <p className="text-base text-slate-600">对应节点 ID：root/q-1num/chart-hist（leaf id=chart-hist）</p>
          <p>
            用直方图观察贷后“逾期天数（DPD）”的分布形态与长尾，可更早识别
            “轻逾期堆积 → 滚动逾期 → 实质违约”的迁移路径，辅助催收分层和拨备策略调整。
          </p>
        </div>

        <ChartWrapper title="数据直方图：DPD 分箱与账户数">
          <HistogramDpdScenarioG2 />
        </ChartWrapper>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>1-30 天轻逾期占比已达 10.5%，若滚动率维持 12%，后续账期 Stage2 压力会继续上升。</li>
          <li>31-90 天区间滚动率从 28% 提升到 41%，是贷后策略是否失效的关键观察带。</li>
          <li>&gt;180 天账户占比仅 1.0%，但余额不低，呈现“低频高暴露”的尾部风险。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
