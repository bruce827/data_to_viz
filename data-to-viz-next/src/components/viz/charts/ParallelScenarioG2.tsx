'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type RiskTag = '高风险组合' | '关注组合' | '稳健组合';

type SmeRiskRow = {
  custId: string;
  segment: string;
  pd: number;
  lgd: number;
  eadWan: number;
  ltv: number;
  dscr: number;
  raroc: number;
  asOf: string;
};

type SmeRiskDatum = SmeRiskRow & {
  riskTag: RiskTag;
  pdLabel: string;
  lgdLabel: string;
  eadLabel: string;
  ltvLabel: string;
  dscrLabel: string;
  rarocLabel: string;
};

type MetricKey = 'pd' | 'lgd' | 'eadWan' | 'ltv' | 'dscr' | 'raroc';

const AXIS_METRICS: MetricKey[] = ['pd', 'lgd', 'eadWan', 'ltv', 'dscr', 'raroc'];

const AXIS_LABEL_MAP: Record<MetricKey, string> = {
  pd: 'PD（违约概率）',
  lgd: 'LGD（违约损失率）',
  eadWan: 'EAD（风险暴露，万元）',
  ltv: 'LTV（贷款价值比）',
  dscr: 'DSCR（债务偿付覆盖倍数）',
  raroc: 'RAROC（风险调整后资本回报率）',
};

// 数据源：docs/cate-deep-research-report.md（chart-parallel）
const scenarioRawData: SmeRiskRow[] = [
  { custId: 'SME001', segment: '小微制造', pd: 0.0387, lgd: 0.355, eadWan: 3875, ltv: 0.833, dscr: 0.67, raroc: 0.058, asOf: '2025-12-31' },
  { custId: 'SME002', segment: '小微餐饮', pd: 0.0365, lgd: 0.442, eadWan: 3185, ltv: 0.618, dscr: 1.66, raroc: 0.141, asOf: '2025-12-31' },
  { custId: 'SME003', segment: '小微外贸', pd: 0.0356, lgd: 0.544, eadWan: 3506, ltv: 0.764, dscr: 1.44, raroc: 0.122, asOf: '2025-12-31' },
  { custId: 'SME004', segment: '小微物流', pd: 0.0299, lgd: 0.55, eadWan: 3975, ltv: 0.785, dscr: 1.06, raroc: 0.105, asOf: '2025-12-31' },
  { custId: 'SME005', segment: '小微电商', pd: 0.0471, lgd: 0.458, eadWan: 3832, ltv: 0.848, dscr: 1.13, raroc: 0.1, asOf: '2025-12-31' },
  { custId: 'SME006', segment: '小微建材', pd: 0.0351, lgd: 0.589, eadWan: 3369, ltv: 0.818, dscr: 1.22, raroc: 0.086, asOf: '2025-12-31' },
  { custId: 'SME007', segment: '小微医疗', pd: 0.0286, lgd: 0.489, eadWan: 2153, ltv: 0.537, dscr: 1.58, raroc: 0.132, asOf: '2025-12-31' },
  { custId: 'SME008', segment: '小微教育', pd: 0.0309, lgd: 0.46, eadWan: 3202, ltv: 0.631, dscr: 1.62, raroc: 0.131, asOf: '2025-12-31' },
  { custId: 'SME009', segment: '小微农企', pd: 0.0328, lgd: 0.561, eadWan: 3667, ltv: 0.773, dscr: 1.1, raroc: 0.095, asOf: '2025-12-31' },
  { custId: 'SME010', segment: '小微零售', pd: 0.0436, lgd: 0.487, eadWan: 3500, ltv: 0.82, dscr: 0.96, raroc: 0.081, asOf: '2025-12-31' },
  { custId: 'SME011', segment: '小微软件', pd: 0.0195, lgd: 0.42, eadWan: 2804, ltv: 0.49, dscr: 1.88, raroc: 0.162, asOf: '2025-12-31' },
  { custId: 'SME012', segment: '小微家政', pd: 0.0507, lgd: 0.602, eadWan: 4022, ltv: 0.924, dscr: 0.83, raroc: 0.042, asOf: '2025-12-31' },
];

function toRiskTag(row: SmeRiskRow): RiskTag {
  if ((row.pd >= 0.045 && row.dscr < 1.0) || row.raroc < 0.06 || row.ltv > 0.9) return '高风险组合';
  if (row.pd >= 0.034 || row.lgd >= 0.54 || row.dscr < 1.2) return '关注组合';
  return '稳健组合';
}

const scenarioData: SmeRiskDatum[] = scenarioRawData.map((row) => ({
  ...row,
  riskTag: toRiskTag(row),
  pdLabel: `${(row.pd * 100).toFixed(2)}%`,
  lgdLabel: `${(row.lgd * 100).toFixed(1)}%`,
  eadLabel: `${row.eadWan.toLocaleString()} 万元`,
  ltvLabel: `${(row.ltv * 100).toFixed(1)}%`,
  dscrLabel: `${row.dscr.toFixed(2)}x`,
  rarocLabel: `${(row.raroc * 100).toFixed(2)}%`,
}));

const RISK_COLORS: Record<RiskTag, string> = {
  高风险组合: '#ef4444',
  关注组合: '#f59e0b',
  稳健组合: '#2563eb',
};

export function ParallelRiskScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 390,
      paddingLeft: 32,
      paddingRight: 24,
      paddingTop: 46,
      paddingBottom: 36,
    });

    chart.options({
      type: 'line',
      data: {
        type: 'inline',
        value: scenarioData,
      },
      coordinate: { type: 'parallel' },
      encode: {
        position: AXIS_METRICS,
        color: 'riskTag',
      },
      scale: {
        color: {
          domain: ['高风险组合', '关注组合', '稳健组合'],
          range: ['#ef4444', '#f59e0b', '#2563eb'],
        },
      },
      axis: {
        position: {
          title: false,
          labelFontSize: 11,
          labelFill: '#0f172a',
          labelFontWeight: 700,
          labelFormatter: (value: string | number) => {
            if (typeof value !== 'string') return String(value);
            return AXIS_LABEL_MAP[value as MetricKey] || value;
          },
        },
      },
      legend: {
        color: {
          title: '客群风险分层',
          position: 'top',
          offsetY: -10,
        },
      },
      style: {
        stroke: (d: SmeRiskDatum) => RISK_COLORS[d.riskTag],
        lineWidth: (d: SmeRiskDatum) => (d.riskTag === '高风险组合' ? 2.6 : 1.9),
        strokeOpacity: (d: SmeRiskDatum) => (d.riskTag === '高风险组合' ? 0.95 : 0.55),
      },
      tooltip: false,
      interaction: [],
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '390px' }} />;
}
