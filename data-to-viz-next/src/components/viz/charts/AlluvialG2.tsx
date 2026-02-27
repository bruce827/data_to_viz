'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

export function AlluvialG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 320,
      paddingLeft: 12,
      paddingRight: 12,
      paddingTop: 12,
      paddingBottom: 12,
    });

    chart.options({
      type: 'sankey',
      autoFit: true,
      data: {
        type: 'fetch',
        value: 'https://assets.antv.antgroup.com/g2/energy.json',
        transform: [
          {
            type: 'custom',
            callback: (data: unknown) => ({ links: data }),
          },
        ],
      },
      layout: {
        nodeAlign: 'center',
        nodePadding: 0.03,
      },
      style: {
        labelSpacing: 3,
        labelFontWeight: 'bold',
        nodeStrokeWidth: 1.2,
        linkFillOpacity: 0.4,
      },
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '320px' }} />;
}
