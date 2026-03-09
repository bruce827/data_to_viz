'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { CompositeMapIcon } from '@/components/viz/icons';
import { CompositeMapL7 } from '@/components/viz/charts/CompositeMapL7';
import {
  CompositeMapWhitelistScenarioL7,
  compositeFlowScenarioData,
  compositeProjectScenarioData,
} from '@/components/viz/charts/CompositeMapWhitelistScenarioL7';

export default function CompositeMapStory() {
  const outlineItems = [
    { id: 'what-is-composite-map', label: '什么是复合地图' },
    { id: 'when-to-use-composite-map', label: '何时使用' },
    { id: 'composite-map-common-mistakes', label: '常见误区' },
    { id: 'composite-map-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="复合地图"
      subtitle="把点、线、面叠加到同一张地图上，适合表达项目、资金流和状态之间的联动关系。"
      icon={CompositeMapIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是复合地图？" id="what-is-composite-map">
        <p>
          复合地图（Composite Map）不是一种单一图形，而是把点、线、面等多种空间图层叠加在一张地图上。
        </p>
        <p>
          它适合回答“对象在哪里、资金怎么流、状态处于什么阶段”这类需要多层信息同时阅读的问题。
        </p>
        <p>英文名：Composite Map</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV L7）">
        <CompositeMapL7 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-composite-map">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要把项目、路径、区域状态放在同一张图里联读。</li>
          <li>需要同时观察“对象位置 + 流动关系 + 风险状态”。</li>
          <li>需要将监管闭环或业务流程可视化，而不是只看单一地理分布。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="composite-map-common-mistakes">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-red-100 bg-red-50 p-6">
            <h3 className="mb-2 font-bold text-red-800">图层太多但没有主次</h3>
            <p className="text-sm text-red-700">
              复合地图不是把所有东西都堆上去。必须先定义核心问题，再决定点、线、面的职责。
            </p>
          </div>
          <div className="rounded-lg border border-red-100 bg-red-50 p-6">
            <h3 className="mb-2 font-bold text-red-800">颜色和形状语义不统一</h3>
            <p className="text-sm text-red-700">
              如果面和线的颜色各讲各的，用户就会读不懂。复合地图更需要统一视觉映射规则。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="composite-map-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">房地产白名单项目的资金闭环与交付进度联读</h3>
          <p className="text-base text-slate-600">对应节点 ID：root/q-map-point/chart-map-composite（leaf id=chart-map-composite）</p>
          <p>
            以白名单项目为核心对象，把项目区域、监管专户支付流向和项目进度状态叠加在同一张地图上，
            用于识别“支持项目是否真的在按闭环要求推进”。
          </p>
        </div>

        <ChartWrapper title="应用场景图：白名单—资金闭环—交付进度复合地图">
          <CompositeMapWhitelistScenarioL7 />
        </ChartWrapper>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h4 className="mb-3 text-base font-semibold text-slate-900">项目层数据表</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                  <th className="px-3 py-2 text-left font-semibold">项目</th>
                  <th className="px-3 py-2 text-left font-semibold">批次</th>
                  <th className="px-3 py-2 text-right font-semibold">批复额度</th>
                  <th className="px-3 py-2 text-right font-semibold">已提款</th>
                  <th className="px-3 py-2 text-right font-semibold">交付进度</th>
                  <th className="px-3 py-2 text-right font-semibold">风险状态</th>
                </tr>
              </thead>
              <tbody>
                {compositeProjectScenarioData.map((row) => (
                  <tr key={row.project_id} className="border-b border-slate-100 text-slate-700">
                    <td className="px-3 py-2">{row.project_name}</td>
                    <td className="px-3 py-2">{row.whitelist_batch}</td>
                    <td className="px-3 py-2 text-right">{(row.approved_loan_cny / 100000000).toFixed(1)} 亿元</td>
                    <td className="px-3 py-2 text-right">{(row.drawn_loan_cny / 100000000).toFixed(1)} 亿元</td>
                    <td className="px-3 py-2 text-right">{(row.delivery_progress_pct * 100).toFixed(0)}%</td>
                    <td className="px-3 py-2 text-right">{row.risk_flag}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h4 className="mb-3 text-base font-semibold text-slate-900">资金流层数据表</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                  <th className="px-3 py-2 text-left font-semibold">支付ID</th>
                  <th className="px-3 py-2 text-left font-semibold">项目</th>
                  <th className="px-3 py-2 text-left font-semibold">对手方</th>
                  <th className="px-3 py-2 text-right font-semibold">金额</th>
                  <th className="px-3 py-2 text-right font-semibold">风险分</th>
                  <th className="px-3 py-2 text-right font-semibold">状态</th>
                </tr>
              </thead>
              <tbody>
                {compositeFlowScenarioData.map((row) => (
                  <tr key={row.pay_id} className="border-b border-slate-100 text-slate-700">
                    <td className="px-3 py-2">{row.pay_id}</td>
                    <td className="px-3 py-2">{row.project_id}</td>
                    <td className="px-3 py-2">{row.to_counterparty}</td>
                    <td className="px-3 py-2 text-right">{(row.amount_cny / 1000000).toFixed(1)} 百万元</td>
                    <td className="px-3 py-2 text-right">{row.risk_score.toFixed(2)}</td>
                    <td className="px-3 py-2 text-right">{row.risk_flag}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-sm text-slate-500">
          说明：本场景在你刚才确认的补数口径下，
          将 report 的 `1` 个项目点 + `1` 条资金流，扩展为 `3` 个白名单项目 +
          `7` 条资金流，并补齐项目状态层，以满足复合地图的多层对照表达。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>深圳项目“已提款高、进度高、资金流风险低”，当前闭环状态最稳。</li>
          <li>广州项目处于中间带，进度与支付都在推进，但已有关注级流向，需要继续看闭环执行。</li>
          <li>武汉项目进度最低且预警级资金流最多，最值得优先做专项核查与暂停异常拨付。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
