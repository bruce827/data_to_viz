'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type BizLine = '零售' | '对公' | '普惠';

type ProductRarocRow = {
  product: string;
  bizLine: BizLine;
  raroc: number;
  nimBps: number;
  feeBps: number;
  riskCostBps: number;
  econCapitalYi: number;
};

type ProductRarocDatum = ProductRarocRow & {
  rarocLabel: string;
  nimLabel: string;
  feeLabel: string;
  riskCostLabel: string;
  econCapitalLabel: string;
};

// 数据源：docs/cate-deep-research-report.md（chart-lollipop）
const scenarioRawData: ProductRarocRow[] = [
  { product: '工资代发+结算', bizLine: '零售', raroc: 0.161, nimBps: 60, feeBps: 90, riskCostBps: 5, econCapitalYi: 50 },
  { product: '基金/理财代销', bizLine: '零售', raroc: 0.173, nimBps: 0, feeBps: 160, riskCostBps: 2, econCapitalYi: 30 },
  { product: '信用卡分期', bizLine: '零售', raroc: 0.145, nimBps: 380, feeBps: 45, riskCostBps: 95, econCapitalYi: 95 },
  { product: '消费贷（线上）', bizLine: '零售', raroc: 0.132, nimBps: 310, feeBps: 18, riskCostBps: 75, econCapitalYi: 130 },
  { product: '消费贷（线下）', bizLine: '零售', raroc: 0.118, nimBps: 285, feeBps: 12, riskCostBps: 68, econCapitalYi: 150 },
  { product: '供应链金融（核心企业）', bizLine: '对公', raroc: 0.106, nimBps: 220, feeBps: 35, riskCostBps: 40, econCapitalYi: 180 },
  { product: '普惠小微经营贷', bizLine: '普惠', raroc: 0.094, nimBps: 260, feeBps: 10, riskCostBps: 85, econCapitalYi: 240 },
  { product: '按揭贷款（首套）', bizLine: '零售', raroc: 0.082, nimBps: 92, feeBps: 5, riskCostBps: 18, econCapitalYi: 320 },
  { product: '按揭贷款（二套）', bizLine: '零售', raroc: 0.071, nimBps: 105, feeBps: 6, riskCostBps: 22, econCapitalYi: 280 },
  { product: '票据贴现', bizLine: '对公', raroc: 0.058, nimBps: 45, feeBps: 8, riskCostBps: 12, econCapitalYi: 210 },
];

const scenarioData: ProductRarocDatum[] = [...scenarioRawData]
  .map((row) => ({
    ...row,
    rarocLabel: `${(row.raroc * 100).toFixed(1)}%`,
    nimLabel: `${row.nimBps} bps`,
    feeLabel: `${row.feeBps} bps`,
    riskCostLabel: `${row.riskCostBps} bps`,
    econCapitalLabel: `${row.econCapitalYi} 亿元`,
  }))
  .sort((a, b) => b.raroc - a.raroc);

export function LollipopRarocScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 380,
      paddingLeft: 170,
      paddingRight: 30,
      paddingTop: 46,
      paddingBottom: 38,
    });

    chart.options({
      type: 'view',
      data: {
        type: 'inline',
        value: scenarioData,
      },
      coordinate: {
        transform: [{ type: 'transpose' }],
      },
      scale: {
        y: {
          domain: [0, 0.19],
        },
        color: {
          domain: ['零售', '对公', '普惠'],
          range: ['#2563eb', '#f59e0b', '#ef4444'],
        },
      },
      children: [
        {
          type: 'interval',
          encode: {
            x: 'product',
            y: 'raroc',
            color: 'bizLine',
          },
          style: {
            maxWidth: 8,
            radius: 0,
            fillOpacity: 0.9,
          },
          tooltip: false,
        },
        {
          type: 'point',
          encode: {
            x: 'product',
            y: 'raroc',
            color: 'bizLine',
          },
          style: {
            shape: 'circle',
            r: 6.5,
            lineWidth: 1.5,
            stroke: '#ffffff',
          },
          labels: [
            {
              text: 'rarocLabel',
              dx: 10,
              textAlign: 'left',
              fill: '#0f172a',
              fontSize: 11,
              fontWeight: 600,
            },
          ],
          tooltip: {
            title: (d: ProductRarocDatum) => d.product,
            items: [
              { field: 'bizLine', name: '业务条线' },
              { field: 'rarocLabel', name: 'RAROC（风险调整后资本回报率）' },
              { field: 'nimLabel', name: 'NIM（净息差）贡献' },
              { field: 'feeLabel', name: '手续费贡献' },
              { field: 'riskCostLabel', name: '风险成本' },
              { field: 'econCapitalLabel', name: '经济资本占用' },
            ],
          },
        },
        {
          type: 'lineY',
          data: {
            type: 'inline',
            value: [{ baseline: 0.1 }],
          },
          encode: {
            y: 'baseline',
          },
          style: {
            stroke: '#64748b',
            lineDash: [4, 4],
            lineWidth: 1.2,
          },
          legend: false,
          tooltip: false,
        },
      ],
      axis: {
        x: { title: '产品线' },
        y: {
          title: 'RAROC（风险调整后资本回报率）',
          labelFormatter: (v: string | number) => `${(Number(v) * 100).toFixed(0)}%`,
        },
      },
      legend: {
        color: {
          title: '业务条线',
          position: 'top',
          cols: 3,
          offsetY: -8,
        },
      },
      interaction: [{ type: 'elementHighlight', background: true }],
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '380px' }} />;
}
