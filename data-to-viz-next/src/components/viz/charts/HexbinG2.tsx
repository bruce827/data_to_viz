'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import hexbinData from './demoData/Density2DG2.json';

export function HexbinG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 300,
    });

    chart.options({
      type: 'rect',
      data: {
        type: 'inline',
        value: hexbinData,
      },
      encode: {
        x: 'x',
        y: 'y',
        color: 'count',
      },
      transform: [
        {
          type: 'bin',
          as: ['x', 'y', 'count'],
          field: 'count',
          method: 'count',
          thresholdsX: 10,
          thresholdsY: 10,
        },
      ],
      scale: {
        color: { palette: 'interpolateYlGnBu' }
      },
      style: {
        stroke: '#fff',
        lineWidth: 1,
      },
      axis: {
        x: { title: '变量 X' },
        y: { title: '变量 Y' }
      }
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '300px' }} />;
}
