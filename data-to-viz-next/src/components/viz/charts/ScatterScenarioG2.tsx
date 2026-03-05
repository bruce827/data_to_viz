'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type DscrPdDatum = {
  enterprise: string;
  industry: string;
  dscr: number;
  pd: number;
};

// 数据源：docs/deep-research-report.md 中 chart-scatter 场景（示例数据）
const reportSamples: DscrPdDatum[] = [
  { enterprise: 'SME01', dscr: 1.55, pd: 1.2, industry: '制造' },
  { enterprise: 'SME02', dscr: 1.32, pd: 1.8, industry: '批发' },
  { enterprise: 'SME03', dscr: 1.18, pd: 3.0, industry: '餐饮' },
  { enterprise: 'SME04', dscr: 1.05, pd: 6.8, industry: '建工' },
  { enterprise: 'SME05', dscr: 0.92, pd: 12.5, industry: '商贸' },
  { enterprise: 'SME06', dscr: 1.4, pd: 1.5, industry: '科技服务' },
  { enterprise: 'SME07', dscr: 1.1, pd: 5.2, industry: '物流' },
  { enterprise: 'SME08', dscr: 0.98, pd: 10.1, industry: '餐饮' },
  { enterprise: 'SME09', dscr: 1.25, pd: 2.2, industry: '制造' },
  { enterprise: 'SME10', dscr: 0.85, pd: 15.9, industry: '建工' },
];

type TrendDatum = {
  dscr: number;
  pd: number;
};

const INDUSTRY_DOMAIN = ['制造', '批发', '餐饮', '建工', '商贸', '科技服务', '物流'] as const;
const INDUSTRY_COLORS = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#17becf', '#8c564b'];
const INDUSTRY_COLOR_MAP = INDUSTRY_DOMAIN.reduce<Record<string, string>>((acc, industry, index) => {
  acc[industry] = INDUSTRY_COLORS[index];
  return acc;
}, {});

type IndustryProfile = {
  industry: (typeof INDUSTRY_DOMAIN)[number];
  count: number;
  dscrCenter: number;
  dscrStd: number;
  pdBase: number;
  pdStd: number;
};

const INDUSTRY_PROFILES: IndustryProfile[] = [
  { industry: '制造', count: 26, dscrCenter: 1.33, dscrStd: 0.08, pdBase: 2.2, pdStd: 0.7 },
  { industry: '批发', count: 20, dscrCenter: 1.25, dscrStd: 0.09, pdBase: 3.0, pdStd: 0.9 },
  { industry: '餐饮', count: 24, dscrCenter: 1.08, dscrStd: 0.1, pdBase: 6.5, pdStd: 1.5 },
  { industry: '建工', count: 24, dscrCenter: 1.0, dscrStd: 0.11, pdBase: 8.8, pdStd: 1.8 },
  { industry: '商贸', count: 22, dscrCenter: 0.98, dscrStd: 0.1, pdBase: 8.2, pdStd: 1.6 },
  { industry: '科技服务', count: 18, dscrCenter: 1.37, dscrStd: 0.07, pdBase: 1.9, pdStd: 0.6 },
  { industry: '物流', count: 20, dscrCenter: 1.15, dscrStd: 0.09, pdBase: 4.8, pdStd: 1.2 },
];

function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

