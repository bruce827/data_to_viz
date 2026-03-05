'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type LoanNodeRaw = {
  id: string;
  parent: string | null;
  valueYi: number;
  asOf: string;
};

type LoanHierarchyNode = {
  id: string;
  name: string;
  valueYi: number;
  asOf: string;
  shareOfRoot: number;
  children?: LoanHierarchyNode[];
};

type PackDatum = {
  depth?: number;
  r?: number;
  data?: LoanHierarchyNode;
  parent?: PackDatum | null;
};

// 数据源：docs/cate-deep-research-report.md（chart-circular-packing）
const scenarioRows: LoanNodeRaw[] = [
  { id: 'loan_book', parent: null, valueYi: 30000, asOf: '2025-12-31' },
  { id: 'retail', parent: 'loan_book', valueYi: 11200, asOf: '2025-12-31' },
  { id: 'corporate', parent: 'loan_book', valueYi: 14000, asOf: '2025-12-31' },
  { id: 'inclusive', parent: 'loan_book', valueYi: 3800, asOf: '2025-12-31' },
  { id: 'treasury', parent: 'loan_book', valueYi: 1000, asOf: '2025-12-31' },
  { id: 'mortgage', parent: 'retail', valueYi: 6200, asOf: '2025-12-31' },
  { id: 'consumer_loan', parent: 'retail', valueYi: 3200, asOf: '2025-12-31' },
  { id: 'credit_card', parent: 'retail', valueYi: 1800, asOf: '2025-12-31' },
  { id: 'manufacturing', parent: 'corporate', valueYi: 4200, asOf: '2025-12-31' },
  { id: 'infrastructure', parent: 'corporate', valueYi: 3600, asOf: '2025-12-31' },
  { id: 'real_estate', parent: 'corporate', valueYi: 2100, asOf: '2025-12-31' },
  { id: 'trade', parent: 'corporate', valueYi: 1800, asOf: '2025-12-31' },
  { id: 'tech', parent: 'corporate', valueYi: 2300, asOf: '2025-12-31' },
  { id: 'micro_business', parent: 'inclusive', valueYi: 2400, asOf: '2025-12-31' },
  { id: 'agri', parent: 'inclusive', valueYi: 900, asOf: '2025-12-31' },
  { id: 'inclusive_personal', parent: 'inclusive', valueYi: 500, asOf: '2025-12-31' },
  { id: 'bond_investment', parent: 'treasury', valueYi: 650, asOf: '2025-12-31' },
  { id: 'interbank_assets', parent: 'treasury', valueYi: 350, asOf: '2025-12-31' },
];

const nameMap: Record<string, string> = {
  loan_book: '贷款总盘',
  retail: '零售贷款',
  corporate: '对公贷款',
  inclusive: '普惠贷款',
  treasury: '资金业务',
  mortgage: '按揭贷款',
  consumer_loan: '消费贷',
  credit_card: '信用卡',
  manufacturing: '制造业',
  infrastructure: '基建',
  real_estate: '房地产',
  trade: '商贸流通',
  tech: '科技',
  micro_business: '小微经营贷',
  agri: '涉农贷款',
  inclusive_personal: '普惠个人',
  bond_investment: '债券投资',
  interbank_assets: '同业资产',
};

const topGroupPalette: Record<string, string[]> = {
  retail: ['#1d4ed8', '#3b82f6', '#93c5fd'],
  corporate: ['#0f766e', '#14b8a6', '#99f6e4'],
  inclusive: ['#b45309', '#f59e0b', '#fcd34d'],
  treasury: ['#7c3aed', '#a855f7', '#d8b4fe'],
  root: ['#94a3b8', '#cbd5e1', '#e2e8f0'],
};

function buildHierarchy(rows: LoanNodeRaw[]): LoanHierarchyNode {
  const nodes = new Map<string, LoanHierarchyNode>();

  rows.forEach((row) => {
    nodes.set(row.id, {
      id: row.id,
      name: nameMap[row.id] || row.id,
      valueYi: row.valueYi,
      asOf: row.asOf,
      shareOfRoot: 0,
      children: [],
    });
  });

  rows.forEach((row) => {
    if (!row.parent) return;
    const node = nodes.get(row.id);
    const parent = nodes.get(row.parent);
    if (node && parent) {
      parent.children = parent.children || [];
      parent.children.push(node);
    }
  });

  const root = nodes.get('loan_book');
  if (!root) {
    return {
      id: 'loan_book',
      name: '贷款总盘',
      valueYi: 1,
      asOf: '',
      shareOfRoot: 1,
      children: [],
    };
  }

  const rootValue = root.valueYi;
  function annotate(node: LoanHierarchyNode) {
    node.shareOfRoot = node.valueYi / rootValue;
    (node.children || []).forEach((child) => annotate(child));
  }
  annotate(root);
  return root;
}

function getTopGroupKey(d: PackDatum) {
  if ((d.depth ?? 0) <= 0) return 'root';
  let cursor: PackDatum | null | undefined = d;
  while (cursor?.parent && (cursor.parent.depth ?? 0) > 1) {
    cursor = cursor.parent;
  }
  return cursor?.data?.id ?? 'root';
}

function getFillColor(d: PackDatum) {
  const depth = d.depth ?? 0;
  const topGroup = getTopGroupKey(d);
  const palette = topGroupPalette[topGroup] || topGroupPalette.root;
  const idx = Math.max(0, Math.min(depth, palette.length) - 1);
  return palette[idx];
}

function formatYi(value?: number) {
  if (typeof value !== 'number') return '-';
  return `${value.toLocaleString()} 亿元`;
}

function formatPercent(value?: number) {
  if (typeof value !== 'number') return '-';
  return `${(value * 100).toFixed(2)}%`;
}

const scenarioData = buildHierarchy(scenarioRows);

export function CircularPackingHierarchyScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 420,
      padding: 8,
    });

    chart.options({
      type: 'pack',
      data: { value: scenarioData },
      layout: { padding: 3 },
      encode: { value: 'valueYi' },
      style: {
        fill: (d: PackDatum) => getFillColor(d),
        fillOpacity: (d: PackDatum) => ((d.depth ?? 0) <= 0 ? 0.5 : 0.72),
        stroke: '#ffffff',
        lineWidth: 1.4,
        labelText: (d: PackDatum) => {
          const depth = d.depth ?? 0;
          const radius = d.r ?? 0;
          const name = d.data?.name || '';
          if (depth <= 0 || radius < 18) return '';
          if (depth === 1 && radius >= 38) return `${name}\n${formatYi(d.data?.valueYi)}`;
          if (depth >= 2 && radius >= 24) return name;
          return '';
        },
        labelFill: '#f8fafc',
        labelStroke: '#0f172a',
        labelLineWidth: 2,
        labelFontWeight: 800,
        labelFontSize: 12,
        labelLineHeight: 15,
      },
      legend: false,
      tooltip: {
        title: (d: PackDatum) => `${d.data?.name ?? ''}（${d.data?.asOf ?? ''}）`,
        items: [
          {
            field: 'valueYi',
            name: '贷款余额',
            valueFormatter: (value: number) => formatYi(value),
          },
          {
            field: 'shareOfRoot',
            name: '占贷款总盘比例',
            valueFormatter: (value: number) => formatPercent(value),
          },
        ],
      },
      interaction: [{ type: 'elementHighlight' }],
    });

    chart.render();
    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '420px' }} />;
}
