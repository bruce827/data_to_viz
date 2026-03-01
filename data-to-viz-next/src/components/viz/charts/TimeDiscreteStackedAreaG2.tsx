'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import data from './demoData/TimeDiscreteStackedAreaG2.json';

type Datum = {
  month: string;
  channel: string;
  value: number;
};

export function TimeDiscreteStackedAreaG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 320,
      paddingLeft: 52,
      paddingRight: 20,
      paddingTop: 20,
      paddingBottom: 40,
    });

    chart.options({
      type: 'area',
      data: {
        type: 'inline',
        value: data,
      },
      transform: [{ type: 'stackY' }],
      encode: {
        x: 'month',
        y: 'value',
        color: 'channel',
        shape: 'smooth',
      },
      scale: {
        color: {
          domain: ['自然流量', '广告投放', '私域运营'],
          range: ['#2563eb', '#0ea5a4', '#f59e0b'],
        },
      },
      style: {
        fillOpacity: 0.72,
      },
      axis: {
        x: { title: false },
        y: { title: '渠道GMV（万元）' },
      },
      legend: {
        color: { position: 'top' },
      },
      tooltip: {
        title: (d: Datum) => d.month,
        items: [
          { field: 'channel', name: '渠道' },
          { field: 'value', name: 'GMV（万元）' },
        ],
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
