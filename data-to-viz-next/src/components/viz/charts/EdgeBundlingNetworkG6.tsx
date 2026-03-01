'use client';

import React, { useEffect, useRef } from 'react';
import { Graph } from '@antv/g6';
import edgeBundlingData from './demoData/EdgeBundlingNetworkG6.json';

const GROUP_COLOR: Record<string, string> = {
  左侧: '#2563eb',
  右侧: '#0ea5a4',
};

type NodeDatum = {
  data?: {
    label?: string;
    group?: string;
    size?: number;
  };
};

type EdgeDatum = {
  data?: {
    value?: number;
  };
};

export function EdgeBundlingNetworkG6() {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let disposed = false;
    let rendered = false;

    const graph = new Graph({
      container: containerRef.current,
      data: edgeBundlingData,
      padding: [12, 20, 12, 20],
      node: {
        type: 'circle',
        style: {
          size: (d: NodeDatum) => d.data?.size ?? 20,
          fill: (d: NodeDatum) => GROUP_COLOR[d.data?.group ?? '左侧'] ?? '#2563eb',
          stroke: '#ffffff',
          lineWidth: 1.4,
          labelText: (d: NodeDatum) => d.data?.label ?? '',
          labelPlacement: 'right',
          labelFill: '#334155',
          labelFontSize: 11,
          labelFontWeight: 600,
          labelOffsetX: 5,
        },
      },
      edge: {
        type: 'polyline',
        style: {
          stroke: '#64748b',
          strokeOpacity: 0.38,
          lineWidth: (d: EdgeDatum) => Math.max(1, (d.data?.value ?? 3) / 4),
        },
      },
      plugins: [
        {
          type: 'edge-bundling',
          key: 'edge-bundling',
          K: 0.1,
          lambda: 0.1,
          divisions: 1,
          divRate: 2,
          cycles: 4,
          iterations: 70,
          iterRate: 2 / 3,
          bundleThreshold: 0.45,
        },
      ],
      behaviors: ['drag-canvas', 'zoom-canvas', 'drag-element'],
      autoFit: { type: 'view' },
      animation: false,
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
      if (graphRef.current === graph) graphRef.current = null;
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

  return <div ref={containerRef} style={{ width: '100%', height: '340px' }} />;
}
