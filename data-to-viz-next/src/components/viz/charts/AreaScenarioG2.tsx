'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type AlmDatum = {
  month: string;
  loan: number;
  deposit: number;
  gap: number;
};

type FoldedDatum = AlmDatum & {
  series: 'loan' | 'deposit';
  seriesLabel: string;
  amount: number;
};

// 数据源：docs/deep-research-report.md 中 chart-area 场景（单位：万亿元）
const almGapData: AlmDatum[] = [
  { month: '2025-07', loan: 23.8, deposit: 24.1, gap: -0.3 },
  { month: '2025-08', loan: 24.0, deposit: 24.4, gap: -0.4 },
  { month: '2025-09', loan: 24.4, deposit: 24.2, gap: 0.2 },
  { month: '2025-10', loan: 24.9, deposit: 24.1, gap: 0.8 },
  { month: '2025-11', loan: 25.1, deposit: 24.5, gap: 0.6 },
  { month: '2025-12', loan: 25.4, deposit: 24.9, gap: 0.5 },
];

const foldedLineData: FoldedDatum[] = almGapData.flatMap((d) => [
  {
    ...d,
    series: 'loan' as const,
    seriesLabel: '各项贷款余额',
    amount: d.loan,
  },
  {
    ...d,
    series: 'deposit' as const,
    seriesLabel: '各项存款余额',
    amount: d.deposit,
  },
]);

export function AreaAlmScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 320,
      paddingLeft: 64,
      paddingRight: 28,
      paddingBottom: 52,
    });

    chart.options({
      type: 'view',
      scale: {
        color: {
          domain: ['loan', 'deposit'],
          range: ['#2563eb', '#0ea5e9'],
        },
      },
      axis: {
        x: { title: '月份' },
        y: { title: '余额（万亿元）' },
      },
      legend: {
        color: { title: false },
      },
      children: [
        {
          type: 'area',
          data: {
            type: 'inline',
            value: almGapData,
            transform: [
              {
                type: 'fold',
                fields: ['loan', 'deposit'],
                key: 'series',
                value: 'amount',
              },
            ],
          },
          transform: [{ type: 'diffY' }],
          encode: {
            x: 'month',
            y: 'amount',
            color: 'series',
            shape: 'smooth',
          },
          style: {
            fillOpacity: 0.45,
          },
          legend: false,
          tooltip: false,
        },
        {
          type: 'line',
          data: {
            type: 'inline',
            value: foldedLineData,
          },
          encode: {
            x: 'month',
            y: 'amount',
            color: 'series',
            shape: 'smooth',
          },
          style: {
            lineWidth: 2,
          },
        },
        {
          type: 'point',
          data: {
            type: 'inline',
            value: foldedLineData,
          },
          encode: {
            x: 'month',
            y: 'amount',
            color: 'series',
          },
          style: {
            r: 3,
            stroke: '#ffffff',
            lineWidth: 1,
          },
          tooltip: {
            title: (d: FoldedDatum) => d.month,
            items: [
              { field: 'seriesLabel', name: '序列' },
              { field: 'loan', name: '各项贷款余额' },
              { field: 'deposit', name: '各项存款余额' },
              { field: 'gap', name: '缺口（贷-存）' },
            ],
          },
        },
      ],
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '320px' }} />;
}
