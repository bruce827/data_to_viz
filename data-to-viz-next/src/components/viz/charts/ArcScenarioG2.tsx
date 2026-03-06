'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { Chart } from '@antv/g2';

type ArcRelation = '授信' | '担保' | '关联交易';

type ArcRawRow = {
  quarter: string;
  center: string;
  node: string;
  relation: ArcRelation;
  ead_cny_100m: number;
  pd: number;
};

type ArcLinkDatum = {
  source: string;
  target: string;
  relation: ArcRelation;
  ead: number;
  eadLabel: string;
  pdLabel: string;
  quarter: string;
  y: number;
  y1: number;
};

type ArcNodeDatum = {
  id: string;
  nodeType: '中心集团' | '关联节点';
  relation: ArcRelation | '中心';
  ead: number;
  eadLabel: string;
  pdLabel: string;
  riskBand: '中心' | '低风险' | '中风险' | '高风险';
  y: number;
};

// 数据源：docs/catenum-deep-research-report.md（ARCD / chart-structure-network-arc）
const scenarioRows: ArcRawRow[] = [
  { quarter: '2025Q4', center: '集团B', node: '子公司B1', relation: '授信', ead_cny_100m: 18.0, pd: 0.012 },
  { quarter: '2025Q4', center: '集团B', node: '子公司B2', relation: '授信', ead_cny_100m: 22.5, pd: 0.015 },
  { quarter: '2025Q4', center: '集团B', node: '项目公司P2', relation: '授信', ead_cny_100m: 35.0, pd: 0.028 },
  { quarter: '2025Q4', center: '集团B', node: '供应商S3', relation: '担保', ead_cny_100m: 6.0, pd: 0.02 },
  { quarter: '2025Q4', center: '集团B', node: '供应商S4', relation: '担保', ead_cny_100m: 4.5, pd: 0.018 },
  { quarter: '2025Q4', center: '集团B', node: '关联方R1', relation: '关联交易', ead_cny_100m: 9.0, pd: 0.022 },
];

const RELATION_COLOR: Record<ArcRelation, string> = {
  授信: '#2563eb',
  担保: '#16a34a',
  关联交易: '#f59e0b',
};

function toRiskBand(pd: number): ArcNodeDatum['riskBand'] {
  if (pd >= 0.025) return '高风险';
  if (pd >= 0.018) return '中风险';
  return '低风险';
}

function buildArcData(rows: ArcRawRow[]) {
  const centerId = rows[0]?.center ?? '中心集团';
  const totalEad = rows.reduce((sum, row) => sum + row.ead_cny_100m, 0);
  const weightedPd =
    totalEad > 0 ? rows.reduce((sum, row) => sum + row.pd * row.ead_cny_100m, 0) / totalEad : 0;

  const orderedNodes = ['子公司B1', '子公司B2', '项目公司P2', centerId, '供应商S3', '供应商S4', '关联方R1'];

  const nodeRows = rows.map((row) => ({
    id: row.node,
    nodeType: '关联节点' as const,
    relation: row.relation,
    ead: row.ead_cny_100m,
    eadLabel: `${row.ead_cny_100m.toFixed(1)} 亿元`,
    pdLabel: `${(row.pd * 100).toFixed(2)}%`,
    riskBand: toRiskBand(row.pd),
    y: 0.14,
  }));

  const centerNode: ArcNodeDatum = {
    id: centerId,
    nodeType: '中心集团',
    relation: '中心',
    ead: totalEad,
    eadLabel: `${totalEad.toFixed(1)} 亿元`,
    pdLabel: `${(weightedPd * 100).toFixed(2)}%`,
    riskBand: '中心',
    y: 0.14,
  };

  const nodeMap = new Map<string, ArcNodeDatum>();
  nodeRows.forEach((item) => nodeMap.set(item.id, item));
  nodeMap.set(centerNode.id, centerNode);

  const nodes = orderedNodes
    .map((id) => nodeMap.get(id))
    .filter((item): item is ArcNodeDatum => Boolean(item));

  const links: ArcLinkDatum[] = rows.map((row) => ({
    source: row.center,
    target: row.node,
    relation: row.relation,
    ead: row.ead_cny_100m,
    eadLabel: `${row.ead_cny_100m.toFixed(1)} 亿元`,
    pdLabel: `${(row.pd * 100).toFixed(2)}%`,
    quarter: row.quarter,
    y: 0.14,
    y1: 0.14,
  }));

  return {
    nodes,
    links,
    orderedNodes,
  };
}

