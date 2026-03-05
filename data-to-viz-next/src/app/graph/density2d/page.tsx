'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { Density2DIcon } from '@/components/viz/icons';
import { DensityHeatmapG2 } from '@/components/viz/charts/DensityHeatmapG2';
import { DensityHeatmapLtvScenarioG2 } from '@/components/viz/charts/DensityHeatmapScenarioG2';

export default function DensityHeatmapStory() {
  const outlineItems = [
    { id: 'what-is-density-heatmap', label: '什么是密度热力图' },
    { id: 'when-to-use-density-heatmap', label: '何时使用' },
    { id: 'density-heatmap-common-mistakes', label: '常见误区' },
    { id: 'density-heatmap-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="密度热力图"
      subtitle="在二维空间中以颜色表达样本密度，定位风险聚集区域。"
      icon={Density2DIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是密度热力图？" id="what-is-density-heatmap">
        <p>
          密度热力图（Density Heatmap）将两个数值维度划分为网格，并用颜色深浅表达每个网格中的样本密度。
          相比直接绘制海量散点，它更容易呈现聚集区、稀疏区与风险分层边界。
        </p>
        <p>
          在需要同时关注“两个连续变量交叉变化”与“样本集中度”的分析场景中，密度热力图通常比普通散点图更清晰。
        </p>
        <p>英文名：Density Heatmap</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G2）">
        <DensityHeatmapG2 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-density-heatmap">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>样本量很大，散点重叠严重，难以识别高密度区域。</li>
          <li>需要识别“二维阈值组合”下的风险聚集（如高 LTV + 房价下跌）。</li>
          <li>需要把结果直接映射到贷后分层、重组优先级或拨备分层规则。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="density-heatmap-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">只看热点，不看样本基数</h3>
            <p className="text-sm text-red-700">
              热区颜色深并不必然代表高风险率，需结合账户基数、余额暴露与逾期率综合判断。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">平滑参数失衡</h3>
            <p className="text-sm text-red-700">
              平滑过强会抹平局部风险簇，平滑过弱又会把噪声误读成结构信号，需要按业务粒度校准。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="density-heatmap-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">按揭 LTV × 房价变动风险密度分层</h3>
          <p className="text-base text-slate-600">
            对应节点 ID：root/q-2num/q-2num-notordered/q-notordered-many/chart-density-heatmap（leaf id=chart-density-heatmap）
          </p>
          <p>
            通过密度热力图识别“高 LTV 且房价下跌”客户聚集区，可优先锁定潜在止损与重组对象，
            支持按揭组合的贷后分层管理与拨备分层。
          </p>
        </div>

        <ChartWrapper title="数据密度热力图：LTV × 房价变动账户分布（对数色阶）">
          <DensityHeatmapLtvScenarioG2 />
        </ChartWrapper>

        <p className="text-sm text-slate-500">
          说明：report 提供的是二维聚合矩阵，本图按原始占比重采样为连续点云后做核密度平滑，
          用于匹配密度热力图的交互语义。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>&gt;85% 客群在房价下跌区（≤-5%）占比最高，达到 43.2%，且在重跌区（&lt;-15%）占 44.0%。</li>
          <li>房价下跌区（≤-5%）的绝对规模最大来自 70%-85% LTV（14,400 户），风险并非只集中在极端 LTV。</li>
          <li>建议按“高占比（&gt;85%）+大规模（70%-85%）”双维度设预警名单，联动展期、重组与风险沟通动作。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
