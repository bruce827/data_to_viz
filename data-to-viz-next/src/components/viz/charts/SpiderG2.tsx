'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import spiderData from './demoData/SpiderG2.json';

type SpiderDatum = {
  series?: string;
  dimension?: string;
  score?: number;
};

export function SpiderG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 300,
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 20,
      paddingBottom: 20,
    });

    // Radar chart in G2: polar coordinate + area/line/point marks.
    chart.options({
      type: 'view',
      coordinate: { type: 'polar' },
      scale: {
        y: { min: 0, max: 100 },
        color: { range: ['#2563eb', '#0ea5a4'] },
      },
      axis: {
        x: { title: false },
        y: { title: false },
      },
      children: [
        {
          type: 'area',
          data: { type: 'inline', value: spiderData },
          encode: { x: 'dimension', y: 'score', color: 'series' },
          style: { fillOpacity: 0.16 },
        },
        {
          type: 'line',
          data: { type: 'inline', value: spiderData },
          encode: { x: 'dimension', y: 'score', color: 'series' },
          style: { lineWidth: 2 },
        },
        {
          type: 'point',
          data: { type: 'inline', value: spiderData },
          encode: { x: 'dimension', y: 'score', color: 'series', shape: 'point' },
          style: { r: 3, stroke: '#ffffff', lineWidth: 1 },
          tooltip: {
            title: (d: SpiderDatum) => `${d.series || ''} - ${d.dimension || ''}`,
            items: [{ field: 'score', name: '评分' }],
          },
        },
      ],
      legend: {
        color: { position: 'top' },
      },
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '300px' }} />;
}
