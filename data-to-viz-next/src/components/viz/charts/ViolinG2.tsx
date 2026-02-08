'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import violinData from './demoData/ViolinG2.json';

export function ViolinG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 300,
    });

chart.options({
  type: 'density',
  data: {
    type: 'inline',
    value:violinData ,
    transform: [
      {
        type: 'kde',
        field: 'y',
        groupBy: ['x'],
        size: 20,
      },
    ],
  },
  encode: {
    x: 'x',
    y: 'y',
    color: 'x',
    size: 'size',
  },
  tooltip: false,
});

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '300px' }} />;
}