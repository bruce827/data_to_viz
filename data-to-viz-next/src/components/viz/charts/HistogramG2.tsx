'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type BinDatum = {
  x0: number;
  x1: number;
};

export function HistogramG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 300,
      paddingLeft: 40,
      paddingRight: 20,
      paddingBottom: 40,
    });

    // Generate random normal distribution data for a better "demo" look
    const data = Array.from({ length: 1000 }, () => ({
      value: (Math.random() + Math.random() + Math.random() + Math.random()) * 25
    }));

    chart
      .rect()
      .data(data)
      .encode('x', 'value')
      .encode('y', 'count')
      .transform({ type: 'binX', y: 'count' })
      .style('inset', 1)
      .style('fill', '#2563eb') // Blue-600
      .style('fillOpacity', 0.8)
      .axis('x', { title: '变量值', titleFontSize: 12 })
      .axis('y', { title: '频数', titleFontSize: 12 })
      .tooltip({
        showMarkers: false,
        title: (d: BinDatum) => `范围: ${Math.floor(d.x0)} - ${Math.floor(d.x1)}`,
        items: [{ channel: 'y', name: '计数' }]
      });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} />;
}
