'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import circularPackingSetData from './demoData/CircularPackingSetG2.json';

type PackDatum = {
  depth?: number;
  r?: number;
  data?: {
    name?: string;
    value?: number;
    group?: string;
  };
};

export function CircularPackingSetG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 320,
      padding: 8,
    });

    chart.options({
      type: 'pack',
      data: {
        value: circularPackingSetData,
      },
      layout: { padding: 3 },
      encode: {
        value: 'value',
        color: (d: PackDatum) => d.data?.group || '分组',
      },
      style: {
        fillOpacity: 0.9,
        stroke: '#ffffff',
        lineWidth: 1.5,
        labelText: (d: PackDatum) => {
          if ((d.depth ?? 0) <= 0) return '';
          if ((d.r ?? 0) < 16) return '';
          return d.data?.name || '';
        },
        labelFill: '#0f172a',
        labelFontWeight: 700,
        labelFontSize: 11,
      },
      scale: {
        color: {
          range: ['#1d4ed8', '#3b82f6', '#f59e0b', '#ef4444'],
        },
      },
      interaction: [{ type: 'elementHighlight' }],
      legend: false,
      tooltip: {
        title: (d: PackDatum) => d.data?.name || '',
        items: [{ field: 'value', name: '规模' }],
      },
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '320px' }} />;
}
