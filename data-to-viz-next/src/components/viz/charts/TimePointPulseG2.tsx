'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import rawData from './demoData/TimePointPulseG2.json';

type RawDatum = {
  time: string;
  score: number;
  level: string;
  event: string;
};

type Datum = {
  time: Date;
  score: number;
  level: string;
  event: string;
  baseline: number;
};

export function TimePointPulseG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 320,
      paddingLeft: 52,
      paddingRight: 16,
      paddingTop: 20,
      paddingBottom: 46,
    });

    chart.options({
      type: 'view',
      data: {
        type: 'inline',
        value: rawData,
        transform: [
          {
            type: 'map',
            callback: (d: RawDatum) => ({
              ...d,
              time: new Date(d.time),
              baseline: 0,
            }),
          },
        ],
      },
      scale: {
        y: {
          domain: [0, 100],
        },
        color: {
          domain: ['高', '中', '低'],
          range: ['#ef4444', '#f59e0b', '#3b82f6'],
        },
      },
      children: [
        {
          type: 'lineY',
          data: {
            type: 'inline',
            value: [{ baseline: 0 }],
          },
          encode: { y: 'baseline' },
          style: {
            stroke: '#64748b',
            lineWidth: 1.4,
          },
          legend: false,
        },
        {
          type: 'link',
          encode: {
            x: 'time',
            y: ['baseline', 'score'],
            color: 'level',
          },
          style: {
            lineWidth: 2.2,
            strokeOpacity: 0.92,
          },
          tooltip: false,
          legend: false,
        },
        {
          type: 'point',
          encode: {
            x: 'time',
            y: 'score',
            color: 'level',
          },
          style: {
            r: 4.5,
            stroke: '#ffffff',
            lineWidth: 1.2,
          },
          labels: [
            {
              text: (d: Datum) => d.event,
              dy: -10,
              fill: '#0f172a',
              fontSize: 10,
              fontWeight: 600,
            },
          ],
          tooltip: {
            title: (d: Datum) => d.time.toLocaleString(),
            items: [
              { field: 'event', name: '事件' },
              { field: 'level', name: '等级' },
              { field: 'score', name: '强度分' },
            ],
          },
        },
      ],
      axis: {
        x: {
          title: '事件时间',
          labelFormatter: (v: string | number | Date) => {
            const date = new Date(v);
            const hh = String(date.getHours()).padStart(2, '0');
            const mm = String(date.getMinutes()).padStart(2, '0');
            return `${hh}:${mm}`;
          },
        },
        y: {
          title: '事件强度分',
        },
      },
      interaction: {
        tooltip: { shared: true },
      },
    });

    chart.render();
    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '320px' }} />;
}