export function ArcGroupExposureScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { nodes, links, orderedNodes } = useMemo(() => buildArcData(scenarioRows), []);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 420,
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 62,
      paddingBottom: 28,
    });

    chart.options({
      type: 'view',
      scale: {
        x: {
          domain: orderedNodes,
          paddingInner: 0.16,
          paddingOuter: 0.08,
        },
        y: {
          domain: [0, 1],
        },
      },
      children: [
        {
          type: 'lineY',
          data: { type: 'inline', value: [{ base: 0.14 }] },
          encode: { y: 'base' },
          style: {
            stroke: '#94a3b8',
            strokeOpacity: 0.72,
            lineWidth: 1.2,
          },
          axis: false,
          legend: false,
          tooltip: false,
        },
        {
          type: 'link',
          data: { type: 'inline', value: links },
          encode: {
            x: 'source',
            y: 'y',
            x1: 'target',
            y1: 'y1',
            color: 'relation',
            shape: 'arc',
          },
          scale: {
            color: {
              domain: ['授信', '担保', '关联交易'],
              range: ['#2563eb', '#16a34a', '#f59e0b'],
            },
          },
          style: {
            shape: 'arc',
            strokeOpacity: 0.62,
            lineWidth: (d: ArcLinkDatum) => 1 + d.ead * 0.08,
          },
          legend: {
            color: {
              title: '关系类型',
              position: 'top',
              itemMarkerSize: 8,
              itemLabelFontSize: 12,
            },
          },
          tooltip: {
            title: (d: ArcLinkDatum) => `${d.source} → ${d.target}（${d.quarter}）`,
            items: [
              { field: 'relation', name: '关系类型' },
              { field: 'eadLabel', name: 'EAD（敞口）' },
              { field: 'pdLabel', name: 'PD（违约概率）' },
            ],
          },
        },
        {
          type: 'point',
          data: { type: 'inline', value: nodes },
          encode: {
            x: 'id',
            y: 'y',
            size: 'ead',
          },
          scale: {
            size: {
              range: [8, 24],
            },
          },
          style: {
            fill: (d: ArcNodeDatum) => (d.nodeType === '中心集团' ? '#0f172a' : '#ffffff'),
            fillOpacity: 1,
            stroke: (d: ArcNodeDatum) =>
              d.nodeType === '中心集团' ? '#0f172a' : RELATION_COLOR[d.relation as ArcRelation],
            lineWidth: 2,
          },
          labels: [
            {
              text: 'id',
              dy: 13,
              textAlign: 'center',
              textBaseline: 'top',
              fontSize: 11,
              fontWeight: 700,
              fill: '#0f172a',
            },
          ],
          tooltip: {
            title: (d: ArcNodeDatum) => d.id,
            items: [
              { field: 'nodeType', name: '节点类型' },
              { field: 'relation', name: '关系归属' },
              { field: 'eadLabel', name: 'EAD（敞口）' },
              { field: 'pdLabel', name: 'PD（违约概率）' },
              { field: 'riskBand', name: '风险分层' },
            ],
          },
          legend: false,
        },
      ],
      axis: {
        x: {
          label: false,
          line: false,
          tick: false,
          title: false,
        },
        y: {
          label: false,
          line: false,
          tick: false,
          title: false,
          grid: false,
        },
      },
    });

    chart.render();
    return () => chart.destroy();
  }, [links, nodes, orderedNodes]);

  return <div ref={containerRef} style={{ width: '100%', height: '420px' }} />;
}
