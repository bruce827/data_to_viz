'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import DataSet from '@antv/data-set';

type RiskMatrixCell = {
  ltvBand: '<50%' | '50%-70%' | '70%-85%' | '>85%';
  priceChangeBand: '>=0%' | '0%~-5%' | '-5%~-15%' | '<-15%';
  accounts: number;
};

type MortgagePointDatum = {
  ltv: number;
  priceChange: number;
  ltvBand: RiskMatrixCell['ltvBand'];
  priceChangeBand: RiskMatrixCell['priceChangeBand'];
  riskZone: '常规监控区' | '重点贷后跟踪区' | '高风险优先处置区';
};

// 数据源：docs/deep-research-report.md 中 chart-density-heatmap 场景（示例数据，单位：账户数）
const riskMatrix: RiskMatrixCell[] = [
  { ltvBand: '<50%', priceChangeBand: '>=0%', accounts: 38000 },
  { ltvBand: '<50%', priceChangeBand: '0%~-5%', accounts: 9500 },
  { ltvBand: '<50%', priceChangeBand: '-5%~-15%', accounts: 2200 },
  { ltvBand: '<50%', priceChangeBand: '<-15%', accounts: 600 },
  { ltvBand: '50%-70%', priceChangeBand: '>=0%', accounts: 52000 },
  { ltvBand: '50%-70%', priceChangeBand: '0%~-5%', accounts: 18000 },
  { ltvBand: '50%-70%', priceChangeBand: '-5%~-15%', accounts: 6800 },
  { ltvBand: '50%-70%', priceChangeBand: '<-15%', accounts: 2100 },
  { ltvBand: '70%-85%', priceChangeBand: '>=0%', accounts: 31000 },
  { ltvBand: '70%-85%', priceChangeBand: '0%~-5%', accounts: 16500 },
  { ltvBand: '70%-85%', priceChangeBand: '-5%~-15%', accounts: 9600 },
  { ltvBand: '70%-85%', priceChangeBand: '<-15%', accounts: 4800 },
  { ltvBand: '>85%', priceChangeBand: '>=0%', accounts: 8500 },
  { ltvBand: '>85%', priceChangeBand: '0%~-5%', accounts: 7400 },
  { ltvBand: '>85%', priceChangeBand: '-5%~-15%', accounts: 6200 },
  { ltvBand: '>85%', priceChangeBand: '<-15%', accounts: 5900 },
];

const LTV_BOUNDS: Record<RiskMatrixCell['ltvBand'], [number, number]> = {
  '<50%': [25, 50],
  '50%-70%': [50, 70],
  '70%-85%': [70, 85],
  '>85%': [85, 120],
};
const PRICE_CHANGE_BOUNDS: Record<RiskMatrixCell['priceChangeBand'], [number, number]> = {
  '>=0%': [0, 8],
  '0%~-5%': [-5, 0],
  '-5%~-15%': [-15, -5],
  '<-15%': [-30, -15],
};

function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

