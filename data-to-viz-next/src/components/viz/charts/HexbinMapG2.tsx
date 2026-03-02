'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import DataSet from '@antv/data-set';

type HexbinMapSourceDatum = {
  longitude: number;
  latitude: number;
};

export function HexbinMapG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 320,
    });

    chart
      .polygon()
      .data({
        type: 'fetch',
        value: 'https://assets.antv.antgroup.com/g2/hexbin-china.json',
        transform: [
          {
            type: 'custom',
            callback: (data: HexbinMapSourceDatum[]) => {
              const dv = new DataSet.View().source(data).transform({
                type: 'bin.hexagon',
                fields: ['longitude', 'latitude'],
                binWidth: [2, 3],
                as: ['longitude', 'latitude', 'count'],
              });
              return dv.rows;
            },
          },
        ],
      })
      .encode('x', 'longitude')
      .encode('y', 'latitude')
      .encode('color', 'count')
      .scale('color', {
        range: '#BAE7FF-#1890FF-#0050B3',
      })
      .style('lineWidth', 5)
      .style('stroke', '#fff')
      .axis(false)
      .legend(false)
      .tooltip({
        field: 'count',
      })
      .state('active', {
        stroke: '#f97316',
        lineWidth: 6,
      })
      .state('inactive', { opacity: 1 })
      .interaction('elementHighlight', true);

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '320px' }} />;
}
