'use client';

import React, { useEffect, useRef } from 'react';
import { Graph } from '@antv/g6';
import communityData from './demoData/CommunityNetworkG6.json';

const COMMUNITY_COLORS: Record<string, string> = {
  A: '#2563eb',
  B: '#0ea5a4',
  C: '#8b5cf6',
};

type CommunityNodeStyleDatum = {
  data?: {
    label?: string;
    community?: string;
    size?: number;
  };
};

type CommunityEdgeStyleDatum = {
  data?: {
    value?: number;
  };
};

export function CommunityNetworkG6() {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let disposed = false;
    let rendered = false;

    const graph = new Graph({
      container: containerRef.current,
      data: communityData,
      padding: 12,
      layout: {
        type: 'force',
        preventOverlap: true,
        nodeStrength: -90,
        linkDistance: (d: CommunityEdgeStyleDatum) => {
          const value = d.data?.value ?? 4;
          return Math.max(80, 130 - value * 4);
        },
      },
      node: {
        type: 'circle',
        style: {
          size: (d: CommunityNodeStyleDatum) => d.data?.size ?? 22,
          fill: (d: CommunityNodeStyleDatum) =>
            (d.data?.community && COMMUNITY_COLORS[d.data.community]) || '#2563eb',
          stroke: '#ffffff',
          lineWidth: 1.5,
          labelText: (d: CommunityNodeStyleDatum) => d.data?.label ?? '',
          labelPlacement: 'bottom',
          labelFill: '#334155',
          labelFontSize: 11,
          labelFontWeight: 600,
          labelOffsetY: 6,
        },
      },
      edge: {
        type: 'line',
        style: {
          stroke: '#94a3b8',
          strokeOpacity: 0.48,
          lineWidth: (d: CommunityEdgeStyleDatum) => Math.max(1.2, (d.data?.value ?? 4) / 3),
        },
      },
      behaviors: ['drag-canvas', 'zoom-canvas', 'drag-element'],
      autoFit: {
        type: 'view',
      },
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

  return <div ref={containerRef} style={{ width: '100%', height: '360px' }} />;
}
