'use client';

import React from 'react';
import Image from 'next/image';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { SankeyIcon } from '@/components/viz/icons';
import { SankeyStageMigrationScenarioG2 } from '@/components/viz/charts/SankeyScenarioG2';

export default function SankeyStory() {
  const outlineItems = [
    { id: 'what-is-sankey', label: '什么是桑基图' },
    { id: 'when-to-use-sankey', label: '何时使用' },
    { id: 'sankey-common-mistakes', label: '常见误区' },
    { id: 'sankey-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="桑基图"
      subtitle="用流量宽度展示阶段迁徙规模，适合风险迁徙与处置效率分析。"
      icon={SankeyIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是桑基图？" id="what-is-sankey">
        <p>
          桑基图（Sankey）用于展示“从哪里流向哪里”，流线宽度对应数量大小。
          在风险管理场景里，它特别适合表达阶段迁徙（如 Stage1 到 Stage2）和核销去向，帮助管理层判断风险是改善还是恶化。
        </p>
        <p>英文名：Sankey</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G2）">
        <figure className="rounded-lg border border-slate-200 bg-white p-2">
          <Image
            src="/images/graph/sankey/interactive-example-1.png"
            alt="桑基图交互示例"
            width={1244}
            height={738}
            className="w-full h-auto rounded-md"
          />
        </figure>
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-sankey">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要展示阶段间迁徙规模，而不只是看期末静态余额。</li>
          <li>需要识别“恶化流”和“回迁流”的主通道。</li>
          <li>需要把迁徙分析与拨备、资本预案联动决策。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="sankey-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">只看流量绝对值</h3>
            <p className="text-sm text-red-700">
              绝对值大不一定代表风险更高，必须结合“占来源阶段比例”判断迁徙强度。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">忽略回迁与核销效率</h3>
            <p className="text-sm text-red-700">
              仅关注 Stage1 到 Stage2 会遗漏 Stage2 回迁和 Stage3 核销效率，无法完整评估风险治理效果。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="sankey-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">
            IFRS 9（国际财务报告准则第9号）风险阶段迁徙（Stage1→Stage2→Stage3→核销）
          </h3>
          <p className="text-base text-slate-600">
            对应节点 ID：root/q-2cat-network/chart-sankey-set（leaf id=chart-sankey-set）
          </p>
          <p>
            用桑基图展示 2025Q3 到 2025Q4 的阶段迁徙，跟踪 Stage1（第一阶段）早预警流、
            Stage2（第二阶段）恶化流和 Stage3（第三阶段）核销流，
            支持风险管理、会计计量与资本计划联动决策。
          </p>
        </div>

        <ChartWrapper title="数据桑基图：风险阶段迁徙流向">
          <SankeyStageMigrationScenarioG2 />
        </ChartWrapper>

        <p className="text-sm text-slate-500">
          说明：本场景直接使用 `docs/cate-deep-research-report.md` 中 `chart-sankey-set` 样例数据；
          原始 source-target 边表可直接转换为 sankey links，不需要额外补数。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>Stage1（第一阶段）→Stage2（第二阶段）迁徙占 Stage1 总流出的约 4.93%，是早预警关键通道。</li>
          <li>Stage2（第二阶段）→Stage3（第三阶段）占 Stage2 总流出的约 7.95%，需重点监控恶化斜率。</li>
          <li>Stage3（第三阶段）→WriteOff（核销）占 Stage3 总流出的约 23.01%，反映处置效率与损失确认节奏。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
