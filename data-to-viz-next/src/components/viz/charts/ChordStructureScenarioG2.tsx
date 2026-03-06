'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type RegionalFlowRaw = {
  week: string;
  from: string;
  to: string;
  amt_cny_100m: number;
};

type RegionalFlowDatum = {
  week: string;
  source: string;
  target: string;
  value: number;
  sourceCluster: '华南' | '华东' | '华北' | '西部';
  flowLabel: string;
  sourceShareLabel: string;
};

type ChordDatum = {
  source?: string;
  target?: string;
  value?: number;
  sourceCluster?: RegionalFlowDatum['sourceCluster'];
  name?: string;
  week?: string;
  flowLabel?: string;
  sourceShareLabel?: string;
};

// 数据源：docs/catenum-deep-research-report.md（CHRD / chart-structure-network-chord）
const scenarioRawRows: RegionalFlowRaw[] = [
  { week: '2025-W52', from: '广东', to: '上海', amt_cny_100m: 120 },
  { week: '2025-W52', from: '上海', to: '江苏', amt_cny_100m: 85 },
  { week: '2025-W52', from: '北京', to: '广东', amt_cny_100m: 70 },
  { week: '2025-W52', from: '江苏', to: '四川', amt_cny_100m: 45 },
  { week: '2025-W52', from: '四川', to: '上海', amt_cny_100m: 32 },
  { week: '2025-W52', from: '广东', to: '北京', amt_cny_100m: 58 },
];

const sourceTotalMap = scenarioRawRows.reduce<Record<string, number>>((acc, row) => {
  acc[row.from] = (acc[row.from] || 0) + row.amt_cny_100m;
  return acc;
}, {});

function toCluster(region: string): RegionalFlowDatum['sourceCluster'] {
  if (region === '广东') return '华南';
  if (region === '上海' || region === '江苏') return '华东';
  if (region === '北京') return '华北';
  return '西部';
}

const nodeClusterMap: Record<string, RegionalFlowDatum['sourceCluster']> = {
  广东: '华南',
  上海: '华东',
  江苏: '华东',
  北京: '华北',
  四川: '西部',
};

const scenarioData: RegionalFlowDatum[] = scenarioRawRows.map((row) => {
  const sourceTotal = sourceTotalMap[row.from] || 1;
  const share = row.amt_cny_100m / sourceTotal;
  return {
    week: row.week,
    source: row.from,
    target: row.to,
    value: row.amt_cny_100m,
    sourceCluster: toCluster(row.from),
    flowLabel: `${row.amt_cny_100m.toFixed(0)} 亿元`,
    sourceShareLabel: `${(share * 100).toFixed(2)}%`,
  };
});

export function ChordRegionalFlowScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 440,
      paddingLeft: 12,
      paddingRight: 12,
      paddingTop: 56,
      paddingBottom: 18,
    });

    chart.options({
      type: 'chord',
      data: {
        value: scenarioData,
      },
      layout: {
        nodeWidthRatio: 0.08,
      },
      encode: {
        color: (d: ChordDatum) => d.sourceCluster || nodeClusterMap[d.name || ''],
      },
      scale: {
        color: {
          domain: ['华东', '华南', '华北', '西部'],
          range: ['#2563eb', '#16a34a', '#f59e0b', '#ef4444'],
        },
      },
      legend: {
        color: {
          title: '来源区域分组',
          position: 'top',
          cols: 4,
          crossPadding: 8,
        },
      },
      style: {
        labelFontSize: 12,
        labelFontWeight: 700,
        labelFill: '#0f172a',
        linkFillOpacity: 0.6,
        nodeStroke: '#ffffff',
        nodeStrokeWidth: 1,
      },
      tooltip: {
        title: (d: ChordDatum) => {
          if (d.source && d.target) return `${d.source} → ${d.target}（${d.week}）`;
          return d.name || '';
        },
        items: [
          { field: 'flowLabel', name: '流量金额' },
          { field: 'sourceShareLabel', name: '占来源区域流出比例' },
        ],
      },
      interaction: [{ type: 'elementHighlight', background: true }],
    });

    chart.render();
    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '440px' }} />;
}
