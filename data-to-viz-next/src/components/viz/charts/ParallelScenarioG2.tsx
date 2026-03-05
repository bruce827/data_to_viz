'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type ProfileTag = '风险收益失配' | '高风险但缓释较强' | '相对稳健';

type ParallelRiskDatum = {
  customer: string;
  pd: number;
  lgd: number;
  ead: number;
  raroc: number;
  guaranteeCoverage: number;
  esgScore: number;
  profileTag: ProfileTag;
  pdPressure: number;
  lgdPressure: number;
  eadPressure: number;
  rarocPressure: number;
  guaranteePressure: number;
  esgPressure: number;
  pdLabel: string;
  lgdLabel: string;
  eadLabel: string;
  rarocLabel: string;
  guaranteeLabel: string;
  esgLabel: string;
  profileNote: string;
};

type BaseRow = Omit<
  ParallelRiskDatum,
  | 'pdPressure'
  | 'lgdPressure'
  | 'eadPressure'
  | 'rarocPressure'
  | 'guaranteePressure'
  | 'esgPressure'
  | 'pdLabel'
  | 'lgdLabel'
  | 'eadLabel'
  | 'rarocLabel'
  | 'guaranteeLabel'
  | 'esgLabel'
>;

const baseRows: BaseRow[] = [
  { customer: 'P01', pd: 1.6, lgd: 35, ead: 90, raroc: 10.2, guaranteeCoverage: 80, esgScore: 82, profileTag: '相对稳健', profileNote: '风险收益整体匹配' },
  { customer: 'P02', pd: 3.9, lgd: 60, ead: 70, raroc: 6.1, guaranteeCoverage: 40, esgScore: 55, profileTag: '风险收益失配', profileNote: '高PD+高LGD且收益偏低' },
  { customer: 'P03', pd: 2.8, lgd: 70, ead: 60, raroc: 7.0, guaranteeCoverage: 55, esgScore: 49, profileTag: '风险收益失配', profileNote: '高LGD+低ESG，转型压力突出' },
  { customer: 'P04', pd: 1.2, lgd: 30, ead: 120, raroc: 8.8, guaranteeCoverage: 90, esgScore: 76, profileTag: '相对稳健', profileNote: '敞口大但缓释充足' },
  { customer: 'P05', pd: 4.2, lgd: 65, ead: 40, raroc: 9.5, guaranteeCoverage: 95, esgScore: 58, profileTag: '高风险但缓释较强', profileNote: '高风险由担保覆盖部分对冲' },
  { customer: 'P06', pd: 2.0, lgd: 45, ead: 85, raroc: 6.5, guaranteeCoverage: 60, esgScore: 88, profileTag: '相对稳健', profileNote: 'ESG表现较好但收益偏弱' },
];

const PRESSURE_AXES = [
  'pdPressure',
  'lgdPressure',
  'eadPressure',
  'rarocPressure',
  'guaranteePressure',
  'esgPressure',
] as const;

const AXIS_LABEL_MAP: Record<(typeof PRESSURE_AXES)[number], string> = {
  pdPressure: 'PD（违约概率）压力',
  lgdPressure: 'LGD（违约损失率）压力',
  eadPressure: 'EAD（违约风险暴露）集中度',
  rarocPressure: 'RAROC（风险调整后资本收益）不足压力',
  guaranteePressure: '担保不足压力',
  esgPressure: 'ESG（环境/社会/治理）转型压力',
};

