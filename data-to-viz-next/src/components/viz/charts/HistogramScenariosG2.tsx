'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

const dpdDistributionData = [
  { bin: '0', accounts: 820000, ratio: '82.0%', balance: 1640, rollRate: '0.6%' },
  { bin: '1-30', accounts: 105000, ratio: '10.5%', balance: 210, rollRate: '12.0%' },
  { bin: '31-60', accounts: 32000, ratio: '3.2%', balance: 70, rollRate: '28.0%' },
  { bin: '61-90', accounts: 18000, ratio: '1.8%', balance: 45, rollRate: '41.0%' },
  { bin: '91-180', accounts: 15000, ratio: '1.5%', balance: 55, rollRate: '18.0%' },
  { bin: '>180', accounts: 10000, ratio: '1.0%', balance: 80, rollRate: '6.0%' },
];

export function HistogramDpdScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 300,
      paddingLeft: 60,
      paddingRight: 24,
      paddingBottom: 48,
    });

    chart.options({
      type: 'interval',
      data: {
        type: 'inline',
        value: dpdDistributionData,
      },
      encode: {
        x: 'bin',
        y: 'accounts',
      },
      scale: {
        y: { nice: true },
      },
      axis: {
        x: { title: 'DPD 分箱（天）' },
        y: { title: '账户数' },
      },
      style: {
        fill: '#2563eb',
        fillOpacity: 0.86,
      },
      tooltip: {
        items: ['bin', 'accounts', 'ratio', 'balance', 'rollRate'],
      },
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '300px' }} />;
}
