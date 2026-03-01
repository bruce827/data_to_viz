'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type Point = {
  second: string;
  latency: number;
};

const WINDOW_SIZE = 60;

function formatSecond(offset: number): string {
  const date = new Date(Date.now() + offset * 1000);
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${mm}:${ss}`;
}

function nextLatency(prev: number): number {
  const delta = (Math.random() - 0.5) * 14;
  const spike = Math.random() < 0.08 ? Math.random() * 26 : 0;
  return Math.max(28, Math.min(180, prev + delta + spike));
}

export function TimeContinuousLineRealtimeG2() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef<Point[]>([]);
  const valueRef = useRef<number>(68);

  useEffect(() => {
    if (!containerRef.current) return;

    const initialData: Point[] = [];
    for (let i = -WINDOW_SIZE + 1; i <= 0; i += 1) {
      const next = nextLatency(valueRef.current);
      valueRef.current = next;
      initialData.push({
        second: formatSecond(i),
        latency: Number(next.toFixed(1)),
      });
    }
    dataRef.current = initialData;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 320,
      paddingLeft: 56,
      paddingRight: 16,
      paddingTop: 20,
      paddingBottom: 44,
    });

    chart.options({
      type: 'view',
      data: {
        type: 'inline',
        value: initialData,
      },
      children: [
        {
          type: 'line',
          encode: {
            x: 'second',
            y: 'latency',
            shape: 'smooth',
          },
          style: {
            stroke: '#2563eb',
            lineWidth: 2.4,
          },
        },
        {
          type: 'point',
          encode: {
            x: 'second',
            y: 'latency',
          },
          style: {
            fill: '#2563eb',
            stroke: '#ffffff',
            lineWidth: 1.2,
            r: 2.8,
          },
          tooltip: false,
        },
      ],
      axis: {
        x: { title: '时间（mm:ss）' },
        y: { title: '接口耗时（ms）' },
      },
      interaction: {
        tooltip: { shared: true },
      },
      tooltip: {
        title: (d: Point) => d.second,
        items: [{ field: 'latency', name: '接口耗时（ms）' }],
      },
    });

    chart.render();

    const timerId = window.setInterval(() => {
      const next = nextLatency(valueRef.current);
      valueRef.current = next;

      const nextData = [...dataRef.current.slice(1), { second: formatSecond(0), latency: Number(next.toFixed(1)) }];
      dataRef.current = nextData;
      chart.changeData(nextData);
    }, 1000);

    return () => {
      window.clearInterval(timerId);
      chart.destroy();
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '320px' }} />;
}
