'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import stackedAreaData from './demoData/StackedAreaG2.json';

export function StackedAreaG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 300,
    });

    chart.options({
      type: 'area',
      data: {
        type: 'inline',
        value: stackedAreaData,
      },
      transform: [
        { type: 'stackY' }
      ],
      encode: {
        x: 'year',
        y: 'value',
        color: 'category',
        shape: 'smooth',
      },
      scale: {
        color: { palette: 'category10' }
      },
      style: {
        fillOpacity: 0.7,
      },
      axis: {
        x: { title: '年份' },
        y: { title: '数值' }
      },
      tooltip: {
        items: ['value']
      }
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '300px' }} />;
}
