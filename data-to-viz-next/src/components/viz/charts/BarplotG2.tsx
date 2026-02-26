'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import barplotData from './demoData/BarplotG2.json';

export function BarplotG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 300,
      paddingLeft: 80,
      paddingRight: 24,
      paddingBottom: 36,
    });

    chart.options({
      type: 'interval',
      data: {
        type: 'inline',
        value: barplotData,
      },
      encode: {
        x: 'category',
        y: 'value',
        color: 'category',
      },
      coordinate: {
        transform: [{ type: 'transpose' }],
      },
      legend: false,
      scale: {
        y: { nice: true },
        color: {
          range: ['#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'],
        },
      },
      axis: {
        x: { title: '类别' },
        y: { title: '数量' },
      },
      style: {
        fillOpacity: 0.9,
      },
      tooltip: {
        items: ['category', 'value'],
      },
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '300px' }} />;
}
