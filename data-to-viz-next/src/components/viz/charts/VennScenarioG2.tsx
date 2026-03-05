'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type VennScenarioRaw = {
  segment: string;
  customerCountK: number;
  asOf: string;
};

type VennScenarioDatum = {
  sets: string[];
  size: number;
  segment: string;
  label: string;
  share: number;
  shareLabel: string;
  countLabel: string;
  asOf: string;
};

type VennTransformedDatum = VennScenarioDatum & {
  key?: string;
  path?: string;
};

// 数据源：docs/cate-deep-research-report.md（chart-venn）
const scenarioRawData: VennScenarioRaw[] = [
  { segment: 'Mobile_only', customerCountK: 6800, asOf: '2025-12-31' },
  { segment: 'Web_only', customerCountK: 950, asOf: '2025-12-31' },
  { segment: 'Branch_only', customerCountK: 1200, asOf: '2025-12-31' },
  { segment: 'Mobile&Web', customerCountK: 2100, asOf: '2025-12-31' },
  { segment: 'Mobile&Branch', customerCountK: 1750, asOf: '2025-12-31' },
  { segment: 'Web&Branch', customerCountK: 620, asOf: '2025-12-31' },
  { segment: 'Mobile&Web&Branch', customerCountK: 980, asOf: '2025-12-31' },
];

const totalCustomerCountK = scenarioRawData.reduce((sum, row) => sum + row.customerCountK, 0);

const segmentMap: Record<string, { sets: string[]; label: string }> = {
  Mobile_only: { sets: ['移动银行'], label: '移动独占' },
  Web_only: { sets: ['网银'], label: '网银独占' },
  Branch_only: { sets: ['柜面'], label: '柜面独占' },
  'Mobile&Web': { sets: ['移动银行', '网银'], label: '移动∩网银' },
  'Mobile&Branch': { sets: ['移动银行', '柜面'], label: '移动∩柜面' },
  'Web&Branch': { sets: ['网银', '柜面'], label: '网银∩柜面' },
  'Mobile&Web&Branch': { sets: ['移动银行', '网银', '柜面'], label: '三渠道交集' },
};

const scenarioData: VennScenarioDatum[] = scenarioRawData.map((row) => {
  const mapped = segmentMap[row.segment];
  const share = row.customerCountK / totalCustomerCountK;
  return {
    sets: mapped.sets,
    size: row.customerCountK,
    segment: row.segment,
    label: mapped.label,
    share,
    shareLabel: `${(share * 100).toFixed(2)}%`,
    countLabel: `${row.customerCountK.toLocaleString()} 千人`,
    asOf: row.asOf,
  };
});

function getLabelText(d: VennTransformedDatum) {
  const setCount = d.sets?.length ?? 0;
  if (setCount === 1) return `${d.label}\n${d.shareLabel}`;
  if (setCount === 3) return `${d.label}\n${d.shareLabel}`;
  return '';
}

const labelOffsetMap: Record<string, { dx: number; dy: number }> = {
  Mobile_only: { dx: -16, dy: -10 },
  Web_only: { dx: 16, dy: -10 },
  Branch_only: { dx: 0, dy: 14 },
  'Mobile&Web&Branch': { dx: 0, dy: 0 },
};

export function VennChannelScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 380,
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 36,
      paddingBottom: 16,
    });

    chart
      .path()
      .data({
        type: 'inline',
        value: scenarioData,
        transform: [{ type: 'venn', sets: 'sets', size: 'size', as: ['key', 'path'] }],
      })
      .encode('d', 'path')
      .encode('color', (d: VennTransformedDatum) => (d.sets?.length ?? 0).toString())
      .scale('color', {
        domain: ['1', '2', '3'],
        range: ['#2563eb', '#f59e0b', '#dc2626'],
      })
      .style('fillOpacity', (d: VennTransformedDatum) => {
        const setCount = d.sets?.length ?? 0;
        if (setCount === 1) return 0.32;
        if (setCount === 2) return 0.48;
        return 0.65;
      })
      .style('stroke', '#ffffff')
      .style('lineWidth', 2)
      .label({
        text: (d: VennTransformedDatum) => getLabelText(d),
        position: 'inside',
        fill: (d: VennTransformedDatum) => ((d.sets?.length ?? 0) === 1 ? '#0f172a' : '#ffffff'),
        fontWeight: 700,
        fontSize: 11,
        lineHeight: 13,
        textAlign: 'center',
        textBaseline: 'middle',
        dx: (d: VennTransformedDatum) => labelOffsetMap[d.segment]?.dx ?? 0,
        dy: (d: VennTransformedDatum) => labelOffsetMap[d.segment]?.dy ?? 0,
      })
      .legend('color', {
        title: '交集阶数',
        position: 'top',
        itemLabelFormatter: (value: string) => {
          if (value === '1') return '单渠道';
          if (value === '2') return '双渠道交集';
          return '三渠道交集';
        },
      })
      .tooltip({
        title: (d: VennTransformedDatum) => `${d.label}（${d.asOf}）`,
        items: [
          {
            field: 'sets',
            name: '渠道组合',
            valueFormatter: (value: string[]) => value.join(' ∩ '),
          },
          { field: 'countLabel', name: '活跃客户规模（MAU，月活用户）' },
          { field: 'shareLabel', name: '占比' },
        ],
      })
      .interaction('elementHighlight');

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '380px' }} />;
}
