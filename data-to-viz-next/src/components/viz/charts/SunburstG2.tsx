'use client';

import React, { useEffect, useRef } from 'react';
import { Runtime, corelib, graphlib, extend } from '@antv/g2';
import sunburstData from './demoData/SunburstG2.json';

type SunburstNode = {
  name: string;
  value?: number;
  children?: SunburstNode[];
};

type SunburstDatum = {
  name?: string;
  value?: number;
};

const graphLibrary = graphlib();
const SunburstChart = extend(Runtime, {
  ...corelib(),
  ...graphLibrary,
  // Map sunburst to built-in partition mark to keep official API shape.
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

export function SunburstG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const root = normalizeValue(sunburstData as SunburstNode);

    const chart = new SunburstChart({
      container: containerRef.current,
      autoFit: true,
      height: 300,
      padding: 8,
    });

    // Follow official sunburst API shape; use partition mark under the hood.
    chart.options({
      type: 'sunburst',
      data: [root],
      coordinate: { type: 'polar' },
      encode: {
        value: 'value',
        color: 'name',
      },
      scale: {
        color: {
          range: ['#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#0ea5a4', '#0f766e'],
        },
      },
      style: {
        stroke: '#ffffff',
        lineWidth: 1,
        fillOpacity: 0.9,
      },
      labels: [
        {
          text: 'name',
          transform: [{ type: 'overflowHide' }],
          style: { fill: '#ffffff', fontWeight: 700, fontSize: 11 },
        },
      ],
      legend: false,
      tooltip: {
        title: (d: SunburstDatum) => d.name || '',
        items: [{ field: 'value', name: '数值' }],
      },
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '300px' }} />;
}
