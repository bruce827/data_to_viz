'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import packingSetData from './demoData/CircularPackingSetG2.json';

type PackSetDatum = {
  data?: {
    name?: string;
    value?: number;
    group?: string;
  };
  depth?: number;
  height?: number;
  r?: number;
};

const GROUP_COLOR: Record<string, string> = {
  集合A: '#2563eb',
  集合B: '#0ea5a4',
  集合C: '#16a34a',
  交叉: '#f59e0b',
};

export function CircularPackingSetG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 300,
      padding: 8,
    });

    // Follow official G2 pack chart pattern for set-like grouping.
    chart.options({
      type: 'pack',
      data: { value: packingSetData },
      layout: { padding: 3 },
      encode: {
        value: 'value',
        color: (d: PackSetDatum) => d.data?.group || d.data?.name || '其他',
      },
      scale: {
        color: {
          range: Object.values(GROUP_COLOR),
          domain: Object.keys(GROUP_COLOR),
        },
      },
      style: {
        stroke: '#ffffff',
        lineWidth: 1,
        fillOpacity: 0.86,
        labelText: (d: PackSetDatum) => {
          if ((d.r ?? 0) < 15) return '';
          return d.height === 0 ? d.data?.name || '' : '';
        },
        labelFill: '#0f172a',
        labelFontSize: 10,
        labelFontWeight: 700,
      },
      legend: {
        color: { position: 'right', itemLabelFontSize: 11 },
      },
      tooltip: {
        title: (d: PackSetDatum) => d.data?.name || '',
        items: [{ field: 'value', name: '规模' }],
      },
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '300px' }} />;
}
