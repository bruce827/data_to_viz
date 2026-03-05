'use client';

import React from 'react';
import Image from 'next/image';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { PCAIcon } from '@/components/viz/icons';
import { PCATransitionRiskScenarioG2 } from '@/components/viz/charts/PCAScenarioG2';

export default function PCAStory() {
  const outlineItems = [
    { id: 'what-is-pca', label: '什么是降维散点图' },
    { id: 'when-to-use-pca', label: '何时使用' },
    { id: 'pca-common-mistakes', label: '常见误区' },
    { id: 'pca-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="降维散点图（PCA）"
      subtitle="把 ESG、财务与排放等多维指标压缩到二维空间，识别转型风险簇。"
      icon={PCAIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是降维散点图？" id="what-is-pca">
        <p>
          降维散点图（PCA Scatter Plot）通过主成分分析（Principal Component Analysis）把高维指标压缩为两个主成分坐标（PC1、PC2），
          每个点代表一个客户在“综合风险结构”中的相对位置。
        </p>
        <p>
          在授信策略场景中，PCA 常用于识别相似客群与异常簇，帮助快速定位“高碳高风险、低 ESG”组合对象。
        </p>
        <p>英文名：PCA Scatter Plot</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G2）">
        <Image
          src="/images/stories/pca/pca-example.png"
          alt="降维散点图交互示例"
          width={370}
          height={272}
          className="w-full h-auto rounded-md border border-slate-200"
        />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-pca">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>指标维度较多（排放强度、ESG、能效、合规事件等），难以在二维内直接比较。</li>
          <li>需要从多指标结构中识别“相似客群”并做授信策略分层。</li>
          <li>需要把模型结果用于授信定价、期限策略和转型金融产品设计。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="pca-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">把主成分坐标当作单指标排序</h3>
            <p className="text-sm text-red-700">
              PC1/PC2 是多指标综合后的投影，不等于某个原始指标本身，不能直接替代单指标阈值管理。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">忽略业务解释与尽调闭环</h3>
            <p className="text-sm text-red-700">
              PCA 适合做分群与预警，不应替代实质尽调；需结合行业信息与披露数据做二次核验。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="pca-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">ESG + 排放多指标的转型风险聚类识别</h3>
          <p className="text-base text-slate-600">
            对应节点 ID：root/q-sevnum/q-sevnum-notordered/chart-pca（leaf id=chart-pca）
          </p>
          <p>
            将企业 ESG 评分与碳强度等多维指标投影到 PCA 空间后，可快速识别高转型风险簇并联动授信定价、
            期限策略和转型计划约束，支持绿色金融组合管理。
          </p>
        </div>

        <ChartWrapper title="数据降维散点图：企业 ESG/排放转型风险簇（PCA）">
          <PCATransitionRiskScenarioG2 />
        </ChartWrapper>

        <p className="text-sm text-slate-500">
          说明：本场景基于 report 的指标口径（PC1/PC2/ESG/碳强度）扩充为 30 个样本点，
          并加入业务噪声与局部反向扰动，用于更真实地展示相关结构与离群点识别。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>高转型风险簇（R 系列）整体呈正相关，但存在局部回撤点，反映行业阶段与治理差异导致的短期偏离。</li>
          <li>低转型风险簇（L 系列）整体呈负相关，且在中段与过渡簇有一定重叠，更贴近真实分布边界。</li>
          <li>O01/O02 为明显离群点，建议纳入单户尽调清单并单独校验转型计划与披露数据。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
