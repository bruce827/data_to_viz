'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type StageQuarterRow = {
  quarter: string;
  stage1: number;
  stage2: number;
  stage3: number;
  total: number;
};

type StageKey = 'stage1' | 'stage2' | 'stage3';

type StageStackedDatum = {
  quarter: string;
  stage: string;
  amount: number;
  amountLabel: string;
  total: number;
  totalLabel: string;
  share: number;
  shareLabel: string;
};

type Stage2ShareDatum = {
  quarter: string;
  stage2Share: number;
  stage2ShareLabel: string;
  stage2AmountLabel: string;
};

const amountFormatter = new Intl.NumberFormat('zh-CN');

const STAGE_ORDER: StageKey[] = ['stage1', 'stage2', 'stage3'];
const STAGE_LABEL: Record<StageKey, string> = {
  stage1: 'Stage 1（正常）',
  stage2: 'Stage 2（显著风险上升）',
  stage3: 'Stage 3（信用减值）',
};
const STAGE_COLORS: Record<StageKey, string> = {
  stage1: '#3b82f6',
  stage2: '#f59e0b',
  stage3: '#ef4444',
};

// 数据源：docs/deep-research-report.md 中 chart-stacked-area 场景（示例数据，单位：亿元）
const reportRows: StageQuarterRow[] = [
  { quarter: '2024Q2', stage1: 18500, stage2: 1600, stage3: 420, total: 20520 },
  { quarter: '2024Q3', stage1: 18200, stage2: 1950, stage3: 430, total: 20580 },
  { quarter: '2024Q4', stage1: 17900, stage2: 2350, stage3: 410, total: 20660 },
  { quarter: '2025Q1', stage1: 17600, stage2: 2700, stage3: 450, total: 20750 },
  { quarter: '2025Q2', stage1: 17350, stage2: 2980, stage3: 470, total: 20800 },
];

const stackedData: StageStackedDatum[] = reportRows.flatMap((row) =>
  STAGE_ORDER.map((stageKey) => {
    const amount = row[stageKey];
    const share = (amount / row.total) * 100;
    return {
      quarter: row.quarter,
      stage: STAGE_LABEL[stageKey],
      amount,
      amountLabel: amountFormatter.format(amount),
      total: row.total,
      totalLabel: amountFormatter.format(row.total),
      share: Number(share.toFixed(1)),
      shareLabel: `${share.toFixed(1)}%`,
    };
  }),
);

const stage2ShareData: Stage2ShareDatum[] = reportRows.map((row) => {
  const share = (row.stage2 / row.total) * 100;
  return {
    quarter: row.quarter,
    stage2Share: Number(share.toFixed(1)),
    stage2ShareLabel: `${share.toFixed(1)}%`,
    stage2AmountLabel: amountFormatter.format(row.stage2),
  };
});

const overlayNote = [
  {
    quarter: '2024Q2',
    stage2Share: 18,
    label: 'Stage 2 占比趋势',
  },
];

export function StackedAreaSevScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 360,
      paddingLeft: 74,
      paddingRight: 28,
      paddingTop: 30,
      paddingBottom: 56,
    });

    chart.options({
      type: 'view',
      scale: {
        y: { domain: [0, 100], nice: false },
        color: {
          domain: STAGE_ORDER.map((key) => STAGE_LABEL[key]),
          range: STAGE_ORDER.map((key) => STAGE_COLORS[key]),
        },
      },
      axis: {
        x: { title: '季度' },
        y: {
          title: '阶段占比（%）',
          labelFormatter: (value: string) => `${Number(value).toFixed(0)}%`,
        },
      },
      legend: {
        color: {
          title: 'IFRS 9 分阶段',
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
            y: 'share',
            color: 'stage',
            shape: 'smooth',
          },
          style: {
            fillOpacity: 0.8,
          },
          tooltip: {
            title: (d: StageStackedDatum) => d.quarter,
            items: [
              { field: 'stage', name: '阶段' },
              { field: 'amountLabel', name: 'EAD（亿元）' },
              { field: 'shareLabel', name: '阶段占比' },
              { field: 'totalLabel', name: '总 EAD（亿元）' },
            ],
          },
        },
        {
          type: 'line',
          data: {
            type: 'inline',
            value: stage2ShareData,
          },
          encode: {
            x: 'quarter',
            y: 'stage2Share',
            shape: 'smooth',
          },
          style: {
            stroke: '#0f172a',
            lineWidth: 2,
            lineDash: [6, 4],
          },
          tooltip: {
            title: (d: Stage2ShareDatum) => `${d.quarter} Stage 2`,
            items: [
              { field: 'stage2ShareLabel', name: 'Stage 2 占比' },
              { field: 'stage2AmountLabel', name: 'Stage 2 EAD（亿元）' },
            ],
          },
          legend: false,
        },
        {
          type: 'point',
          data: {
            type: 'inline',
            value: stage2ShareData,
          },
          encode: {
            x: 'quarter',
            y: 'stage2Share',
          },
          style: {
            fill: '#0f172a',
            stroke: '#ffffff',
            lineWidth: 1.2,
            r: 3.6,
          },
          labels: [
            {
              text: (d: Stage2ShareDatum) => d.stage2ShareLabel,
              dy: -12,
              fill: '#334155',
              fontSize: 10,
              fontWeight: 600,
            },
          ],
          tooltip: false,
          legend: false,
        },
        {
          type: 'text',
          data: {
            type: 'inline',
            value: overlayNote,
          },
          encode: {
            x: 'quarter',
            y: 'stage2Share',
            text: 'label',
          },
          style: {
            fill: '#334155',
            fontSize: 10,
            fontWeight: 600,
            dx: 6,
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

  return <div ref={containerRef} style={{ width: '100%', height: '360px' }} />;
}
