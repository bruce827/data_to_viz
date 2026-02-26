'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import sankeyData from './demoData/SankeyG2.json';

type SankeyDatum = {
  source?: string;
  target?: string;
  value?: number;
  name?: string;
};

export function SankeyG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 300,
      paddingLeft: 12,
      paddingRight: 12,
      paddingTop: 12,
      paddingBottom: 12,
    });

    // Follow official G2 Sankey pattern: type=sankey + links data.
    chart.options({
      type: 'sankey',
      data: { value: sankeyData },
      layout: {
        nodeAlign: 'justify',
        nodePadding: 0.05,
      },
      encode: {
        color: (d: SankeyDatum) => d.source || d.name,
      },
      scale: {
        color: {
          range: ['#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#0f766e', '#0ea5a4'],
        },
      },
      style: {
        labelSpacing: 4,
        labelFontSize: 12,
        labelFontWeight: 700,
        labelFill: '#334155',
        nodeStroke: '#ffffff',
        nodeStrokeWidth: 1,
        linkFillOpacity: 0.42,
      },
      tooltip: {
        title: (d: SankeyDatum) =>
          d.source && d.target ? `${d.source} → ${d.target}` : d.name || '',
        items: [{ field: 'value', name: '流量' }],
      },
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '300px' }} />;
}
