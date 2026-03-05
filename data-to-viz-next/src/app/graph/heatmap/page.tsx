'use client';

import React from 'react';
import Image from 'next/image';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { HeatmapIcon } from '@/components/viz/icons';
import { HeatmapManyScenarioG2 } from '@/components/viz/charts/HeatmapManyScenarioG2';

export default function HeatmapManyStory() {
  const outlineItems = [
    { id: 'what-is-threshold-heatmap', label: '什么是阈值热力图' },
    { id: 'when-to-use-threshold-heatmap', label: '何时使用' },
    { id: 'threshold-heatmap-common-mistakes', label: '常见误区' },
    { id: 'threshold-heatmap-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="阈值热力图"
      subtitle="在二维指标空间中用颜色表示密度，快速定位风险高发区。"
      icon={HeatmapIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是阈值热力图？" id="what-is-threshold-heatmap">
        <p>
          阈值热力图（Threshold Heatmap）把两个数值维度离散成网格，并用颜色深浅表达每个格子的样本数量或风险强度。
          与散点图相比，它更适合大样本密集场景，避免点位重叠导致的信息遮挡。
        </p>
        <p>
          当业务决策依赖“阈值组合”时（如高利用率 + 轻逾期），阈值热力图可以直接定位风险聚集区，
          用于策略分层、额度调整和催收优先级排布。
        </p>
        <p>英文名：Threshold Heatmap</p>
      </StorySection>

      <ChartWrapper title="交互示例（边界平滑对比）">
        <div className="grid gap-6 md:grid-cols-2">
          <figure className="space-y-2">
            <Image
              src="/images/stories/heatmap/heatmap-boundary-raw.png"
              alt="边界未经平滑处理的热力图"
              width={1020}
              height={654}
              className="w-full h-auto rounded-md border border-slate-200"
            />
            <figcaption className="text-sm text-slate-600">1. 边界未经平滑处理的热力图</figcaption>
          </figure>
          <figure className="space-y-2">
            <Image
              src="/images/stories/heatmap/heatmap-boundary-smoothed.png"
              alt="边界经平滑处理的热力图"
              width={1004}
              height={636}
              className="w-full h-auto rounded-md border border-slate-200"
            />
            <figcaption className="text-sm text-slate-600">2. 边界经平滑处理的热力图</figcaption>
          </figure>
        </div>
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-threshold-heatmap">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>二维指标样本量很大，散点图出现明显重叠。</li>
          <li>需要快速识别“阈值组合”下的风险聚集程度。</li>
          <li>需要将结果直接映射到策略矩阵（如降额、止付、催收分层）。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="threshold-heatmap-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">例 1：不适合精确比较具体数值</h3>
            <p className="text-sm text-red-700">
              热力图通过颜色强度表现数值大小，但人眼对颜色的感知不如对长度的感知精确。
              如果需要准确比较具体数值，柱状图或折线图通常是更好的选择。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">例 2：不适合展示少量离散数据点</h3>
            <p className="text-sm text-red-700">
              当数据点较少时，热力图的密度分布优势不明显，直接使用散点图会更清晰直观。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="threshold-heatmap-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">信用卡“高利用率 × 逾期”风险密度分布</h3>
          <p className="text-base text-slate-600">
            对应节点 ID：root/q-2num/q-2num-notordered/q-notordered-many/chart-heatmap-many（leaf id=chart-heatmap-many）
          </p>
          <p>
            在零售客户量大、行为高频的场景下，利用率与 DPD 的二维热力图可用于定位风险集中区。
            特别是“利用率≥80% 且 DPD≥31 天”的网格，通常是额度策略和催收策略的重点干预区域。
          </p>
        </div>

        <ChartWrapper title="数据热力图：利用率 × DPD 账户密度（对数色阶）">
          <HeatmapManyScenarioG2 />
        </ChartWrapper>

        <p className="text-sm text-slate-500">
          说明：本场景直接使用 report 提供的二维矩阵示例数据（虚构演示数据），未做额外样本扩展。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>80%-100% 与超限区间在 31-90 天和 &gt;90 天网格显著变深，说明尾部违约压力集中。</li>
          <li>“高利用率 + 1-30 天”网格规模最大，体现风险先堆积后迁移，适合前置干预。</li>
          <li>将高风险网格直接映射到策略矩阵，可形成“监控-触发-动作”的闭环管理。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
