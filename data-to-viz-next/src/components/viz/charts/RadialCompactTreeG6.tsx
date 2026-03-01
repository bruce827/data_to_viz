'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useRef } from 'react';
import { Graph, treeToGraphData } from '@antv/g6';

export function RadialCompactTreeG6() {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    let disposed = false;
    const mountNode = document.createElement('div');
    mountNode.style.width = '100%';
    mountNode.style.height = '100%';
    containerRef.current.appendChild(mountNode);
    const safeDestroy = () => {
      if (!graphRef.current) return;
      const graph = graphRef.current;
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
      graphRef.current = null;
    };

    fetch('https://assets.antv.antgroup.com/g6/flare.json')
      .then((res) => res.json())
      .then((data) => {
        if (disposed) return;

        const graph = new Graph({
          container: mountNode,
          autoFit: 'view',
          padding: 50,
          data: treeToGraphData(data as any),
          node: {
            style: {
              size: 12,
              labelText: (d: any) => d.id,
              labelBackground: true,
              labelFontSize: 14,
              labelFontFamily: 'Gill Sans',
            },
          },
          edge: {
            type: 'cubic-radial',
            style: {
              lineWidth: 3,
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

        graph
          .render()
          .then(() => {
            if (disposed) safeDestroy();
          })
          .catch(() => {
            if (disposed) return;
          });
      })
      .catch(() => {
        // ignore
      });

    return () => {
      disposed = true;
      safeDestroy();
      if (mountNode.parentNode) mountNode.parentNode.removeChild(mountNode);
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '420px' }} />;
}
