'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type QuarterRow = {
  quarter: string;
  mortgage: number;
  installment: number;
  cardRevolving: number;
  inclusiveSme: number;
  total: number;
};

type ProductKey = 'mortgage' | 'installment' | 'cardRevolving' | 'inclusiveSme';

type StackedDatum = {
  quarter: string;
  product: string;
  riskTier: string;
  amount: number;
  amountLabel: string;
  quarterTotal: number;
  quarterTotalLabel: string;
  share: number;
  shareLabel: string;
};

type TotalLineDatum = {
  quarter: string;
  total: number;
  totalLabel: string;
};

const PRODUCT_ORDER: ProductKey[] = ['mortgage', 'installment', 'cardRevolving', 'inclusiveSme'];
const PRODUCT_LABEL: Record<ProductKey, string> = {
  mortgage: '按揭',
  installment: '消费分期',
  cardRevolving: '信用卡透支',
  inclusiveSme: '普惠小微（个体/小微主）',
};
const RISK_TIER_LABEL: Record<ProductKey, string> = {
  mortgage: '低风险/规模大',
  installment: '中风险/增速快',
  cardRevolving: '中高风险/波动高',
  inclusiveSme: '高风险/政策导向',
};
const PRODUCT_COLORS: Record<ProductKey, string> = {
  mortgage: '#2563eb',
  installment: '#06b6d4',
  cardRevolving: '#10b981',
  inclusiveSme: '#f97316',
};

const amountFormatter = new Intl.NumberFormat('zh-CN');

// 数据源：docs/deep-research-report.md 中 chart-stacked-area-many 场景（示例数据，单位：亿元）
const reportRows: QuarterRow[] = [
  { quarter: '2024Q1', mortgage: 6200, installment: 1450, cardRevolving: 980, inclusiveSme: 620, total: 9250 },
  { quarter: '2024Q2', mortgage: 6150, installment: 1520, cardRevolving: 1020, inclusiveSme: 700, total: 9390 },
  { quarter: '2024Q3', mortgage: 6080, installment: 1600, cardRevolving: 1080, inclusiveSme: 780, total: 9540 },
  { quarter: '2024Q4', mortgage: 6000, installment: 1720, cardRevolving: 1140, inclusiveSme: 900, total: 9760 },
  { quarter: '2025Q1', mortgage: 5920, installment: 1820, cardRevolving: 1220, inclusiveSme: 1020, total: 9980 },
  { quarter: '2025Q2', mortgage: 5850, installment: 1900, cardRevolving: 1300, inclusiveSme: 1150, total: 10200 },
];

const stackedData: StackedDatum[] = reportRows.flatMap((row) =>
  PRODUCT_ORDER.map((key) => {
    const amount = row[key];
    const share = (amount / row.total) * 100;
    return {
      quarter: row.quarter,
      product: PRODUCT_LABEL[key],
      riskTier: RISK_TIER_LABEL[key],
      amount,
      amountLabel: amountFormatter.format(amount),
      quarterTotal: row.total,
      quarterTotalLabel: amountFormatter.format(row.total),
      share: Number(share.toFixed(1)),
      shareLabel: `${share.toFixed(1)}%`,
    };
  }),
);

const totalLineData: TotalLineDatum[] = reportRows.map((row) => ({
  quarter: row.quarter,
  total: row.total,
  totalLabel: amountFormatter.format(row.total),
}));

const maxQuarterTotal = Math.max(...reportRows.map((row) => row.total));
const yAxisMax = Math.ceil(maxQuarterTotal * 1.2);

export function StackedAreaManyScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 360,
      paddingLeft: 70,
      paddingRight: 24,
      paddingBottom: 58,
      paddingTop: 26,
    });

    chart.options({
      type: 'view',
      scale: {
        y: {
          domain: [0, yAxisMax],
          nice: false,
        },
        color: {
          domain: PRODUCT_ORDER.map((k) => PRODUCT_LABEL[k]),
          range: PRODUCT_ORDER.map((k) => PRODUCT_COLORS[k]),
        },
      },
      axis: {
        x: { title: '季度' },
        y: { title: '余额（亿元）' },
      },
      legend: {
        color: {
          title: '零售贷款产品结构',
          position: 'top',
        },
      },
      children: [
        {
          type: 'area',
          data: {
            type: 'inline',
            value: stackedData,
          },
          transform: [{ type: 'stackY' }],
          encode: {
            x: 'quarter',
            y: 'amount',
            color: 'product',
            shape: 'smooth',
          },
          style: {
            fillOpacity: 0.74,
          },
          tooltip: {
            title: (d: StackedDatum) => d.quarter,
            items: [
              { field: 'product', name: '产品' },
              { field: 'amountLabel', name: '余额（亿元）' },
              { field: 'shareLabel', name: '当季占比' },
              { field: 'quarterTotalLabel', name: '当季合计（亿元）' },
              { field: 'riskTier', name: '结构标签' },
            ],
          },
        },
        {
          type: 'line',
          data: {
            type: 'inline',
            value: totalLineData,
          },
          encode: {
            x: 'quarter',
            y: 'total',
            shape: 'smooth',
          },
          style: {
            stroke: '#0f172a',
            lineWidth: 2.2,
            lineDash: [6, 4],
          },
          tooltip: {
            title: (d: TotalLineDatum) => d.quarter,
            items: [{ field: 'totalLabel', name: '总量（亿元）' }],
          },
          legend: false,
        },
        {
          type: 'point',
          data: {
            type: 'inline',
            value: totalLineData,
          },
          encode: {
            x: 'quarter',
            y: 'total',
          },
          style: {
            fill: '#0f172a',
            stroke: '#ffffff',
            lineWidth: 1.1,
            r: 3.5,
          },
          labels: [
            {
              text: (d: TotalLineDatum) => `${d.totalLabel}`,
              dy: -12,
              fontSize: 10,
              fill: '#334155',
              fontWeight: 600,
            },
          ],
          tooltip: false,
          legend: false,
        },
      ],
      interaction: [{ type: 'elementHighlight', background: true }],
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '360px' }} />;
}
