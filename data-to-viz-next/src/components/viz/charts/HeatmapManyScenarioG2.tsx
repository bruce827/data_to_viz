'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type ThresholdHeatmapDatum = {
  utilization: string;
  dpd: string;
  accounts: number;
  accountsLabel: string;
  rowShare: number;
  rowShareLabel: string;
  riskZone: string;
};

type MatrixRow = {
  utilization: string;
  values: number[];
};

const UTILIZATION_DOMAIN = ['0-30%', '30-60%', '60-80%', '80-100%', '>100%（超限）'] as const;
const DPD_DOMAIN = ['0天', '1-30天', '31-60天', '61-90天', '>90天'] as const;

const accountFormatter = new Intl.NumberFormat('zh-CN');

// 数据源：docs/deep-research-report.md 中 chart-heatmap-many 场景（示例数据，单位：账户数）
const reportMatrix: MatrixRow[] = [
  { utilization: '0-30%', values: [120000, 6500, 1200, 300, 120] },
  { utilization: '30-60%', values: [160000, 12800, 2900, 820, 380] },
  { utilization: '60-80%', values: [95000, 13600, 4200, 1400, 900] },
  { utilization: '80-100%', values: [60000, 15500, 6100, 2600, 2100] },
  { utilization: '>100%（超限）', values: [18000, 7900, 4800, 2200, 2600] },
];

function classifyRisk(utilization: string, dpd: string) {
  const utilizationIndex = UTILIZATION_DOMAIN.indexOf(utilization as (typeof UTILIZATION_DOMAIN)[number]);
  const dpdIndex = DPD_DOMAIN.indexOf(dpd as (typeof DPD_DOMAIN)[number]);
  if (utilizationIndex >= 3 && dpdIndex >= 2) return '高风险干预区';
  if (utilizationIndex >= 2 && dpdIndex >= 1) return '重点关注区';
  return '常规监控区';
}

const heatmapManyData: ThresholdHeatmapDatum[] = reportMatrix.flatMap((row) => {
  const rowTotal = row.values.reduce((sum, value) => sum + value, 0);
  return DPD_DOMAIN.map((dpd, idx) => {
    const accounts = row.values[idx];
    const rowShare = (accounts / rowTotal) * 100;
    return {
      utilization: row.utilization,
      dpd,
      accounts,
      accountsLabel: accountFormatter.format(accounts),
      rowShare: Number(rowShare.toFixed(1)),
      rowShareLabel: `${rowShare.toFixed(1)}%`,
      riskZone: classifyRisk(row.utilization, dpd),
    };
  });
});

const utilizationThresholdLine = [
  { utilization: '80-100%', dpd: DPD_DOMAIN[0] },
  { utilization: '80-100%', dpd: DPD_DOMAIN[DPD_DOMAIN.length - 1] },
];

const dpdThresholdLine = [
  { utilization: UTILIZATION_DOMAIN[0], dpd: '1-30天' },
  { utilization: UTILIZATION_DOMAIN[UTILIZATION_DOMAIN.length - 1], dpd: '1-30天' },
];

const thresholdLabels = [
  { utilization: '80-100%', dpd: '>90天', label: '利用率阈值：80%' },
  { utilization: '>100%（超限）', dpd: '1-30天', label: 'DPD 阈值：30天' },
];

export function HeatmapManyScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 340,
      paddingLeft: 84,
      paddingRight: 20,
      paddingTop: 28,
      paddingBottom: 52,
    });

    chart.options({
      type: 'view',
      data: {
        type: 'inline',
        value: heatmapManyData,
      },
      scale: {
        x: {
          domain: [...UTILIZATION_DOMAIN],
        },
        y: {
          domain: [...DPD_DOMAIN],
        },
        color: {
          type: 'log',
          domain: [100, 160000],
          range: ['#eff6ff', '#bfdbfe', '#7dd3fc', '#3b82f6', '#1d4ed8'],
        },
      },
      axis: {
        x: {
          title: '信用额度利用率区间',
          titleSpacing: 26,
        },
        y: {
          title: '逾期天数（DPD）区间',
          titleSpacing: 12,
        },
      },
      legend: {
        color: {
          title: '账户数（对数色阶）',
        },
      },
      children: [
        {
          type: 'cell',
          encode: {
            x: 'utilization',
            y: 'dpd',
            color: 'accounts',
          },
          style: {
            stroke: '#ffffff',
            lineWidth: 1.2,
          },
          labels: [
            {
              text: (d: ThresholdHeatmapDatum) => (d.accounts >= 2600 ? `${(d.accounts / 1000).toFixed(1)}k` : ''),
              fill: '#0f172a',
              fontSize: 10,
              fontWeight: 600,
            },
          ],
          tooltip: {
            title: (d: ThresholdHeatmapDatum) => `${d.utilization} × ${d.dpd}`,
            items: [
              { field: 'accountsLabel', name: '账户数' },
              { field: 'rowShareLabel', name: '该利用率层内占比' },
              { field: 'riskZone', name: '风险分层' },
            ],
          },
        },
        {
          type: 'line',
          data: {
            type: 'inline',
            value: utilizationThresholdLine,
          },
          encode: {
            x: 'utilization',
            y: 'dpd',
          },
          style: {
            stroke: '#f97316',
            lineDash: [6, 4],
            lineWidth: 1.8,
          },
          tooltip: false,
          legend: false,
        },
        {
          type: 'line',
          data: {
            type: 'inline',
            value: dpdThresholdLine,
          },
          encode: {
            x: 'utilization',
            y: 'dpd',
          },
          style: {
            stroke: '#dc2626',
            lineDash: [6, 4],
            lineWidth: 1.8,
          },
          tooltip: false,
          legend: false,
        },
        {
          type: 'text',
          data: {
            type: 'inline',
            value: thresholdLabels,
          },
          encode: {
            x: 'utilization',
            y: 'dpd',
            text: 'label',
          },
          style: {
            fill: '#334155',
            fontSize: 10,
            dy: -8,
          },
          tooltip: false,
          legend: false,
        },
      ],
      interaction: [{ type: 'elementHighlight', background: true }],
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '340px' }} />;
}
