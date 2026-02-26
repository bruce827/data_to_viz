'use client';

import React, { useEffect, useRef } from 'react';
import { Graph } from '@antv/g6';
import networkData from './demoData/NetworkG6.json';

const GROUP_COLORS: Record<string, string> = {
  业务: '#2563eb',
  平台: '#0ea5a4',
  服务: '#0f766e',
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

export function NetworkG6() {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const graph = new Graph({
      container: containerRef.current,
      data: networkData,
      padding: 12,
      layout: {
        type: 'force',
        preventOverlap: true,
        linkDistance: 110,
      },
      node: {
        type: 'circle',
        style: {
          size: (d: NodeStyleDatum) => d.data?.size ?? 24,
          fill: (d: NodeStyleDatum) =>
            (d.data?.group && GROUP_COLORS[d.data.group]) || '#3b82f6',
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
          targetArrow: true,
        },
      },
      behaviors: ['drag-canvas', 'zoom-canvas', 'drag-element'],
      autoFit: {
        type: 'view',
      },
      animation: true,
    });

    graph.render();
    graphRef.current = graph;

    return () => {
      graphRef.current?.destroy();
      graphRef.current = null;
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '300px' }} />;
}
