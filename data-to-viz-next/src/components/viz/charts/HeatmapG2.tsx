'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import DataSet from '@antv/data-set';

type HeatmapSourceDatum = {
  carat: number;
  price: number;
};

export function HeatmapG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 300,
    });

    chart.data({
      type: 'fetch',
      value: 'https://assets.antv.antgroup.com/g2/diamond.json',
    });

    chart.scale('x', { nice: true, domainMin: -0.5 });
    chart.scale('y', { nice: true, domainMin: -2000 });
    chart.scale('color', { nice: true });

    chart
      .heatmap()
      .data({
        transform: [
          {
            type: 'custom',
            callback: (data: HeatmapSourceDatum[]) => {
              const dv = new DataSet.View().source(data);
              dv.transform({
                type: 'kernel-smooth.density',
                fields: ['carat', 'price'],
                method: 'gaussian',
                as: ['carat', 'price', 'density'],
              });
              return dv.rows;
            },
          },
        ],
      })
      .encode('x', 'carat')
      .encode('y', 'price')
      .encode('color', 'density')
      .style({
        opacity: 0.3,
        gradient: [
          [0, 'white'],
          [0.2, 'blue'],
          [0.4, 'cyan'],
          [0.6, 'lime'],
          [0.8, 'yellow'],
          [0.9, 'red'],
        ],
      });

    chart.point().encode('x', 'carat').encode('y', 'price');

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '300px' }} />;
}
