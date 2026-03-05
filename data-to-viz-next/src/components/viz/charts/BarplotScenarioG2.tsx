'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type RegionRiskRaw = {
  region: string;
  asOf: string;
  loanBalanceYi: number;
  nplRatio: number;
  stage2Ratio: number;
  provisionCoverage: number;
};

type RiskBand = '高风险区' | '关注区' | '稳健区';

type RegionRiskDatum = RegionRiskRaw & {
  riskBand: RiskBand;
  nplLabel: string;
  stage2Label: string;
  provisionLabel: string;
  balanceLabel: string;
};

const scenarioRawData: RegionRiskRaw[] = [
  { region: '京津冀', asOf: '2025-12-31', loanBalanceYi: 5200, nplRatio: 0.0132, stage2Ratio: 0.02, provisionCoverage: 2.25 },
  { region: '长三角', asOf: '2025-12-31', loanBalanceYi: 8600, nplRatio: 0.0121, stage2Ratio: 0.018, provisionCoverage: 2.35 },
  { region: '珠三角', asOf: '2025-12-31', loanBalanceYi: 7400, nplRatio: 0.0128, stage2Ratio: 0.019, provisionCoverage: 2.28 },
  { region: '成渝', asOf: '2025-12-31', loanBalanceYi: 4100, nplRatio: 0.0156, stage2Ratio: 0.024, provisionCoverage: 2.05 },
  { region: '中部', asOf: '2025-12-31', loanBalanceYi: 6800, nplRatio: 0.0164, stage2Ratio: 0.026, provisionCoverage: 2.0 },
  { region: '山东半岛', asOf: '2025-12-31', loanBalanceYi: 3600, nplRatio: 0.0148, stage2Ratio: 0.023, provisionCoverage: 2.1 },
  { region: '海峡西岸', asOf: '2025-12-31', loanBalanceYi: 2900, nplRatio: 0.0151, stage2Ratio: 0.022, provisionCoverage: 2.08 },
  { region: '东北', asOf: '2025-12-31', loanBalanceYi: 2400, nplRatio: 0.0195, stage2Ratio: 0.031, provisionCoverage: 1.85 },
  { region: '西北', asOf: '2025-12-31', loanBalanceYi: 2600, nplRatio: 0.0182, stage2Ratio: 0.03, provisionCoverage: 1.9 },
  { region: '海南', asOf: '2025-12-31', loanBalanceYi: 900, nplRatio: 0.0176, stage2Ratio: 0.028, provisionCoverage: 1.95 },
];

function toRiskBand(nplRatio: number): RiskBand {
  if (nplRatio >= 0.018) return '高风险区';
  if (nplRatio >= 0.015) return '关注区';
  return '稳健区';
}

const scenarioData: RegionRiskDatum[] = [...scenarioRawData]
  .map((row) => ({
    ...row,
    riskBand: toRiskBand(row.nplRatio),
    nplLabel: `${(row.nplRatio * 100).toFixed(2)}%`,
    stage2Label: `${(row.stage2Ratio * 100).toFixed(2)}%`,
    provisionLabel: `${(row.provisionCoverage * 100).toFixed(1)}%`,
    balanceLabel: `${row.loanBalanceYi.toLocaleString()} 亿元`,
  }))
  .sort((a, b) => b.nplRatio - a.nplRatio);

export function BarplotRegionRiskScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 360,
      paddingLeft: 94,
      paddingRight: 28,
      paddingTop: 36,
      paddingBottom: 40,
    });

    chart.options({
      type: 'interval',
      data: { type: 'inline', value: scenarioData },
      encode: {
        x: 'region',
        y: 'nplRatio',
        color: 'riskBand',
      },
      coordinate: {
        transform: [{ type: 'transpose' }],
      },
      scale: {
        y: { nice: true, domain: [0, 0.022] },
        color: {
          domain: ['高风险区', '关注区', '稳健区'],
          range: ['#dc2626', '#f59e0b', '#2563eb'],
        },
      },
      axis: {
        x: { title: '区域' },
        y: {
          title: 'NPL（不良贷款率）',
          labelFormatter: (v: string | number) => `${(Number(v) * 100).toFixed(1)}%`,
        },
      },
      legend: {
        color: {
          title: '风险分层',
          position: 'top',
          offsetY: -8,
        },
      },
      tooltip: {
        title: (d: RegionRiskDatum) => `${d.region}（${d.asOf}）`,
        items: [
          { field: 'nplLabel', name: 'NPL（不良贷款率）' },
          { field: 'stage2Label', name: 'Stage 2（阶段二贷款）占比' },
          { field: 'provisionLabel', name: '拨备覆盖率' },
          { field: 'balanceLabel', name: '贷款余额' },
          { field: 'riskBand', name: '风险分层' },
        ],
      },
      style: {
        radiusTopRight: 4,
        radiusBottomRight: 4,
        fillOpacity: 0.92,
      },
      interaction: [{ type: 'elementHighlight', background: true }],
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '360px' }} />;
}
