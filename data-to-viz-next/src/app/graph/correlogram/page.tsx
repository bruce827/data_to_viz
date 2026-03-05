'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { RidgelineIcon } from '@/components/viz/icons';
import { RidgelineG2 } from '@/components/viz/charts/RidgelineG2';
import { RidgelineDpdScenarioG2 } from '@/components/viz/charts/RidgelineScenarioG2';

type MonthDpdRow = {
  month: string;
  current: number;
  oneToThirty: number;
  thirtyOneToSixty: number;
  overSixty: number;
};

export default function CorrelogramStory() {
  const monthRows: MonthDpdRow[] = [
    { month: '2025-07', current: 90.2, oneToThirty: 7.1, thirtyOneToSixty: 1.8, overSixty: 0.9 },
    { month: '2025-08', current: 89.1, oneToThirty: 7.9, thirtyOneToSixty: 2.0, overSixty: 1.0 },
    { month: '2025-09', current: 87.8, oneToThirty: 8.7, thirtyOneToSixty: 2.3, overSixty: 1.2 },
    { month: '2025-10', current: 86.9, oneToThirty: 9.2, thirtyOneToSixty: 2.6, overSixty: 1.3 },
    { month: '2025-11', current: 86.0, oneToThirty: 9.8, thirtyOneToSixty: 2.8, overSixty: 1.4 },
    { month: '2025-12', current: 85.4, oneToThirty: 10.1, thirtyOneToSixty: 3.0, overSixty: 1.5 },
  ];

  const outlineItems = [
    { id: 'what-is-ridgeline', label: '什么是山脊图' },
    { id: 'when-to-use-ridgeline', label: '何时使用' },
    { id: 'ridgeline-common-mistakes', label: '常见误区' },
    { id: 'ridgeline-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="山脊图"
      subtitle="按月观察 DPD（逾期天数）分布形态变化，识别“均值未变但尾部变厚”的慢变量风险。"
      icon={RidgelineIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是山脊图？" id="what-is-ridgeline">
        <p>
          山脊图（Ridgeline Plot）把多个时间截面的密度曲线按行叠放，适合观察分布形态随时间如何漂移。
          相比只看均值或中位数，它更容易发现“右尾变厚”“轻逾期堆积”等早期变化。
        </p>
        <p>
          在零售风险监控里，山脊图可以把 DPD（逾期天数）从“单点指标”提升为“分布轨迹”，
          更早暴露组合风险在累积。
        </p>
        <p>英文名：Ridgeline Plot</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G2）">
        <RidgelineG2 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-ridgeline">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要比较多个月份分布形态变化，而不只是比较单月均值。</li>
          <li>需要识别“轻逾期先抬头、再向重逾期滚动”的风险迁移过程。</li>
          <li>需要把分布右移作为 EWS（早期预警系统）触发信号。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="ridgeline-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">把山脊图当绝对人数图</h3>
            <p className="text-sm text-red-700">
              山脊图强调分布形态变化，不直接表达绝对规模；需结合样本量或余额图一起看。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">坐标尺度不一致</h3>
            <p className="text-sm text-red-700">
              不同月份若使用不同 x 轴范围会放大或缩小差异，必须统一 DPD 轴尺度。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="ridgeline-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">零售 DPD 分布按月漂移监控</h3>
          <p className="text-base text-slate-600">
            对应节点 ID：root/q-sevnum/q-sevnum-notordered/chart-correlogram（leaf id=chart-correlogram）
          </p>
          <p>
            report 给的是分档占比（0天、1-30天、31-60天、&gt;60天），无法直接形成连续山脊曲线。
            本场景按分档占比重采样为连续 DPD（逾期天数）样本，再做核密度估计，以还原“按月分布右移”的变化过程。
          </p>
        </div>

        <ChartWrapper title="数据山脊图：DPD（逾期天数）分布右移（2025-07 到 2025-12）">
          <RidgelineDpdScenarioG2 />
        </ChartWrapper>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-800">场景原始数据表（分档占比）</h4>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">月份</th>
                  <th className="px-3 py-2 text-right font-medium">0天</th>
                  <th className="px-3 py-2 text-right font-medium">1-30天</th>
                  <th className="px-3 py-2 text-right font-medium">31-60天</th>
                  <th className="px-3 py-2 text-right font-medium">&gt;60天</th>
                </tr>
              </thead>
              <tbody>
                {monthRows.map((row) => (
                  <tr key={row.month} className="border-t border-slate-100 text-slate-700">
                    <td className="px-3 py-2">{row.month}</td>
                    <td className="px-3 py-2 text-right">{row.current.toFixed(1)}%</td>
                    <td className="px-3 py-2 text-right">{row.oneToThirty.toFixed(1)}%</td>
                    <td className="px-3 py-2 text-right">{row.thirtyOneToSixty.toFixed(1)}%</td>
                    <td className="px-3 py-2 text-right">{row.overSixty.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>0天占比持续下降（90.2% → 85.4%），说明正常客群“底盘”在变薄。</li>
          <li>31-60天与&gt;60天同步上升，表明滚动逾期在向尾部传导。</li>
          <li>可把“1-30天连续两月上行”作为 EWS（早期预警系统）触发条件，提前复核策略和催收资源。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
