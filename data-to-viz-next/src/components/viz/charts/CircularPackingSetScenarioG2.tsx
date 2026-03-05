'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type AlertNodeRaw = {
  id: string;
  parent: string | null;
  alertCount: number;
  asOf: string;
};

type AlertHierarchyNode = {
  id: string;
  name: string;
  alertCount: number;
  asOf: string;
  shareOfRoot: number;
  topGroup: string;
  children?: AlertHierarchyNode[];
};

type PackDatum = {
  depth?: number;
  r?: number;
  value?: number;
  data?: AlertHierarchyNode;
  parent?: PackDatum | null;
};

// 数据源：docs/cate-deep-research-report.md（chart-circular-packing-set）
const scenarioRows: AlertNodeRaw[] = [
  { id: 'aml_alerts', parent: null, alertCount: 128000, asOf: '2025-12-31' },
  { id: 'transaction_monitoring', parent: 'aml_alerts', alertCount: 72000, asOf: '2025-12-31' },
  { id: 'kyc_refresh', parent: 'aml_alerts', alertCount: 26000, asOf: '2025-12-31' },
  { id: 'sanctions_screening', parent: 'aml_alerts', alertCount: 14000, asOf: '2025-12-31' },
  { id: 'fraud_ops', parent: 'aml_alerts', alertCount: 16000, asOf: '2025-12-31' },
  { id: 'structuring', parent: 'transaction_monitoring', alertCount: 18000, asOf: '2025-12-31' },
  { id: 'high_risk_geo', parent: 'transaction_monitoring', alertCount: 12000, asOf: '2025-12-31' },
  { id: 'unusual_device', parent: 'transaction_monitoring', alertCount: 9000, asOf: '2025-12-31' },
  { id: 'merchant_risk', parent: 'transaction_monitoring', alertCount: 15000, asOf: '2025-12-31' },
  { id: 'cash_intensity', parent: 'transaction_monitoring', alertCount: 18000, asOf: '2025-12-31' },
  { id: 'expired_id', parent: 'kyc_refresh', alertCount: 9000, asOf: '2025-12-31' },
  { id: 'beneficial_owner', parent: 'kyc_refresh', alertCount: 7000, asOf: '2025-12-31' },
  { id: 'pep_review', parent: 'kyc_refresh', alertCount: 10000, asOf: '2025-12-31' },
  { id: 'name_match', parent: 'sanctions_screening', alertCount: 9000, asOf: '2025-12-31' },
  { id: 'country_match', parent: 'sanctions_screening', alertCount: 5000, asOf: '2025-12-31' },
  { id: 'sim_swap', parent: 'fraud_ops', alertCount: 6000, asOf: '2025-12-31' },
  { id: 'account_takeover', parent: 'fraud_ops', alertCount: 5000, asOf: '2025-12-31' },
  { id: 'loan_fraud', parent: 'fraud_ops', alertCount: 5000, asOf: '2025-12-31' },
];

const nameMap: Record<string, string> = {
  aml_alerts: 'AML/反欺诈告警池',
  transaction_monitoring: '交易监测',
  kyc_refresh: 'KYC（客户身份识别）复核',
  sanctions_screening: '制裁筛查',
  fraud_ops: '欺诈运营',
  structuring: '结构化拆分交易',
  high_risk_geo: '高风险地区交易',
  unusual_device: '异常设备',
  merchant_risk: '商户风险',
  cash_intensity: '现金密集度异常',
  expired_id: '证件过期',
  beneficial_owner: '受益所有人核验',
  pep_review: 'PEP（政治公众人物）复核',
  name_match: '名单姓名命中',
  country_match: '国家/地区命中',
  sim_swap: 'SIM 卡置换',
  account_takeover: '账户接管',
  loan_fraud: '信贷欺诈',
};

const topGroupPalette: Record<string, string[]> = {
  transaction_monitoring: ['#1d4ed8', '#3b82f6', '#93c5fd'],
  kyc_refresh: ['#0f766e', '#14b8a6', '#99f6e4'],
  sanctions_screening: ['#d97706', '#f59e0b', '#fcd34d'],
  fraud_ops: ['#b91c1c', '#ef4444', '#fca5a5'],
  root: ['#94a3b8', '#cbd5e1', '#e2e8f0'],
};

function buildHierarchy(rows: AlertNodeRaw[]): AlertHierarchyNode {
  const nodes = new Map<string, AlertHierarchyNode>();

  rows.forEach((row) => {
    nodes.set(row.id, {
      id: row.id,
      name: nameMap[row.id] || row.id,
      alertCount: row.alertCount,
      asOf: row.asOf,
      shareOfRoot: 0,
      topGroup: row.id,
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

  const root = nodes.get('aml_alerts');
  if (!root) {
    return {
      id: 'aml_alerts',
      name: 'AML/反欺诈告警池',
      alertCount: 1,
      asOf: '',
      shareOfRoot: 1,
      topGroup: 'root',
      children: [],
    };
  }

  const rootTotal = root.alertCount;

  function annotate(node: AlertHierarchyNode, topGroup: string) {
    node.shareOfRoot = node.alertCount / rootTotal;
    node.topGroup = topGroup;
    (node.children || []).forEach((child) => {
      annotate(child, node.id === 'aml_alerts' ? child.id : topGroup);
    });
  }

  annotate(root, 'root');
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

function formatAlertCount(v?: number) {
  if (typeof v !== 'number') return '-';
  return `${v.toLocaleString()} 条`;
}

function formatPercent(v?: number) {
  if (typeof v !== 'number') return '-';
  return `${(v * 100).toFixed(2)}%`;
}

const scenarioData = buildHierarchy(scenarioRows);

export function CircularPackingSetScenarioG2() {
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
      encode: { value: 'alertCount' },
      style: {
        fill: (d: PackDatum) => getFillColor(d),
        fillOpacity: (d: PackDatum) => ((d.depth ?? 0) <= 0 ? 0.5 : 0.72),
        stroke: '#ffffff',
        lineWidth: 1.4,
        labelText: (d: PackDatum) => {
          const depth = d.depth ?? 0;
          const r = d.r ?? 0;
          const name = d.data?.name || '';
          if (depth <= 0 || r < 18) return '';
          if (depth === 1 && r >= 40) return `${name}\n${formatAlertCount(d.data?.alertCount)}`;
          if (depth >= 2 && r >= 24) return name;
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
            field: 'alertCount',
            name: '告警量',
            valueFormatter: (value: number) => formatAlertCount(value),
          },
          {
            field: 'shareOfRoot',
            name: '占总告警池比例',
            valueFormatter: (value: number) => formatPercent(value),
          },
          {
            field: 'topGroup',
            name: '一级类型',
            valueFormatter: (value: string) => nameMap[value] || value,
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
