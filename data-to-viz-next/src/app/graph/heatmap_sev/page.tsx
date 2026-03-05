'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { HeatmapIcon } from '@/components/viz/icons';
import { HeatmapSevG2 } from '@/components/viz/charts/HeatmapSevG2';
import { HeatmapStressScenarioG2 } from '@/components/viz/charts/HeatmapStressScenarioG2';

export default function HeatmapSevStory() {
  const outlineItems = [
    { id: 'what-is-heatmap-sev', label: '什么是热力图' },
    { id: 'when-to-use-heatmap-sev', label: '何时使用' },
    { id: 'heatmap-sev-common-mistakes', label: '常见误区' },
    { id: 'heatmap-sev-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="热力图"
      subtitle="把多组合与多情景结果矩阵化呈现，快速定位压力测试红区。"
      icon={HeatmapIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是热力图？" id="what-is-heatmap-sev">
        <p>
          热力图（Heatmap）通过颜色深浅编码数值强弱，将二维矩阵中的差异直观展示出来。
          它特别适合“组合 × 情景”“区域 × 指标”等交叉结构的对比分析。
        </p>
        <p>
          当管理问题是“在哪些单元格优先介入”时，热力图比表格更快、更聚焦，
          能在高维信息中快速突出异常或极值区。
        </p>
        <p>英文名：Heatmap</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G2）">
        <HeatmapSevG2 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-heatmap-sev">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要比较多个组合在多个情景下的结果差异。</li>
          <li>需要快速标出“高损失率红区”并触发策略动作。</li>
          <li>需要向管理层说明“情景变化对组合影响”的优先级。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="heatmap-sev-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">只看颜色，不看口径</h3>
            <p className="text-sm text-red-700">
              颜色深浅必须建立在统一指标口径上（如统一为损失率 bp），否则跨单元格比较会失真。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">忽略基准增量</h3>
            <p className="text-sm text-red-700">
              仅看绝对值会漏掉压力传导速度，建议同步展示“较基准变化”作为决策依据。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="heatmap-sev-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">压力测试情景矩阵下的组合预期损失对比</h3>
          <p className="text-base text-slate-600">对应节点 ID：root/q-sevnum/q-sevnum-notordered/chart-heatmap（leaf id=chart-heatmap）</p>
          <p>
            在“基准-不利-严重”三情景下，对按揭、普惠小微、房地产开发贷、平台类融资进行矩阵化展示，
            可直接识别高敏感组合并映射到资本缓冲与限额管理动作。
          </p>
        </div>

        <ChartWrapper title="数据热力图：情景压力测试损失率矩阵（bp）">
          <HeatmapStressScenarioG2 />
        </ChartWrapper>

        <p className="text-sm text-slate-500">
          说明：本场景直接使用 report 提供的压力测试矩阵数据（虚构演示数据），未做额外补数。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>房地产开发贷在严重情景达到 260 bp，为全矩阵最高值，应作为资本与限额管理优先对象。</li>
          <li>普惠小微从基准 45 bp 上升到严重 140 bp，增量显著，提示扩量阶段需同步强化贷后缓释。</li>
          <li>平台类融资虽低于开发贷，但严重情景升至 110 bp，仍需结合区域财政与现金流穿透分层管理。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
