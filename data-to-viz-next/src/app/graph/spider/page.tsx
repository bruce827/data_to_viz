'use client';

import React from 'react';
import Image from 'next/image';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { SpiderIcon } from '@/components/viz/icons';
import { SpiderBranchScenarioG2 } from '@/components/viz/charts/SpiderScenarioG2';

export default function SpiderStory() {
  const outlineItems = [
    { id: 'what-is-spider', label: '什么是雷达图' },
    { id: 'when-to-use-spider', label: '何时使用' },
    { id: 'spider-common-mistakes', label: '常见误区' },
    { id: 'spider-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="雷达图"
      subtitle="适合做多指标综合体检，快速识别分行在经营与风险维度上的优势与短板。"
      icon={SpiderIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是雷达图？" id="what-is-spider">
        <p>
          雷达图（Spider / Radar Chart）将多个指标映射到从中心向外发散的坐标轴上，
          通过多边形形状对比不同对象的“能力轮廓”。
          当指标维度固定且需要看整体平衡性时，雷达图比单维排序图更直观。
        </p>
        <p>英文名：Spider Chart / Radar Chart</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G2）">
        <figure className="rounded-lg border border-slate-200 bg-white p-2">
          <Image
            src="/images/graph/spider/interactive-example-1.png"
            alt="雷达图交互示例"
            width={1012}
            height={626}
            className="w-full h-auto rounded-md"
          />
        </figure>
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-spider">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要比较多个对象在同一组指标上的综合表现。</li>
          <li>需要识别“短板维度”与“不均衡结构”。</li>
          <li>指标已经归一化，且方向统一（分数越高越好）。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="spider-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">指标未归一化直接对比</h3>
            <p className="text-sm text-red-700">
              不同量纲直接放在雷达图会造成误导，必须先做统一口径与归一化处理。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">对象过多导致图形重叠</h3>
            <p className="text-sm text-red-700">
              系列过多会严重遮挡，建议限制对象数量并结合 tooltip 或明细表查看数值。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="spider-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">分行经营—风险一体化评分卡</h3>
          <p className="text-base text-slate-600">
            对应节点 ID：root/q-2cat/q-2cat-multi/chart-spider（leaf id=chart-spider）
          </p>
          <p>
            将分行在 NIM（净息差）、NPL（不良贷款率）、RAROC（风险调整后资本回报率）、
            成本收入比、数字零售渗透率等维度统一为 0-100 评分，
            用于行长办公会快速识别“均衡型分行”与“短板型分行”。
          </p>
        </div>

        <ChartWrapper title="数据雷达图：分行经营与风险综合评分">
          <SpiderBranchScenarioG2 />
        </ChartWrapper>

        <p className="text-sm text-slate-500">
          说明：本场景直接使用 `docs/cate-deep-research-report.md` 中 `chart-spider` 样例数据；
          数据已归一化到 0-100 且方向一致（分数越高越好），可直接用于雷达图。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>上海分行在五个维度均处高分区，可作为目标轮廓参考。</li>
          <li>广东分行在风险质量和数字渗透维度较强，但 NIM（净息差）维度偏弱。</li>
          <li>四川与湖北分行呈“部分维度短板”特征，需按维度制定专项改进动作。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
