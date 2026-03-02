'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import DataSet from '@antv/data-set';
import hexbinData from './demoData/Density2DG2.json';

type HexbinSourceDatum = {
  x: number;
  y: number;
};

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
      type: 'point',
      data: {
        type: 'inline',
        value: hexbinData,
        transform: [
          {
            type: 'custom',
            callback: (data: HexbinSourceDatum[]) => {
              const dv = new DataSet.View().source(data);
              dv.transform({
                type: 'bin.hexagon',
                fields: ['x', 'y'],
                binWidth: [8, 8],
                as: ['x', 'y', 'count'],
              });
              return dv.rows;
            },
          },
        ],
      },
      encode: {
        x: 'x',
        y: 'y',
        color: 'count',
        size: 'count',
        shape: 'hexagon',
      },
      scale: {
        color: { palette: 'ylGnBu' },
        size: { range: [6, 22] },
      },
      style: {
        stroke: '#fff',
        lineWidth: 1,
        fillOpacity: 0.85,
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