function normalize(value: number, min: number, max: number) {
  if (max === min) return 0.5;
  return (value - min) / (max - min);
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function toFixed2(value: number) {
  return Number(value.toFixed(2));
}

function extent(values: number[]) {
  return {
    min: Math.min(...values),
    max: Math.max(...values),
  };
}

const pdExtent = extent(baseRows.map((row) => row.pd));
const lgdExtent = extent(baseRows.map((row) => row.lgd));
const eadExtent = extent(baseRows.map((row) => row.ead));
const rarocExtent = extent(baseRows.map((row) => row.raroc));
const guaranteeExtent = extent(baseRows.map((row) => row.guaranteeCoverage));
const esgExtent = extent(baseRows.map((row) => row.esgScore));

const scenarioData: ParallelRiskDatum[] = baseRows.map((row) => {
  const pdPressure = clamp01(normalize(row.pd, pdExtent.min, pdExtent.max));
  const lgdPressure = clamp01(normalize(row.lgd, lgdExtent.min, lgdExtent.max));
  const eadPressure = clamp01(normalize(row.ead, eadExtent.min, eadExtent.max));
  const rarocPressure = clamp01(1 - normalize(row.raroc, rarocExtent.min, rarocExtent.max));
  const guaranteePressure = clamp01(
    1 - normalize(row.guaranteeCoverage, guaranteeExtent.min, guaranteeExtent.max),
  );
  const esgPressure = clamp01(1 - normalize(row.esgScore, esgExtent.min, esgExtent.max));

  return {
    ...row,
    pdPressure: toFixed2(pdPressure),
    lgdPressure: toFixed2(lgdPressure),
    eadPressure: toFixed2(eadPressure),
    rarocPressure: toFixed2(rarocPressure),
    guaranteePressure: toFixed2(guaranteePressure),
    esgPressure: toFixed2(esgPressure),
    pdLabel: `${row.pd.toFixed(1)}%`,
    lgdLabel: `${row.lgd.toFixed(0)}%`,
    eadLabel: `${row.ead}`,
    rarocLabel: `${row.raroc.toFixed(1)}%`,
    guaranteeLabel: `${row.guaranteeCoverage.toFixed(0)}%`,
    esgLabel: `${row.esgScore.toFixed(0)}`,
  };
});

const PROFILE_COLORS: Record<ProfileTag, string> = {
  风险收益失配: '#ef4444',
  高风险但缓释较强: '#f59e0b',
  相对稳健: '#3b82f6',
};

export function ParallelRiskScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 360,
      paddingLeft: 34,
      paddingRight: 24,
      paddingTop: 46,
      paddingBottom: 34,
    });

    chart.options({
      type: 'line',
      data: {
        type: 'inline',
        value: scenarioData,
      },
      coordinate: { type: 'parallel' },
      encode: {
        position: [...PRESSURE_AXES],
        color: 'profileTag',
      },
      scale: {
        color: {
          domain: ['风险收益失配', '高风险但缓释较强', '相对稳健'],
          range: ['#ef4444', '#f59e0b', '#3b82f6'],
        },
      },
      axis: {
        position: {
          title: false,
          labelFormatter: (value: string | number) => {
            if (typeof value !== 'string') return String(value);
            return AXIS_LABEL_MAP[value as (typeof PRESSURE_AXES)[number]] ?? value;
          },
        },
      },
      legend: {
        color: {
          title: '客户分层',
          position: 'top',
          offsetY: -14,
        },
      },
      style: {
        stroke: (d: ParallelRiskDatum) => PROFILE_COLORS[d.profileTag],
        lineWidth: (d: ParallelRiskDatum) => (d.profileTag === '风险收益失配' ? 2.8 : 2),
        strokeOpacity: (d: ParallelRiskDatum) => (d.profileTag === '风险收益失配' ? 0.98 : 0.7),
      },
      tooltip: {
        title: (d: ParallelRiskDatum) => `客户 ${d.customer}`,
        items: [
          { field: 'profileTag', name: '客户分层' },
          { field: 'pdLabel', name: 'PD（违约概率）' },
          { field: 'lgdLabel', name: 'LGD（违约损失率）' },
          { field: 'eadLabel', name: 'EAD（违约风险暴露，亿）' },
          { field: 'rarocLabel', name: 'RAROC（风险调整后资本收益）' },
          { field: 'guaranteeLabel', name: '担保覆盖率' },
          { field: 'esgLabel', name: 'ESG分（环境/社会/治理）' },
          { field: 'profileNote', name: '备注' },
        ],
      },
      interaction: [{ type: 'elementHighlight', background: true }],
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '360px' }} />;
}
