'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { StreamIcon } from '@/components/viz/icons';
import { StreamgraphG2 } from '@/components/viz/charts/StreamgraphG2';
import { StreamgraphFundingScenarioG2 } from '@/components/viz/charts/StreamgraphScenarioG2';

export default function StreamgraphStory() {
  const outlineItems = [
    { id: 'what-is-streamgraph', label: '什么是河流图' },
    { id: 'when-to-use-streamgraph', label: '何时使用' },
    { id: 'streamgraph-common-mistakes', label: '常见误区' },
    { id: 'streamgraph-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="河流图"
      subtitle="观察负债端资金来源结构迁移，识别 NIM（净息差）压力与流动性敏感性变化。"
      icon={StreamIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是河流图？" id="what-is-streamgraph">
        <p>
          河流图（Streamgraph）是对称堆叠面积图，强调类别占比随时间的连续迁移。相比普通堆叠面积图，
          河流图更适合表达“结构重心在流动”这一动态过程。
        </p>
        <p>
          当分析重点是资金来源结构变迁速度，而非某一类的绝对值高低时，河流图通常更易读。
        </p>
        <p>英文名：Streamgraph</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G2）">
        <StreamgraphG2 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-streamgraph">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要观察活期、定期、同业、债券等资金来源占比的迁移速度。</li>
          <li>需要解释 NIM（净息差）收窄背后的负债结构因素。</li>
          <li>需要联动监控 LCR（流动性覆盖率）与 NSFR（净稳定资金比例）的边际压力。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="streamgraph-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">把河流图当作绝对规模图</h3>
            <p className="text-sm text-red-700">
              河流图更擅长看结构迁移，不适合直接解读总量变化，需结合总量图或附表。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">只看单期截面，不看迁移方向</h3>
            <p className="text-sm text-red-700">
              单期占比高低信息有限，应重点关注连续季度的流向和斜率变化。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="streamgraph-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">负债端资金来源结构迁移与 NIM 敏感性</h3>
          <p className="text-base text-slate-600">
            对应节点 ID：root/q-sevnum/q-sevnum-ordered/chart-stream（leaf id=chart-stream）
          </p>
          <p>
            在政策利率下行阶段，若低成本活期占比持续下滑、定期与同业占比抬升，银行可能面临
            “资产端让利快于负债端降本”的剪刀差。河流图可用于识别该结构迁移并支持负债定价策略调整。
          </p>
        </div>

        <ChartWrapper title="数据河流图：负债端资金来源结构迁移（占比 %）">
          <StreamgraphFundingScenarioG2 />
        </ChartWrapper>

        <p className="text-sm text-slate-500">
          说明：report 提供的是季度占比锚点；为匹配交互示例的河流形态，本场景在锚点约束下扩展为月度序列，
          用于展示更连续的结构迁移轨迹。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>活期存款占比从 38% 降到 29%，定期存款从 46% 升到 55%，负债成本刚性显著增强。</li>
          <li>同业负债占比由 10% 升至 12%，在存贷款缺口扩大的情况下会抬升流动性敏感度。</li>
          <li>
            若负债端降本传导不畅，NIM（净息差）仍将承压，需通过核心存款经营与
            FTP（内部资金转移定价）机制联动缓释。
          </li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
