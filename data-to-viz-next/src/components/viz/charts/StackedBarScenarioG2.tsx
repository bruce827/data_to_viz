'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type DpdBucketRaw = {
  month: string;
  cityTier: string;
  dpdBucket: string;
  balanceCny100m: number;
  bucketShare: number;
};

type DpdBucketDatum = DpdBucketRaw & {
  balanceLabel: string;
  shareLabel: string;
};

// 数据源：docs/catenum-deep-research-report.md（SBAR / chart-combo-mcat-1num-stacked-bar）
const scenarioRawData: DpdBucketRaw[] = [
  { month: '2025-10', cityTier: '一线', dpdBucket: '0-30', balanceCny100m: 32.4, bucketShare: 0.62 },
  { month: '2025-10', cityTier: '一线', dpdBucket: '31-60', balanceCny100m: 10.1, bucketShare: 0.19 },
  { month: '2025-10', cityTier: '一线', dpdBucket: '61-90', balanceCny100m: 5.2, bucketShare: 0.10 },
  { month: '2025-10', cityTier: '一线', dpdBucket: '90+', balanceCny100m: 4.6, bucketShare: 0.09 },
  { month: '2025-10', cityTier: '三四线', dpdBucket: '0-30', balanceCny100m: 18.8, bucketShare: 0.54 },
  { month: '2025-10', cityTier: '三四线', dpdBucket: '90+', balanceCny100m: 6.9, bucketShare: 0.20 },
];

const scenarioData: DpdBucketDatum[] = scenarioRawData.map((row) => ({
  ...row,
  balanceLabel: `${row.balanceCny100m.toFixed(1)} 亿元`,
  shareLabel: `${(row.bucketShare * 100).toFixed(2)}%`,
}));

const bucketColorMap: Record<string, string> = {
  '0-30': '#2563eb',
  '31-60': '#f59e0b',
  '61-90': '#f97316',
  '90+': '#ef4444',
};

export function StackedBarDpdScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 400,
      paddingLeft: 54,
      paddingRight: 16,
      paddingTop: 52,
      paddingBottom: 44,
    });

    chart
      .interval()
      .data(scenarioData)
      .transform({ type: 'stackY' })
      .encode('x', 'cityTier')
      .encode('y', 'balanceCny100m')
      .encode('color', 'dpdBucket')
      .scale('color', {
        domain: ['0-30', '31-60', '61-90', '90+'],
        range: ['#2563eb', '#f59e0b', '#f97316', '#ef4444'],
      })
      .legend('color', {
        title: 'DPD账龄分层（逾期天数分层）',
        position: 'top',
      })
      .axis('y', {
        title: false,
        labelFormatter: (value: string) => `${Number(value).toFixed(0)}`,
      })
      .style('fill', (d: DpdBucketDatum) => bucketColorMap[d.dpdBucket] || '#94a3b8')
      .style('stroke', '#ffffff')
      .style('lineWidth', 0.8)
      .tooltip({
        title: (d: DpdBucketDatum) => `${d.cityTier}｜${d.month}｜DPD ${d.dpdBucket}`,
        items: [
          { field: 'balanceLabel', name: '账龄余额（亿元）' },
          { field: 'shareLabel', name: '该城市层级内占比' },
        ],
      });

    chart.interaction('tooltip', { shared: true });
    chart.interaction('elementHighlightByColor', { background: true });

    chart.render();
    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '400px' }} />;
}
