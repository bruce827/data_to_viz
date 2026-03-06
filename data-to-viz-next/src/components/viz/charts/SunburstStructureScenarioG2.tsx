'use client';

import React, { useEffect, useRef } from 'react';
import { Runtime, corelib, graphlib, extend } from '@antv/g2';

type SunburstNode = {
  id: string;
  name: string;
  sum: number;
  month: string;
  topCategory: string;
  topCategoryLabel: string;
  shareOfRoot: number;
  children?: SunburstNode[];
};

type SunburstDatum = {
  name?: string;
  sum?: number;
  depth?: number;
  path?: string[];
  month?: string;
  shareOfRoot?: number;
  topCategoryLabel?: string;
};

const graphLibrary = graphlib();
const StructureSunburstChart = extend(Runtime, {
  ...corelib(),
  ...graphLibrary,
  'mark.sunburst': graphLibrary['mark.partition'],
});

type SunburstRawRow = {
  month: string;
  product: '存款' | '理财' | '基金' | '保险';
  channel: '手机银行' | '网点' | '客户经理';
  segment: '大众客' | '新市民' | '高净值';
  aum_cny_100m: number;
};

// 数据源：docs/catenum-deep-research-report.md（SUN / chart-structure-hierarchy-sunburst）
// 说明：report 原始样例较精简，这里按“产品->渠道->客群”补足为多层级结构，以匹配旭日图层级表达。
const scenarioRows: SunburstRawRow[] = [
  { month: '2025-12', product: '存款', channel: '手机银行', segment: '大众客', aum_cny_100m: 2200 },
  { month: '2025-12', product: '存款', channel: '手机银行', segment: '新市民', aum_cny_100m: 900 },
  { month: '2025-12', product: '存款', channel: '手机银行', segment: '高净值', aum_cny_100m: 600 },
  { month: '2025-12', product: '存款', channel: '网点', segment: '大众客', aum_cny_100m: 1800 },
  { month: '2025-12', product: '存款', channel: '网点', segment: '高净值', aum_cny_100m: 700 },
  { month: '2025-12', product: '存款', channel: '客户经理', segment: '高净值', aum_cny_100m: 450 },

  { month: '2025-12', product: '理财', channel: '手机银行', segment: '大众客', aum_cny_100m: 1400 },
  { month: '2025-12', product: '理财', channel: '手机银行', segment: '高净值', aum_cny_100m: 900 },
  { month: '2025-12', product: '理财', channel: '手机银行', segment: '新市民', aum_cny_100m: 350 },
  { month: '2025-12', product: '理财', channel: '网点', segment: '大众客', aum_cny_100m: 520 },
  { month: '2025-12', product: '理财', channel: '网点', segment: '高净值', aum_cny_100m: 480 },
  { month: '2025-12', product: '理财', channel: '客户经理', segment: '高净值', aum_cny_100m: 760 },

  { month: '2025-12', product: '基金', channel: '手机银行', segment: '大众客', aum_cny_100m: 820 },
  { month: '2025-12', product: '基金', channel: '手机银行', segment: '高净值', aum_cny_100m: 360 },
  { month: '2025-12', product: '基金', channel: '客户经理', segment: '高净值', aum_cny_100m: 420 },
  { month: '2025-12', product: '基金', channel: '网点', segment: '大众客', aum_cny_100m: 210 },

  { month: '2025-12', product: '保险', channel: '客户经理', segment: '高净值', aum_cny_100m: 520 },
  { month: '2025-12', product: '保险', channel: '客户经理', segment: '大众客', aum_cny_100m: 260 },
  { month: '2025-12', product: '保险', channel: '网点', segment: '大众客', aum_cny_100m: 180 },
  { month: '2025-12', product: '保险', channel: '手机银行', segment: '大众客', aum_cny_100m: 140 },
];

