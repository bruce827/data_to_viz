'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import density2Data from './demoData/Density2DG2.json';

export function Density2DG2() {
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
        value: density2Data,
      },
      children: [
        {
          type: 'heatmap',
          transform: [
            {
              type: 'kernelDensity',
              as: ['x', 'y', 'count'],
            },
          ],
          encode: {
            x: 'x',
            y: 'y',
            color: 'count',
          },
          scale: {
            color: { palette: 'interpolateBlues' }
          },
          style: {
             fillOpacity: 0.8
          }
        },
        {
          type: 'point',
          encode: {
             x: 'x',
             y: 'y'
          },
          style: {
             fill: 'white',
             fillOpacity: 0.2,
             stroke: '#000',
             strokeOpacity: 0.1,
             lineWidth: 1,
             size: 2
          }
        }
      ],
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
