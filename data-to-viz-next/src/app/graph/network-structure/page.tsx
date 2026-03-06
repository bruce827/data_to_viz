'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { NetworkIcon } from '@/components/viz/icons';
import { NetworkG6 } from '@/components/viz/charts/NetworkG6';
import { NetworkStructureGuaranteeScenarioG6 } from '@/components/viz/charts/NetworkStructureScenarioG6';

const scenarioTableRows = [
  { asOf: '2025-12-31', source: '集团A', target: '子公司A1', relation: '股权控制', exposure: 0.0 },
  { asOf: '2025-12-31', source: '集团A', target: '子公司A2', relation: '股权控制', exposure: 0.0 },
  { asOf: '2025-12-31', source: '子公司A1', target: '供应商S1', relation: '担保', exposure: 8.5 },
  { asOf: '2025-12-31', source: '子公司A2', target: '供应商S1', relation: '担保', exposure: 6.0 },
  { asOf: '2025-12-31', source: '供应商S1', target: '供应商S2', relation: '互保', exposure: 3.2 },
  { asOf: '2025-12-31', source: '供应商S2', target: '项目公司P1', relation: '担保', exposure: 4.1 },
];

export default function NetworkStructureStory() {
  const outlineItems = [
    { id: 'what-is-network-structure', label: '什么是关系网络图' },
    { id: 'when-to-use-network-structure', label: '何时使用' },
    { id: 'network-structure-common-mistakes', label: '常见误区' },
    { id: 'network-structure-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="关系网络图"
      subtitle="通过节点与连接边展示担保、互保与控制关系，识别传染与集中度风险。"
      icon={NetworkIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是关系网络图？" id="what-is-network-structure">
        <p>
          关系网络图（Network Graph）用节点表示实体、用边表示实体之间的关系（如股权控制、担保、互保）。
          它适合发现关键枢纽节点与潜在传染链路，是集团授信穿透分析的重要图形。
        </p>
        <p>英文名：Network Graph</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G6）">
        <NetworkG6 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-network-structure">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要识别担保链和互保链中的关键节点与薄弱环节。</li>
          <li>需要评估“单点风险”是否会沿集团链条向外传导。</li>
          <li>需要把关系结构分析与授信上限、贷后监控策略联动。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="network-structure-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">只看节点多少，不看连边强度</h3>
            <p className="text-sm text-red-700">
              节点多不代表风险高，真正关键是高敞口连边是否集中在少数链路上。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">只看担保关系，忽略股权控制</h3>
            <p className="text-sm text-red-700">
              股权控制链会影响风险归属和治理责任，必须与担保链同时分析。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="network-structure-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">
            担保链与关联企业网络（传染与集中度识别）
          </h3>
          <p className="text-base text-slate-600">
            对应节点 ID：root/q-structure/q-structure-network/chart-structure-network-network（leaf id=chart-structure-network-network）
          </p>
          <p>
            以 2025-12-31（2025年12月31日）月度快照为窗口，展示集团A到子公司、供应商、项目公司的关系链路。
            边宽映射风险敞口（亿元），用于识别“关键节点倒下导致连锁违约”的传导路径。
          </p>
        </div>

        <ChartWrapper title="数据关系网络图：集团A担保链与互保链">
          <NetworkStructureGuaranteeScenarioG6 />
        </ChartWrapper>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200 text-slate-700">
                <th className="px-4 py-3 text-left font-semibold">日期</th>
                <th className="px-4 py-3 text-left font-semibold">来源节点</th>
                <th className="px-4 py-3 text-left font-semibold">目标节点</th>
                <th className="px-4 py-3 text-left font-semibold">关系类型</th>
                <th className="px-4 py-3 text-right font-semibold">敞口（亿元）</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {scenarioTableRows.map((row) => (
                <tr
                  key={`${row.source}-${row.target}-${row.relation}`}
                  className="border-b border-slate-100 last:border-b-0"
                >
                  <td className="px-4 py-3">{row.asOf}</td>
                  <td className="px-4 py-3">{row.source}</td>
                  <td className="px-4 py-3">{row.target}</td>
                  <td className="px-4 py-3">{row.relation}</td>
                  <td className="px-4 py-3 text-right">{row.exposure.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-sm text-slate-500">
          说明：本场景直接使用 `docs/catenum-deep-research-report.md` 中 `NETW` 样例边表数据，
          无额外补数；节点大小按连接边的敞口汇总自动计算，仅用于可视化表达强弱关系。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>供应商S1 同时承接子公司A1（8.5亿元）与子公司A2（6.0亿元）担保，处于网络关键汇聚点。</li>
          <li>供应商S2 与供应商S1 的互保（3.2亿元）叠加对项目公司P1 的担保（4.1亿元），存在链式传导路径。</li>
          <li>集团A 到两家子公司的股权控制链虽无直接敞口金额，但决定了风险穿透分析的治理主线。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
