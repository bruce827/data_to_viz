'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type ScenarioSample = {
  x: string;
  y: number;
};

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

function gaussian(seed: number): number {
  const u1 = Math.max(1e-6, pseudoRandom(seed));
  const u2 = pseudoRandom(seed + 13.37);
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function pushCluster(
  acc: ScenarioSample[],
  group: string,
  mean: number,
  sigma: number,
  count: number,
  seedOffset: number,
) {
  for (let i = 0; i < count; i += 1) {
    const z = gaussian(seedOffset + i * 0.97);
    const value = Math.max(0.1, mean + z * sigma);
    acc.push({ x: group, y: value });
  }
}

function buildScenarioSamples(): ScenarioSample[] {
  const samples: ScenarioSample[] = [];

  // 线上：双峰（低 PD 主体 + 高风险尾部）
  pushCluster(samples, '线上（APP/小程序）', 1.8, 0.45, 420, 101);
  pushCluster(samples, '线上（APP/小程序）', 7.4, 1.0, 260, 211);
  pushCluster(samples, '线上（APP/小程序）', 10.2, 0.9, 120, 307);

  // 线下：单峰且尾部较短
  pushCluster(samples, '线下（网点/驻点）', 1.9, 0.5, 700, 401);
  pushCluster(samples, '线下（网点/驻点）', 4.9, 0.7, 100, 509);

  // 平台导流：长尾显著
  pushCluster(samples, '合作平台导流', 3.1, 0.85, 360, 601);
  pushCluster(samples, '合作平台导流', 7.2, 1.3, 260, 701);
  pushCluster(samples, '合作平台导流', 12.4, 1.8, 180, 809);

  return samples;
}

export function ViolinPdScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 340,
      paddingLeft: 84,
      paddingRight: 28,
      paddingBottom: 56,
    });

    const samples = buildScenarioSamples();

    chart.options({
      type: 'density',
      data: {
        type: 'inline',
        value: samples,
        transform: [
          {
            type: 'kde',
            field: 'y',
            groupBy: ['x'],
            size: 24,
          },
        ],
      },
      encode: {
        x: 'x',
        y: 'y',
        color: 'x',
        size: 'size',
      },
      scale: {
        color: {
          range: ['#3b82f6', '#0ea5e9', '#6366f1'],
        },
      },
      axis: {
        x: { title: '获客渠道' },
        y: { title: 'PD（未来12个月违约概率，%）' },
      },
      tooltip: false,
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '340px' }} />;
}
