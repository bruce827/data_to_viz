'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

export function ScatterG2() {
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

    // Generate correlated data for a better "demo" look
    const data = Array.from({ length: 150 }, () => {
      const x = 150 + Math.random() * 40;
      const y = (x - 150) * 1.5 + 45 + (Math.random() - 0.5) * 20;
      return {
        height: x,
        weight: y,
        category: Math.random() > 0.5 ? '组A' : '组B',
      };
    });

    chart
      .point()
      .data(data)
      .encode('x', 'height')
      .encode('y', 'weight')
      .encode('color', 'category')
      .scale('color', { range: ['#2563eb', '#f59e0b'] }) // Blue and Amber
      .style('fillOpacity', 0.6)
      .style('stroke', '#fff')
      .style('lineWidth', 1)
      .axis('x', { title: '身高 (cm)', titleFontSize: 12 })
      .axis('y', { title: '体重 (kg)', titleFontSize: 12 })
      .tooltip({
        showMarkers: true,
        title: (d: any) => `详情`,
        items: [
          { channel: 'x', name: '身高' },
          { channel: 'y', name: '体重' },
          { channel: 'color', name: '类别' }
        ]
      });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} />;
}
