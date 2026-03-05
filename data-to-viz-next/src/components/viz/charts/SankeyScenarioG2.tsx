'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type StageFlowRaw = {
  source: string;
  target: string;
  loanBalanceYi: number;
  asOf: string;
};

type StageFlowDatum = {
  source: string;
  target: string;
  value: number;
  asOf: string;
  sourceStage: 'Stage1' | 'Stage2' | 'Stage3';
  sourceLabel: string;
  targetLabel: string;
  flowLabel: string;
  sourceShareLabel: string;
};

// 数据源：docs/cate-deep-research-report.md（chart-sankey-set）
const scenarioRawData: StageFlowRaw[] = [
  { source: 'Stage1_2025Q3', target: 'Stage1_2025Q4', loanBalanceYi: 18200, asOf: '2025-12-31' },
  { source: 'Stage1_2025Q3', target: 'Stage2_2025Q4', loanBalanceYi: 950, asOf: '2025-12-31' },
  { source: 'Stage1_2025Q3', target: 'Stage3_2025Q4', loanBalanceYi: 120, asOf: '2025-12-31' },
  { source: 'Stage2_2025Q3', target: 'Stage1_2025Q4', loanBalanceYi: 610, asOf: '2025-12-31' },
  { source: 'Stage2_2025Q3', target: 'Stage2_2025Q4', loanBalanceYi: 2980, asOf: '2025-12-31' },
  { source: 'Stage2_2025Q3', target: 'Stage3_2025Q4', loanBalanceYi: 310, asOf: '2025-12-31' },
  { source: 'Stage3_2025Q3', target: 'Stage3_2025Q4', loanBalanceYi: 780, asOf: '2025-12-31' },
  { source: 'Stage3_2025Q3', target: 'WriteOff_2025Q4', loanBalanceYi: 260, asOf: '2025-12-31' },
  { source: 'Stage3_2025Q3', target: 'Stage2_2025Q4', loanBalanceYi: 90, asOf: '2025-12-31' },
];

const nodeLabelMap: Record<string, string> = {
  Stage1_2025Q3: 'Stage1（第一阶段）-2025Q3',
  Stage2_2025Q3: 'Stage2（第二阶段）-2025Q3',
  Stage3_2025Q3: 'Stage3（第三阶段）-2025Q3',
  Stage1_2025Q4: 'Stage1（第一阶段）-2025Q4',
  Stage2_2025Q4: 'Stage2（第二阶段）-2025Q4',
  Stage3_2025Q4: 'Stage3（第三阶段）-2025Q4',
  WriteOff_2025Q4: 'WriteOff（核销）-2025Q4',
};

function toSourceStage(source: string): StageFlowDatum['sourceStage'] {
  if (source.startsWith('Stage1')) return 'Stage1';
  if (source.startsWith('Stage2')) return 'Stage2';
  return 'Stage3';
}

const sourceTotalMap = scenarioRawData.reduce<Record<string, number>>((acc, row) => {
  acc[row.source] = (acc[row.source] || 0) + row.loanBalanceYi;
  return acc;
}, {});

const scenarioData: StageFlowDatum[] = scenarioRawData.map((row) => {
  const sourceTotal = sourceTotalMap[row.source] || 1;
  const sourceShare = row.loanBalanceYi / sourceTotal;
  return {
    source: row.source,
    target: row.target,
    value: row.loanBalanceYi,
    asOf: row.asOf,
    sourceStage: toSourceStage(row.source),
    sourceLabel: nodeLabelMap[row.source] || row.source,
    targetLabel: nodeLabelMap[row.target] || row.target,
    flowLabel: `${row.loanBalanceYi.toLocaleString()} 亿元`,
    sourceShareLabel: `${(sourceShare * 100).toFixed(2)}%`,
  };
});

export function SankeyStageMigrationScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 420,
      paddingLeft: 12,
      paddingRight: 12,
      paddingTop: 44,
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
        color: 'sourceStage',
      },
      scale: {
        color: {
          domain: ['Stage1', 'Stage2', 'Stage3'],
          range: ['#2563eb', '#f59e0b', '#ef4444'],
        },
      },
      legend: {
        color: {
          title: '来源阶段',
          position: 'top',
          itemLabelFormatter: (value: string) => {
            if (value === 'Stage1') return 'Stage1（第一阶段）';
            if (value === 'Stage2') return 'Stage2（第二阶段）';
            return 'Stage3（第三阶段）';
          },
        },
      },
      style: {
        nodeStroke: '#ffffff',
        nodeStrokeWidth: 1,
        labelSpacing: 4,
        labelFontSize: 11,
        labelFontWeight: 700,
        labelFill: '#0f172a',
        linkFillOpacity: 0.45,
      },
      tooltip: {
        title: (d: StageFlowDatum) => `${d.sourceLabel} → ${d.targetLabel}（${d.asOf}）`,
        items: [
          { field: 'flowLabel', name: '迁徙金额' },
          { field: 'sourceShareLabel', name: '占来源阶段迁徙比例' },
        ],
      },
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '420px' }} />;
}
