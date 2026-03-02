'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import bubbleData from './demoData/BubbleG2.json';

export function BubbleG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 300,
    });

    chart.options({
      type: 'point',
      data: {
        type: 'inline',
        value: bubbleData,
      },
      encode: {
        x: 'gdp',
        y: 'lifeExp',
        size: 'pop',
        color: 'continent',
        shape: 'point',
      },
      scale: {
        x: { type: 'log' },
        y: { domain: [50, 90] },
        size: { range: [5, 30] }
      },
      axis: {
        x: { title: '人均 GDP (对数刻度)' },
        y: { title: '预期寿命 (年)' },
      },
      style: {
        fillOpacity: 0.6,
        stroke: '#fff',
        lineWidth: 1,
      },
      tooltip: {
        items: ['gdp', 'lifeExp', 'pop', 'continent']
      }
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '300px' }} />;
}
