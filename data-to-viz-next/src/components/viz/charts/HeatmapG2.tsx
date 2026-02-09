'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import heatmapData from './demoData/HeatmapG2.json';

export function HeatmapG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 300,
    });

    chart.options({
      type: 'cell',
      data: {
        type: 'inline',
        value: heatmapData,
      },
      encode: {
        x: 'x',
        y: 'y',
        color: 'value',
      },
      scale: {
        color: {
          palette: 'gnBu',
          nice: true,
        },
      },
      style: {
        inset: 0.5,
      },
      axis: {
        x: { title: '类别 X' },
        y: { title: '级别 Y' },
      },
      tooltip: {
        items: [{ field: 'value', name: '数值' }],
      },
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '300px' }} />;
}
