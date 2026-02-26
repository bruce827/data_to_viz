'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import lineSevData from './demoData/LineSevG2.json';

export function LineSevG2() {
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
        value: lineSevData,
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
          }
        },
        {
          type: 'point',
          encode: {
            x: 'month',
            y: 'temp',
            color: 'city',
          },
          style: {
            r: 3,
            stroke: '#fff',
            lineWidth: 1
          },
          tooltip: false
        }
      ],
      scale: {
        color: { palette: 'category10' }
      },
      axis: {
        x: { title: '月份' },
        y: { title: '温度 (℃)' }
      },
      interaction: {
        tooltip: { shared: true }
      }
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '300px' }} />;
}
