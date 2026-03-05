'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type DensityPoint = {
  x: number;
  y: number;
};

type MoneyRange = {
  min: number;
  max: number;
  count: number;
};

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

// 数据源：docs/deep-research-report.md 中 chart-density 场景的区间占比
const AML_DENSITY_RANGES: MoneyRange[] = [
  { min: 0, max: 10000, count: 340 },
  { min: 10000, max: 30000, count: 380 },
  { min: 30000, max: 45000, count: 140 },
  { min: 45000, max: 49999, count: 50 },
  { min: 50000, max: 55000, count: 70 },
  { min: 55000, max: 80000, count: 20 },
];

function buildSampleData(ranges: MoneyRange[]): number[] {
  const values: number[] = [];

  ranges.forEach((range) => {
    const span = range.max - range.min;
    for (let i = 0; i < range.count; i += 1) {
      const t = (i + 0.5) / range.count;
      values.push(range.min + span * t);
    }
  });

  return values;
}

export function DensityAmlScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 320,
      paddingLeft: 56,
      paddingRight: 28,
      paddingBottom: 48,
    });

    const sampleValues = buildSampleData(AML_DENSITY_RANGES);
    const xTicks = Array.from({ length: 120 }, (_, i) => (i * 80000) / 119);
    const kde = kernelDensityEstimator(epanechnikov(4500), xTicks);
    const densityData = kde(sampleValues);
    const maxDensity = Math.max(...densityData.map((d) => d.y));

    chart
      .area()
      .data(densityData)
      .encode('x', 'x')
      .encode('y', 'y')
      .style('fill', '#0ea5e9')
      .style('fillOpacity', 0.3)
      .style('stroke', '#0284c7')
      .style('lineWidth', 2)
      .axis('x', { title: '交易金额（元）' })
      .axis('y', { title: '概率密度' })
      .tooltip({
        title: (d: DensityPoint) => `金额: ${Math.round(d.x).toLocaleString()} 元`,
        items: [{ channel: 'y', name: '密度', valueFormatter: (v: number) => v.toFixed(6) }],
      });

    chart
      .line()
      .data([
        { x: 50000, y: 0 },
        { x: 50000, y: maxDensity * 1.05 },
      ])
      .encode('x', 'x')
      .encode('y', 'y')
      .style('stroke', '#ef4444')
      .style('lineDash', [4, 4])
      .style('lineWidth', 2)
      .tooltip(false);

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '320px' }} />;
}
