'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import parallelData from './demoData/ParallelG2.json';

export function ParallelG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 300,
    });

    // 定义要展示的维度
    const position = [
      'sepal_length',
      'sepal_width',
      'petal_length',
      'petal_width'
    ];

    chart.options({
      type: 'line',
      data: {
        type: 'inline',
        value: parallelData,
      },
      coordinate: { type: 'parallel' },
      encode: {
        position: position,
        color: 'species'
      },
      style: {
        lineWidth: 2,
        strokeOpacity: 0.4
      },
      axis: {
        // 修正：移除 v.replace，先检查 v 是否存在
        position: {
          labelFormatter: (v: any) => {
            if (typeof v === 'string') return v.replace('_', ' ');
            return v;
          }
        }
      },
      tooltip: {
        items: [{ field: 'species', name: '品种' }]
      }
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '300px' }} />;
}