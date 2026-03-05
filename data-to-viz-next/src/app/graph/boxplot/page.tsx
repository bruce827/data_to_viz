'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { BoxplotIcon } from '@/components/viz/icons';
import { BoxplotG2 } from '@/components/viz/charts/BoxplotG2';
import { BoxplotPricingScenarioG2 } from '@/components/viz/charts/BoxplotScenarioG2';

export default function BoxplotStory() {
  const outlineItems = [
    { id: 'what-is-boxplot', label: '什么是箱线图' },
    { id: 'when-to-use-boxplot', label: '何时使用' },
    { id: 'boxplot-common-mistakes', label: '常见误区' },
    { id: 'boxplot-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="箱线图"
      subtitle="用五数概括快速比较分布位置、离散程度与异常值。"
      icon={BoxplotIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是箱线图？" id="what-is-boxplot">
        <p>
          箱线图（Boxplot）通过最小值、下四分位数（Q1）、中位数、上四分位数（Q3）和最大值这五个统计量，
          在一张图里同时展示数据的中心位置、离散程度和异常值。
        </p>
        <p>
          它特别适合做多组对比：不需要查看全部明细点，也能快速判断哪些组“整体偏低”、哪些组“波动更大”、
          哪些组存在明显的极端值。
        </p>
        <p>英文名：Boxplot</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G2）">
        <BoxplotG2 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-boxplot">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要比较多个类别的分布差异，而不仅是均值高低。</li>
          <li>需要快速识别离散程度和异常值风险。</li>
          <li>需要在风控、定价、运营看板中做“分组体检”。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="boxplot-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">只看中位数</h3>
            <p className="text-sm text-red-700">
              只比较中位数会忽略离散度和异常点，容易漏判尾部风险。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">忽略样本规模</h3>
            <p className="text-sm text-red-700">
              小样本组的箱体形态稳定性较差，解读时应结合样本量。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="boxplot-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">小微贷款利差/风险溢价的行业诊断</h3>
          <p className="text-base text-slate-600">
            对应节点 ID：root/q-2num/q-2num-notordered/q-notordered-few/chart-boxplot（leaf id=chart-boxplot）
          </p>
          <p>
            在普惠扩量与融资成本下行导向下，银行可能出现“以价换量、风险溢价不足”。
            使用箱线图对比不同行业的小微贷款利差分布，可快速识别“定价偏低且离散”的高风险行业。
          </p>
        </div>

        <ChartWrapper title="数据箱线图：行业利差分布与上侧异常点（bp）">
          <BoxplotPricingScenarioG2 />
        </ChartWrapper>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>制造业（中游）与科技服务中位利差偏低，可能存在风险补偿不足。</li>
          <li>建筑分包上侧异常点更多，提示客户分层显著，应联动逾期指标交叉核验。</li>
          <li>若行业箱线图长期整体下移，通常意味着息差承压与价格竞争加剧。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