function gaussian(seed: number) {
  const u1 = Math.max(1e-6, pseudoRandom(seed));
  const u2 = pseudoRandom(seed + 17.53);
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function buildAugmentedSamples(base: DscrPdDatum[]): DscrPdDatum[] {
  const augmented = [...base];
  let idx = 0;

  for (const profile of INDUSTRY_PROFILES) {
    for (let i = 0; i < profile.count; i += 1) {
      idx += 1;
      const seed = idx * 13.37 + i * 2.11;
      const dscr = clamp(
        profile.dscrCenter + gaussian(seed) * profile.dscrStd,
        0.82,
        1.6,
      );
      // 低 DSCR 区间施加非线性风险抬升，匹配 report 的“拐点”描述。
      const riskLift = Math.max(0, 1.1 - dscr) * 22;
      const pd = clamp(
        profile.pdBase + gaussian(seed + 9.31) * profile.pdStd + riskLift,
        0.6,
        17.2,
      );
      augmented.push({
        enterprise: `SYN${String(idx).padStart(2, '0')}`,
        industry: profile.industry,
        dscr: Number(dscr.toFixed(2)),
        pd: Number(pd.toFixed(1)),
      });
    }
  }

  return augmented;
}

function tricubeWeight(distance: number) {
  if (distance >= 1) return 0;
  const t = 1 - distance ** 3;
  return t ** 3;
}

function buildLoessLikeTrend(data: DscrPdDatum[], pointCount = 60, bandwidth = 0.32): TrendDatum[] {
  const sorted = [...data].sort((a, b) => a.dscr - b.dscr);
  const minX = sorted[0]?.dscr ?? 0;
  const maxX = sorted[sorted.length - 1]?.dscr ?? 1;
  const span = Math.max(maxX - minX, 1e-6);
  const window = bandwidth * span;
  const result: TrendDatum[] = [];

  for (let i = 0; i < pointCount; i += 1) {
    const x = minX + (span * i) / (pointCount - 1);
    let wSum = 0;
    let ySum = 0;

    for (const row of sorted) {
      const distance = Math.abs(row.dscr - x) / window;
      const w = tricubeWeight(distance);
      if (w <= 0) continue;
      wSum += w;
      ySum += w * row.pd;
    }

    if (wSum <= 1e-8) {
      const nearest = sorted.reduce((best, cur) =>
        Math.abs(cur.dscr - x) < Math.abs(best.dscr - x) ? cur : best,
      );
      result.push({ dscr: x, pd: nearest.pd });
    } else {
      result.push({ dscr: x, pd: ySum / wSum });
    }
  }

  return result;
}

const dscrPdData = buildAugmentedSamples(reportSamples);
const loessTrend = buildLoessLikeTrend(dscrPdData);
const reportHighlightData = dscrPdData.filter((d) => d.enterprise.startsWith('SME'));
const syntheticData = dscrPdData.filter((d) => d.enterprise.startsWith('SYN'));

const dscrTurningPoint = 1.1;
const dscrThresholdLine = [
  { dscr: dscrTurningPoint, pd: 0.4 },
  { dscr: dscrTurningPoint, pd: 16.8 },
];

export function ScatterDscrScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 340,
      paddingLeft: 64,
      paddingRight: 28,
      paddingBottom: 56,
    });

    chart.options({
      type: 'view',
      scale: {
        x: { domain: [0.8, 1.6], nice: true },
        y: { domain: [0, 18], nice: true },
        color: {
          domain: [...INDUSTRY_DOMAIN],
          range: [...INDUSTRY_COLORS],
        },
      },
      axis: {
        x: { title: 'DSCR（债务偿付覆盖率）' },
        y: { title: '12M PD（%）' },
      },
      legend: {
        color: {
          title: '行业',
          position: 'top',
        },
      },
      children: [
        {
          type: 'line',
          data: {
            type: 'inline',
            value: dscrThresholdLine,
          },
          encode: {
            x: 'dscr',
            y: 'pd',
          },
          style: {
            stroke: '#f97316',
            lineDash: [6, 4],
            lineWidth: 1.5,
          },
          legend: false,
          tooltip: false,
        },
        {
          type: 'line',
          data: {
            type: 'inline',
            value: loessTrend,
          },
          encode: {
            x: 'dscr',
            y: 'pd',
          },
          style: {
            stroke: '#475569',
            lineWidth: 2.5,
            strokeOpacity: 0.9,
          },
          legend: false,
          tooltip: false,
        },
        {
          type: 'point',
          data: {
            type: 'inline',
            value: syntheticData,
          },
          encode: {
            x: 'dscr',
            y: 'pd',
            color: 'industry',
          },
          style: {
            r: 5.2,
            fill: (d: DscrPdDatum) => INDUSTRY_COLOR_MAP[d.industry] || '#64748b',
            fillOpacity: 0.82,
            stroke: '#ffffff',
            lineWidth: 1.1,
          },
          tooltip: {
            title: (d: DscrPdDatum) => d.enterprise,
            items: [
              { field: 'industry', name: '行业' },
              { field: 'dscr', name: 'DSCR' },
              { field: 'pd', name: '12M PD（%）' },
            ],
          },
        },
        {
          type: 'point',
          data: {
            type: 'inline',
            value: reportHighlightData,
          },
          encode: {
            x: 'dscr',
            y: 'pd',
            color: 'industry',
          },
          style: {
            r: 8.2,
            fill: (d: DscrPdDatum) => INDUSTRY_COLOR_MAP[d.industry] || '#64748b',
            fillOpacity: 1,
            stroke: '#ffffff',
            lineWidth: 2.2,
          },
          tooltip: {
            title: (d: DscrPdDatum) => d.enterprise,
            items: [
              { field: 'industry', name: '行业' },
              { field: 'dscr', name: 'DSCR' },
              { field: 'pd', name: '12M PD（%）' },
            ],
          },
        },
      ],
      interaction: {
        tooltip: { shared: false },
      },
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '340px' }} />;
}
