'use client';

import React, { useEffect, useRef } from 'react';
import { Runtime, corelib, graphlib, extend } from '@antv/g2';

type SunburstRawRow = {
  id: string;
  parent: string | null;
  loanBalanceYi: number;
  asOf: string;
  taxonomy: string;
};

type SunburstHierarchyNode = {
  id: string;
  name: string;
  loanBalanceYi: number;
  asOf: string;
  taxonomy: string;
  shareOfRoot: number;
  topCategory: string;
  topCategoryLabel: string;
  children?: SunburstHierarchyNode[];
};

type SunburstDatum = {
  name?: string;
  depth?: number;
  path?: string[];
  loanBalanceYi?: number;
  shareOfRoot?: number;
  topCategory?: string;
  topCategoryLabel?: string;
  asOf?: string;
};

const graphLibrary = graphlib();
const ScenarioSunburstChart = extend(Runtime, {
  ...corelib(),
  ...graphLibrary,
  'mark.sunburst': graphLibrary['mark.partition'],
});

// 数据源：docs/cate-deep-research-report.md（chart-sunburst）
const scenarioRows: SunburstRawRow[] = [
  { id: 'esg_credit', parent: null, loanBalanceYi: 5200, asOf: '2025-12-31', taxonomy: 'ESG' },
  { id: 'green_mitigation', parent: 'esg_credit', loanBalanceYi: 2400, asOf: '2025-12-31', taxonomy: 'ESG' },
  { id: 'green_adaptation', parent: 'esg_credit', loanBalanceYi: 900, asOf: '2025-12-31', taxonomy: 'ESG' },
  { id: 'transition_finance', parent: 'esg_credit', loanBalanceYi: 1300, asOf: '2025-12-31', taxonomy: 'ESG' },
  { id: 'social_inclusion', parent: 'esg_credit', loanBalanceYi: 600, asOf: '2025-12-31', taxonomy: 'ESG' },
  { id: 'clean_energy', parent: 'green_mitigation', loanBalanceYi: 980, asOf: '2025-12-31', taxonomy: 'ESG' },
  { id: 'energy_efficiency', parent: 'green_mitigation', loanBalanceYi: 740, asOf: '2025-12-31', taxonomy: 'ESG' },
  { id: 'green_transport', parent: 'green_mitigation', loanBalanceYi: 380, asOf: '2025-12-31', taxonomy: 'ESG' },
  { id: 'pollution_control', parent: 'green_mitigation', loanBalanceYi: 300, asOf: '2025-12-31', taxonomy: 'ESG' },
  { id: 'flood_control', parent: 'green_adaptation', loanBalanceYi: 360, asOf: '2025-12-31', taxonomy: 'ESG' },
  { id: 'water_saving', parent: 'green_adaptation', loanBalanceYi: 260, asOf: '2025-12-31', taxonomy: 'ESG' },
  { id: 'climate_resilience_agri', parent: 'green_adaptation', loanBalanceYi: 280, asOf: '2025-12-31', taxonomy: 'ESG' },
  { id: 'steel_low_carbon', parent: 'transition_finance', loanBalanceYi: 420, asOf: '2025-12-31', taxonomy: 'ESG' },
  { id: 'cement_upgrade', parent: 'transition_finance', loanBalanceYi: 260, asOf: '2025-12-31', taxonomy: 'ESG' },
  { id: 'coal_power_flex', parent: 'transition_finance', loanBalanceYi: 320, asOf: '2025-12-31', taxonomy: 'ESG' },
  { id: 'auto_supply_chain', parent: 'transition_finance', loanBalanceYi: 300, asOf: '2025-12-31', taxonomy: 'ESG' },
  { id: 'inclusive_sme', parent: 'social_inclusion', loanBalanceYi: 350, asOf: '2025-12-31', taxonomy: 'ESG' },
  { id: 'rural_revitalization', parent: 'social_inclusion', loanBalanceYi: 250, asOf: '2025-12-31', taxonomy: 'ESG' },
];

const nameMap: Record<string, string> = {
  esg_credit: 'ESG（环境、社会与治理）信贷总盘',
  green_mitigation: '绿色减缓',
  green_adaptation: '绿色适应',
  transition_finance: '转型金融',
  social_inclusion: '社会包容',
  clean_energy: '清洁能源',
  energy_efficiency: '能效提升',
  green_transport: '绿色交通',
  pollution_control: '污染治理',
  flood_control: '防洪工程',
  water_saving: '节水改造',
  climate_resilience_agri: '气候韧性农业',
  steel_low_carbon: '钢铁低碳改造',
  cement_upgrade: '水泥工艺升级',
  coal_power_flex: '煤电灵活性改造',
  auto_supply_chain: '汽车供应链转型',
  inclusive_sme: '普惠小微',
  rural_revitalization: '乡村振兴',
};

const topCategoryLabelMap: Record<string, string> = {
  green_mitigation: '绿色减缓',
  green_adaptation: '绿色适应',
  transition_finance: '转型金融',
  social_inclusion: '社会包容',
  root: 'ESG总盘',
};

