'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { CircularPackingIcon } from '@/components/viz/icons';
import { CircularPackingSetG2 } from '@/components/viz/charts/CircularPackingSetG2';
import { CircularPackingSetScenarioG2 } from '@/components/viz/charts/CircularPackingSetScenarioG2';

const scenarioTableRows = [
  { level: '一级类型', item: '交易监测', alertCount: 72000, share: 0.5625 },
  { level: '一级类型', item: 'KYC（客户身份识别）复核', alertCount: 26000, share: 0.2031 },
  { level: '一级类型', item: '制裁筛查', alertCount: 14000, share: 0.1094 },
  { level: '一级类型', item: '欺诈运营', alertCount: 16000, share: 0.1250 },
  { level: '二级规则', item: '结构化拆分交易', alertCount: 18000, share: 0.1406 },
  { level: '二级规则', item: '现金密集度异常', alertCount: 18000, share: 0.1406 },
  { level: '二级规则', item: '商户风险', alertCount: 15000, share: 0.1172 },
  { level: '二级规则', item: '高风险地区交易', alertCount: 12000, share: 0.0938 },
  { level: '二级规则', item: 'PEP（政治公众人物）复核', alertCount: 10000, share: 0.0781 },
];

export default function CircularPackingStory() {
  const outlineItems = [
    { id: 'what-is-circular-packing', label: '什么是圆形填充图' },
    { id: 'when-to-use-circular-packing', label: '何时使用' },
    { id: 'circular-packing-common-mistakes', label: '常见误区' },
    { id: 'circular-packing-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="圆形填充图（集合语境）"
      subtitle="以嵌套圆面积表达分层集合规模，适合告警池治理与资源排班决策。"
      icon={CircularPackingIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是圆形填充图？" id="what-is-circular-packing">
        <p>
          圆形填充图（Circular Packing）通过嵌套圆展示层级结构，圆面积与数值大小对应。
          在“集合拆分”场景中，它能把总盘、一级类型和细分规则放在同一视图里，便于快速识别主导来源和长尾问题。
        </p>
        <p>英文名：Circular Packing</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G2）">
        <CircularPackingSetG2 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-circular-packing">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要表达“总盘 → 分类 → 子规则”的层级规模结构。</li>
          <li>需要在一屏内识别主导来源与长尾规则。</li>
          <li>需要支持运营排班、规则优化、白名单治理等动作分派。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="circular-packing-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">只看面积不看层级归属</h3>
            <p className="text-sm text-red-700">
              同样大小的圆若归属不同一级类型，治理动作完全不同，必须结合父层级解读。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">把长尾小圆完全忽略</h3>
            <p className="text-sm text-red-700">
              小圆往往是高误伤或高合规敏感规则，应结合 tooltip 与数据表做补充分析。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="circular-packing-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">反洗钱/反欺诈告警结构分解（告警池治理与资源排班）</h3>
          <p className="text-base text-slate-600">
            对应节点 ID：root/q-2cat/q-2cat-set/chart-circular-packing-set（leaf id=chart-circular-packing-set）
          </p>
          <p>
            对 AML（反洗钱）/反欺诈告警按“一级类型 → 细分规则”做层级拆解，
            用于识别告警池主要来源与长尾规则，指导规则阈值优化、白名单策略和审核人力排班。
          </p>
        </div>

        <ChartWrapper title="数据圆形填充图：AML/反欺诈告警池结构">
          <CircularPackingSetScenarioG2 />
        </ChartWrapper>

        <p className="text-sm text-slate-500">
          说明：本场景使用 `docs/cate-deep-research-report.md` 中 `chart-circular-packing-set` 样例数据；
          原始 `id-parent-alert_count` 结构可直接转层级树用于 pack 渲染，不需要额外补数。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>交易监测告警占总盘 56.25%，是规则治理与排班优化的主战场。</li>
          <li>KYC 复核占 20.31%，需重点关注证件过期、PEP 复核等流程效率。</li>
          <li>结构化拆分交易与现金密集度异常并列高位（各 14.06%），可优先评估阈值与误伤率。</li>
        </ul>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h4 className="text-base font-semibold text-slate-900 mb-3">场景数据摘要表（单位：条，as_of=2025-12-31）</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                  <th className="px-3 py-2 text-left font-semibold">层级</th>
                  <th className="px-3 py-2 text-left font-semibold">类别/规则</th>
                  <th className="px-3 py-2 text-right font-semibold">告警量</th>
                  <th className="px-3 py-2 text-right font-semibold">占总盘比例</th>
                </tr>
              </thead>
              <tbody>
                {scenarioTableRows.map((row) => (
                  <tr key={`${row.level}-${row.item}`} className="border-b border-slate-100 text-slate-700">
                    <td className="px-3 py-2">{row.level}</td>
                    <td className="px-3 py-2">{row.item}</td>
                    <td className="px-3 py-2 text-right">{row.alertCount.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right">{(row.share * 100).toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </StorySection>
    </StoryLayout>
  );
}
