'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import streamData from './demoData/StreamgraphG2.json';

type StreamDatum = {
  date: string;
  unemployed: number;
  industry: string;
};

export function StreamgraphG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      theme: 'classic',
      autoFit: true,
      height: 300,
    });

    chart.options({
      type: 'area',
      data: {
        type: 'inline',
        value: streamData,
      },
      encode: {
        x: (d: StreamDatum) => new Date(d.date),
        y: 'unemployed',
        color: 'industry',
        shape: 'smooth',
      },
      transform: [
        { type: 'stackY' },
        { type: 'symmetryY' }, // 官方范例：对称分布
      ],
      axis: {
        x: { title: false },
        y: { title: false }
      },
      tooltip: {
        items: [{ field: 'unemployed', name: '人数' }]
      }
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '300px' }} />;
}
