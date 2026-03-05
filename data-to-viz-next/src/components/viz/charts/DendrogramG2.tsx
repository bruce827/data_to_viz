'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import dendrogramData from './demoData/DendrogramG2.json';

type TreeNode = {
  name: string;
  value?: number;
  children?: TreeNode[];
};

type TreeLayoutNode = {
  name: string;
  depth: number;
  children?: TreeLayoutNode[];
};

type TreeLayoutEdge = {
  source: TreeLayoutNode;
  target: TreeLayoutNode;
};

function withLeafValues(node: TreeNode): TreeNode {
  const children = node.children?.map(withLeafValues);
  if (!children || children.length === 0) {
    return { ...node, value: node.value ?? 1 };
  }
  return { ...node, children, value: node.value ?? children.length };
}

const demoTreeData = withLeafValues(dendrogramData as TreeNode);
const DEPTH_COLORS = ['#0f172a', '#334155', '#475569', '#0ea5e9'];

export function DendrogramG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 300,
      paddingLeft: 34,
      paddingRight: 24,
      paddingTop: 24,
      paddingBottom: 38,
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
          data: { type: 'inline', value: demoTreeData },
          layout: {
            as: ['x', 'y'],
            separation: (a: { parent?: unknown }, b: { parent?: unknown }) =>
              a.parent === b.parent ? 1 : 1.35,
          },
          encode: {
            value: 'value',
            nodeColor: (d: TreeLayoutNode) =>
              DEPTH_COLORS[Math.min(d.depth, DEPTH_COLORS.length - 1)],
            nodeSize: (d: TreeLayoutNode) =>
              d.children ? (d.depth === 0 ? 5.2 : 3.8) : 4.8,
            linkShape: 'smooth',
          },
          style: {
            nodeFillOpacity: 0.95,
            nodeStroke: '#ffffff',
            nodeLineWidth: 1.2,
            linkStroke: '#94a3b8',
            linkStrokeOpacity: 0.72,
            linkLineWidth: (d: TreeLayoutEdge) =>
              d.target.children ? 1.4 : 1.1,
          },
          nodeLabels: [
            {
              text: (d: TreeLayoutNode) => (d.children ? '' : d.name),
              dy: 8,
              textAlign: 'center',
              fill: '#334155',
              fontSize: 10,
            },
          ],
          tooltip: {
            node: {
              title: (d: TreeLayoutNode) => d.name,
              items: [
                (d: TreeLayoutNode) => ({ name: '层级', value: `L${d.depth}` }),
                (d: TreeLayoutNode) => ({
                  name: '子节点数',
                  value: String(d.children?.length ?? 0),
                }),
              ],
            },
            link: {
              title: '',
              items: [
                (d: TreeLayoutEdge) => ({ name: '上游', value: d.source.name }),
                (d: TreeLayoutEdge) => ({ name: '下游', value: d.target.name }),
              ],
            },
          },
        },
        {
          type: 'lineY',
          data: [0.58],
          style: {
            stroke: '#f59e0b',
            lineDash: [6, 4],
            lineWidth: 1.3,
          },
          tooltip: false,
          legend: false,
        },
        {
          type: 'text',
          data: {
            type: 'inline',
            value: [{ x: 0.03, y: 0.595, label: '示例切割线' }],
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
      ],
      interaction: [{ type: 'elementHighlight', background: true }],
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return (
    <div className="relative w-full bg-slate-50/50 rounded-lg border border-slate-100 overflow-hidden">
      <div ref={containerRef} style={{ width: '100%', height: '300px' }} />
    </div>
  );
}
