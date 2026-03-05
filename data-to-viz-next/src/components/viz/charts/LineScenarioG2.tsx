'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type NplDatum = {
  period: string;
  npl: number;
};

// 数据源：docs/deep-research-report.md 中 chart-line 场景（单位：%）
const nplTrendData: NplDatum[] = [
  { period: '2023Q4', npl: 1.59 },
  { period: '2024Q4', npl: 1.50 },
  { period: '2025Q3', npl: 1.52 },
  { period: '2025Q4', npl: 1.50 },
];

export function LineNplScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 320,
      paddingLeft: 58,
      paddingRight: 24,
      paddingBottom: 48,
    });

    chart.options({
      type: 'view',
      data: {
        type: 'inline',
        value: nplTrendData,
      },
      children: [
        {
          type: 'line',
          encode: {
            x: 'period',
            y: 'npl',
            shape: 'smooth',
          },
          style: {
            stroke: '#2563eb',
            lineWidth: 2.5,
          },
        },
        {
          type: 'point',
          encode: {
            x: 'period',
            y: 'npl',
          },
          style: {
            fill: '#2563eb',
            stroke: '#ffffff',
            lineWidth: 1.2,
            r: 4,
          },
          labels: [
            {
              text: (d: NplDatum) => `${d.npl.toFixed(2)}%`,
              dy: -10,
              fontSize: 11,
              fill: '#1e3a8a',
              fontWeight: 600,
            },
          ],
        },
      ],
      axis: {
        x: { title: '时点' },
        y: { title: 'NPL 比率（%）' },
      },
      tooltip: {
        items: [{ field: 'npl', name: 'NPL 比率（%）' }],
      },
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '320px' }} />;
}
