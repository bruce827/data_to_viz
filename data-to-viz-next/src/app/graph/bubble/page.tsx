'use client';

import React from 'react';
import Image from 'next/image';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { BubbleIcon } from '@/components/viz/icons';
import { BubblePortfolioScenarioG2 } from '@/components/viz/charts/BubbleScenarioG2';

export default function BubbleStory() {
  const outlineItems = [
    { id: 'what-is-bubble', label: '什么是气泡图' },
    { id: 'when-to-use-bubble', label: '何时使用' },
    { id: 'bubble-common-mistakes', label: '常见误区' },
    { id: 'bubble-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="气泡图"
      subtitle="在二维关系中引入规模维度，直观看到“风险-收益-暴露”三维权衡。"
      icon={BubbleIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是气泡图？" id="what-is-bubble">
        <p>
          气泡图（Bubble Chart）可以理解为“带大小编码的散点图”。
          横纵轴通常表达两个核心指标，气泡面积表达第三个指标（通常是规模或权重）。
        </p>
        <p>
          当分析目标不只是“相关关系”，而是同时比较“关系 + 规模影响”时，气泡图会比普通散点图更有决策价值。
        </p>
        <p>英文名：Bubble Chart</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G2）">
        <Image
          src="/images/stories/bubble/bubble-example.png"
          alt="气泡图交互示例"
          width={368}
          height={475}
          className="w-full h-auto rounded-md border border-slate-200"
        />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-bubble">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要在同一图中同时比较风险、收益与规模。</li>
          <li>需要快速识别“大暴露但收益不足”的结构性问题。</li>
          <li>需要做组合调优（投放、压降、限额分配）并向管理层解释依据。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="bubble-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">只看位置不看面积含义</h3>
            <p className="text-sm text-red-700">
              气泡大小代表规模，若只看点位高低容易低估“大体量低效率”对组合的拖累。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">面积比例失真</h3>
            <p className="text-sm text-red-700">
              直接线性映射半径会放大视觉差异，建议用平方根比例映射尺寸，保持感知可读性。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="bubble-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">行业组合的“风险-收益-规模”三维权衡</h3>
          <p className="text-base text-slate-600">
            对应节点 ID：root/q-3num/chart-bubble（leaf id=chart-bubble）
          </p>
          <p>
            在对公组合管理中，将 PD 作为风险轴、RAROC 作为收益轴、EAD 作为规模轴，可快速识别
            “高风险低收益的大暴露”行业并触发压降或结构重配。
          </p>
        </div>

        <ChartWrapper title="数据气泡图：行业 PD-RAROC-EAD 组合诊断">
          <BubblePortfolioScenarioG2 />
        </ChartWrapper>

        <p className="text-sm text-slate-500">
          说明：本场景直接使用 report 提供的行业样例数据（虚构演示数据），未做额外补数。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>房地产上下游呈现“大泡泡 + 高 PD + 中低 RAROC”，属于优先压降与精选投放对象。</li>
          <li>科技创新与绿色能源位于“中低 PD + 较高 RAROC”区间，可作为结构转型候选方向。</li>
          <li>组合管理应同步看“象限位置 + 泡泡面积”，避免被小规模高收益样本误导整体配置。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
