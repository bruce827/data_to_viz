'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import packingData from './demoData/CircularPackingG2.json';

type PackDatum = {
  data?: {
    name?: string;
    value?: number;
  };
  depth?: number;
  height?: number;
  r?: number;
};

export function CircularPackingG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 300,
      padding: 8,
    });

    // Follow official G2 pack chart pattern.
    chart.options({
      type: 'pack',
      data: { value: packingData },
      layout: { padding: 3 },
      encode: {
        value: 'value',
        color: (d: PackDatum) => d.depth ?? 0,
      },
      scale: {
        color: {
          range: ['#dbeafe', '#93c5fd', '#60a5fa', '#2563eb'],
        },
      },
      style: {
        stroke: '#ffffff',
        lineWidth: 1,
        labelText: (d: PackDatum) => {
          if ((d.r ?? 0) < 14) return '';
          return d.height === 0 ? d.data?.name || '' : '';
        },
        labelFill: '#0f172a',
        labelFontSize: 10,
        labelFontWeight: 600,
      },
      legend: false,
      tooltip: {
        title: (d: PackDatum) => d.data?.name || '',
        items: [{ field: 'value', name: '数值' }],
      },
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '300px' }} />;
}
