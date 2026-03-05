'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type MonthBinRow = {
  month: string;
  pct0: number;
  pct1to30: number;
  pct31to60: number;
  pctOver60: number;
};

type SampleRow = {
  month: string;
  dpd: number;
};

type DensityPoint = {
  x: number;
  y: number;
};

type PlotRow = {
  month: string;
  dpd: number;
  densityRange: [number, number];
};

const MONTH_ORDER = ['2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12'];

// 数据源：docs/deep-research-report.md（chart-correlogram）
const MONTH_BIN_ROWS: MonthBinRow[] = [
  { month: '2025-07', pct0: 90.2, pct1to30: 7.1, pct31to60: 1.8, pctOver60: 0.9 },
  { month: '2025-08', pct0: 89.1, pct1to30: 7.9, pct31to60: 2.0, pctOver60: 1.0 },
  { month: '2025-09', pct0: 87.8, pct1to30: 8.7, pct31to60: 2.3, pctOver60: 1.2 },
  { month: '2025-10', pct0: 86.9, pct1to30: 9.2, pct31to60: 2.6, pctOver60: 1.3 },
  { month: '2025-11', pct0: 86.0, pct1to30: 9.8, pct31to60: 2.8, pctOver60: 1.4 },
  { month: '2025-12', pct0: 85.4, pct1to30: 10.1, pct31to60: 3.0, pctOver60: 1.5 },
];

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

function gaussian(seed: number): number {
  const u1 = Math.max(1e-6, pseudoRandom(seed));
  const u2 = pseudoRandom(seed + 19.73);
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function kernelDensityEstimator(kernel: (v: number) => number, x: number[]) {
  return (sample: number[]): DensityPoint[] =>
    x.map((xVal) => ({
      x: xVal,
      y: sample.reduce((acc, v) => acc + kernel(xVal - v), 0) / sample.length,
    }));
}

function epanechnikov(bandwidth: number) {
  return (v: number): number => {
    const normalized = v / bandwidth;
    return Math.abs(normalized) <= 1 ? (0.75 * (1 - normalized * normalized)) / bandwidth : 0;
  };
}

function pushCluster(
  acc: SampleRow[],
  month: string,
  mean: number,
  sigma: number,
  count: number,
  min: number,
  max: number,
  seedOffset: number,
) {
  for (let i = 0; i < count; i += 1) {
    const z = gaussian(seedOffset + i * 0.73);
    const dpd = clamp(mean + z * sigma, min, max);
    acc.push({ month, dpd });
  }
}

function buildMonthlySamples(rows: MonthBinRow[]): SampleRow[] {
  const samples: SampleRow[] = [];
  const totalPerMonth = 1000;

  rows.forEach((row, rowIndex) => {
    const count0 = Math.round((row.pct0 / 100) * totalPerMonth);
    const count1to30 = Math.round((row.pct1to30 / 100) * totalPerMonth);
    const count31to60 = Math.round((row.pct31to60 / 100) * totalPerMonth);
    const used = count0 + count1to30 + count31to60;
    const countOver60 = Math.max(0, totalPerMonth - used);

    const seedBase = (rowIndex + 1) * 1000;

    // 让每个月的低逾期分布起点与中心略有差异，避免所有月份都从 0 起步
    const currentMin = 0.2 + rowIndex * 0.22;
    const currentMax = 3.3 + rowIndex * 0.28;
    const currentMean = 0.9 + rowIndex * 0.26;

    // 0天：集中在接近 0 的低逾期区，但按月份轻微右移
    pushCluster(samples, row.month, currentMean, 0.62, count0, currentMin, currentMax, seedBase + 11);
    // 1-30 天：轻逾期区，同步小幅右移
    pushCluster(samples, row.month, 14.2 + rowIndex * 0.45, 6.3, count1to30, 1 + rowIndex * 0.15, 30, seedBase + 101);
    // 31-60 天：滚动逾期区
    pushCluster(samples, row.month, 44, 6.2, count31to60, 31, 60, seedBase + 211);
    // >60 天：严重逾期尾部
    pushCluster(samples, row.month, 79, 13.5, countOver60, 61, 120, seedBase + 307);
  });

  return samples;
}

export function RidgelineDpdScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 360,
      paddingLeft: 72,
      paddingRight: 28,
      paddingTop: 38,
      paddingBottom: 46,
    });

    const samples = buildMonthlySamples(MONTH_BIN_ROWS);
    const xTicks = Array.from({ length: 121 }, (_, i) => i);
    const kde = kernelDensityEstimator(epanechnikov(4.8), xTicks);
    const plotData: PlotRow[] = [];

    MONTH_ORDER.forEach((month, idx) => {
      const monthlyValues = samples.filter((d) => d.month === month).map((d) => d.dpd);
      const density = kde(monthlyValues);
      const maxDensity = Math.max(...density.map((d) => d.y)) || 1;
      const offset = idx;
      const scaleFactor = 1.36;
      // 核密度尾部会把所有月份都“拖”到 x=0；这里按月设置最小可见起点，并裁剪低密度尾部。
      const minVisibleX = 0.6 + idx * 1.1;
      const minVisibleDensity = 0.022;
      const normalized = density.map((point) => ({
        x: point.x,
        n: point.y / maxDensity,
      }));

      normalized.forEach((point) => {
        if (point.x < minVisibleX) return;
        if (point.n < minVisibleDensity) return;
        plotData.push({
          month,
          dpd: point.x,
          densityRange: [offset, offset + point.n * scaleFactor],
        });
      });
    });

    chart.options({
      type: 'area',
      data: plotData,
      encode: {
        x: 'dpd',
        y: 'densityRange',
        color: 'month',
      },
      scale: {
        color: {
          domain: MONTH_ORDER,
          range: ['#fde68a', '#fcd34d', '#f59e0b', '#f97316', '#ef4444', '#dc2626'],
        },
        y: { domain: [0, MONTH_ORDER.length + 0.5] },
      },
      style: {
        fillOpacity: 0.82,
        stroke: '#ffffff',
        lineWidth: 1,
      },
      axis: {
        x: { title: 'DPD（逾期天数）' },
        y: {
          title: '月份',
          labelFormatter: (value: string | number) => {
            const month = MONTH_ORDER[Math.floor(Number(value))];
            return month ?? '';
          },
        },
      },
      legend: {
        color: {
          title: '观察月份',
          position: 'top',
          cols: 3,
          offsetY: -10,
        },
      },
      tooltip: {
        title: (d: PlotRow) => d.month,
        items: [
          {
            field: 'dpd',
            name: 'DPD（逾期天数）',
            valueFormatter: (v: number) => `${Math.round(v)} 天`,
          },
        ],
      },
      interaction: [{ type: 'elementHighlight', background: true }],
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '360px' }} />;
}
