'use client';

import React, { useEffect, useRef } from 'react';
import { Graph } from '@antv/g6';
import forceData from './demoData/ForceDirectedNetworkG6.json';

const GROUP_COLORS: Record<string, string> = {
  核心: '#2563eb',
  平台: '#0ea5a4',
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

export function ForceDirectedNetworkG6() {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let disposed = false;
    let rendered = false;
    const seededData = {
      ...forceData,
      nodes: buildInitialScatter(forceData.nodes),
    };

    const graph = new Graph({
      container: containerRef.current,
      data: seededData,
      padding: 12,
      layout: {
        type: 'force',
        preventOverlap: true,
        nodeStrength: -80,
        linkDistance: (d: EdgeStyleDatum) => {
          const value = d.data?.value ?? 6;
          return Math.max(90, 140 - value * 4);
        },
      },
      node: {
        type: 'circle',
        style: {
          size: (d: NodeStyleDatum) => d.data?.size ?? 24,
          fill: (d: NodeStyleDatum) => (d.data?.group && GROUP_COLORS[d.data.group]) || '#3b82f6',
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
          stroke: '#94a3b8',
          strokeOpacity: 0.5,
          lineWidth: (d: EdgeStyleDatum) => Math.max(1.2, (d.data?.value ?? 4) / 4),
          endArrow: true,
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
