'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import arcData from './demoData/ArcDiagramG2.json';

type ArcNode = {
  id: string;
  group: string;
  size: number;
};

type ArcLink = {
  source: string;
  target: string;
  value: number;
  group: string;
};

type ArcLinkPoint = ArcLink & {
  y: number;
  y1: number;
};

type ArcNodePoint = ArcNode & {
  y: number;
};

const GROUP_COLOR: Record<string, string> = {
  业务: '#3b82f6',
  平台: '#0ea5a4',
  服务: '#f59e0b',
};

export function ArcDiagramG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const nodes = (arcData.nodes as ArcNode[]).map((d) => ({ ...d, y: 0.12 }));
    const links = (arcData.links as ArcLink[]).map((d) => ({ ...d, y: 0.12, y1: 0.12 }));

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 320,
      paddingLeft: 24,
      paddingRight: 24,
      paddingTop: 24,
      paddingBottom: 44,
    });

    // Arc diagram with G2 link mark: one-dimensional node order + arc-shaped links.
    chart.options({
      type: 'view',
      scale: {
        x: {
          domain: nodes.map((d) => d.id),
          paddingInner: 0.2,
          paddingOuter: 0.1,
        },
        y: {
          domain: [0, 1],
        },
      },
      children: [
        {
          type: 'lineY',
          data: { type: 'inline', value: [{ base: 0.12 }] },
          encode: { y: 'base' },
          style: {
            stroke: '#94a3b8',
            strokeOpacity: 0.6,
            lineWidth: 1.2,
          },
          axis: false,
          legend: false,
          tooltip: false,
        },
        {
          type: 'link',
          data: {
            type: 'inline',
            value: links,
          },
          encode: {
            x: 'source',
            y: 'y',
            x1: 'target',
            y1: 'y1',
            color: 'group',
            shape: 'arc',
          },
          scale: {
            color: {
              domain: Object.keys(GROUP_COLOR),
              range: Object.values(GROUP_COLOR),
            },
          },
          style: {
            shape: 'arc',
            strokeOpacity: 0.45,
            lineWidth: (d: ArcLinkPoint) => 0.8 + d.value * 0.2,
          },
          tooltip: {
            title: (d: ArcLinkPoint) => `${d.source} → ${d.target}`,
            items: [
              { field: 'value', name: '关联强度' },
              { field: 'group', name: '关系类别' },
            ],
          },
          legend: {
            color: {
              position: 'top',
              itemLabelFontSize: 11,
            },
          },
          interaction: [{ type: 'elementHighlight' }],
        },
        {
          type: 'point',
          data: {
            type: 'inline',
            value: nodes,
          },
          encode: {
            x: 'id',
            y: 'y',
            color: 'group',
            size: 'size',
          },
          scale: {
            size: {
              range: [4, 10],
            },
            color: {
              domain: Object.keys(GROUP_COLOR),
              range: Object.values(GROUP_COLOR),
            },
          },
          style: {
            stroke: '#ffffff',
            lineWidth: 1.4,
          },
          labels: [
            {
              text: 'id',
              dy: 12,
              textAlign: 'center',
              textBaseline: 'top',
              fill: '#334155',
              fontSize: 10,
              fontWeight: 600,
            },
          ],
          axis: false,
          legend: false,
          tooltip: {
            title: (d: ArcNodePoint) => d.id,
            items: [
              { field: 'group', name: '节点类别' },
              { field: 'size', name: '节点权重' },
            ],
          },
        },
      ],
      axis: {
        x: {
          title: false,
          label: false,
          tick: false,
          line: false,
        },
        y: {
          title: false,
          label: false,
          tick: false,
          line: false,
          grid: false,
        },
      },
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '320px' }} />;
}
