'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { DendrogramIcon } from '@/components/viz/icons';
import { DendrogramG2 } from '@/components/viz/charts/DendrogramG2';
import { DendrogramGuaranteeScenarioG2 } from '@/components/viz/charts/DendrogramScenarioG2';

type GuaranteeRelationRow = {
  pair: string;
  guarantorCount: number;
  flowSimilarity: number;
  association: number;
  distance: number;
};

export default function DendrogramStory() {
  const relationRows: GuaranteeRelationRow[] = [
    { pair: 'A-B', guarantorCount: 2, flowSimilarity: 0.78, association: 0.82, distance: 0.18 },
    { pair: 'A-C', guarantorCount: 1, flowSimilarity: 0.55, association: 0.60, distance: 0.40 },
    { pair: 'B-C', guarantorCount: 2, flowSimilarity: 0.70, association: 0.79, distance: 0.21 },
    { pair: 'D-E', guarantorCount: 1, flowSimilarity: 0.62, association: 0.65, distance: 0.35 },
    { pair: 'E-F', guarantorCount: 2, flowSimilarity: 0.74, association: 0.80, distance: 0.20 },
    { pair: 'C-D', guarantorCount: 0, flowSimilarity: 0.12, association: 0.10, distance: 0.90 },
  ];

  const outlineItems = [
    { id: 'what-is-dendrogram', label: '什么是树状图' },
    { id: 'when-to-use-dendrogram', label: '何时使用' },
    { id: 'dendrogram-common-mistakes', label: '常见误区' },
    { id: 'dendrogram-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="树状图（Dendrogram）"
      subtitle="通过层次聚类识别互保圈结构，定位关联传染与集中度隐患。"
      icon={DendrogramIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是树状图？" id="what-is-dendrogram">
        <p>
          树状图（Dendrogram）是层次聚类结果的可视化表达。它通过“从叶子到根”的合并过程，
          展示样本之间由近到远的关系结构。
        </p>
        <p>
          在金融风控场景中，树状图可把“共同担保人、资金往来相似度、股权关联”等多种关系压缩为
          一棵可解释的层次树，辅助识别互保圈与潜在传染路径。
        </p>
        <p>英文名：Dendrogram</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G2）">
        <DendrogramG2 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-dendrogram">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要识别批量客户中隐性的圈层关系，而不是只看单户风险。</li>
          <li>需要在一个图中同时看到“高关联对”与“圈层边界”的形成过程。</li>
          <li>需要给授信限额、担保替换、风险隔离提供簇级别依据。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="dendrogram-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">把树状图当作组织架构图</h3>
            <p className="text-sm text-red-700">
              树状图表达的是“相似度/距离”合并过程，不是管理层级。解读时要关注切割线和合并高度。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">只看单条强关系，忽略簇级暴露</h3>
            <p className="text-sm text-red-700">
              A-B 很强不代表风险仅在二者之间，需结合整簇总 EAD 和最弱环节点做整体判断。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="dendrogram-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">中小企业互保圈层次聚类与风险隔离</h3>
          <p className="text-base text-slate-600">
            对应节点 ID：root/q-sevnum/q-sevnum-notordered/chart-dendrogram（leaf id=chart-dendrogram）
          </p>
          <p>
            将企业对的综合关联度映射为层次距离（distance = 1 - 关联度），可在一张树状图中识别
            A/B/C 与 D/E/F 两个互保圈，并区分圈内高关联和跨圈弱关联，支持簇级授信与隔离策略。
          </p>
        </div>

        <ChartWrapper title="数据树状图：互保网络层次聚类（含切割线）">
          <DendrogramGuaranteeScenarioG2 />
        </ChartWrapper>

        <p className="text-sm text-slate-500">
          说明：report 提供的是企业对关联度，本场景按“关联度→层次距离（1-关联度）”重构为聚类树，
          用于匹配树状图的交互语义。
        </p>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-800">场景原始数据表（树图重构依据）</h4>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">企业对</th>
                  <th className="px-3 py-2 text-right font-medium">共同担保人</th>
                  <th className="px-3 py-2 text-right font-medium">资金往来相似度</th>
                  <th className="px-3 py-2 text-right font-medium">综合关联度</th>
                  <th className="px-3 py-2 text-right font-medium">层次距离 (1-关联度)</th>
                </tr>
              </thead>
              <tbody>
                {relationRows.map((row) => (
                  <tr key={row.pair} className="border-t border-slate-100 text-slate-700">
                    <td className="px-3 py-2">{row.pair}</td>
                    <td className="px-3 py-2 text-right">{row.guarantorCount}</td>
                    <td className="px-3 py-2 text-right">{row.flowSimilarity.toFixed(2)}</td>
                    <td className="px-3 py-2 text-right">{row.association.toFixed(2)}</td>
                    <td className="px-3 py-2 text-right">{row.distance.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>A/B/C 在关联度 0.60 及以上形成同一互保圈，E/F 先合并后与 D 形成第二圈层。</li>
          <li>切割线（关联度 0.60）下可得到两个主要互保簇，适合分别设置簇级限额与穿透监控。</li>
          <li>跨圈关系 C-D 仅 0.10，说明两簇之间当前以弱连接为主，可优先做分层隔离管理。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