function buildHierarchy(rows: SunburstRawRow[]): SunburstNode {
  const month = rows[0]?.month ?? '';
  const productMap = new Map<string, SunburstRawRow[]>();

  rows.forEach((row) => {
    const list = productMap.get(row.product);
    if (list) list.push(row);
    else productMap.set(row.product, [row]);
  });

  const productNodes: SunburstNode[] = Array.from(productMap.entries()).map(([product, productRows]) => {
    const channelMap = new Map<string, SunburstRawRow[]>();
    productRows.forEach((row) => {
      const list = channelMap.get(row.channel);
      if (list) list.push(row);
      else channelMap.set(row.channel, [row]);
    });

    const channelNodes: SunburstNode[] = Array.from(channelMap.entries()).map(([channel, channelRows]) => {
      const segmentNodes: SunburstNode[] = channelRows.map((row) => ({
        id: `${product}-${channel}-${row.segment}`,
        name: row.segment,
        sum: row.aum_cny_100m,
        month: row.month,
        topCategory: product,
        topCategoryLabel: product,
        shareOfRoot: 0,
      }));
      const channelTotal = segmentNodes.reduce((sum, node) => sum + node.sum, 0);
      return {
        id: `${product}-${channel}`,
        name: channel,
        sum: channelTotal,
        month,
        topCategory: product,
        topCategoryLabel: product,
        shareOfRoot: 0,
        children: segmentNodes,
      };
    });

    const productTotal = channelNodes.reduce((sum, node) => sum + node.sum, 0);
    return {
      id: `product-${product}`,
      name: product,
      sum: productTotal,
      month,
      topCategory: product,
      topCategoryLabel: product,
      shareOfRoot: 0,
      children: channelNodes,
    };
  });

  const rootTotal = productNodes.reduce((sum, node) => sum + node.sum, 0);
  const root: SunburstNode = {
    id: 'asset-root',
    name: '零售AUM总盘',
    sum: rootTotal,
    month,
    topCategory: '总盘',
    topCategoryLabel: '总盘',
    shareOfRoot: 1,
    children: productNodes,
  };

  function annotate(node: SunburstNode, topCategory: string) {
    node.shareOfRoot = rootTotal > 0 ? node.sum / rootTotal : 0;
    node.topCategory = topCategory;
    node.topCategoryLabel = topCategory;
    (node.children || []).forEach((child) => {
      annotate(child, node.id === 'asset-root' ? child.name : topCategory);
    });
  }

  annotate(root, '总盘');
  return root;
}

const scenarioData = buildHierarchy(scenarioRows);

const COLOR_DOMAIN = ['存款', '理财', '基金', '保险', '总盘'];
const COLOR_RANGE = ['#2563eb', '#16a34a', '#f59e0b', '#8b5cf6', '#475569'];
const PRODUCT_COLOR_FAMILY: Record<string, string[]> = {
  存款: ['#1d4ed8', '#3b82f6', '#93c5fd'],
  理财: ['#15803d', '#22c55e', '#86efac'],
  基金: ['#b45309', '#f59e0b', '#fcd34d'],
  保险: ['#7e22ce', '#a855f7', '#d8b4fe'],
  总盘: ['#334155', '#64748b', '#94a3b8'],
};

function getTopCategoryFromPath(d: SunburstDatum) {
  if ((d.depth ?? 0) <= 0) return '总盘';
  return d.path?.[1] || d.topCategoryLabel || '总盘';
}

function formatYi(value?: number) {
  if (typeof value !== 'number') return '-';
  return `${value.toLocaleString()} 亿元`;
}

function formatPercent(value?: number) {
  if (typeof value !== 'number') return '-';
  return `${(value * 100).toFixed(2)}%`;
}

export function SunburstStructureAssetScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new StructureSunburstChart({
      container: containerRef.current,
      autoFit: true,
      height: 430,
      padding: 8,
    });

    chart.options({
      type: 'sunburst',
      data: [scenarioData],
      coordinate: {
        type: 'polar',
        innerRadius: 0.08,
        outerRadius: 0.98,
      },
      encode: {
        value: 'sum',
        color: (d: SunburstDatum) => getTopCategoryFromPath(d),
      },
      scale: {
        color: {
          domain: COLOR_DOMAIN,
          range: COLOR_RANGE,
        },
      },
      style: {
        fill: (d: SunburstDatum) => {
          const topCategory = getTopCategoryFromPath(d);
          const family = PRODUCT_COLOR_FAMILY[topCategory] || PRODUCT_COLOR_FAMILY['总盘'];
          const depth = d.depth ?? 0;
          const idx = Math.min(Math.max(depth - 1, 0), family.length - 1);
          return family[idx];
        },
        stroke: '#ffffff',
        lineWidth: 1,
        fillOpacity: (d: SunburstDatum) => ((d.depth ?? 0) <= 1 ? 0.95 : 0.84),
      },
      labels: [
        {
          text: 'name',
          transform: [{ type: 'overflowHide' }],
          style: {
            fill: '#f8fafc',
            stroke: '#0f172a',
            lineWidth: 1.8,
            fontWeight: 700,
            fontSize: 11,
          },
        },
      ],
      legend: {
        color: {
          title: '颜色映射：产品类别（lvl2）',
          position: 'top',
          cols: 5,
        },
      },
      tooltip: {
        title: (d: SunburstDatum) => `${d.name ?? ''}（${d.month ?? ''}）`,
        items: [
          {
            field: 'sum',
            name: 'AUM',
            valueFormatter: (value: number) => formatYi(value),
          },
          {
            field: 'shareOfRoot',
            name: '占总盘比例',
            valueFormatter: (value: number) => formatPercent(value),
          },
          { field: 'topCategoryLabel', name: '颜色所属产品类别' },
        ],
      },
      interaction: [{ type: 'elementHighlight' }],
    });

    chart.render();
    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '430px' }} />;
}
