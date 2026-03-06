'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type SegmentRiskRaw = {
  month: string;
  segment: '新市民' | '大众' | '高净值';
  risk_band: '高' | '中' | '低';
  customer_cnt: number;
  loan_balance_cny_100m: number;
  pd_avg: number;
};

type SegmentRiskNode = {
  id: string;
  name: string;
  customer_cnt: number;
  loan_balance_cny_100m: number;
  pd_avg: number;
  month: string;
  share_of_root: number;
  top_segment: string;
  risk_band: '高' | '中' | '低';
  children?: SegmentRiskNode[];
};

type PackDatum = {
  depth?: number;
  r?: number;
  data?: SegmentRiskNode;
  parent?: PackDatum | null;
};

// 数据源：docs/catenum-deep-research-report.md（CPAK / chart-structure-hierarchy-circular-packing）
const scenarioRows: SegmentRiskRaw[] = [
  { month: '2025-12', segment: '新市民', risk_band: '高', customer_cnt: 180000, loan_balance_cny_100m: 920, pd_avg: 0.022 },
  { month: '2025-12', segment: '新市民', risk_band: '中', customer_cnt: 420000, loan_balance_cny_100m: 1460, pd_avg: 0.014 },
  { month: '2025-12', segment: '大众', risk_band: '中', customer_cnt: 980000, loan_balance_cny_100m: 3100, pd_avg: 0.011 },
  { month: '2025-12', segment: '大众', risk_band: '低', customer_cnt: 760000, loan_balance_cny_100m: 2850, pd_avg: 0.006 },
  { month: '2025-12', segment: '高净值', risk_band: '低', customer_cnt: 120000, loan_balance_cny_100m: 2100, pd_avg: 0.003 },
  { month: '2025-12', segment: '高净值', risk_band: '中', customer_cnt: 45000, loan_balance_cny_100m: 980, pd_avg: 0.007 },
];

const segmentPalette: Record<string, string[]> = {
  新市民: ['#b91c1c', '#ef4444', '#fca5a5'],
  大众: ['#1d4ed8', '#3b82f6', '#93c5fd'],
  高净值: ['#166534', '#22c55e', '#86efac'],
  root: ['#475569', '#64748b', '#94a3b8'],
};

function buildHierarchy(rows: SegmentRiskRaw[]): SegmentRiskNode {
  const grouped = new Map<string, SegmentRiskRaw[]>();
  rows.forEach((row) => {
    const list = grouped.get(row.segment);
    if (list) list.push(row);
    else grouped.set(row.segment, [row]);
  });

  const segmentNodes: SegmentRiskNode[] = Array.from(grouped.entries()).map(([segment, list]) => {
    const totalCustomer = list.reduce((sum, row) => sum + row.customer_cnt, 0);
    const totalBalance = list.reduce((sum, row) => sum + row.loan_balance_cny_100m, 0);
    const weightedPd =
      totalCustomer > 0 ? list.reduce((sum, row) => sum + row.pd_avg * row.customer_cnt, 0) / totalCustomer : 0;

    return {
      id: `segment-${segment}`,
      name: segment,
      customer_cnt: totalCustomer,
      loan_balance_cny_100m: totalBalance,
      pd_avg: weightedPd,
      month: list[0]?.month ?? '',
      share_of_root: 0,
      top_segment: segment,
      risk_band: '中',
      children: list.map((row) => ({
        id: `${row.segment}-${row.risk_band}`,
        name: `${row.risk_band}风险`,
        customer_cnt: row.customer_cnt,
        loan_balance_cny_100m: row.loan_balance_cny_100m,
        pd_avg: row.pd_avg,
        month: row.month,
        share_of_root: 0,
        top_segment: row.segment,
        risk_band: row.risk_band,
      })),
    };
  });

  const rootCustomer = segmentNodes.reduce((sum, node) => sum + node.customer_cnt, 0);
  const rootBalance = segmentNodes.reduce((sum, node) => sum + node.loan_balance_cny_100m, 0);
  const rootPd =
    rootCustomer > 0
      ? segmentNodes.reduce((sum, node) => sum + node.pd_avg * node.customer_cnt, 0) / rootCustomer
      : 0;

  const root: SegmentRiskNode = {
    id: 'retail-segment-root',
    name: '零售客户总盘',
    customer_cnt: rootCustomer,
    loan_balance_cny_100m: rootBalance,
    pd_avg: rootPd,
    month: rows[0]?.month ?? '',
    share_of_root: 1,
    top_segment: 'root',
    risk_band: '中',
    children: segmentNodes,
  };

  function annotate(node: SegmentRiskNode, topSegment: string) {
    node.share_of_root = rootCustomer > 0 ? node.customer_cnt / rootCustomer : 0;
    node.top_segment = topSegment;
    (node.children || []).forEach((child) => {
      annotate(child, node.id === 'retail-segment-root' ? child.top_segment : topSegment);
    });
  }

  annotate(root, 'root');
  return root;
}

