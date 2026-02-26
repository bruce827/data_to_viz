'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import treemapData from './demoData/TreemapG2.json';

export function TreemapG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 300,
      padding: 8,
    });

    chart.options({
      type: 'treemap',
      data: { value: treemapData },
      layout: {
        tile: 'treemapSquarify',
        paddingInner: 2,
      },
      encode: {
        value: 'value',
        color: (d) => d.path?.[1] || d.data?.name,
      },
      scale: {
        color: {
          range: ['#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#0f766e', '#0369a1'],
        },
      },
      style: {
        labelText: (d) => d.data?.name,
        labelFill: '#ffffff',
        labelFontWeight: 700,
        labelFontSize: 12,
        labelLineWidth: 0.4,
      },
      tooltip: {
        title: (d) => d.data?.name,
        items: [{ field: 'value', name: '数值' }],
      },
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '300px' }} />;
}
