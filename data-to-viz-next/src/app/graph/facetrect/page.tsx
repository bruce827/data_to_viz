'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { FacetRectIcon } from '@/components/viz/icons';
import { FacetRectG2 } from '@/components/viz/charts/FacetRectG2';
import { FacetRectRiskScenarioG2 } from '@/components/viz/charts/FacetRectScenarioG2';

export default function FacetRectStory() {
  const outlineItems = [
    { id: 'what-is-facet-rect', label: '什么是矩形分面图' },
    { id: 'when-to-use-facet-rect', label: '何时使用' },
    { id: 'facet-rect-common-mistakes', label: '常见误区' },
    { id: 'facet-rect-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="矩形分面图"
      subtitle="按多个维度拆分小面板，适合比较“产品×客群”切片下的风险与合规指标。"
      icon={FacetRectIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是矩形分面图？" id="what-is-facet-rect">
        <p>
          矩形分面图（Facet Rect）会先按分类维度拆分多个小面板，再在每个面板中绘制同构图形。
          它适合多维切片对比，帮助识别“局部高风险组合”。
        </p>
        <p>英文名：Facet Rect</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G2）">
        <FacetRectG2 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-facet-rect">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要同时对比多个维度组合（如产品×客群×风险等级）。</li>
          <li>需要识别某些局部组合的高风险高投诉特征。</li>
          <li>需要在一个视图中保留全局结构和局部差异。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="facet-rect-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">分面过多导致可读性下降</h3>
            <p className="text-sm text-red-700">
              维度组合过多会让每个面板过小。应控制分面数量或增加筛选条件。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">面板间尺度不统一</h3>
            <p className="text-sm text-red-700">
              若不同面板尺度不一致，横向比较会失真。建议统一主要度量轴范围。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="facet-rect-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">
            产品×客户类型×风险等级分面矩阵（合规与风险统一视角）
          </h3>
          <p className="text-base text-slate-600">
            对应节点 ID：root/q-combo/q-combo-mcat-mnum/chart-combo-mcat-mnum-facet-rect（leaf id=chart-combo-mcat-mnum-facet-rect）
          </p>
          <p>
            按产品（消费贷、信用卡、按揭）与客户类型（新客、存量）分面展示，
            面板内用点位编码风险等级、NPL（不良贷款率）和投诉率，
            快速识别高风险与高投诉叠加组合。
          </p>
        </div>

        <ChartWrapper title="数据矩形分面图：产品-客群风险与投诉分布">
          <FacetRectRiskScenarioG2 />
        </ChartWrapper>

        <p className="text-sm text-slate-500">
          说明：本场景基于 `docs/catenum-deep-research-report.md` 中 `FREC` 样例口径，
          按相同字段结构扩展为更完整的“产品×客群×风险等级”矩阵数据。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>信用卡-新客-高风险组合 NPL 与投诉率均最高（3.50%、0.60%）。</li>
          <li>同产品下新客普遍高于存量（消费贷与信用卡差异最明显）。</li>
          <li>按揭产品两类客群整体处于低到中风险区间（NPL 0.30%-0.40%）。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
