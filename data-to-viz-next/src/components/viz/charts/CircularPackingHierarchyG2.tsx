'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import packingHierarchyData from './demoData/CircularPackingHierarchyG2.json';

type PackDatum = {
  depth?: number;
  r?: number;
  value?: number;
  data?: {
    name?: string;
    value?: number;
  };
  parent?: PackDatum | null;
};

const TOP_GROUP_COLORS: Record<string, string[]> = {
  生产: ['#1d4ed8', '#3b82f6', '#93c5fd'],
  营销: ['#0f766e', '#14b8a6', '#99f6e4'],
  运营: ['#166534', '#22c55e', '#86efac'],
  default: ['#475569', '#64748b', '#cbd5e1'],
};

function formatValue(value?: number) {
  if (typeof value !== 'number') return '';
  return `${value}万`;
}

function getTopGroupName(d: PackDatum) {
  if ((d.depth ?? 0) <= 0) return '';

  let cursor: PackDatum | null | undefined = d;
  while (cursor?.parent && (cursor.parent.depth ?? 0) > 0) {
    cursor = cursor.parent;
  }
  return cursor?.data?.name || '';
}

function getFillColor(d: PackDatum) {
  const depth = d.depth ?? 0;
  if (depth <= 0) return '#e2e8f0';

  const topGroup = getTopGroupName(d);
  const palette = TOP_GROUP_COLORS[topGroup] || TOP_GROUP_COLORS.default;
  const index = Math.min(Math.max(depth - 1, 0), palette.length - 1);
  return palette[index];
}

export function CircularPackingHierarchyG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 380,
      padding: 8,
    });

    chart.options({
      type: 'pack',
      data: { value: packingHierarchyData },
      layout: { padding: 3 },
      encode: {
        value: 'value',
      },
      style: {
        fill: (d: PackDatum) => getFillColor(d),
        stroke: '#ffffff',
        lineWidth: 1,
        labelText: (d: PackDatum) => {
          if ((d.depth ?? 0) <= 0) return '';
          if ((d.r ?? 0) < 20) return '';

          const name = d.data?.name || '';
          const rawValue =
            typeof d.data?.value === 'number' ? d.data.value : d.value;
          const value = formatValue(rawValue);

          if ((d.r ?? 0) >= 34 && value && (d.depth ?? 0) >= 2) {
            return `${name}\n${value}`;
          }
          return name;
        },
        labelFill: '#ffffff',
        labelFontSize: 12,
        labelFontWeight: 800,
        labelLineHeight: 15,
      },
      legend: false,
      tooltip: {
        title: (d: PackDatum) => d.data?.name || '',
        items: [{ field: 'value', name: '成本（万元）' }],
      },
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '380px' }} />;
}
