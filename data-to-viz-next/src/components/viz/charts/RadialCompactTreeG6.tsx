'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useRef } from 'react';
import { Graph, treeToGraphData } from '@antv/g6';
import radialCompactTreeData from './demoData/RadialCompactTreeG6.json';

export function RadialCompactTreeG6() {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = '';

    let disposed = false;
    let rendered = false;
    let destroyed = false;
    const mountNode = document.createElement('div');
    mountNode.style.width = '100%';
    mountNode.style.height = '100%';
    container.appendChild(mountNode);
    const safeDestroy = () => {
      if (destroyed || !graphRef.current) return;
      destroyed = true;
      const graph = graphRef.current;
      try {
        graph.destroy();
      } catch {
        // ignore
      }
      graphRef.current = null;
      if (mountNode.parentNode === container) {
        container.removeChild(mountNode);
      }
    };

    const graph = new Graph({
      container: mountNode,
      autoFit: 'view',
      padding: 50,
      data: treeToGraphData(radialCompactTreeData as any),
      node: {
        style: {
          size: (d: any) => (d.depth === 0 ? 22 : 14),
          fill: (d: any) => {
            if (d.depth === 0) return '#0f172a';
            if (d.depth === 1) return '#2563eb';
            return '#0ea5a4';
          },
          stroke: '#ffffff',
          lineWidth: 1.4,
          labelText: (d: any) => d.id,
          labelBackground: true,
          labelBackgroundFill: '#ffffff',
          labelPadding: [2, 4],
          labelFontSize: 12,
          labelFill: '#334155',
          labelFontFamily: 'Gill Sans',
        },
      },
      edge: {
        type: 'cubic-radial',
        style: {
          stroke: '#94a3b8',
          lineWidth: 2.2,
        },
      },
      layout: {
        type: 'compact-box',
        radial: true,
        direction: 'RL',
        getVGap: () => 40,
        getHGap: () => 80,
        preLayout: false,
      },
      behaviors: [
        'drag-canvas',
        'zoom-canvas',
        'drag-element',
        {
          key: 'hover-activate',
          type: 'hover-activate',
          degree: 5,
          direction: 'in',
          inactiveState: 'inactive',
        },
      ],
      transforms: ['place-radial-labels'],
      animation: false,
    });

    graphRef.current = graph;

    const renderPromise = graph
      .render()
      .then(() => {
        rendered = true;
        if (disposed) safeDestroy();
      })
      .catch((error: unknown) => {
        if (!disposed) {
          console.error(error);
        }
        if (disposed) safeDestroy();
      });

    return () => {
      disposed = true;
      if (rendered) {
        safeDestroy();
      } else {
        void renderPromise.finally(() => {
          safeDestroy();
        });
      }
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '420px' }} />;
}
