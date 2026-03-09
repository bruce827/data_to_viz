'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { NetworkIcon } from '@/components/viz/icons';
import { NetworkG6 } from '@/components/viz/charts/NetworkG6';
import { NetworkGuaranteeScenarioG6 } from '@/components/viz/charts/NetworkScenarioG6';

export default function NetworkStory() {
  const outlineItems = [
    { id: 'what-is-network', label: '什么是关系图' },
    { id: 'when-to-use-network', label: '何时使用' },
    { id: 'network-common-mistakes', label: '常见误区' },
    { id: 'network-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="关系图"
      subtitle="用节点与边展示担保、互保与确权链路，适合识别集团级风险传染路径。"
      icon={NetworkIcon}
      outlineItems={outlineItems}
      decisionTreeTab="cat"
    >
      <StorySection title="什么是关系图？" id="what-is-network">
        <p>
          关系图（Network）以节点表示实体、以连边表示实体间关系（如担保、互保、确权）。
          它适合发现关键节点、桥接节点和潜在传染链路，是集团授信穿透分析的核心图形之一。
        </p>
        <p>英文名：Network Graph</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G6）">
        <NetworkG6 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-network">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要穿透集团内多主体担保关系，识别风险传染路径。</li>
          <li>需要定位关键节点（高敞口/高连接度）并做贷后预警。</li>
          <li>需要在项目支持与集团风险约束之间做联动决策。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="network-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">只看单条边，不看链路累积</h3>
            <p className="text-sm text-red-700">
              单条担保金额不大也可能位于关键桥接位置。应沿路径累加潜在传染敞口评估风险。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">只看项目，不看集团层级</h3>
            <p className="text-sm text-red-700">
              项目融资合规不等于集团整体稳健。若集团母公司与高风险子公司互保交织，仍可能触发集中暴露。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="network-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">
            集团互保链与房地产项目风险穿透（关联交易与担保传染）
          </h3>
          <p className="text-base text-slate-600">
            对应节点 ID：root/q-2cat-network/chart-network-set（leaf id=chart-network-set）
          </p>
          <p>
            用关系图展示集团 A 内部担保链、互保链与外部核心对手方确权关系。
            节点大小映射 EAD（违约风险暴露额），边宽映射担保金额，节点颜色映射内部评级风险分层，
            支持贷前授信、贷中监测与贷后预警联动。
          </p>
        </div>

        <ChartWrapper title="数据关系图：集团互保与担保传染链路">
          <NetworkGuaranteeScenarioG6 />
        </ChartWrapper>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200 text-slate-700">
                <th className="px-4 py-3 text-left font-semibold">来源节点</th>
                <th className="px-4 py-3 text-left font-semibold">目标节点</th>
                <th className="px-4 py-3 text-left font-semibold">关系类型</th>
                <th className="px-4 py-3 text-right font-semibold">担保金额（亿元）</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              <tr className="border-b border-slate-100">
                <td className="px-4 py-3">集团A母公司</td>
                <td className="px-4 py-3">A地产</td>
                <td className="px-4 py-3">担保</td>
                <td className="px-4 py-3 text-right">60</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="px-4 py-3">集团A母公司</td>
                <td className="px-4 py-3">A建筑</td>
                <td className="px-4 py-3">担保</td>
                <td className="px-4 py-3 text-right">45</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="px-4 py-3">A建筑</td>
                <td className="px-4 py-3">A地产</td>
                <td className="px-4 py-3">互保</td>
                <td className="px-4 py-3 text-right">25</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="px-4 py-3">A物业</td>
                <td className="px-4 py-3">A地产</td>
                <td className="px-4 py-3">保证金质押担保</td>
                <td className="px-4 py-3 text-right">8</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="px-4 py-3">A物流</td>
                <td className="px-4 py-3">A建筑</td>
                <td className="px-4 py-3">互保</td>
                <td className="px-4 py-3 text-right">12</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="px-4 py-3">A融资租赁</td>
                <td className="px-4 py-3">A物流</td>
                <td className="px-4 py-3">回购/差额补足</td>
                <td className="px-4 py-3 text-right">20</td>
              </tr>
              <tr>
                <td className="px-4 py-3">核心央国企客户</td>
                <td className="px-4 py-3">A建筑</td>
                <td className="px-4 py-3">应收账款确权</td>
                <td className="px-4 py-3 text-right">30</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm text-slate-500">
          说明：本场景使用 `docs/cate-deep-research-report.md` 中 `chart-network-set` 的 nodes/edges 样例数据，
          无需额外补数。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>集团A母公司对地产与建筑的直接担保合计 105 亿元，是核心传导起点。</li>
          <li>A地产接收来自母公司、A建筑、A物业的多源支持，入边金额合计 93 亿元，关联依赖度高。</li>
          <li>核心央国企客户到 A建筑的 30 亿元确权链路，提示外部交易链条与集团内部风险存在耦合。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
