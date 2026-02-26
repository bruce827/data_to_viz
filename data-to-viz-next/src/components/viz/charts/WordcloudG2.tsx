'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import wordcloudData from './demoData/WordcloudG2.json';

export function WordcloudG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 300,
      padding: 12,
    });

    chart.options({
      type: 'wordCloud',
      data: {
        type: 'inline',
        value: wordcloudData,
      },
      encode: {
        text: 'text',
        value: 'value',
        color: 'group',
      },
      scale: {
        color: {
          range: ['#1d4ed8', '#2563eb', '#3b82f6', '#0f766e', '#475569', '#0369a1'],
        },
      },
      style: {
        fontFamily: 'sans-serif',
        fontWeight: 600,
      },
      layout: {
        spiral: 'archimedean',
        fontSize: [14, 54],
        rotate: () => 0,
        padding: 2,
      },
      legend: false,
      tooltip: {
        items: ['text', 'value'],
      },
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '300px' }} />;
}
