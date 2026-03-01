'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { Chart } from '@antv/g2';

type Datum = {
  hour: string;
  value: number;
  series: '工作日' | '周末';
};

function createSeededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function buildClockData(): Datum[] {
  const rand = createSeededRandom(20260303);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const buildOne = (series: '工作日' | '周末') => {
    const base = series === '工作日' ? 110 : 95;
    const morningPeak = series === '工作日' ? 95 : 55;
    const eveningPeak = series === '工作日' ? 85 : 72;

    return hours.map((hour) => {
      const morning = Math.exp(-((hour - 9) ** 2) / 10) * morningPeak;
      const evening = Math.exp(-((hour - 19) ** 2) / 12) * eveningPeak;
      const nightDrop = Math.exp(-((hour - 3) ** 2) / 8) * 38;
      const noise = (rand() - 0.5) * 12;
      const value = Math.max(20, Math.round(base + morning + evening - nightDrop + noise));
      return {
        hour: `${String(hour).padStart(2, '0')}:00`,
        value,
        series,
      };
    });
  };

  return [...buildOne('工作日'), ...buildOne('周末')];
}

export function TimeCyclicClockG2() {
  const containerRef = useRef<HTMLDivElement>(null);
  const data = useMemo(() => buildClockData(), []);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 320,
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 16,
      paddingBottom: 16,
    });

    chart.options({
      type: 'view',
      coordinate: { type: 'polar' },
      data: {
        type: 'inline',
        value: data,
      },
      scale: {
        color: {
          domain: ['工作日', '周末'],
          range: ['#2563eb', '#f59e0b'],
        },
        y: {
          min: 0,
          nice: true,
        },
      },
      children: [
        {
          type: 'area',
          encode: {
            x: 'hour',
            y: 'value',
            color: 'series',
          },
          style: {
            fillOpacity: 0.16,
          },
        },
        {
          type: 'line',
          encode: {
            x: 'hour',
            y: 'value',
            color: 'series',
          },
          style: {
            lineWidth: 2,
          },
        },
        {
          type: 'point',
          encode: {
            x: 'hour',
            y: 'value',
            color: 'series',
          },
          style: {
            r: 2.4,
            stroke: '#ffffff',
            lineWidth: 1,
          },
          tooltip: {
            title: (d: Datum) => `${d.series} / ${d.hour}`,
            items: [{ field: 'value', name: '访问量' }],
          },
        },
      ],
      axis: {
        x: {
          title: false,
          labelFormatter: (v: string) => {
            const hour = Number(v.slice(0, 2));
            return hour % 3 === 0 ? v : '';
          },
        },
        y: {
          title: false,
        },
      },
      legend: {
        color: {
          position: 'top',
          title: false,
        },
      },
      interaction: [{ type: 'elementHighlight' }],
    });

    chart.render();
    return () => chart.destroy();
  }, [data]);

  return <div ref={containerRef} style={{ width: '100%', height: '320px' }} />;
}
