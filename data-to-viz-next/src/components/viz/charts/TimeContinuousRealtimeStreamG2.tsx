'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type Datum = {
  second: string;
  service: string;
  value: number;
};

type Slice = {
  second: string;
  gateway: number;
  trade: number;
  message: number;
};

const WINDOW_SIZE = 40;
const SERVICES = ['API网关', '交易服务', '消息服务'] as const;

function formatSecond(offset: number): string {
  const date = new Date(Date.now() + offset * 1000);
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${mm}:${ss}`;
}

function nextValue(base: number, noise: number, min: number, max: number): number {
  const delta = (Math.random() - 0.5) * noise;
  return Math.max(min, Math.min(max, base + delta));
}

function toRows(series: Slice[]): Datum[] {
  return series.flatMap((s) => [
    { second: s.second, service: 'API网关', value: Number(s.gateway.toFixed(1)) },
    { second: s.second, service: '交易服务', value: Number(s.trade.toFixed(1)) },
    { second: s.second, service: '消息服务', value: Number(s.message.toFixed(1)) },
  ]);
}

export function TimeContinuousRealtimeStreamG2() {
  const containerRef = useRef<HTMLDivElement>(null);
  const seriesRef = useRef<Slice[]>([]);
  const stateRef = useRef({ gateway: 92, trade: 68, message: 50 });

  useEffect(() => {
    if (!containerRef.current) return;

    const initialSeries: Slice[] = [];
    for (let i = -WINDOW_SIZE + 1; i <= 0; i += 1) {
      const gateway = nextValue(stateRef.current.gateway, 16, 60, 140);
      const trade = nextValue(stateRef.current.trade, 14, 38, 110);
      const message = nextValue(stateRef.current.message, 12, 25, 90);
      stateRef.current = { gateway, trade, message };

      initialSeries.push({
        second: formatSecond(i),
        gateway,
        trade,
        message,
      });
    }
    seriesRef.current = initialSeries;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 320,
      paddingLeft: 56,
      paddingRight: 20,
      paddingTop: 20,
      paddingBottom: 44,
    });

    chart.options({
      type: 'area',
      data: {
        type: 'inline',
        value: toRows(seriesRef.current),
      },
      transform: [{ type: 'stackY' }, { type: 'symmetryY' }],
      encode: {
        x: 'second',
        y: 'value',
        color: 'service',
        shape: 'smooth',
      },
      scale: {
        color: {
          domain: [...SERVICES],
          range: ['#2563eb', '#0ea5a4', '#f59e0b'],
        },
      },
      style: {
        fillOpacity: 0.72,
      },
      axis: {
        x: { title: '时间（mm:ss）' },
        y: { title: '每秒事件量' },
      },
      tooltip: {
        title: (d: Datum) => d.second,
        items: [
          { field: 'service', name: '服务' },
          { field: 'value', name: '每秒事件量' },
        ],
      },
      interaction: {
        tooltip: { shared: true },
      },
      legend: {
        color: { position: 'top' },
      },
    });

    chart.render();

    const timerId = window.setInterval(() => {
      const gateway = nextValue(stateRef.current.gateway, 16, 60, 140);
      const trade = nextValue(stateRef.current.trade, 14, 38, 110);
      const message = nextValue(stateRef.current.message, 12, 25, 90);
      stateRef.current = { gateway, trade, message };

      const nextSeries = [
        ...seriesRef.current.slice(1),
        {
          second: formatSecond(0),
          gateway,
          trade,
          message,
        },
      ];
      seriesRef.current = nextSeries;
      chart.changeData(toRows(nextSeries));
    }, 1000);

    return () => {
      window.clearInterval(timerId);
      chart.destroy();
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '320px' }} />;
}
