'use client';

import React, { useEffect, useRef } from 'react';
import { Graph } from '@antv/g6';
import bipartiteData from './demoData/BipartiteNetworkG6.json';

const SIDE_COLORS: Record<string, string> = {
  left: '#2563eb',
  right: '#0ea5a4',
};

type NodeDatum = {
  data?: {
    label?: string;
    side?: string;
    size?: number;
  };
};

type EdgeDatum = {
  data?: {
    value?: number;
  };
};

export function BipartiteNetworkG6() {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let disposed = false;
    let rendered = false;

    const graph = new Graph({
      container: containerRef.current,
      data: bipartiteData,
      padding: [20, 24, 16, 24],
      node: {
        type: 'rect',
        style: {
          size: (d: NodeDatum) => [72, d.data?.size ?? 28],
          radius: 8,
          fill: (d: NodeDatum) => SIDE_COLORS[d.data?.side ?? 'left'] ?? '#2563eb',
          fillOpacity: 0.84,
          stroke: '#ffffff',
          lineWidth: 1.5,
          labelText: (d: NodeDatum) => d.data?.label ?? '',
          labelFill: '#ffffff',
          labelFontSize: 12,
          labelFontWeight: 700,
          labelPlacement: 'center',
        },
      },
      edge: {
        type: 'line',
        style: {
          stroke: '#64748b',
          strokeOpacity: 0.45,
          lineWidth: (d: EdgeDatum) => Math.max(1.2, (d.data?.value ?? 3) / 3),
          endArrow: true,
        },
      },
      behaviors: ['drag-canvas', 'zoom-canvas'],
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

  return <div ref={containerRef} style={{ width: '100%', height: '320px' }} />;
}
