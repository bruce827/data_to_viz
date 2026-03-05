'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { DensityIcon } from '@/components/viz/icons';
import { DensityG2 } from '@/components/viz/charts/DensityG2';
import { DensityAmlScenarioG2 } from '@/components/viz/charts/DensityScenarioG2';

export default function DensityStory() {
  const outlineItems = [
    { id: 'what-is-density', label: '什么是密度图' },
    { id: 'when-to-use-density', label: '何时使用' },
    { id: 'density-common-mistakes', label: '常见误区' },
    { id: 'density-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="密度图"
      subtitle="用于平滑展示连续变量分布形态并识别峰值结构。"
      icon={DensityIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是密度图？" id="what-is-density">
        <p>
          密度图（Density Plot）是直方图的平滑版本，用连续曲线表达数据在不同取值区间的相对集中程度。
          它更容易观察分布形态中的单峰、多峰、长尾和偏态特征。
        </p>
        <p>
          与直方图相比，密度图不依赖固定分箱边界，能减少“分箱选择”对视觉结果的影响。
          在需要观察阈值附近是否出现异常聚集时，密度图通常更直观。
        </p>
        <p>
          英文名：Density Plot
        </p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G2）">
        <DensityG2 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-density">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要观察连续变量的整体形状，而不是只看离散柱高。</li>
          <li>希望识别阈值附近的“异常峰值”或多峰分布。</li>
          <li>需要对比不同客群分布形态差异（可结合分面方式）。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="density-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">带宽过大</h3>
            <p className="text-sm text-red-700">
              过度平滑会抹掉局部峰值，导致真实异常聚集被忽略。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">带宽过小</h3>
            <p className="text-sm text-red-700">
              曲线会过度抖动，随机噪声被误读为结构性风险信号。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="density-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">现金收支金额分布的核密度监控</h3>
          <p className="text-base text-slate-600">对应节点 ID：root/q-1num/chart-density（leaf id=chart-density）</p>
          <p>
            对柜面、ATM、现金管理客户的现金存取款金额绘制密度图，观察在监管或内部监测阈值附近是否出现异常峰值。
            在反洗钱场景中，5 万元阈值附近的密度抬升，通常比均值变化更早暴露“结构化拆分/贴阈值”行为。
          </p>
        </div>

        <ChartWrapper title="数据密度图：现金交易金额分布（阈值线 = 50,000 元）">
          <DensityAmlScenarioG2 />
        </ChartWrapper>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>45,000-55,000 区间出现明显密度抬升，更符合结构化拆分而非自然现金需求。</li>
          <li>若峰值集中在少数客户、少数网点或少数时段，应提升可疑交易核查优先级。</li>
          <li>仅靠“是否大于等于 5 万元”不够，应联动频次、跨账户关联和交易网络指标。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
