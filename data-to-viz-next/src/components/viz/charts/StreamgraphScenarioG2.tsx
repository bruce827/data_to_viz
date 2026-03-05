'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

export function StreamgraphFundingScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 360,
    });

    chart.data({
      type: 'fetch',
      value: '/data/g2/unemployment-by-industry.json',
    });

    chart
      .area()
      .transform({ type: 'stackY' })
      .transform({ type: 'symmetryY' })
      .encode('x', (d: { date: string }) => new Date(d.date))
      .encode('y', 'unemployed')
      .encode('color', 'industry');

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '360px' }} />;
}
