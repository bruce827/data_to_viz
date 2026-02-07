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
      height: 400,
    });

    const data = Array.from({ length: 100 }, () => ({
      height: 150 + Math.random() * 50,
      weight: 40 + Math.random() * 60,
      gender: Math.random() > 0.5 ? 'Male' : 'Female',
    }));

    chart
      .point()
      .data(data)
      .encode('x', 'height')
      .encode('y', 'weight')
      .encode('color', 'gender')
      .encode('shape', 'point')
      .style('fillOpacity', 0.6)
      .style('lineWidth', 1);

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} />;
}
