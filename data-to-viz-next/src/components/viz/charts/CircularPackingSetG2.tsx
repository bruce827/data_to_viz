'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type VennDatum = {
  sets: string[];
  label?: string;
};

export function CircularPackingSetG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 320,
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 12,
      paddingBottom: 12,
    });

    chart.options({
      type: 'path',
      data: {
        type: 'fetch',
        value: 'https://assets.antv.antgroup.com/g2/lastfm.json',
        transform: [
          {
            type: 'venn',
            padding: 12,
            sets: 'sets',
            size: 'size',
            as: ['key', 'path'],
          },
        ],
      },
      encode: {
        d: 'path',
        color: 'key',
      },
      labels: [
        {
          position: 'inside',
          text: (d: VennDatum) => d.label || '',
          style: {
            fontSize: 12,
            fontWeight: 'bold',
          },
          transform: [{ type: 'contrastReverse' }],
        },
      ],
      style: {
        opacity: (d: VennDatum) => (d.sets.length > 1 ? 0.4 : 0.7),
        stroke: '#fff',
        lineWidth: 2,
      },
      scale: {
        color: {
          range: ['#667eea', '#764ba2', '#f093fb'],
        },
      },
      state: {
        inactive: { opacity: 0.1 },
        active: { opacity: 0.9 },
      },
      interaction: [{ type: 'elementHighlight' }],
      legend: false,
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '320px' }} />;
}
