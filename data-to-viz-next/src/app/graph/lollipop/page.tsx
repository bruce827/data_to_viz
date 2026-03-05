'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { LollipopIcon } from '@/components/viz/icons';
import { LollipopG2 } from '@/components/viz/charts/LollipopG2';
import { LollipopRarocScenarioG2 } from '@/components/viz/charts/LollipopScenarioG2';

export default function LollipopStory() {
  const outlineItems = [
    { id: 'what-is-lollipop', label: '什么是棒棒糖图' },
    { id: 'when-to-use-lollipop', label: '何时使用' },
    { id: 'lollipop-common-mistakes', label: '常见误区' },
    { id: 'lollipop-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="棒棒糖图"
      subtitle="在保持分类比较能力的同时降低视觉负担，适合做产品排名与差距审视。"
      icon={LollipopIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是棒棒糖图？" id="what-is-lollipop">
        <p>
          棒棒糖图（Lollipop Chart）由细线和端点组成，表达方式与条形图类似，但视觉更轻。
          它保留“分类比较”的核心能力，同时减少大面积色块造成的压迫感。
        </p>
        <p>
          在银行管理看板中，当你要展示产品排名但又希望突出终点值（如 RAROC），棒棒糖图通常比条形图更易读。
        </p>
        <p>英文名：Lollipop Chart</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G2）">
        <LollipopG2 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-lollipop">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要展示分类排名并同时突出每个分类的精确终点值。</li>
          <li>分类数量中等、标签较长，希望减轻图面拥挤感。</li>
          <li>需要把业务分层（零售/对公/普惠）与指标高低同时表达。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="lollipop-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">只看排名不看资本占用</h3>
            <p className="text-sm text-red-700">
              RAROC（风险调整后资本回报率）高不代表绝对贡献高，需同时看经济资本占用与风险成本。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">端点标签过密不可读</h3>
            <p className="text-sm text-red-700">
              产品过多且不排序会造成标签重叠，应先按指标排序并控制显示数量。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="lollipop-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">产品线 RAROC 排名与资本占用审视</h3>
          <p className="text-base text-slate-600">
            对应节点 ID：root/q-1cat/chart-lollipop（leaf id=chart-lollipop）
          </p>
          <p>
            在净息差承压背景下，按产品对比 RAROC（风险调整后资本回报率），并联动
            NIM（净息差）贡献、手续费贡献、风险成本与经济资本占用，可快速识别
            “高回报可扩张”和“低回报高占用需调整”的资产配置方向。
          </p>
        </div>

        <ChartWrapper title="数据棒棒糖图：产品线 RAROC（风险调整后资本回报率）排名">
          <LollipopRarocScenarioG2 />
        </ChartWrapper>

        <p className="text-sm text-slate-500">
          说明：本场景使用 `docs/cate-deep-research-report.md` 中 `chart-lollipop` 样例数据；
          字段可直接映射为棒棒糖图，不需要额外补数。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>基金/理财代销（17.3%）与工资代发+结算（16.1%）处于高 RAROC 区间，可作为增配方向。</li>
          <li>按揭贷款（二套 7.1%、首套 8.2%）与票据贴现（5.8%）回报偏低，需联动定价与资本效率复核。</li>
          <li>普惠小微经营贷 RAROC 为 9.4%，同时资本占用高，宜做分层定价与风险缓释优化。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
