'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type SankeyRawRow = {
  quarter: string;
  source: string;
  target: string;
  flow_cny_100m: number;
};

type SankeyDatum = {
  quarter: string;
  source: string;
  target: string;
  value: number;
  stage: string;
  flowLabel: string;
  sourceShareLabel: string;
};

// 数据源：docs/catenum-deep-research-report.md（SANK / chart-structure-flow-sankey）
const scenarioRawRows: SankeyRawRow[] = [
  { quarter: '2025Q3', source: '正常', target: '关注', flow_cny_100m: 240 },
  { quarter: '2025Q3', source: '关注', target: '不良', flow_cny_100m: 110 },
  { quarter: '2025Q3', source: '不良', target: '核销', flow_cny_100m: 65 },
  { quarter: '2025Q3', source: '不良', target: '现金清收', flow_cny_100m: 28 },
  { quarter: '2025Q3', source: '关注', target: '重组/展期', flow_cny_100m: 54 },
  { quarter: '2025Q3', source: '重组/展期', target: '不良', flow_cny_100m: 22 },
];

const sourceTotalMap = scenarioRawRows.reduce<Record<string, number>>((acc, row) => {
  acc[row.source] = (acc[row.source] || 0) + row.flow_cny_100m;
  return acc;
}, {});

const scenarioData: SankeyDatum[] = scenarioRawRows.map((row) => {
  const sourceTotal = sourceTotalMap[row.source] || 1;
  const share = row.flow_cny_100m / sourceTotal;
  return {
    quarter: row.quarter,
    source: row.source,
    target: row.target,
    value: row.flow_cny_100m,
    stage: row.source,
    flowLabel: `${row.flow_cny_100m.toFixed(0)} 亿元`,
    sourceShareLabel: `${(share * 100).toFixed(2)}%`,
  };
});

export function SankeyStructureMigrationScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 430,
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 50,
      paddingBottom: 14,
    });

    chart.options({
      type: 'sankey',
      data: {
        value: { links: scenarioData },
      },
      layout: {
        nodeAlign: 'justify',
        nodePadding: 0.06,
      },
      encode: {
        color: 'stage',
      },
      scale: {
        color: {
          domain: ['正常', '关注', '不良', '重组/展期'],
          range: ['#2563eb', '#f59e0b', '#ef4444', '#8b5cf6'],
        },
      },
      legend: {
        color: {
          title: '来源状态',
          position: 'top',
        },
      },
      style: {
        nodeStroke: '#ffffff',
        nodeStrokeWidth: 1,
        labelFontSize: 11,
        labelFontWeight: 700,
        labelFill: '#0f172a',
        labelSpacing: 5,
        linkFillOpacity: 0.45,
      },
      tooltip: {
        title: (d: SankeyDatum) => `${d.source} → ${d.target}（${d.quarter}）`,
        items: [
          { field: 'flowLabel', name: '迁徙金额' },
          { field: 'sourceShareLabel', name: '占来源状态迁徙比例' },
        ],
      },
    });

    chart.render();
    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '430px' }} />;
}
