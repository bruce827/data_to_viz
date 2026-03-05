'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type TrajectoryDatum = {
  period: string;
  order: number;
  lcr: number;
  npl: number;
};

// 数据源：docs/deep-research-report.md 中 chart-connected-scatter 场景（单位：LCR%、NPL%）
const nplLcrTrajectoryData: TrajectoryDatum[] = [
  { period: '2023Q4', order: 1, lcr: 151.6, npl: 1.59 },
  { period: '2024Q4', order: 2, lcr: 154.73, npl: 1.5 },
  { period: '2025Q3', order: 3, lcr: 149.73, npl: 1.52 },
  { period: '2025Q4', order: 4, lcr: 157.99, npl: 1.5 },
];

export function ConnectedScatterNplLcrScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 330,
      paddingLeft: 62,
      paddingRight: 24,
      paddingBottom: 52,
    });

    chart.options({
      type: 'view',
      data: nplLcrTrajectoryData,
      children: [
        {
          type: 'line',
          encode: {
            x: 'lcr',
            y: 'npl',
            shape: 'smooth',
          },
          style: {
            stroke: '#64748b',
            lineWidth: 2,
            lineDash: [4, 4],
          },
          tooltip: false,
        },
        {
          type: 'point',
          encode: {
            x: 'lcr',
            y: 'npl',
            color: 'period',
          },
          scale: {
            color: {
              domain: ['2023Q4', '2024Q4', '2025Q3', '2025Q4'],
              range: ['#93c5fd', '#60a5fa', '#3b82f6', '#1d4ed8'],
            },
          },
          style: {
            r: 4.5,
            stroke: '#ffffff',
            lineWidth: 1.2,
          },
          tooltip: {
            title: (d: TrajectoryDatum) => d.period,
            items: [
              { field: 'lcr', name: 'LCR（%）' },
              { field: 'npl', name: 'NPL（%）' },
            ],
          },
        },
        {
          type: 'text',
          encode: {
            x: 'lcr',
            y: 'npl',
            text: 'period',
          },
          style: {
            dy: -11,
            fontSize: 10,
            fill: '#475569',
          },
          tooltip: false,
        },
        {
          type: 'line',
          data: {
            type: 'inline',
            value: [
              { x: 149.5, y: 1.5 },
              { x: 158.5, y: 1.5 },
            ],
          },
          encode: {
            x: 'x',
            y: 'y',
          },
          style: {
            stroke: '#94a3b8',
            lineDash: [3, 3],
            lineWidth: 1,
          },
          tooltip: false,
        },
        {
          type: 'line',
          data: {
            type: 'inline',
            value: [
              { x: 150, y: 1.47 },
              { x: 150, y: 1.61 },
            ],
          },
          encode: {
            x: 'x',
            y: 'y',
          },
          style: {
            stroke: '#94a3b8',
            lineDash: [3, 3],
            lineWidth: 1,
          },
          tooltip: false,
        },
      ],
      axis: {
        x: { title: 'LCR（%）' },
        y: { title: 'NPL（%）' },
      },
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '330px' }} />;
}
