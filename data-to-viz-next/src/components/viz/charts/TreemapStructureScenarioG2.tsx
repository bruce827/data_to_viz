'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type TreemapRawRow = {
  as_of: string;
  lvl1: string;
  lvl2: string;
  ead_cny_100m: number;
  npl_ratio: number;
  esg_flag: '高' | '中' | '低';
};

type TreemapNode = {
  name: string;
  ead_cny_100m: number;
  npl_ratio: number;
  esg_flag: '高' | '中' | '低';
  risk_band: '高风险' | '中风险' | '低风险';
  as_of: string;
  children?: TreemapNode[];
};

type TreemapDatum = {
  path?: string[];
  x0?: number;
  x1?: number;
  data?: TreemapNode;
};

// 数据源：docs/catenum-deep-research-report.md（TREE / chart-structure-hierarchy-treemap）
const scenarioRows: TreemapRawRow[] = [
  { as_of: '2025-12-31', lvl1: '房地产相关', lvl2: '开发贷', ead_cny_100m: 5200, npl_ratio: 0.03, esg_flag: '高' },
  { as_of: '2025-12-31', lvl1: '房地产相关', lvl2: '建筑施工', ead_cny_100m: 3100, npl_ratio: 0.024, esg_flag: '中' },
  { as_of: '2025-12-31', lvl1: '制造业', lvl2: '先进制造', ead_cny_100m: 6800, npl_ratio: 0.012, esg_flag: '中' },
  { as_of: '2025-12-31', lvl1: '制造业', lvl2: '高耗能行业', ead_cny_100m: 2400, npl_ratio: 0.016, esg_flag: '高' },
  { as_of: '2025-12-31', lvl1: '基建公用', lvl2: '交通基建', ead_cny_100m: 2900, npl_ratio: 0.01, esg_flag: '中' },
  { as_of: '2025-12-31', lvl1: '批发零售', lvl2: '大宗贸易', ead_cny_100m: 2100, npl_ratio: 0.018, esg_flag: '中' },
];

function toRiskBand(esgFlag: TreemapRawRow['esg_flag'], nplRatio: number): TreemapNode['risk_band'] {
  if (esgFlag === '高' || nplRatio >= 0.025) return '高风险';
  if (nplRatio >= 0.015) return '中风险';
  return '低风险';
}

function buildTree(rows: TreemapRawRow[]): TreemapNode {
  const grouped = new Map<string, TreemapRawRow[]>();
  rows.forEach((row) => {
    const list = grouped.get(row.lvl1);
    if (list) {
      list.push(row);
    } else {
      grouped.set(row.lvl1, [row]);
    }
  });

  const children: TreemapNode[] = Array.from(grouped.entries()).map(([lvl1, list]) => {
    const totalEad = list.reduce((sum, row) => sum + row.ead_cny_100m, 0);
    const avgNpl = list.reduce((sum, row) => sum + row.npl_ratio * row.ead_cny_100m, 0) / totalEad;
    const highEsgCount = list.filter((row) => row.esg_flag === '高').length;
    const esgFlag: TreemapNode['esg_flag'] = highEsgCount > 0 ? '高' : '中';
    const riskBand = toRiskBand(esgFlag, avgNpl);
    return {
      name: lvl1,
      ead_cny_100m: totalEad,
      npl_ratio: avgNpl,
      esg_flag: esgFlag,
      risk_band: riskBand,
      as_of: list[0]?.as_of ?? '',
      children: list.map((row) => ({
        name: row.lvl2,
        ead_cny_100m: row.ead_cny_100m,
        npl_ratio: row.npl_ratio,
        esg_flag: row.esg_flag,
        risk_band: toRiskBand(row.esg_flag, row.npl_ratio),
        as_of: row.as_of,
      })),
    };
  });

  const rootEad = children.reduce((sum, node) => sum + node.ead_cny_100m, 0);
  const rootNpl = children.reduce((sum, node) => sum + node.npl_ratio * node.ead_cny_100m, 0) / rootEad;
  return {
    name: '对公行业组合',
    ead_cny_100m: rootEad,
    npl_ratio: rootNpl,
    esg_flag: '中',
    risk_band: toRiskBand('中', rootNpl),
    as_of: rows[0]?.as_of ?? '',
    children,
  };
}

const treeData = buildTree(scenarioRows);

function formatYiFrom100m(value: unknown) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return '-';
  return `${(numeric / 10).toFixed(1)} 亿元`;
}

function formatPercent(value: unknown) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return '-';
  return `${(numeric * 100).toFixed(2)}%`;
}

export function TreemapStructureExposureScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 430,
      paddingTop: 56,
      paddingRight: 16,
      paddingBottom: 16,
      paddingLeft: 16,
    });

    chart.options({
      type: 'treemap',
      data: { value: treeData },
      layout: {
        tile: 'treemapSquarify',
        paddingInner: 2,
      },
      encode: {
        value: 'ead_cny_100m',
        color: (d: TreemapDatum) => d.data?.risk_band ?? '中风险',
      },
      scale: {
        color: {
          domain: ['高风险', '中风险', '低风险'],
          range: ['#dc2626', '#f59e0b', '#2563eb'],
        },
      },
      legend: {
        color: {
          title: '风险颜色映射（ESG + NPL）',
          position: 'top',
          cols: 3,
        },
      },
      style: {
        labelText: (d: TreemapDatum) => {
          const name = d.data?.name ?? '';
          const isLeaf = (d.path?.length ?? 0) >= 3;
          const ead = d.data?.ead_cny_100m;
          if (!isLeaf || typeof ead !== 'number') return name;
          return `${name}\nEAD ${(ead / 10).toFixed(0)}亿`;
        },
        labelPosition: 'top-left',
        labelDx: 4,
        labelDy: 4,
        labelFill: '#ffffff',
        labelFontSize: 11,
        labelFontWeight: 700,
        labelWordWrap: true,
        labelMaxLines: 2,
        labelWordWrapWidth: (d: TreemapDatum) => Math.max((d.x1 ?? 0) - (d.x0 ?? 0) - 8, 20),
      },
      tooltip: {
        title: (d: TreemapDatum) => `${d.data?.name ?? ''}（${d.data?.as_of ?? ''}）`,
        items: [
          {
            field: 'ead_cny_100m',
            name: 'EAD（敞口）',
            valueFormatter: (value: unknown) => formatYiFrom100m(value),
          },
          {
            field: 'npl_ratio',
            name: 'NPL',
            valueFormatter: (value: unknown) => formatPercent(value),
          },
          { field: 'risk_band', name: '颜色映射分层' },
          { field: 'esg_flag', name: 'ESG 风险等级' },
        ],
      },
      interaction: [{ type: 'elementHighlight' }],
    });

    chart.render();
    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '430px' }} />;
}
