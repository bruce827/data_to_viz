'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { ConnectedScatterIcon } from '@/components/viz/icons';
import { ConnectedScatterG2 } from '@/components/viz/charts/ConnectedScatterG2';
import { ConnectedScatterNplLcrScenarioG2 } from '@/components/viz/charts/ConnectedScatterScenarioG2';

export default function ConnectedScatterStory() {
  const outlineItems = [
    { id: 'what-is-connected-scatter', label: '什么是散点折线图' },
    { id: 'when-to-use-connected-scatter', label: '何时使用' },
    { id: 'connected-scatter-common-mistakes', label: '常见误区' },
    { id: 'connected-scatter-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="散点折线图"
      subtitle="把散点按时间连接，识别双指标在坐标平面中的联动轨迹。"
      icon={ConnectedScatterIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是散点折线图？" id="what-is-connected-scatter">
        <p>
          散点折线图（Connected Scatter Plot）本质上是“散点图 + 时间连接线”。
          它展示的不是单纯相关性，而是两个指标在时间推进中的联动轨迹。
        </p>
        <p>
          与普通散点图相比，它能回答“先发生了什么、后发生了什么”，
          从而识别系统状态是向有利象限移动还是向不利象限移动。
        </p>
        <p>英文名：Connected Scatter Plot</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G2）">
        <ConnectedScatterG2 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-connected-scatter">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要同时看两个数值指标的联动，而不是各自趋势。</li>
          <li>需要识别指标组合在不同时点的“路径迁移”。</li>
          <li>需要向管理层解释系统风险如何逐步累积或缓释。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="connected-scatter-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">未标注时间顺序</h3>
            <p className="text-sm text-red-700">
              若没有顺序信息，图会退化为普通散点图，失去“轨迹”意义。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">忽略阈值象限</h3>
            <p className="text-sm text-red-700">
              不设置参考线时，很难判断轨迹移动是否进入风险区间。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="connected-scatter-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">NPL-LCR 轨迹图（风险-流动性联动）</h3>
          <p className="text-base text-slate-600">
            对应节点 ID：root/q-2num/q-2num-ordered/chart-connected-scatter（leaf id=chart-connected-scatter）
          </p>
          <p>
            把 NPL（y）与 LCR（x）按时间连接，可直观看到“资产质量-流动性”组合如何迁移，
            用于识别早期压力信号与阶段性缓冲回补。
          </p>
        </div>

        <ChartWrapper title="数据轨迹图：行业 NPL-LCR 联动路径">
          <ConnectedScatterNplLcrScenarioG2 />
        </ChartWrapper>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>2025Q3 出现“LCR 回落 + NPL 回升”，轨迹向不利象限移动，属于早期压力信号。</li>
          <li>2025Q4 轨迹回到“更高 LCR + 更低 NPL”，显示阶段性缓冲回补。</li>
          <li>联动轨迹比单指标更敏感，建议作为压力测试与流动性预案触发信号。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
