'use client';

import React, { useEffect, useRef } from 'react';
import { Graph } from '@antv/g6';
import weightedData from './demoData/WeightedNetworkG6.json';

const NODE_GROUP_COLORS: Record<string, string> = {
  区域: '#2563eb',
  中台: '#0ea5a4',
  服务: '#0284c7',
};

type NodeStyleDatum = {
  data?: {
    label?: string;
    group?: string;
    size?: number;
  };
};

type EdgeStyleDatum = {
  data?: {
    value?: number;
  };
};

function buildInitialScatter<T extends { id: string; style?: Record<string, unknown> }>(
  nodes: T[],
): Array<T & { style: Record<string, unknown> }> {
  const total = Math.max(nodes.length, 1);
  const radius = 95;
  return nodes.map((node, index) => {
    const angle = (Math.PI * 2 * index) / total;
    const x = 150 + Math.cos(angle) * radius;
    const y = 145 + Math.sin(angle) * radius;
    return {
      ...node,
      style: {
        ...(node.style || {}),
        x,
        y,
      },
    };
  });
}

function getEdgeColor(value: number): string {
  if (value >= 140) return '#1d4ed8';
  if (value >= 100) return '#2563eb';
  if (value >= 70) return '#3b82f6';
  if (value >= 50) return '#60a5fa';
  return '#93c5fd';
}

export function WeightedNetworkG6() {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let disposed = false;
    let rendered = false;
    const seededData = {
      ...weightedData,
      nodes: buildInitialScatter(weightedData.nodes),
    };

    const graph = new Graph({
      container: containerRef.current,
      data: seededData,
      padding: 12,
      layout: {
        type: 'force',
        preventOverlap: true,
        nodeStrength: -75,
        linkDistance: 120,
      },
      node: {
        type: 'circle',
        style: {
          size: (d: NodeStyleDatum) => d.data?.size ?? 24,
          fill: (d: NodeStyleDatum) => (d.data?.group && NODE_GROUP_COLORS[d.data.group]) || '#3b82f6',
          stroke: '#ffffff',
          lineWidth: 1.5,
          labelText: (d: NodeStyleDatum) => d.data?.label ?? '',
          labelPlacement: 'bottom',
          labelFill: '#334155',
          labelFontSize: 12,
          labelFontWeight: 600,
          labelOffsetY: 6,
        },
      },
      edge: {
        type: 'line',
        style: {
          stroke: (d: EdgeStyleDatum) => getEdgeColor(d.data?.value ?? 0),
          strokeOpacity: 0.85,
          lineWidth: (d: EdgeStyleDatum) => {
            const value = d.data?.value ?? 0;
            return Math.max(1.2, value / 24);
          },
          labelText: (d: EdgeStyleDatum) => `${d.data?.value ?? 0}`,
          labelFill: '#1e293b',
          labelFontSize: 11,
          labelFontWeight: 700,
          labelBackground: true,
          labelBackgroundFill: '#ffffff',
          labelBackgroundOpacity: 0.85,
          labelPadding: [1, 3],
        },
      },
      behaviors: ['drag-canvas', 'zoom-canvas', 'drag-element'],
      autoFit: {
        type: 'view',
      },
      animation: true,
    });
    graphRef.current = graph;

    const safeDestroy = () => {
      try {
        graph.stopLayout();
      } catch {
        // ignore
      }
      try {
        graph.destroy();
      } catch {
        // ignore
      }
      if (graphRef.current === graph) {
        graphRef.current = null;
      }
    };

    graph
      .render()
      .then(() => {
        rendered = true;
        if (disposed) safeDestroy();
      })
      .catch(() => {
        if (disposed) safeDestroy();
      });

    return () => {
      disposed = true;
      if (rendered) safeDestroy();
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '300px' }} />;
}
