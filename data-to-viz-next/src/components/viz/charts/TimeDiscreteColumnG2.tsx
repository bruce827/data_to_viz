'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import data from './demoData/TimeDiscreteColumnG2.json';

type Datum = {
  month: string;
  value: number;
};

export function TimeDiscreteColumnG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 320,
      paddingLeft: 52,
      paddingRight: 16,
      paddingTop: 20,
      paddingBottom: 40,
    });

    chart.options({
      type: 'interval',
      data: {
        type: 'inline',
        value: data,
      },
      encode: {
        x: 'month',
        y: 'value',
      },
      style: {
        fill: '#0ea5a4',
        fillOpacity: 0.88,
        radiusTopLeft: 4,
        radiusTopRight: 4,
      },
      labels: [
        {
          text: (d: Datum) => `${d.value.toFixed(1)}`,
          dy: -6,
          fill: '#0f172a',
          fontSize: 10,
          fontWeight: 600,
        },
      ],
      axis: {
        x: { title: false },
        y: { title: '新增付费用户（万）' },
      },
      tooltip: {
        title: (d: Datum) => d.month,
        items: [{ field: 'value', name: '新增付费用户（万）' }],
      },
    });

    chart.render();
    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '320px' }} />;
}
