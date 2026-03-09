'use client';

import React from 'react';
import Image from 'next/image';
import { StoryLayout, StorySection, ChartWrapper } from '@/components/viz/story/StoryComponents';
import { CartogramIcon } from '@/components/viz/icons';
import {
  ProvinceAssetQualityChoroplethScenarioL7,
  provinceAssetQualityScenarioData,
} from '@/components/viz/charts/ProvinceAssetQualityChoroplethScenarioL7';

export default function BackgroundMapStory() {
  const outlineItems = [
    { id: 'what-is-background-map', label: '什么是分级统计图' },
    { id: 'when-to-use-background-map', label: '何时使用' },
    { id: 'background-map-common-mistakes', label: '常见误区' },
    { id: 'background-map-use-case', label: '应用场景' },
  ];

  return (
    <StoryLayout
      title="分级统计图"
      subtitle="按行政区或区域面统一着色，适合做区域对标、监管沟通和资源倾斜决策。"
      icon={CartogramIcon}
      outlineItems={outlineItems}
    >
      <StorySection title="什么是分级统计图？" id="what-is-background-map">
        <p>
          分级统计图（Choropleth / Graduated Map）会把每个行政区或区域单元按指标分级着色，颜色越深通常代表风险或规模越高。
        </p>
        <p>
          它适合用在“区域对比”场景，因为用户读的是整体分布与层级，而不是单个精确坐标。
        </p>
        <p>英文名：Graduated Map / Choropleth</p>
      </StorySection>

      <ChartWrapper title="交互示例">
        <Image
          src="/images/maps/background-map-example.png"
          alt="分级统计图交互示例"
          width={1019}
          height={575}
          className="w-full rounded-md border border-slate-200 bg-white"
          unoptimized
        />
      </ChartWrapper>

      <StorySection title="何时使用" id="when-to-use-background-map">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>需要按省、市、区等行政单元做总体对标。</li>
          <li>需要快速生成董事会、风险委和监管沟通材料。</li>
          <li>需要把复杂指标压缩成可被非技术角色快速理解的颜色分级。</li>
        </ul>
      </StorySection>

      <StorySection title="常见误区" id="background-map-common-mistakes">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-red-100 bg-red-50 p-6">
            <h3 className="mb-2 font-bold text-red-800">把省级分层当成足够细的处置单元</h3>
            <p className="text-sm text-red-700">
              省级分层适合管理层视角，但不适合直接做处置；深色省份内部仍可能同时存在稳健区与尾部风险区。
            </p>
          </div>
          <div className="rounded-lg border border-red-100 bg-red-50 p-6">
            <h3 className="mb-2 font-bold text-red-800">颜色太多导致层级失真</h3>
            <p className="text-sm text-red-700">
              分级图最重要的是稳定层级，不是追求连续色带。等级太多会让“轻重缓急”变得模糊。
            </p>
          </div>
        </div>
      </StorySection>

      <StorySection title="应用场景" id="background-map-use-case">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">省级资产质量分级统计图</h3>
          <p className="text-base text-slate-600">对应节点 ID：root/q-map-polygon/chart-background（leaf id=chart-background）</p>
          <p>
            以省份为单位统一渲染不良率分层，并在表格中补充关注率与拨备覆盖率，用于做区域风险对标与资源倾斜。
          </p>
        </div>

        <ChartWrapper title="应用场景图：省级资产质量分级统计图">
          <ProvinceAssetQualityChoroplethScenarioL7 />
        </ChartWrapper>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h4 className="mb-3 text-base font-semibold text-slate-900">场景数据表</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                  <th className="px-3 py-2 text-left font-semibold">省份</th>
                  <th className="px-3 py-2 text-left font-semibold">季度</th>
                  <th className="px-3 py-2 text-right font-semibold">关注率</th>
                  <th className="px-3 py-2 text-right font-semibold">不良率</th>
                  <th className="px-3 py-2 text-right font-semibold">拨备覆盖率</th>
                  <th className="px-3 py-2 text-right font-semibold">分层</th>
                </tr>
              </thead>
              <tbody>
                {provinceAssetQualityScenarioData.map((row) => (
                  <tr key={row.province_adcode} className="border-b border-slate-100 text-slate-700">
                    <td className="px-3 py-2">{row.province}</td>
                    <td className="px-3 py-2">{row.stat_quarter}</td>
                    <td className="px-3 py-2 text-right">{(row.special_mention_ratio * 100).toFixed(2)}%</td>
                    <td className="px-3 py-2 text-right">{(row.npl_ratio * 100).toFixed(2)}%</td>
                    <td className="px-3 py-2 text-right">{(row.provision_coverage * 100).toFixed(0)}%</td>
                    <td className="px-3 py-2 text-right">{row.npl_band}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-sm text-slate-500">
          说明：本场景以 `docs/map-deep-research-report.md` 中
          `scn_chart-background_province_asset_quality_choropleth_v1` 的字段口径为基础，扩展到 10 个重点省级区域，
          用颜色表达不良率层级，用表格补充关注率与拨备覆盖率。
        </p>

        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>河南已进入承压层，说明区域资产质量和拨备缓冲都需要优先关注。</li>
          <li>湖北、重庆、四川处于关注带，更适合结合行业和城市层级做进一步下钻，而不是简单贴标签。</li>
          <li>北京、上海、浙江仍处于稳健带，可作为区域对标基线和经营资源配置参考。</li>
        </ul>
      </StorySection>
    </StoryLayout>
  );
}
