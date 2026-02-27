'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import treemapHierarchyData from './demoData/TreemapHierarchyG2.json';

type TreemapDatum = {
  path?: string[];
  value?: number;
  depth?: number;
  x0?: number;
  x1?: number;
  data?: {
    name?: string;
    value?: number;
  };
};

function formatValue(value?: number) {
  if (typeof value !== 'number') return '';
  return `${value}万`;
}

export function TreemapHierarchyG2() {
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
      data: { value: treemapHierarchyData },
      layout: {
        tile: 'treemapSquarify',
        paddingInner: 2,
      },
      encode: {
        value: 'value',
        color: (d: TreemapDatum) => d.path?.[1] || d.data?.name || '',
      },
      scale: {
        color: {
          range: ['#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#0f766e', '#0369a1'],
        },
      },
      style: {
        labelText: (d: TreemapDatum) => {
          const name = d.data?.name || '';
          const rawValue =
            typeof d.data?.value === 'number' ? d.data.value : d.value;
          const value = formatValue(rawValue);
          return value ? `${name}\n${value}` : name;
        },
        labelPosition: 'top-left',
        labelDx: 4,
        labelDy: 4,
        labelWordWrap: true,
        labelMaxLines: 2,
        labelWordWrapWidth: (d: TreemapDatum) =>
          Math.max((d.x1 ?? 0) - (d.x0 ?? 0) - 8, 20),
        labelFill: '#ffffff',
        labelFontWeight: 800,
        labelFontSize: 13,
        labelLineHeight: 18,
        labelLineWidth: 0.6,
      },
      tooltip: {
        title: (d: TreemapDatum) => d.data?.name || '',
        items: [{ field: 'value', name: '营收（万元）' }],
      },
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '300px' }} />;
}
