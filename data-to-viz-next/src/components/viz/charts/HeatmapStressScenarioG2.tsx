'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type StressRow = {
  portfolio: string;
  baseline: number;
  adverse: number;
  severe: number;
};

type StressCellDatum = {
  portfolio: string;
  scenario: '基准' | '不利' | '严重';
  lossBp: number;
  lossLabel: string;
  upliftVsBaseline: number;
  upliftLabel: string;
  severityTag: '基准' | '压力上升' | '高压情景';
};

const SCENARIO_ORDER: Array<'基准' | '不利' | '严重'> = ['基准', '不利', '严重'];
const numberFormatter = new Intl.NumberFormat('zh-CN');

// 数据源：docs/deep-research-report.md 中 chart-heatmap 场景（示例数据，单位：损失率 bp）
const stressRows: StressRow[] = [
  { portfolio: '按揭', baseline: 18, adverse: 35, severe: 60 },
  { portfolio: '普惠小微', baseline: 45, adverse: 85, severe: 140 },
  { portfolio: '房地产开发贷', baseline: 70, adverse: 150, severe: 260 },
  { portfolio: '平台类融资', baseline: 30, adverse: 65, severe: 110 },
];

const stressCells: StressCellDatum[] = stressRows.flatMap((row) => {
  const scenarioValues = [
    { scenario: '基准' as const, value: row.baseline },
    { scenario: '不利' as const, value: row.adverse },
    { scenario: '严重' as const, value: row.severe },
  ];

  return scenarioValues.map(({ scenario, value }) => {
    const uplift = value - row.baseline;
    return {
      portfolio: row.portfolio,
      scenario,
      lossBp: value,
      lossLabel: `${numberFormatter.format(value)} bp`,
      upliftVsBaseline: uplift,
      upliftLabel: `${uplift >= 0 ? '+' : ''}${numberFormatter.format(uplift)} bp`,
      severityTag: scenario === '严重' ? '高压情景' : scenario === '不利' ? '压力上升' : '基准',
    };
  });
});

const severeGuideLine = [
  { scenario: '严重', portfolio: '按揭' },
  { scenario: '严重', portfolio: '平台类融资' },
];

const severeGuideLabel = [{ scenario: '严重', portfolio: '按揭', label: '重点关注列' }];

export function HeatmapStressScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 340,
      paddingLeft: 96,
      paddingRight: 28,
      paddingTop: 26,
      paddingBottom: 52,
    });

    chart.options({
      type: 'view',
      data: {
        type: 'inline',
        value: stressCells,
      },
      scale: {
        x: { domain: [...SCENARIO_ORDER] },
        color: {
          domain: [18, 260],
          range: ['#dbeafe', '#facc15', '#dc2626'],
        },
      },
      axis: {
        x: { title: '压力测试情景' },
        y: { title: '资产组合' },
      },
      legend: {
        color: {
          title: '预期损失率（bp）',
        },
      },
      children: [
        {
          type: 'cell',
          encode: {
            x: 'scenario',
            y: 'portfolio',
            color: 'lossBp',
          },
          style: {
            stroke: '#ffffff',
            lineWidth: 1.3,
          },
          labels: [
            {
              text: (d: StressCellDatum) => `${d.lossBp}`,
              fill: '#0f172a',
              fontSize: 11,
              fontWeight: 600,
            },
          ],
          tooltip: {
            title: (d: StressCellDatum) => `${d.portfolio} / ${d.scenario}`,
            items: [
              { field: 'lossLabel', name: '损失率' },
              { field: 'upliftLabel', name: '较基准变化' },
              { field: 'severityTag', name: '情景标签' },
            ],
          },
        },
        {
          type: 'line',
          data: {
            type: 'inline',
            value: severeGuideLine,
          },
          encode: {
            x: 'scenario',
            y: 'portfolio',
          },
          style: {
            stroke: '#f97316',
            lineDash: [6, 4],
            lineWidth: 1.6,
          },
          tooltip: false,
          legend: false,
        },
        {
          type: 'text',
          data: {
            type: 'inline',
            value: severeGuideLabel,
          },
          encode: {
            x: 'scenario',
            y: 'portfolio',
            text: 'label',
          },
          style: {
            fill: '#9a3412',
            fontSize: 10,
            fontWeight: 600,
            dx: 8,
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
