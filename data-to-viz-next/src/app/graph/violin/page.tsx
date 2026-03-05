'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { ViolinIcon } from '@/components/viz/icons';
import { ViolinG2 } from '@/components/viz/charts/ViolinG2';
import { ViolinPdScenarioG2 } from '@/components/viz/charts/ViolinScenarioG2';

export default function ViolinStory() {
  const outlineItems = [
    { id: 'what-is-violin', label: '什么是小提琴图' },
    { id: 'when-to-use-violin', label: '何时使用' },
    { id: 'violin-common-mistakes', label: '常见误区' },
    { id: 'violin-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="小提琴图"
      subtitle="结合密度形状与分布统计，适合识别多峰与长尾风险。"
      icon={ViolinIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是小提琴图？" id="what-is-violin">
        <p>
          小提琴图（Violin Plot）结合了箱线图和密度图的优点：既能看到分布的中心位置和离散程度，
          也能看到分布形状本身（如单峰、双峰、长尾）。
        </p>
        <p>
          当你不满足于“只看中位数和四分位”，而希望进一步理解风险是否在尾部聚集时，
          小提琴图通常比单纯箱线图更有解释力。
        </p>
        <p>英文名：Violin Plot</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G2）">
        <ViolinG2 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-violin">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要对比多组分布形状，而不仅仅比较中位数。</li>
          <li>关注“双峰”或“长尾”是否正在出现并扩大。</li>
          <li>希望将分布形态用于风控阈值、模型重训或策略收紧判断。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="violin-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">只看外形不看统计量</h3>
            <p className="text-sm text-red-700">
              仅凭外形判断风险容易主观化，建议结合中位数、P90、IQR 同步解读。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">忽略群组可比性</h3>
            <p className="text-sm text-red-700">
              样本口径不一致会导致形态对比失真，需先统一样本窗口和分层规则。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="violin-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">线上获客 vs 线下获客的 PD 分布对比</h3>
          <p className="text-base text-slate-600">
            对应节点 ID：root/q-2num/q-2num-notordered/q-notordered-many/chart-violin（leaf id=chart-violin）
          </p>
          <p>
            数字金融推进下，线上获客占比提升，但客群结构可能快速变化。通过小提琴图可同时观察
            渠道 PD 分布形状和尾部拉长情况，用于识别客群漂移与模型失配风险。
          </p>
        </div>

        <ChartWrapper title="数据小提琴图：渠道 PD 分布">
          <ViolinPdScenarioG2 />
        </ChartWrapper>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>合作平台导流的尾部最显著、线上次之，线下分布更集中，说明导流与线上渠道的尾部损失风险更高。</li>
          <li>线上分布呈明显“双峰”，通常意味着客群结构变化或反欺诈策略需要迭代。</li>
          <li>应重点监控高 PD 尾部（如 P90 与高 PD 占比），避免在扩张或降价中出现“利润薄、损失厚”。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
