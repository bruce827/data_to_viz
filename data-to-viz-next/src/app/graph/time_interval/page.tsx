'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { AreaIcon } from '@/components/viz/icons';
import { TimeDurationIntervalG2 } from '@/components/viz/charts/TimeDurationIntervalG2';
import {
  TimeDurationIntervalScenarioG2,
  timeDurationIntervalScenarioData,
} from '@/components/viz/charts/TimeDurationIntervalScenarioG2';

export default function TimeDurationIntervalStory() {
  const outlineItems = [
    { id: 'what-is-time-interval', label: '什么是状态区间图' },
    { id: 'when-to-use-time-interval', label: '何时使用' },
    { id: 'time-interval-common-mistakes', label: '常见误区' },
    { id: 'time-interval-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="状态区间图"
      subtitle="用时间区间展示系统或业务状态如何切换，适合把一次事件从预警到恢复讲清楚。"
      icon={AreaIcon}
      outlineItems={outlineItems}
      decisionTreeTab="time"
    >
      <StorySection title="什么是状态区间图？" id="what-is-time-interval">
        <p>
          状态区间图（State Interval Chart）把同一对象在不同时间段所处的状态画在一条时间轴上，
          重点不是某个瞬时值，而是状态何时切换、持续多久、是否影响到关键链路。
        </p>
        <p>
          当管理问题是“哪一段时间出了问题、影响持续了多久、有没有及时恢复”时，
          状态区间图比普通折线图更直接。
        </p>
        <p>英文名：State Interval Chart</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G2）">
        <TimeDurationIntervalG2 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-time-interval">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要复盘一个监控窗口内多条关键链路的状态切换。</li>
          <li>需要比较不同系统的降级、人工接管和恢复时长。</li>
          <li>需要把“告警 → 处置 → 恢复”讲成一条可复核的时间故事。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="time-interval-common-mistakes">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-red-100 bg-red-50 p-6">
            <h3 className="mb-2 font-bold text-red-800">只标状态，不标持续时长</h3>
            <p className="text-sm text-red-700">
              同样是“降级”，持续 5 分钟和持续 40 分钟的管理意义完全不同，必须保留时间长度。
            </p>
          </div>
          <div className="rounded-lg border border-red-100 bg-red-50 p-6">
            <h3 className="mb-2 font-bold text-red-800">只看技术状态，不看业务动作</h3>
            <p className="text-sm text-red-700">
              如果没有“谁接手、做了什么、影响什么业务”，图只能停留在日志层，无法形成值班复盘。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="time-interval-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">发薪高峰支付链路状态切换复盘</h3>
          <p className="text-base text-slate-600">
            对应节点 ID：root/q-time-event-duration/chart-time-duration-interval（leaf id=chart-time-duration-interval）
          </p>
          <p>
            在发薪日上午窗口，风险、支付、清算和通知四条链路并不是简单地“好/坏”二元状态，
            而是会经历预警、降级、人工接管和恢复。状态区间图可以把这次事件演变和处置动作完整串起来。
          </p>
        </div>

        <ChartWrapper title="应用场景图：发薪窗口关键链路状态区间">
          <TimeDurationIntervalScenarioG2 />
        </ChartWrapper>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h4 className="mb-3 text-base font-semibold text-slate-900">场景数据表</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                  <th className="px-3 py-2 text-left font-semibold">系统</th>
                  <th className="px-3 py-2 text-left font-semibold">状态</th>
                  <th className="px-3 py-2 text-left font-semibold">开始</th>
                  <th className="px-3 py-2 text-left font-semibold">结束</th>
                  <th className="px-3 py-2 text-left font-semibold">责任团队</th>
                  <th className="px-3 py-2 text-left font-semibold">业务影响</th>
                  <th className="px-3 py-2 text-left font-semibold">处置动作</th>
                </tr>
              </thead>
              <tbody>
                {timeDurationIntervalScenarioData.map((row) => (
                  <tr
                    key={`${row.system}-${row.startMinute}-${row.state}`}
                    className="border-b border-slate-100 text-slate-700"
                  >
                    <td className="px-3 py-2">{row.system}</td>
                    <td className="px-3 py-2">{row.state}</td>
                    <td className="px-3 py-2">{row.startLabel}</td>
                    <td className="px-3 py-2">{row.endLabel}</td>
                    <td className="px-3 py-2">{row.owner}</td>
                    <td className="px-3 py-2">{row.impact}</td>
                    <td className="px-3 py-2">{row.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-sm text-slate-500">
          说明：本页为时间序列树的独立 story，使用监控复盘口径构造示例数据，重点表达“状态切换、持续时长、处置动作”
          三个要素；本次未改动时间序列决策树本身。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>最早出现异常的是支付路由服务，随后核心清算进入人工接管，说明问题已经从单点波动扩散到主链路。</li>
          <li>短信通知并未直接故障，而是先进入预警，说明它是“业务影响滞后暴露”的链路，适合作为补充告警指标。</li>
          <li>风控引擎采取的是阈值收紧而非停机，这类“业务策略调整”也应该作为一种状态被记录进时间故事。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
