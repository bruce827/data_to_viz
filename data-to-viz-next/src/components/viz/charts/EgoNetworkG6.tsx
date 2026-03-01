'use client';

import React, { useEffect, useRef } from 'react';
import { Graph } from '@antv/g6';
import egoData from './demoData/EgoNetworkG6.json';

const ROLE_COLORS: Record<string, string> = {
  center: '#1d4ed8',
  neighbor: '#0ea5a4',
  outer: '#94a3b8',
};

type NodeDatum = {
  data?: {
    label?: string;
    role?: string;
    size?: number;
  };
};

type EdgeDatum = {
  data?: {
    value?: number;
  };
};

export function EgoNetworkG6() {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let disposed = false;
    let rendered = false;

    const graph = new Graph({
      container: containerRef.current,
      data: egoData,
      padding: [12, 20, 12, 20],
      node: {
        type: 'circle',
        style: {
          size: (d: NodeDatum) => d.data?.size ?? 24,
          fill: (d: NodeDatum) => ROLE_COLORS[d.data?.role ?? 'neighbor'] ?? '#0ea5a4',
          fillOpacity: (d: NodeDatum) => (d.data?.role === 'outer' ? 0.75 : 0.92),
          stroke: '#ffffff',
          lineWidth: 1.5,
          labelText: (d: NodeDatum) => d.data?.label ?? '',
          labelPlacement: 'bottom',
          labelFill: '#334155',
          labelFontSize: (d: NodeDatum) => (d.data?.role === 'center' ? 13 : 11),
          labelFontWeight: (d: NodeDatum) => (d.data?.role === 'center' ? 700 : 600),
          labelOffsetY: 6,
        },
      },
      edge: {
        type: 'line',
        style: {
          stroke: '#64748b',
          strokeOpacity: 0.45,
          lineWidth: (d: EdgeDatum) => Math.max(1.1, (d.data?.value ?? 2) / 3.5),
        },
      },
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

  return <div ref={containerRef} style={{ width: '100%', height: '320px' }} />;
}
