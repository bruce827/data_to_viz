'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import lollipopData from './demoData/LollipopG2.json';

export function LollipopG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 300,
      paddingLeft: 40,
      paddingRight: 24,
      paddingBottom: 28,
      paddingTop: 20,
    });

    chart.options({
      type: 'view',
      data: {
        type: 'inline',
        value: lollipopData,
      },
      scale: {
        y: {
          domain: [-65, 72],
        },
        color: {
          domain: ['neg', 'pos'],
          range: ['#ff1e1e', '#84bd00'],
        },
      },
      children: [
        {
          type: 'interval',
          encode: {
            x: 'category',
            y: 'value',
            color: 'sign',
          },
          style: {
            // Thin stem to mimic pin/lollipop style
            fillOpacity: 1,
            maxWidth: 8,
            radius: 0,
          },
          legend: false,
        },
        {
          type: 'point',
          encode: {
            x: 'category',
            y: 'value',
          },
          style: {
            shape: 'square',
            r: 8,
            fill: '#4a4a4a',
            stroke: '#4a4a4a',
            lineWidth: 1,
          },
          labels: [
            {
              text: 'label',
              dy: (d: { value: number }) => (d.value >= 0 ? -16 : 16),
              textBaseline: (d: { value: number }) => (d.value >= 0 ? 'bottom' : 'top'),
              textAlign: 'center',
              fill: '#111827',
              fontSize: 11,
              fontWeight: 600,
            },
          ],
          tooltip: {
            items: ['category', 'value'],
          },
          legend: false,
        },
        {
          type: 'lineY',
          data: {
            type: 'inline',
            value: [{ baseline: 0 }],
          },
          encode: {
            y: 'baseline',
          },
          style: {
            stroke: '#4b5563',
            lineWidth: 2,
          },
          legend: false,
        },
        {
          type: 'lineY',
          data: {
            type: 'inline',
            value: [{ baseline: -2 }],
          },
          encode: {
            y: 'baseline',
          },
          style: {
            stroke: '#4b5563',
            lineWidth: 1.6,
          },
          legend: false,
        },
      ],
      axis: {
        x: {
          title: false,
          label: false,
          tick: false,
          line: false,
        },
        y: {
          title: false,
          label: false,
          tick: false,
          grid: false,
        },
      },
      legend: false,
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '300px' }} />;
}
