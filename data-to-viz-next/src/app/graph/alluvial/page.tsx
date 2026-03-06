'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { SankeyIcon } from '@/components/viz/icons';
import { AlluvialG2 } from '@/components/viz/charts/AlluvialG2';
import { AlluvialLifecycleScenarioG2 } from '@/components/viz/charts/AlluvialScenarioG2';

export default function AlluvialStory() {
  const outlineItems = [
    { id: 'what-is-alluvial', label: '什么是河流图' },
    { id: 'when-to-use-alluvial', label: '何时使用' },
    { id: 'alluvial-common-mistakes', label: '常见误区' },
    { id: 'alluvial-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="河流图"
      subtitle="展示多阶段结构流向变化，适合识别渠道到产品再到风险状态的传导路径。"
      icon={SankeyIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是河流图？" id="what-is-alluvial">
        <p>
          河流图（Alluvial）用于展示多阶段类别之间的结构流向与规模变化，常用于看“来源-中间过程-结果”的路径迁移。
          在业务语义上，它与桑基图接近，但更强调阶段性结构变化与组成演进。
        </p>
        <p>英文名：Alluvial</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G2）">
        <AlluvialG2 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-alluvial">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要呈现三段及以上流程中的结构变化。</li>
          <li>需要定位“高风险来源渠道”与“高风险结果状态”的连接通道。</li>
          <li>需要比较不同阶段的流量比例，而不是单点快照。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="alluvial-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">只看宽度，不看分母口径</h3>
            <p className="text-sm text-red-700">
              某条流宽并不代表风险最重，需结合来源总量占比判断结构偏差。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">阶段定义不稳定</h3>
            <p className="text-sm text-red-700">
              若阶段口径经常变化，跨期比较会失真。需先固定渠道、产品、风险状态的口径。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="alluvial-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">
            客户生命周期“获客渠道→产品→风险状态”河流图
          </h3>
          <p className="text-base text-slate-600">
            对应节点 ID：root/q-structure/q-structure-flow/chart-structure-flow-alluvial（leaf id=chart-structure-flow-alluvial）
          </p>
          <p>
            以 2025-10（2025年10月）为窗口，展示客户从获客渠道（线上广告/线下网点/合作平台）到产品
            （消费贷/信用卡/按揭）再到风险状态（正常/逾期30+）的流向结构，
            识别渠道带来的风险选择偏差。
          </p>
        </div>

        <ChartWrapper title="数据河流图：渠道-产品-风险状态流向">
          <AlluvialLifecycleScenarioG2 />
        </ChartWrapper>

        <p className="text-sm text-slate-500">
          说明：本场景直接使用 `docs/catenum-deep-research-report.md` 中 `ALLU` 样例数据，
          并按相同口径聚合为“渠道到产品、产品到风险状态”两段 links 以满足 alluvial 渲染结构。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>合作平台→信用卡路径规模较大，且通向“逾期30+”的分支（3,200 户）需要重点监测。</li>
          <li>线上广告→消费贷路径中逾期30+占比为 4.76%，高于线下网点→消费贷的 0%。</li>
          <li>按揭路径当前全部流向“正常”状态，可作为低风险对照通道。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
