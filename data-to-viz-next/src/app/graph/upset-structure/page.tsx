'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { UpsetIcon } from '@/components/viz/icons';
import { UpsetSetRelationG2 } from '@/components/viz/charts/UpsetSetRelationG2';
import { UpsetStructureCreditRiskScenarioG2 } from '@/components/viz/charts/UpsetStructureScenarioG2';

const scenarioTableRows = [
  { acct: 'CC001', device: true, geo: true, mcc: false, income: true, minpay: true, dpd7: true, loss: 3200 },
  { acct: 'CC002', device: false, geo: true, mcc: true, income: false, minpay: true, dpd7: false, loss: 0 },
  { acct: 'CC003', device: true, geo: false, mcc: true, income: true, minpay: false, dpd7: true, loss: 1800 },
  { acct: 'CC004', device: false, geo: false, mcc: true, income: false, minpay: false, dpd7: true, loss: 600 },
  { acct: 'CC005', device: true, geo: true, mcc: true, income: true, minpay: true, dpd7: false, loss: 0 },
  { acct: 'CC006', device: false, geo: true, mcc: false, income: true, minpay: false, dpd7: true, loss: 900 },
];

export default function UpsetStructureStory() {
  const outlineItems = [
    { id: 'what-is-upset-structure', label: '什么是 UpSet 图' },
    { id: 'when-to-use-upset-structure', label: '何时使用' },
    { id: 'upset-structure-common-mistakes', label: '常见误区' },
    { id: 'upset-structure-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="UpSet 图"
      subtitle="用于展示多集合交集关系，适合识别“多标签叠加”的高危组合。"
      icon={UpsetIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是 UpSet 图？" id="what-is-upset-structure">
        <p>
          UpSet 图用于分析 3 个以上集合的交集关系。相比韦恩图，它在集合数量较多时可读性更好，
          能直接比较不同标签组合的规模大小。
        </p>
        <p>英文名：UpSet Plot</p>
      </StorySection>

      <ChartWrapper title="交互示例（UpSetJS）">
        <UpsetSetRelationG2 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-upset-structure">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要分析 4 个及以上风险标签交集时。</li>
          <li>需要识别“最危险标签组合”并做优先处置。</li>
          <li>需要在标签数量持续扩展时保持图表可读性。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="upset-structure-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">只看单标签命中率</h3>
            <p className="text-sm text-red-700">
              单标签命中高不等于风险最高，应重点观察多标签叠加组合。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">忽略误杀与损失平衡</h3>
            <p className="text-sm text-red-700">
              组合拦截策略需要结合损失与误杀成本，不能只追求命中数量。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="upset-structure-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">
            信用卡多风险标签交集（反欺诈 × 合规 × 信用）
          </h3>
          <p className="text-base text-slate-600">
            对应节点 ID：root/q-structure/q-structure-set/chart-structure-set-upset（leaf id=chart-structure-set-upset）
          </p>
          <p>
            以 2025-12-15（2025年12月15日）样本为窗口，分析“设备异常、异地交易、MCC 异常、收入未核验、连续最低还款、
            DPD7+”六类标签的交集组合，识别最危险组合并触发差异化处置。
          </p>
        </div>

        <ChartWrapper title="数据 UpSet 图：信用卡多标签交集结构">
          <UpsetStructureCreditRiskScenarioG2 />
        </ChartWrapper>

        <p className="text-sm text-slate-500">
          说明：本场景直接使用 `docs/catenum-deep-research-report.md` 中 `UPST` 样例明细数据，
          无额外补数；仅将每个账户的布尔标签转换为集合成员用于 UpSet 渲染。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>6 户样本中有 4 户命中 DPD7+，说明信用恶化标签覆盖面较高。</li>
          <li>“设备异常 + 异地交易 + 收入未核验 + 连续最低还款”组合在样本中出现，且存在损失账户。</li>
          <li>多标签叠加账户（标签数 ≥4）应进入优先人工复核池，并联动额度与交易策略。</li>
        </ul>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h4 className="text-base font-semibold text-slate-900 mb-3">样本明细表（单位：元，date=2025-12-15）</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                  <th className="px-3 py-2 text-left font-semibold">账户</th>
                  <th className="px-3 py-2 text-center font-semibold">设备异常</th>
                  <th className="px-3 py-2 text-center font-semibold">异地交易</th>
                  <th className="px-3 py-2 text-center font-semibold">MCC异常</th>
                  <th className="px-3 py-2 text-center font-semibold">收入未核验</th>
                  <th className="px-3 py-2 text-center font-semibold">连续最低还款</th>
                  <th className="px-3 py-2 text-center font-semibold">DPD7+</th>
                  <th className="px-3 py-2 text-right font-semibold">损失金额</th>
                </tr>
              </thead>
              <tbody>
                {scenarioTableRows.map((row) => (
                  <tr key={row.acct} className="border-b border-slate-100 text-slate-700">
                    <td className="px-3 py-2">{row.acct}</td>
                    <td className="px-3 py-2 text-center">{row.device ? '是' : '否'}</td>
                    <td className="px-3 py-2 text-center">{row.geo ? '是' : '否'}</td>
                    <td className="px-3 py-2 text-center">{row.mcc ? '是' : '否'}</td>
                    <td className="px-3 py-2 text-center">{row.income ? '是' : '否'}</td>
                    <td className="px-3 py-2 text-center">{row.minpay ? '是' : '否'}</td>
                    <td className="px-3 py-2 text-center">{row.dpd7 ? '是' : '否'}</td>
                    <td className="px-3 py-2 text-right">{row.loss.toLocaleString()}</td>
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