const topCategoryColorFamily: Record<string, string[]> = {
  绿色减缓: ['#166534', '#22c55e', '#86efac'],
  绿色适应: ['#1d4ed8', '#3b82f6', '#93c5fd'],
  转型金融: ['#b45309', '#f59e0b', '#fcd34d'],
  社会包容: ['#7e22ce', '#a855f7', '#d8b4fe'],
  ESG总盘: ['#334155', '#64748b', '#94a3b8'],
};

function buildHierarchy(rows: SunburstRawRow[]): SunburstHierarchyNode {
  const nodes = new Map<string, SunburstHierarchyNode>();
  rows.forEach((row) => {
    nodes.set(row.id, {
      id: row.id,
      name: nameMap[row.id] || row.id,
      loanBalanceYi: row.loanBalanceYi,
      asOf: row.asOf,
      taxonomy: row.taxonomy,
      shareOfRoot: 0,
      topCategory: row.id,
      topCategoryLabel: topCategoryLabelMap[row.id] || row.id,
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

  const root = nodes.get('esg_credit');
  if (!root) {
    return {
      id: 'esg_credit',
      name: 'ESG（环境、社会与治理）信贷总盘',
      loanBalanceYi: 1,
      asOf: '',
      taxonomy: 'ESG',
      shareOfRoot: 1,
      topCategory: 'root',
      topCategoryLabel: 'ESG总盘',
      children: [],
    };
  }

  const rootTotal = root.loanBalanceYi;

  function annotate(node: SunburstHierarchyNode, topCategory: string) {
    node.shareOfRoot = node.loanBalanceYi / rootTotal;
    node.topCategory = topCategory;
    node.topCategoryLabel = topCategoryLabelMap[topCategory] || topCategory;
    (node.children || []).forEach((child) => {
      annotate(child, node.id === 'esg_credit' ? child.id : topCategory);
    });
  }

  annotate(root, 'root');
  return root;
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

function getTopCategoryFromPath(d: SunburstDatum) {
  if ((d.depth ?? 0) <= 0) return 'ESG总盘';
  return d.path?.[1] || d.topCategoryLabel || 'ESG总盘';
}

function getFamilyColor(d: SunburstDatum) {
  const topCategory = getTopCategoryFromPath(d);
  const depth = d.depth ?? 0;
  const palette = topCategoryColorFamily[topCategory] || topCategoryColorFamily['ESG总盘'];
  if (depth <= 0) return topCategoryColorFamily['ESG总盘'][0];
  const idx = Math.min(Math.max(depth - 1, 0), palette.length - 1);
  return palette[idx];
}

export function SunburstEsgScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new ScenarioSunburstChart({
      container: containerRef.current,
      autoFit: true,
      height: 420,
      padding: 6,
    });

    chart.options({
      type: 'sunburst',
      data: [scenarioData],
      coordinate: {
        type: 'polar',
        innerRadius: 0.06,
        outerRadius: 0.98,
      },
      encode: {
        value: 'loanBalanceYi',
        color: (d: SunburstDatum) => getTopCategoryFromPath(d),
      },
      scale: {
        color: {
          domain: ['绿色减缓', '绿色适应', '转型金融', '社会包容'],
          range: ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7'],
        },
      },
      style: {
        fill: (d: SunburstDatum) => getFamilyColor(d),
        stroke: '#ffffff',
        lineWidth: 1,
        fillOpacity: (d: SunburstDatum) => ((d.depth ?? 0) <= 1 ? 0.95 : 0.82),
      },
      labels: [
        {
          text: (d: SunburstDatum) => {
            const depth = d.depth ?? 0;
            const name = d.name ?? '';
            const balance = d.loanBalanceYi;
            if (depth === 1) return `${name}\n${typeof balance === 'number' ? `${balance}亿` : ''}`;
            if (depth === 2 && (balance ?? 0) >= 320) return name;
            return '';
          },
          transform: [{ type: 'overflowHide' }],
          style: {
            fill: '#f8fafc',
            stroke: '#0f172a',
            lineWidth: 2,
            fontWeight: 800,
            fontSize: 11,
            lineHeight: 14,
          },
        },
      ],
      legend: {
        color: {
          title: '一级分类',
          position: 'top',
          cols: 4,
        },
      },
      tooltip: {
        title: (d: SunburstDatum) => `${d.name ?? ''}（${d.asOf ?? ''}）`,
        items: [
          {
            field: 'loanBalanceYi',
            name: '贷款余额',
            valueFormatter: (value: number) => formatYi(value),
          },
          {
            field: 'shareOfRoot',
            name: '占 ESG 总盘比例',
            valueFormatter: (value: number) => formatPercent(value),
          },
          { field: 'topCategoryLabel', name: '一级分类' },
        ],
      },
      interaction: [{ type: 'elementHighlight' }],
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '420px' }} />;
}
