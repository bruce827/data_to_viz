'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type ClusterTag = '互保圈A-B-C' | '互保圈D-E-F' | '跨圈弱关联';
type NodeKind = '叶子企业' | '合并节点' | '根节点';

type GuaranteeTreeNode = {
  name: string;
  clusterTag: ClusterTag;
  nodeKind: NodeKind;
  association?: number;
  distance?: number;
  note: string;
  value?: number;
  children?: GuaranteeTreeNode[];
};

type TreeMarkNode = {
  name: string;
  depth: number;
  data: GuaranteeTreeNode;
  children?: TreeMarkNode[];
};

type TreeMarkEdge = {
  source: TreeMarkNode;
  target: TreeMarkNode;
};

const CLUSTER_COLOR_MAP: Record<ClusterTag, string> = {
  '互保圈A-B-C': '#ef4444',
  '互保圈D-E-F': '#3b82f6',
  '跨圈弱关联': '#64748b',
};

function withLeafValues(node: GuaranteeTreeNode): GuaranteeTreeNode {
  const children = node.children?.map(withLeafValues);
  if (!children || children.length === 0) {
    return { ...node, value: 1 };
  }
  return {
    ...node,
    children,
    value: children.reduce((sum, child) => sum + (child.value ?? 1), 0),
  };
}

// 基于 report 的企业对关联度重构层次结构：distance = 1 - association
const scenarioTreeData = withLeafValues({
  name: '跨圈根节点',
  clusterTag: '跨圈弱关联',
  nodeKind: '根节点',
  association: 0.1,
  distance: 0.9,
  note: '由 C-D 弱关联（0.10）连接两个圈层',
  children: [
    {
      name: 'ABC 合并',
      clusterTag: '互保圈A-B-C',
      nodeKind: '合并节点',
      association: 0.6,
      distance: 0.4,
      note: 'A/B/C 在阈值 0.60 下形成互保圈',
      children: [
        {
          name: 'AB 合并',
          clusterTag: '互保圈A-B-C',
          nodeKind: '合并节点',
          association: 0.82,
          distance: 0.18,
          note: 'A-B 为最紧密企业对（0.82）',
          children: [
            {
              name: 'A',
              clusterTag: '互保圈A-B-C',
              nodeKind: '叶子企业',
              note: '与 B 高关联',
            },
            {
              name: 'B',
              clusterTag: '互保圈A-B-C',
              nodeKind: '叶子企业',
              note: '与 A/C 均存在关联',
            },
          ],
        },
        {
          name: 'C',
          clusterTag: '互保圈A-B-C',
          nodeKind: '叶子企业',
          note: '与 D 的跨圈关系较弱（0.10）',
        },
      ],
    },
    {
      name: 'DEF 合并',
      clusterTag: '互保圈D-E-F',
      nodeKind: '合并节点',
      association: 0.65,
      distance: 0.35,
      note: 'D/E/F 在阈值 0.60 下形成互保圈',
      children: [
        {
          name: 'D',
          clusterTag: '互保圈D-E-F',
          nodeKind: '叶子企业',
          note: '与 E/F 形成第二圈层',
        },
        {
          name: 'EF 合并',
          clusterTag: '互保圈D-E-F',
          nodeKind: '合并节点',
          association: 0.8,
          distance: 0.2,
          note: 'E-F 为第二紧密企业对（0.80）',
          children: [
            {
              name: 'E',
              clusterTag: '互保圈D-E-F',
              nodeKind: '叶子企业',
              note: '与 F 高关联',
            },
            {
              name: 'F',
              clusterTag: '互保圈D-E-F',
              nodeKind: '叶子企业',
              note: '与 E 形成紧密对子',
            },
          ],
        },
      ],
    },
  ],
});

const cutLineLabel = [
  { x: 0.03, y: 0.69, label: '策略切割线：关联度 0.60（distance=0.40）' },
];

const weakLinkLabel = [{ x: 0.03, y: 0.18, label: '跨圈弱连接：C-D = 0.10' }];

function formatMaybe(value?: number) {
  return value === undefined ? '-' : value.toFixed(2);
}

