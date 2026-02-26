'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import pieData from './demoData/PieG2.json';

export function PieG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 300,
      paddingLeft: 16,
      paddingRight: 84,
      paddingTop: 16,
      paddingBottom: 16,
    });

    const total = pieData.reduce((sum, item) => sum + item.value, 0);

    chart
      .interval()
      .data(pieData)
      .transform({ type: 'stackY' })
      .coordinate({ type: 'theta', innerRadius: 0.5, outerRadius: 0.82 })
      .encode('y', 'value')
      .encode('color', 'type')
      .scale('color', {
        range: ['#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'],
      })
      .style('stroke', '#ffffff')
      .style('lineWidth', 2)
      .legend('color', { position: 'right' })
      .tooltip({
        items: [
          (d: { type: string; value: number }) => ({
            name: d.type,
            value: `${d.value} (${((d.value / total) * 100).toFixed(1)}%)`,
          }),
        ],
      });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '300px' }} />;
}
