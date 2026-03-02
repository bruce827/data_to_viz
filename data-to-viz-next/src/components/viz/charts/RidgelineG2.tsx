'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import ridgelineData from './demoData/RidgelineG2.json';

type SourceDatum = {
  group: string;
  score: number;
};

type DensityPoint = {
  x: number;
  y: number;
};

type PlotDatum = {
  group: string;
  score: number;
  densityRange: [number, number];
};

// KDE 核心算法
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

export function RidgelineG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 300,
      paddingLeft: 60,
      paddingBottom: 40,
    });

    const groups = ['2023', '2022', '2021', '2020'];
    const plotData: PlotDatum[] = [];
    const ticks = Array.from({ length: 50 }, (_, i) => 40 + (i * (110 - 40)) / 49);
    const kde = kernelDensityEstimator(epanechnikov(5), ticks);

    groups.forEach((group, idx) => {
      const scores = (ridgelineData as SourceDatum[]).filter((d) => d.group === group).map((d) => d.score);
      const density = kde(scores);
      const offset = idx;
      const maxDensity = Math.max(...density.map((d) => d.y));
      const scaleFactor = 1.5;

      density.forEach((point) => {
        plotData.push({
          group,
          score: point.x,
          densityRange: [offset, offset + (point.y / maxDensity) * scaleFactor],
        });
      });
    });

    chart.options({
      type: 'area',
      data: plotData,
      encode: {
        x: 'score',
        y: 'densityRange',
        color: 'group',
      },
      scale: {
        color: { palette: 'blues' },
        y: { domain: [0, groups.length + 0.5] },
      },
      style: {
        fillOpacity: 0.8,
        stroke: '#fff',
        lineWidth: 1,
      },
      axis: {
        x: { title: '分数分布' },
        y: {
          title: '年份',
          labelFormatter: (v: string | number) => groups[Math.floor(Number(v))] || '',
        },
      },
      tooltip: {
        title: (d: PlotDatum) => d.group,
        items: [{ field: 'score', name: '分数' }],
      },
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '300px' }} />;
}