const scenarioData = buildHierarchy(scenarioRows);

function getTopSegment(d: PackDatum) {
  if ((d.depth ?? 0) <= 0) return 'root';
  let cursor: PackDatum | null | undefined = d;
  while (cursor?.parent && (cursor.parent.depth ?? 0) > 1) {
    cursor = cursor.parent;
  }
  return cursor?.data?.top_segment || 'root';
}

function getFillColor(d: PackDatum) {
  const depth = d.depth ?? 0;
  const topSegment = getTopSegment(d);
  const palette = segmentPalette[topSegment] || segmentPalette.root;
  const idx = Math.max(0, Math.min(depth, palette.length) - 1);
  return palette[idx];
}

function formatCustomer(v?: number) {
  if (typeof v !== 'number') return '-';
  return `${v.toLocaleString()} 户`;
}

function formatCustomerShort(v?: number) {
  if (typeof v !== 'number') return '';
  return v >= 10000 ? `${(v / 10000).toFixed(1)}万户` : `${v}户`;
}

function formatCustomerCompact(v?: number) {
  if (typeof v !== 'number') return '';
  return `${(v / 10000).toFixed(1)}`;
}

function formatYi(v?: number) {
  if (typeof v !== 'number') return '-';
  return `${(v / 10).toFixed(1)} 亿元`;
}

function formatPercent(v?: number) {
  if (typeof v !== 'number') return '-';
  return `${(v * 100).toFixed(2)}%`;
}

export function CircularPackingStructureSegmentScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 430,
      padding: 8,
    });

    chart.options({
      type: 'pack',
      data: { value: scenarioData },
      layout: { padding: 3 },
      encode: { value: 'customer_cnt' },
      style: {
        fill: (d: PackDatum) => getFillColor(d),
        fillOpacity: (d: PackDatum) => ((d.depth ?? 0) <= 0 ? 0.45 : 0.78),
        stroke: '#ffffff',
        lineWidth: 1.4,
        labelText: (d: PackDatum) => {
          const depth = d.depth ?? 0;
          const r = d.r ?? 0;
          const name = d.data?.name || '';
          if (depth <= 0 || r < 18) return '';
          if (depth === 1 && r >= 30) return `${name}\n${formatCustomerShort(d.data?.customer_cnt)}`;
          if (depth >= 2 && r >= 22) return `${name}\n${formatCustomerCompact(d.data?.customer_cnt)}万户`;
          if (depth >= 2 && r >= 14) return `${formatCustomerCompact(d.data?.customer_cnt)}万户`;
          return '';
        },
        labelFill: '#f8fafc',
        labelStroke: '#0f172a',
        labelLineWidth: 2,
        labelFontWeight: 800,
        labelFontSize: (d: PackDatum) => ((d.depth ?? 0) >= 2 ? 10 : 12),
        labelLineHeight: (d: PackDatum) => ((d.depth ?? 0) >= 2 ? 12 : 15),
      },
      legend: false,
      tooltip: {
        title: (d: PackDatum) => `${d.data?.name ?? ''}（${d.data?.month ?? ''}）`,
        items: [
          {
            field: 'customer_cnt',
            name: '客户数',
            valueFormatter: (value: number) => formatCustomer(value),
          },
          {
            field: 'loan_balance_cny_100m',
            name: '贷款余额',
            valueFormatter: (value: number) => formatYi(value),
          },
          {
            field: 'pd_avg',
            name: '平均PD',
            valueFormatter: (value: number) => formatPercent(value),
          },
          {
            field: 'share_of_root',
            name: '占零售总盘客户比例',
            valueFormatter: (value: number) => formatPercent(value),
          },
          { field: 'top_segment', name: '所属客群' },
        ],
      },
      interaction: [{ type: 'elementHighlight' }],
    });

    chart.render();
    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '430px' }} />;
}
