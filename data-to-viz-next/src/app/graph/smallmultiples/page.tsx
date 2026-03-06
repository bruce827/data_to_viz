'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { GroupedBarIcon } from '@/components/viz/icons';
import { SmallMultiplesG2 } from '@/components/viz/charts/SmallMultiplesG2';
import { SmallMultiplesProvinceNplScenarioG2 } from '@/components/viz/charts/SmallMultiplesScenarioG2';

export default function SmallMultiplesStory() {
  const outlineItems = [
    { id: 'what-is-small-multiples', label: '什么是小多图' },
    { id: 'when-to-use-small-multiples', label: '何时使用' },
    { id: 'small-multiples-common-mistakes', label: '常见误区' },
    { id: 'small-multiples-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="小多图"
      subtitle="用统一坐标并列展示多个子图，适合比较不同地区或客群的趋势差异。"
      icon={GroupedBarIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是小多图？" id="what-is-small-multiples">
        <p>
          小多图（Small Multiples）将同一种图形按类别拆成多个小面板，并使用统一尺度进行并排展示。
          它能避免“平均值掩盖个体差异”，适合区域分层与客群分层监控。
        </p>
        <p>英文名：Small Multiples</p>
      </StorySection>

      <ChartWrapper title="交互示例（AntV G2）">
        <SmallMultiplesG2 />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-small-multiples">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要比较多个省份或客群的时间趋势，而不是只看全国平均。</li>
          <li>需要快速定位“异常子图”（斜率突变、波动放大）。</li>
          <li>需要在管理驾驶舱中同时保留全局视角与局部细节。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="small-multiples-common-mistakes">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">各子图使用不同纵轴范围</h3>
            <p className="text-sm text-red-700">
              若每个面板纵轴独立缩放，视觉比较会失真。跨面板对比应尽量统一尺度。
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800 mb-2">面板过多但缺少筛选机制</h3>
            <p className="text-sm text-red-700">
              一次展示过多子图会降低可读性。应提供分组筛选或分页，先看重点区域。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="small-multiples-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">31省份NPL月度趋势小多图（区域风险看板）</h3>
          <p className="text-base text-slate-600">
            对应节点 ID：root/q-combo/q-combo-mcat-mnum/chart-combo-mcat-mnum-small-multiples（leaf id=chart-combo-mcat-mnum-small-multiples）
          </p>
          <p>
            用小多图并列展示各省 NPL（不良贷款率）月度趋势，识别异常省份与风险扩散路径。
            场景按 report 的字段口径扩展到广东、河南、江苏、四川、浙江、山东六省，
            便于观察区域分化与趋势异动。
          </p>
        </div>

        <ChartWrapper title="数据小多图：省份 NPL 月度趋势">
          <SmallMultiplesProvinceNplScenarioG2 />
        </ChartWrapper>

        <p className="text-sm text-slate-500">
          说明：本场景基于 `docs/catenum-deep-research-report.md` 中 `SMUL` 样例口径，
          使用相同字段结构扩展了更多省份样例数据（month/province/nplRatio/nplBalanceCny100m）。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>河南与四川均呈显著上行（分别上行 15bp、16bp），其中河南期末 NPL 水平更高（1.95%）。</li>
          <li>四川与山东也呈持续上行（分别上行 16bp、13bp），应纳入重点监测名单。</li>
          <li>浙江 NPL 从 1.28% 回落至 1.23%，表现出阶段性改善特征，可作为对照区域。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
