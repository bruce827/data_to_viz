'use client';

import React from 'react';
import Image from 'next/image';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { ChordIcon } from '@/components/viz/icons';
import { ChordCrossSellScenarioG2 } from '@/components/viz/charts/ChordScenarioG2';

export default function ChordStory() {
  const outlineItems = [
    { id: 'what-is-chord', label: '什么是和弦图' },
    { id: 'when-to-use-chord', label: '何时使用' },
    { id: 'chord-common-mistakes', label: '常见误区' },
    { id: 'chord-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="和弦图"
      subtitle="用圆环弦带展示产品之间的双向转化规模，适合交叉销售飞轮分析。"
      icon={ChordIcon}
      outlineItems={outlineItems}
      decisionTreeTab="cat"
    >
      <StorySection title="什么是和弦图？" id="what-is-chord">
        <p>
          和弦图（Chord）把多个类别放在同一圆环上，用弦带连接“来源类别 → 目标类别”。
          弦带越宽，表示类别之间的流量（人数/金额/次数）越大，适合展示多对多转化网络。
        </p>
        <p>英文名：Chord Diagram</p>
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full text-sm">
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="w-36 bg-slate-50 px-4 py-3 font-semibold text-slate-700">图表类型</td>
                <td className="px-4 py-3 text-slate-700">和弦图</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="w-36 bg-slate-50 px-4 py-3 font-semibold text-slate-700">适合的数据</td>
                <td className="px-4 py-3 text-slate-700">
                  节点数据集（可选）、边数据集：源节点、目标节点、流量值
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="w-36 bg-slate-50 px-4 py-3 font-semibold text-slate-700">功能</td>
                <td className="px-4 py-3 text-slate-700">观察节点关系，展示多个实体间的双向流动关系</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="w-36 bg-slate-50 px-4 py-3 font-semibold text-slate-700">数据与图形的映射</td>
                <td className="px-4 py-3 text-slate-700">
                  权重映射到节点和边的宽度；源节点和目标节点映射到圆周上的弧段位置；节点可以用颜色区分
                </td>
              </tr>
              <tr>
                <td className="w-36 bg-slate-50 px-4 py-3 font-semibold text-slate-700">适合的数据条数</td>
                <td className="px-4 py-3 text-slate-700">节点数据两组以上，5-15 个节点效果最佳</td>
              </tr>
            </tbody>
          </table>
        </div>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G2）">
        <figure className="rounded-lg border border-slate-200 bg-white p-2">
          <Image
            src="/images/graph/chord/interactive-example-2.png"
            alt="和弦图交互示例"
            width={1050}
            height={906}
            className="w-full h-auto rounded-md"
          />
        </figure>
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-chord">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要同时查看多个产品之间的双向转化关系，而不是单链路漏斗。</li>
          <li>需要在一张图上识别“高价值飞轮”与“弱转化断点”。</li>
          <li>需要把零售与对公联动经营路径放在同一视图比较。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="chord-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">只看弦带绝对宽度</h3>
            <p className="text-sm text-red-700">
              绝对人数大不等于转化效率高。必须结合“占来源产品流出比例”判断路径强弱。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">忽略对公与零售联动</h3>
            <p className="text-sm text-red-700">
              只看零售产品互转会漏掉企业结算到供应链融资等高价值路径，影响一体化经营判断。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="chord-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">
            客户产品交叉销售路径（零售+对公一体化经营）
          </h3>
          <p className="text-base text-slate-600">
            对应节点 ID：root/q-2cat-network/chart-chord-set（leaf id=chart-chord-set）
          </p>
          <p>
            用和弦图展示 2025Q4（2025年第四季度）来源产品到目标产品的转化人数，
            识别工资代发、信用卡、理财（AUM，管理资产规模）与企业结算、供应链融资的关键飞轮路径，
            支持非息收入与客户黏性协同提升。
          </p>
        </div>

        <ChartWrapper title="数据和弦图：产品交叉销售路径">
          <ChordCrossSellScenarioG2 />
        </ChartWrapper>

        <p className="text-sm text-slate-500">
          说明：本场景直接使用 `docs/cate-deep-research-report.md` 中 `chart-chord-set` 的 source-target 数据；
          不额外补数字段，仅补充来源占比用于 tooltip 解释。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>工资代发→信用卡为最大单条路径（42,000 人），占工资代发流出约 46.15%。</li>
          <li>企业结算→供应链融资占企业结算流出约 80.00%，是对公联动主通道。</li>
          <li>信用卡→理财（22,000 人）与按揭→理财（14,000 人）共同构成财富转化关键入口。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