function gaussian(seed: number) {
  const u1 = Math.max(1e-6, pseudoRandom(seed));
  const u2 = pseudoRandom(seed + 17.53);
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function classifyRiskByPoint(ltv: number, priceChange: number): MortgagePointDatum['riskZone'] {
  if (ltv >= 85 && priceChange <= -15) return '高风险优先处置区';
  if (ltv >= 70 && priceChange < 0) return '重点贷后跟踪区';
  return '常规监控区';
}

// 将 report 的二维聚合矩阵按比例重采样为连续点云，以匹配“密度热力图”交互语义。
function buildPointCloud(matrix: RiskMatrixCell[]) {
  const points: MortgagePointDatum[] = [];
  let seed = 1;

  matrix.forEach((cell) => {
    const [ltvMin, ltvMax] = LTV_BOUNDS[cell.ltvBand];
    const [priceMin, priceMax] = PRICE_CHANGE_BOUNDS[cell.priceChangeBand];
    const sampleCount = Math.max(8, Math.round(cell.accounts / 90));
    const ltvCenter = (ltvMin + ltvMax) / 2;
    const priceCenter = (priceMin + priceMax) / 2;
    const ltvStd = (ltvMax - ltvMin) / 4.3;
    const priceStd = (priceMax - priceMin) / 4.3;

    for (let i = 0; i < sampleCount; i += 1) {
      seed += 1;
      const ltv = clamp(
        ltvCenter + gaussian(seed * 1.37) * ltvStd,
        ltvMin,
        ltvMax,
      );
      const priceChange = clamp(
        priceCenter + gaussian(seed * 1.91) * priceStd,
        priceMin,
        priceMax,
      );
      points.push({
        ltv: Number(ltv.toFixed(2)),
        priceChange: Number(priceChange.toFixed(2)),
        ltvBand: cell.ltvBand,
        priceChangeBand: cell.priceChangeBand,
        riskZone: classifyRiskByPoint(ltv, priceChange),
      });
    }
  });

  return points;
}

const mortgagePointCloud = buildPointCloud(riskMatrix);
const riskHotspotLabel = [{ ltv: 98, priceChange: -22, label: '高风险密度簇' }];

export function DensityHeatmapLtvScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 350,
      paddingLeft: 72,
      paddingRight: 20,
      paddingTop: 24,
      paddingBottom: 52,
    });

    chart.options({
      type: 'view',
      data: {
        type: 'inline',
        value: mortgagePointCloud,
      },
      scale: {
        x: { domain: [20, 120], nice: true },
        y: { domain: [-30, 10], nice: true },
        color: { nice: true },
      },
      axis: {
        x: { title: '按揭 LTV（%）' },
        y: { title: '房价变动（%）' },
      },
      legend: {
        color: {
          title: '核密度强度',
        },
      },
      children: [
        {
          type: 'heatmap',
          data: {
            transform: [
              {
                type: 'custom',
                callback: (data: MortgagePointDatum[]) => {
                  const dv = new DataSet.View().source(data);
                  dv.transform({
                    type: 'kernel-smooth.density',
                    fields: ['ltv', 'priceChange'],
                    method: 'gaussian',
                    as: ['ltv', 'priceChange', 'density'],
                  });
                  return dv.rows;
                },
              },
            ],
          },
          encode: {
            x: 'ltv',
            y: 'priceChange',
            color: 'density',
          },
          style: {
            opacity: 0.82,
            gradient: [
              [0, '#f8fafc'],
              [0.2, '#bfdbfe'],
              [0.45, '#60a5fa'],
              [0.65, '#06b6d4'],
              [0.82, '#f59e0b'],
              [0.95, '#dc2626'],
            ],
          },
          tooltip: {
            title: '核密度估计',
            items: [
              { field: 'ltv', name: 'LTV（%）' },
              { field: 'priceChange', name: '房价变动（%）' },
              { field: 'density', name: '密度值' },
            ],
          },
        },
        {
          type: 'point',
          data: {
            type: 'inline',
            value: mortgagePointCloud,
          },
          encode: {
            x: 'ltv',
            y: 'priceChange',
          },
          style: {
            fill: '#ffffff',
            fillOpacity: 0.18,
            stroke: '#0f172a',
            strokeOpacity: 0.1,
            lineWidth: 0.6,
            r: 1.7,
          },
          tooltip: false,
          legend: false,
        },
        {
          type: 'text',
          data: {
            type: 'inline',
            value: riskHotspotLabel,
          },
          encode: {
            x: 'ltv',
            y: 'priceChange',
            text: 'label',
          },
          style: {
            fill: '#b91c1c',
            fontSize: 10,
            fontWeight: 600,
            dx: 12,
          },
          tooltip: false,
          legend: false,
        },
      ],
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '350px' }} />;
}
