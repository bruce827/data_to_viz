'use client';

import React from 'react';
import Image from 'next/image';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { HeatmapIcon } from '@/components/viz/icons';
import { HeatmapRegionIndustryScenarioG2 } from '@/components/viz/charts/HeatmapComboScenarioG2';

export default function HeatmapComboStory() {
  const outlineItems = [
    { id: 'what-is-heatmap-combo', label: '什么是热力图' },
    { id: 'when-to-use-heatmap-combo', label: '何时使用' },
    { id: 'heatmap-combo-common-mistakes', label: '常见误区' },
    { id: 'heatmap-combo-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="热力图（多分类×多数值）"
      subtitle="用颜色强度表达分类组合上的数值高低，适合快速定位区域-行业风险聚集点。"
      icon={HeatmapIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是热力图？" id="what-is-heatmap-combo">
        <p>
          热力图（Heatmap）将两个分类维度交叉成网格，用颜色编码连续数值强度。
          它适合快速识别高风险单元格和结构性异常区域。
        </p>
        <p>英文名：Heatmap</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G2）">
        <figure className="rounded-lg border border-slate-200 bg-white p-2">
          <Image
            src="/images/graph/heatmap-combo/interactive-example-1.png"
            alt="热力图交互示例"
            width={1004}
            height={636}
            className="w-full h-auto rounded-md"
          />
        </figure>
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-heatmap-combo">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要在二维分类（如区域×行业）上定位风险热点。</li>
          <li>需要在大盘监控中快速筛出“高值且高规模”单元格。</li>
          <li>需要为后续下钻分析提供优先级排序入口。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="heatmap-combo-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">只看颜色，不看规模</h3>
            <p className="text-sm text-red-700">
              比率高但余额小的单元格不一定是优先风险。应结合余额或权重做综合判断。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">阈值设置不一致</h3>
            <p className="text-sm text-red-700">
              若不同周期阈值变化过大，会导致同一颜色含义不一致，影响趋势比较与管理判断。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="heatmap-combo-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">区域×行业 NPL/逾期热力图（穿透式风险地图）</h3>
          <p className="text-base text-slate-600">
            对应节点 ID：root/q-combo/q-combo-mcat-mnum/chart-combo-mcat-mnum-heatmap（leaf id=chart-combo-mcat-mnum-heatmap）
          </p>
          <p>
            以省份（广东、江苏、四川、北京、浙江、山东）与行业（制造业、房地产相关、批发零售）形成二维网格，
            颜色映射 NPL（不良贷款率），tooltip 同时展示贷款余额，用于识别“高风险比率”与“高余额规模”叠加单元格。
          </p>
        </div>

        <ChartWrapper title="数据热力图：区域×行业 NPL 风险分布">
          <HeatmapRegionIndustryScenarioG2 />
        </ChartWrapper>

        <p className="text-sm text-slate-500">
          说明：本场景基于 `docs/catenum-deep-research-report.md` 中 `HEAT` 样例口径，
          按相同字段结构扩展了更多城市样例，以支持更完整的区域对比观察。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>四川-房地产相关单元格 NPL 最高（3.00%），是当前最红风险热点。</li>
          <li>广东与江苏的房地产相关单元格 NPL 分别为 2.60% 和 2.40%，均明显高于制造业单元格。</li>
          <li>广东-制造业余额最大（8,200 亿元）且 NPL 仅 1.20%，体现“规模大但风险相对可控”的特征。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
