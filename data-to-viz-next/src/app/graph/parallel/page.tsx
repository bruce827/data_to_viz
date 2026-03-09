'use client';

import React from 'react';
import Image from 'next/image';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { ParallelIcon } from '@/components/viz/icons';
import { ParallelRiskScenarioG2 } from '@/components/viz/charts/ParallelScenarioG2';

export default function ParallelStory() {
  const outlineItems = [
    { id: 'what-is-parallel', label: '什么是平行坐标图' },
    { id: 'when-to-use-parallel', label: '何时使用' },
    { id: 'parallel-common-mistakes', label: '常见误区' },
    { id: 'parallel-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="平行坐标图"
      subtitle="在一张图里同时审查多维指标，适合识别小微客群风险画像中的“红线组合”。"
      icon={ParallelIcon}
      outlineItems={outlineItems}
      decisionTreeTab="cat"
    >
      <StorySection title="什么是平行坐标图？" id="what-is-parallel">
        <p>
          平行坐标图（Parallel Plot）把每个指标映射为一条平行轴，每个对象用一条折线连接各轴取值，
          用于同时观察多维指标的组合特征。相比只看单一评分，它更适合识别“高 PD + 高 LTV + 低 DSCR”这类风险组合。
        </p>
        <p>英文名：Parallel Plot / Parallel Coordinates</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G2）">
        <figure className="rounded-lg border border-slate-200 bg-white p-2">
          <Image
            src="/images/graph/parallel/interactive-example-1.png"
            alt="平行坐标图交互示例"
            width={1732}
            height={1082}
            className="w-full h-auto rounded-md"
          />
        </figure>
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-parallel">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要在同一视图对比多个指标，判断是否出现风险共振。</li>
          <li>需要从客户层识别“红线组合”并触发准入或复核动作。</li>
          <li>需要把客群分层结果（高风险/关注/稳健）与多维指标形态联动展示。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="parallel-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">指标方向未统一</h3>
            <p className="text-sm text-red-700">
              不同指标“高好/低好”方向若混用，容易误判折线形态，应先统一解释口径。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">线条过多但没有分层着色</h3>
            <p className="text-sm text-red-700">
              仅画线不分层会降低可读性，应按风险标签着色并提高重点线可见性。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="parallel-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">小微客群多维风险画像（PD×LGD×LTV×DSCR×RAROC）</h3>
          <p className="text-base text-slate-600">
            对应节点 ID：root/q-2cat/q-2cat-multi/chart-parallel（leaf id=chart-parallel）
          </p>
          <p>
            将小微客户的 PD（违约概率）、LGD（违约损失率）、EAD（风险暴露）、
            LTV（贷款价值比）、DSCR（债务偿付覆盖倍数）、RAROC（风险调整后资本回报率）同屏展示，
            用于识别“高风险组合”并触发准入复核与贷后名单管理。
          </p>
        </div>

        <ChartWrapper title="数据平行坐标图：小微客户多维风险画像">
          <ParallelRiskScenarioG2 />
        </ChartWrapper>

        <p className="text-sm text-slate-500">
          说明：本场景直接使用 `docs/cate-deep-research-report.md` 中 `chart-parallel` 样例数据；
          数据原始为宽表（每客户一行），仅做字段映射到平行坐标轴，未做补数。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>SME012 同时出现高 PD、高 LGD、高 LTV、低 DSCR、低 RAROC，属于典型高风险组合。</li>
          <li>SME001 在 DSCR 与 RAROC 维度明显偏弱，且 LTV 偏高，需重点关注偿付能力风险。</li>
          <li>SME011 在多数轴表现稳健，可作为对照样本用于分层定价与准入校准。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
