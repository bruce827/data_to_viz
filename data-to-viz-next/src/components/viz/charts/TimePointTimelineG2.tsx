'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type Datum = {
  sample: string;
  speed_t: number;
  speed_t1: number;
  type: '正常' | '异常';
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function createSeededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function buildLagSpeedData(): Datum[] {
  const rand = createSeededRandom(20260301);
  const normalData: Datum[] = [];

  let current = 64;
  for (let i = 0; i < 96; i += 1) {
    current = clamp(current + (rand() - 0.5) * 14, 28, 122);
    const next = clamp(current + (rand() - 0.5) * 12, 24, 126);
    normalData.push({
      sample: `N-${i + 1}`,
      speed_t: Number(current.toFixed(1)),
      speed_t1: Number(next.toFixed(1)),
      type: '正常',
    });
  }

  const anomalyData: Datum[] = [
    { sample: 'A-1', speed_t: 31.2, speed_t1: 104.8, type: '异常' },
    { sample: 'A-2', speed_t: 109.4, speed_t1: 39.6, type: '异常' },
    { sample: 'A-3', speed_t: 42.8, speed_t1: 116.2, type: '异常' },
    { sample: 'A-4', speed_t: 121.3, speed_t1: 54.5, type: '异常' },
    { sample: 'A-5', speed_t: 95.7, speed_t1: 22.9, type: '异常' },
    { sample: 'A-6', speed_t: 24.9, speed_t1: 86.3, type: '异常' },
  ];

  return [...normalData, ...anomalyData];
}

export function TimePointTimelineG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 320,
      paddingLeft: 88,
      paddingRight: 16,
      paddingTop: 20,
      paddingBottom: 44,
    });

    const data = buildLagSpeedData();

    chart.options({
      type: 'view',
      data: {
        type: 'inline',
        value: data,
      },
      scale: {
        x: {
          nice: true,
        },
        y: {
          nice: true,
        },
      },
      children: [
        {
          type: 'line',
          data: {
            type: 'inline',
            value: [
              { x: 20, y: 20 },
              { x: 130, y: 130 },
            ],
          },
          encode: {
            x: 'x',
            y: 'y',
          },
          style: {
            stroke: '#94a3b8',
            lineDash: [4, 4],
            lineWidth: 1.2,
          },
          tooltip: false,
          legend: false,
        },
        {
          type: 'point',
          data: {
            type: 'inline',
            value: data.filter((d) => d.type === '正常'),
          },
          encode: {
            x: 'speed_t',
            y: 'speed_t1',
          },
          style: {
            fill: '#2563eb',
            stroke: '#ffffff',
            lineWidth: 1,
            r: 4.5,
            fillOpacity: 0.85,
          },
          tooltip: false,
          legend: false,
        },
        {
          type: 'point',
          data: {
            type: 'inline',
            value: data.filter((d) => d.type === '异常'),
          },
          encode: {
            x: 'speed_t',
            y: 'speed_t1',
          },
          style: {
            fill: '#ef4444',
            stroke: '#111827',
            lineWidth: 1.1,
            r: 8,
            fillOpacity: 0.95,
          },
          labels: [
            {
              text: 'sample',
              dy: -10,
              fill: '#0f172a',
              fontSize: 10,
              fontWeight: 700,
            },
          ],
          tooltip: {
            title: (d: Datum) => d.sample,
            items: [
              { field: 'speed_t', name: 't 时刻速度(km/h)' },
              { field: 'speed_t1', name: 't+1 时刻速度(km/h)' },
              { field: 'type', name: '点类型' },
            ],
          },
          legend: false,
        },
      ],
      axis: {
        x: {
          title: '汽车 t 时刻速度 (km/h)',
        },
        y: {
          title: '汽车 t+1 时刻速度 (km/h)',
        },
      },
      interaction: {
        tooltip: { shared: false },
      },
    });

    chart.render();
    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '320px' }} />;
}
