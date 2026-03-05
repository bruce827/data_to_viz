'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type CrossSellRaw = {
  source: string;
  target: string;
  customerCount: number;
  window: string;
  asOf: string;
};

type CrossSellDatum = CrossSellRaw & {
  value: number;
  sourceFamily: '零售个人产品' | '住房与消费融资' | '对公与供应链';
  flowLabel: string;
  sourceShareLabel: string;
};

type ChordDatum = {
  source?: string;
  target?: string;
  value?: number;
  sourceFamily?: CrossSellDatum['sourceFamily'];
  name?: string;
  asOf?: string;
  window?: string;
  flowLabel?: string;
  sourceShareLabel?: string;
};

// 数据源：docs/cate-deep-research-report.md（chart-chord-set）
const scenarioRawData: CrossSellRaw[] = [
  { source: '工资代发', target: '信用卡', customerCount: 42000, window: '2025Q4', asOf: '2025-12-31' },
  { source: '工资代发', target: '理财', customerCount: 31000, window: '2025Q4', asOf: '2025-12-31' },
  { source: '工资代发', target: '消费贷', customerCount: 18000, window: '2025Q4', asOf: '2025-12-31' },
  { source: '信用卡', target: '理财', customerCount: 22000, window: '2025Q4', asOf: '2025-12-31' },
  { source: '信用卡', target: '消费贷', customerCount: 16000, window: '2025Q4', asOf: '2025-12-31' },
  { source: '信用卡', target: '按揭', customerCount: 6000, window: '2025Q4', asOf: '2025-12-31' },
  { source: '按揭', target: '理财', customerCount: 14000, window: '2025Q4', asOf: '2025-12-31' },
  { source: '按揭', target: '信用卡', customerCount: 9000, window: '2025Q4', asOf: '2025-12-31' },
  { source: '理财', target: '信用卡', customerCount: 8000, window: '2025Q4', asOf: '2025-12-31' },
  { source: '企业结算', target: '供应链融资', customerCount: 12000, window: '2025Q4', asOf: '2025-12-31' },
  { source: '企业结算', target: '理财', customerCount: 3000, window: '2025Q4', asOf: '2025-12-31' },
  { source: '供应链融资', target: '企业结算', customerCount: 4500, window: '2025Q4', asOf: '2025-12-31' },
  { source: '供应链融资', target: '理财', customerCount: 2800, window: '2025Q4', asOf: '2025-12-31' },
];

const sourceTotalMap = scenarioRawData.reduce<Record<string, number>>((acc, row) => {
  acc[row.source] = (acc[row.source] || 0) + row.customerCount;
  return acc;
}, {});

function getFamily(product: string): CrossSellDatum['sourceFamily'] {
  if (product === '工资代发' || product === '信用卡' || product === '理财') return '零售个人产品';
  if (product === '按揭' || product === '消费贷') return '住房与消费融资';
  return '对公与供应链';
}

const scenarioData: CrossSellDatum[] = scenarioRawData.map((row) => {
  const sourceTotal = sourceTotalMap[row.source] || 1;
  const sourceShare = row.customerCount / sourceTotal;
  return {
    ...row,
    value: row.customerCount,
    sourceFamily: getFamily(row.source),
    flowLabel: `${row.customerCount.toLocaleString()} 人`,
    sourceShareLabel: `${(sourceShare * 100).toFixed(2)}%`,
  };
});

function familyForNode(name: string): CrossSellDatum['sourceFamily'] {
  return getFamily(name);
}

export function ChordCrossSellScenarioG2() {
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
      paddingBottom: 22,
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
        color: (d: ChordDatum) => d.sourceFamily || familyForNode(d.name || ''),
      },
      scale: {
        color: {
          domain: ['零售个人产品', '住房与消费融资', '对公与供应链'],
          range: ['#2563eb', '#f59e0b', '#0f766e'],
        },
      },
      legend: {
        color: {
          title: '来源产品一级分类',
          position: 'top',
          cols: 3,
          crossPadding: 10,
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
          if (d.source && d.target) return `${d.source} → ${d.target}（${d.window}）`;
          return d.name || '';
        },
        items: [
          { field: 'flowLabel', name: '转化客户数' },
          { field: 'sourceShareLabel', name: '占来源产品流出比例' },
        ],
      },
      interaction: [
        {
          type: 'elementHighlight',
          background: true,
        },
      ],
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '440px' }} />;
}
