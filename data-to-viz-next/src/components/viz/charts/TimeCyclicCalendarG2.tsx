'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { Chart } from '@antv/g2';

type Datum = {
  week: string;
  weekday: string;
  orders: number;
  slot: string;
};

const WEEKDAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

function createSeededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function buildCalendarData(): Datum[] {
  const rand = createSeededRandom(20260301);
  const dayBias = [1.05, 1.0, 0.98, 1.02, 1.12, 0.78, 0.66];
  const data: Datum[] = [];

  for (let week = 1; week <= 12; week += 1) {
    const weeklyTrend = 1 + (week - 6) * 0.018;
    for (let day = 0; day < WEEKDAYS.length; day += 1) {
      const base = 420;
      const noise = (rand() - 0.5) * 60;
      const orders = Math.round(base * weeklyTrend * dayBias[day] + noise);
      data.push({
        week: `W${week}`,
        weekday: WEEKDAYS[day],
        orders,
        slot: `第${week}周 ${WEEKDAYS[day]}`,
      });
    }
  }

  return data;
}

export function TimeCyclicCalendarG2() {
  const containerRef = useRef<HTMLDivElement>(null);
  const data = useMemo(() => buildCalendarData(), []);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 320,
      paddingLeft: 62,
      paddingRight: 16,
      paddingTop: 24,
      paddingBottom: 38,
    });

    chart.options({
      type: 'cell',
      data: {
        type: 'inline',
        value: data,
      },
      encode: {
        x: 'week',
        y: 'weekday',
        color: 'orders',
      },
      scale: {
        color: {
          range: ['#dbeafe', '#93c5fd', '#3b82f6', '#1d4ed8'],
        },
      },
      style: {
        stroke: '#ffffff',
        lineWidth: 1.2,
      },
      labels: [
        {
          text: (d: Datum) => (d.orders >= 500 ? `${d.orders}` : ''),
          fill: '#0f172a',
          fontSize: 10,
          fontWeight: 600,
        },
      ],
      axis: {
        x: { title: '周次' },
        y: { title: '星期' },
      },
      tooltip: {
        title: (d: Datum) => d.slot,
        items: [{ field: 'orders', name: '订单量' }],
      },
      legend: {
        color: { title: false },
      },
      interaction: [{ type: 'elementHighlight', background: true }],
    });

    chart.render();
    return () => chart.destroy();
  }, [data]);

  return <div ref={containerRef} style={{ width: '100%', height: '320px' }} />;
}
