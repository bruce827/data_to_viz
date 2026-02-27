'use client';

import React, { useEffect, useRef } from 'react';
import { Runtime, corelib, graphlib, extend } from '@antv/g2';
import sunburstHierarchyData from './demoData/SunburstHierarchyG2.json';

type SunburstNode = {
  name: string;
  value?: number;
  children?: SunburstNode[];
};

type SunburstDatum = {
  name?: string;
  value?: number;
  path?: string[];
  depth?: number;
};

const HIERARCHY_COLOR_SCALE: Record<string, string[]> = {
  消费电子: ['#1d4ed8', '#3b82f6', '#93c5fd'],
  家电: ['#0f766e', '#14b8a6', '#99f6e4'],
  智能家居: ['#166534', '#22c55e', '#86efac'],
  default: ['#475569', '#94a3b8', '#cbd5e1'],
};

function getHierarchyColor(d: SunburstDatum) {
  const depth = typeof d.depth === 'number' ? d.depth : 0;
  if (depth <= 0) return '#334155';

  const topGroup = d.path?.[1] || d.path?.[0] || 'default';
  const palette = HIERARCHY_COLOR_SCALE[topGroup] || HIERARCHY_COLOR_SCALE.default;
  const index = Math.min(depth - 1, palette.length - 1);
  return palette[Math.max(0, index)];
}

const graphLibrary = graphlib();
const HierarchySunburstChart = extend(Runtime, {
  ...corelib(),
  ...graphLibrary,
  // Keep official sunburst API shape by mapping to partition mark.
  'mark.sunburst': graphLibrary['mark.partition'],
});

function normalizeValue(node: SunburstNode): SunburstNode {
  if (!node.children || node.children.length === 0) {
    return { ...node, value: node.value ?? 0 };
  }

  const children = node.children.map(normalizeValue);
  const sum = children.reduce((acc, child) => acc + (child.value ?? 0), 0);
  return {
    ...node,
    children,
    value: node.value ?? sum,
  };
}

function formatValue(value?: number) {
  if (typeof value !== 'number') return '';
  return `${value}万`;
}

export function SunburstHierarchyG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const root = normalizeValue(sunburstHierarchyData as SunburstNode);

    const chart = new HierarchySunburstChart({
      container: containerRef.current,
      autoFit: true,
      height: 380,
      padding: 4,
    });

    chart.options({
      type: 'sunburst',
      data: [root],
      coordinate: {
        type: 'polar',
        innerRadius: 0.02,
        outerRadius: 0.98
      },
      encode: {
        value: 'value',
      },
      style: {
        fill: (d: SunburstDatum) => getHierarchyColor(d),
        stroke: '#ffffff',
        lineWidth: 1,
        fillOpacity: 0.9,
      },
      labels: [
        {
          text: (d: SunburstDatum) => {
            const name = d.name || '';
            const value = formatValue(d.value);
            return value ? `${name}\n${value}` : name;
          },
          transform: [{ type: 'overflowHide' }],
          style: {
            fill: '#ffffff',
            fontWeight: 800,
            fontSize: 12,
            lineHeight: 15,
          },
        },
      ],
      legend: false,
      tooltip: {
        title: (d: SunburstDatum) => d.name || '',
        items: [{ field: 'value', name: '利润（万元）' }],
      },
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '380px' }} />;
}
