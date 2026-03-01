'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import data from './demoData/TimeDiscreteLineG2.json';

type Datum = {
  month: string;
  value: number;
};

export function TimeDiscreteLineG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 320,
      paddingLeft: 48,
      paddingRight: 16,
      paddingTop: 20,
      paddingBottom: 40,
    });

    chart.options({
      type: 'view',
      data: {
        type: 'inline',
        value: data,
      },
      children: [
        {
          type: 'line',
          encode: {
            x: 'month',
            y: 'value',
            shape: 'smooth',
          },
          style: {
            stroke: '#2563eb',
            lineWidth: 2.5,
          },
          tooltip: {
            title: (d: Datum) => d.month,
            items: [{ field: 'value', name: '月活跃用户（万）' }],
          },
        },
        {
          type: 'point',
          encode: {
            x: 'month',
            y: 'value',
          },
          style: {
            fill: '#2563eb',
            stroke: '#ffffff',
            lineWidth: 1.5,
            r: 3.5,
          },
          tooltip: false,
        },
      ],
      axis: {
        x: { title: false },
        y: { title: '月活跃用户（万）' },
      },
      interaction: {
        tooltip: { shared: true },
      },
    });

    chart.render();
    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '320px' }} />;
}
