'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

export function HistogramG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 400,
    });

    // Generate random normal distribution data
    const data = Array.from({ length: 500 }, () => ({
      value: (Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3
    }));

    chart
      .rect()
      .data(data)
      .encode('x', 'value')
      .encode('y', 'count') // Histogram transform will generate 'count'
      .transform({ type: 'binX', y: 'count' })
      .style('inset', 0.5)
      .style('fill', '#3b82f6') // Blue-500
      .axis('x', { title: 'Value' })
      .axis('y', { title: 'Frequency' });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} />;
}
