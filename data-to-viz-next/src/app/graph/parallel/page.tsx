'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { ParallelIcon } from '@/components/viz/icons';
import { ParallelG2 } from '@/components/viz/charts/ParallelG2';
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
      subtitle="在一张图里同步审查 PD（违约概率）、LGD（违约损失率）、收益、担保与 ESG（环境/社会/治理）的多维一致性。"
      icon={ParallelIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是平行坐标图？" id="what-is-parallel">
        <p>
          平行坐标图（Parallel Coordinates）把每个指标映射为一条平行轴，每个对象用一条折线串联各轴取值，
          用于识别多指标之间的一致性与冲突。
        </p>
        <p>
          相比散点图只能一次观察 2-3 个变量，平行坐标图更适合同时审查风险、收益、缓释与 ESG（环境/社会/治理）等多维约束。
        </p>
        <p>英文名：Parallel Coordinates</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G2）">
        <ParallelG2 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-parallel">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>授信审批或贷后复核需要同时看多个指标，单一评分不足以支撑结论。</li>
          <li>需要识别“高风险低收益”“高风险低ESG”这类多维失配客户。</li>
          <li>需要把“是否追加缓释或调整定价”的判断过程可视化给业务和审计团队。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="parallel-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">各轴不标准化直接比较</h3>
            <p className="text-sm text-red-700">
              指标量纲不同会造成视觉误读，必须先做标准化或分位化，才能比较折线形态。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">线条过多但无分层高亮</h3>
            <p className="text-sm text-red-700">
              不做分组和重点客户高亮会让图面拥挤，应按风险标签分色并突出关键样本。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="parallel-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">
            对公客户风险-收益-缓释-ESG（环境/社会/治理）多维一致性审查
          </h3>
          <p className="text-base text-slate-600">
            对应节点 ID：root/q-sevnum/q-sevnum-notordered/chart-parallel（leaf id=chart-parallel）
          </p>
          <p>
            在授信委员会审议中，把 PD（违约概率）、LGD（违约损失率）、EAD（违约风险暴露）、
            RAROC（风险调整后资本收益）、担保覆盖率和 ESG（环境/社会/治理）同屏审查，
            可快速发现风险收益失配客户并确定“追加缓释、调价或退出”路径。
          </p>
        </div>

        <ChartWrapper title="数据平行坐标图：客户多维风险一致性（标准化压力轴）">
          <ParallelRiskScenarioG2 />
        </ChartWrapper>

        <p className="text-sm text-slate-500">
          说明：本场景直接使用 report 的 6 个客户样本；按 0-1 标准化后将
          RAROC（风险调整后资本收益）、担保覆盖率、ESG（环境/社会/治理）反向为“压力轴”，
          以统一高值=高压力的阅读语义。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>
            P02/P03 在 PD（违约概率）、LGD（违约损失率）、收益不足、担保不足等轴上同时偏高，
            属于风险收益严重失配。
          </li>
          <li>
            P05 虽 PD（违约概率）/LGD（违约损失率）压力高，但担保不足压力较低且收益不足压力不突出，
            表现为“高风险但缓释较强”。
          </li>
          <li>
            P03 同时叠加较高 ESG（环境/社会/治理）转型压力，需在绿色金融框架下提高准入门槛或追加转型约束。
          </li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
