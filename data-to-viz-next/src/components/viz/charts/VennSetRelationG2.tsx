'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import vennSetData from './demoData/VennSetRelationG2.json';

type VennDatum = {
  sets?: string[];
  label?: string;
  size?: number;
};

export function VennSetRelationG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 380,
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 16,
      paddingBottom: 16,
    });

    chart.options({
      type: 'path',
      data: {
        type: 'inline',
        value: vennSetData,
        transform: [{ type: 'venn' }],
      },
      encode: {
        d: 'path',
        color: 'key',
      },
      labels: [
        {
          position: 'inside',
          text: (d: VennDatum) => d.label || '',
        },
      ],
      style: {
        opacity: (d: VennDatum) => ((d.sets?.length ?? 0) > 1 ? 0.3 : 0.7),
        stroke: '#ffffff',
        lineWidth: 2,
      },
      state: {
        inactive: { opacity: 0.2 },
        active: { opacity: 0.9 },
      },
      interaction: [{ type: 'elementHighlight' }],
      legend: false,
      tooltip: {
        title: (d: VennDatum) => d.sets?.join(' ∩ ') || '',
        items: [{ field: 'size', name: '人数' }],
      },
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '380px' }} />;
}
