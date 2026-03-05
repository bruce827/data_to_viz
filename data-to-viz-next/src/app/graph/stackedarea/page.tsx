'use client';

import React from 'react';
import Image from 'next/image';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { StackedAreaIcon } from '@/components/viz/icons';
import { StackedAreaManyScenarioG2 } from '@/components/viz/charts/StackedAreaManyScenarioG2';

export default function StackedAreaManyStory() {
  const outlineItems = [
    { id: 'what-is-stacked-area-many', label: '什么是堆叠面积图' },
    { id: 'when-to-use-stacked-area-many', label: '何时使用' },
    { id: 'stacked-area-many-common-mistakes', label: '常见误区' },
    { id: 'stacked-area-many-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="堆叠面积图（大数据）"
      subtitle="用于展示总量趋势与各结构项贡献随时间的迁移。"
      icon={StackedAreaIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是堆叠面积图？" id="what-is-stacked-area-many">
        <p>
          堆叠面积图（Stacked Area Chart）在时间轴上同时表达两件事：总量如何变化、各组成部分如何分担总量。
          它比多条折线更强调“结构贡献”，也比单条总量线更容易解释增长来源。
        </p>
        <p>
          在高频经营分析中，若管理问题是“增长是被哪类资产/客群推动的”，堆叠面积图通常是直观且高效的表达方式。
        </p>
        <p>英文名：Stacked Area Chart</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G2）">
        <Image
          src="/images/stories/stackedarea/stackedarea-example.png"
          alt="堆叠面积图交互示例"
          width={354}
          height={310}
          className="w-full h-auto rounded-md border border-slate-200"
        />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-stacked-area-many">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要同时观察总量趋势与结构占比迁移。</li>
          <li>需要解释“增长来自哪里”并判断结构是否变得更脆弱。</li>
          <li>适用于产品结构、渠道结构、客群结构等多分类时间序列场景。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="stacked-area-many-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">只看总量不看结构迁移</h3>
            <p className="text-sm text-red-700">
              总量上升不代表质量改善，若高波动资产占比同步上行，实际风险可能在累积。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">堆叠顺序缺乏业务语义</h3>
            <p className="text-sm text-red-700">
              随意排序会增加解读成本，建议按“低风险/规模大 → 高风险/规模小”排序。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="stacked-area-many-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">零售贷款结构变化与增长驱动诊断</h3>
          <p className="text-base text-slate-600">
            对应节点 ID：root/q-2num/q-2num-notordered/q-notordered-many/chart-stacked-area-many（leaf id=chart-stacked-area-many）
          </p>
          <p>
            在净息差承压环境下，银行常通过零售扩张提升收益。堆叠面积图能显示不同产品对总量的贡献变化，
            用于识别增长是否由更高波动、更高资本占用的资产驱动。
          </p>
        </div>

        <ChartWrapper title="数据堆叠面积图：零售贷款产品结构与总量趋势（亿元）">
          <StackedAreaManyScenarioG2 />
        </ChartWrapper>

        <p className="text-sm text-slate-500">
          说明：本场景直接使用 report 提供的季度结构数据（虚构演示数据），未做额外样本扩展。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>按揭规模缓慢下降，而消费分期、信用卡透支、普惠小微持续上升，结构正向高波动资产迁移。</li>
          <li>总量从 9,250 亿元增至 10,200 亿元，但增长并非均匀分布，新增主要来自风险弹性更高的产品。</li>
          <li>可将“结构上升最快产品”纳入迁徙率与损失率阈值监控，形成投放与定价联动机制。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
