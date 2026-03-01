'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type HeatCell = {
  second: string;
  bucket: string;
  count: number;
};

const WINDOW_SIZE = 30;
const BUCKETS = ['0-50ms', '50-100ms', '100-150ms', '150-200ms', '200ms+'];

function formatSecond(offset: number): string {
  const date = new Date(Date.now() + offset * 1000);
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${mm}:${ss}`;
}

function generateBucketCounts(base: number): number[] {
  const shift = Math.max(0, Math.min(4, Math.floor(base / 45)));
  const raw = BUCKETS.map((_, idx) => {
    const distance = Math.abs(idx - shift);
    const value = Math.max(0, 14 - distance * 4 + Math.round((Math.random() - 0.5) * 4));
    return value;
  });
  raw[4] += Math.random() < 0.08 ? 4 : 0;
  return raw;
}

function nextBase(prev: number): number {
  const delta = (Math.random() - 0.5) * 20;
  const spike = Math.random() < 0.08 ? 40 : 0;
  return Math.max(35, Math.min(220, prev + delta + spike));
}

export function TimeContinuousDensityRealtimeG2() {
  const containerRef = useRef<HTMLDivElement>(null);
  const seriesRef = useRef<Array<{ second: string; counts: number[] }>>([]);
  const baseRef = useRef<number>(78);

  useEffect(() => {
    if (!containerRef.current) return;

    const initialSeries: Array<{ second: string; counts: number[] }> = [];
    for (let i = -WINDOW_SIZE + 1; i <= 0; i += 1) {
      const base = nextBase(baseRef.current);
      baseRef.current = base;
      initialSeries.push({
        second: formatSecond(i),
        counts: generateBucketCounts(base),
      });
    }
    seriesRef.current = initialSeries;

    const buildCells = (): HeatCell[] => {
      return seriesRef.current.flatMap(({ second, counts }) =>
        BUCKETS.map((bucket, idx) => ({
          second,
          bucket,
          count: counts[idx],
        })),
      );
    };

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 320,
      paddingLeft: 72,
      paddingRight: 16,
      paddingTop: 20,
      paddingBottom: 44,
    });

    chart.options({
      type: 'heatmap',
      data: {
        type: 'inline',
        value: buildCells(),
      },
      encode: {
        x: 'second',
        y: 'bucket',
        color: 'count',
      },
      scale: {
        color: {
          domain: [0, 18],
          palette: 'blues',
        },
      },
      style: {
        stroke: '#ffffff',
        lineWidth: 1,
      },
      axis: {
        x: {
          title: '时间（mm:ss）',
        },
        y: {
          title: '延迟区间',
        },
      },
      tooltip: {
        title: (d: HeatCell) => `${d.second} / ${d.bucket}`,
        items: [{ field: 'count', name: '采样点数' }],
      },
    });

    chart.render();

    const timerId = window.setInterval(() => {
      const base = nextBase(baseRef.current);
      baseRef.current = base;

      const nextSeries = [
        ...seriesRef.current.slice(1),
        {
          second: formatSecond(0),
          counts: generateBucketCounts(base),
        },
      ];
      seriesRef.current = nextSeries;
      chart.changeData(buildCells());
    }, 1000);

    return () => {
      window.clearInterval(timerId);
      chart.destroy();
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '320px' }} />;
}