export function DendrogramGuaranteeScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 360,
      paddingLeft: 28,
      paddingRight: 24,
      paddingTop: 26,
      paddingBottom: 34,
    });

    chart.options({
      type: 'view',
      scale: {
        x: { domain: [0, 1] },
        y: { domain: [0, 1] },
      },
      children: [
        {
          type: 'tree',
          data: { type: 'inline', value: scenarioTreeData },
          layout: {
            as: ['x', 'y'],
            separation: (a: { parent?: unknown }, b: { parent?: unknown }) =>
              a.parent === b.parent ? 1 : 1.32,
          },
          encode: {
            value: 'value',
            nodeColor: (d: TreeMarkNode) => CLUSTER_COLOR_MAP[d.data.clusterTag],
            nodeSize: (d: TreeMarkNode) =>
              d.data.nodeKind === '叶子企业' ? 5.2 : d.data.nodeKind === '根节点' ? 5.8 : 4.8,
            linkColor: (d: TreeMarkEdge) => CLUSTER_COLOR_MAP[d.target.data.clusterTag],
            linkShape: 'smooth',
          },
          style: {
            nodeFillOpacity: 0.98,
            nodeStroke: '#f8fafc',
            nodeLineWidth: 1.2,
            linkStrokeOpacity: (d: TreeMarkEdge) =>
              d.target.data.clusterTag === '跨圈弱关联' ? 0.8 : 0.95,
            linkLineWidth: (d: TreeMarkEdge) =>
              d.target.data.clusterTag === '跨圈弱关联' ? 1.3 : 1.8,
          },
          nodeLabels: [
            {
              text: (d: TreeMarkNode) => d.data.name,
              dy: 10,
              textAlign: 'center',
              fill: '#334155',
              fontSize: (d: TreeMarkNode) => (d.data.nodeKind === '叶子企业' ? 10 : 9),
              fontWeight: (d: TreeMarkNode) =>
                d.data.nodeKind === '叶子企业' ? 600 : 500,
            },
          ],
          linkLabels: [
            {
              text: (d: TreeMarkEdge) =>
                d.target.data.association === undefined
                  ? ''
                  : `关联 ${d.target.data.association.toFixed(2)}`,
              fill: '#64748b',
              fontSize: 9,
              textBackgroundFill: '#ffffff',
              textBackgroundRadius: 3,
              textBackgroundPadding: [1, 2],
            },
          ],
          tooltip: {
            node: {
              title: (d: TreeMarkNode) => d.data.name,
              items: [
                (d: TreeMarkNode) => ({ name: '节点类型', value: d.data.nodeKind }),
                (d: TreeMarkNode) => ({ name: '圈层', value: d.data.clusterTag }),
                (d: TreeMarkNode) => ({
                  name: '关联度',
                  value: formatMaybe(d.data.association),
                }),
                (d: TreeMarkNode) => ({
                  name: '对应距离',
                  value: formatMaybe(d.data.distance),
                }),
                (d: TreeMarkNode) => ({ name: '说明', value: d.data.note }),
              ],
            },
            link: {
              title: '',
              items: [
                (d: TreeMarkEdge) => ({ name: '上游节点', value: d.source.data.name }),
                (d: TreeMarkEdge) => ({ name: '下游节点', value: d.target.data.name }),
                (d: TreeMarkEdge) => ({
                  name: '下游节点关联度',
                  value: formatMaybe(d.target.data.association),
                }),
              ],
            },
          },
        },
        {
          type: 'lineY',
          data: [0.66],
          style: {
            stroke: '#f59e0b',
            lineDash: [6, 4],
            lineWidth: 1.4,
          },
          tooltip: false,
          legend: false,
        },
        {
          type: 'text',
          data: {
            type: 'inline',
            value: cutLineLabel,
          },
          encode: {
            x: 'x',
            y: 'y',
            text: 'label',
          },
          style: {
            fill: '#b45309',
            fontSize: 10,
            fontWeight: 600,
          },
          tooltip: false,
          legend: false,
        },
        {
          type: 'text',
          data: {
            type: 'inline',
            value: weakLinkLabel,
          },
          encode: {
            x: 'x',
            y: 'y',
            text: 'label',
          },
          style: {
            fill: '#475569',
            fontSize: 10,
            fontWeight: 600,
          },
          tooltip: false,
          legend: false,
        },
      ],
      interaction: [{ type: 'elementHighlight', background: true }],
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '360px' }} />;
}
