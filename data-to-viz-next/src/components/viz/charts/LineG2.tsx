'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import lineData from './demoData/LineG2.json';

export function LineG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 300,
    });

    chart.options({
      type: 'view',
      data: {
        type: 'inline',
        value: lineData,
      },
      children: [
        {
          type: 'line',
          encode: {
            x: 'month',
            y: 'temp',
            color: 'city',
            shape: 'smooth',
          },
          style: {
            lineWidth: 2,
          },
          label: {
            text: 'temp',
            style: {
              fontSize: 10,
              textAlign: 'center',
              textBaseline: 'middle',
              dx: 0,
              dy: -10,
            },
          },
        },
        {
          type: 'point',
          encode: {
            x: 'month',
            y: 'temp',
            color: 'city',
            shape: 'point',
          },
          tooltip: false,
        }
      ],
      axis: {
        x: { title: '月份' },
        y: { title: '平均气温 (℃)' }
      },
      interaction: {
        tooltip: { shared: true },
      },
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '300px' }} />;
}
