'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { Chart } from '@antv/g2';

type Datum = {
  weekday: string;
  week: string;
  orders: number;
};

const WEEKDAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

function createSeededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function buildSeasonalData(): Datum[] {
  const rand = createSeededRandom(20260302);
  const dayBias = [1.08, 1.02, 0.98, 1.0, 1.14, 0.74, 0.62];
  const data: Datum[] = [];

  for (let week = 1; week <= 10; week += 1) {
    const weeklyTrend = 1 + (week - 5) * 0.022;
    for (let day = 0; day < WEEKDAYS.length; day += 1) {
      const base = 390;
      const seasonWave = 1 + Math.sin((week / 10) * Math.PI * 1.4) * 0.08;
      const noise = (rand() - 0.5) * 48;
      const orders = Math.round(base * weeklyTrend * dayBias[day] * seasonWave + noise);
      data.push({
        weekday: WEEKDAYS[day],
        week: `W${week}`,
        orders,
      });
    }
  }

  return data;
}

export function TimeCyclicSeasonalG2() {
  const data = useMemo(() => buildSeasonalData(), []);
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>(
    WEEKDAYS.reduce<Record<string, HTMLDivElement | null>>((acc, day) => {
      acc[day] = null;
      return acc;
    }, {}),
  );

  useEffect(() => {
    const charts: Chart[] = [];

    WEEKDAYS.forEach((day) => {
      const container = panelRefs.current[day];
      if (!container) return;

      const dayData = data.filter((d) => d.weekday === day);

      const chart = new Chart({
        container,
        autoFit: true,
        height: 120,
        paddingLeft: 32,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 24,
      });

      chart.options({
        type: 'view',
        data: {
          type: 'inline',
          value: dayData,
        },
        children: [
          {
            type: 'line',
            encode: {
              x: 'week',
              y: 'orders',
            },
            style: {
              stroke: '#2563eb',
              lineWidth: 2,
            },
          },
          {
            type: 'point',
            encode: {
              x: 'week',
              y: 'orders',
            },
            style: {
              fill: '#2563eb',
              r: 2.5,
              stroke: '#ffffff',
              lineWidth: 1,
            },
            tooltip: false,
          },
        ],
        axis: {
          x: {
            title: false,
            tick: false,
            labelFontSize: 10,
          },
          y: {
            title: false,
            gridLineDash: [2, 2],
            labelFontSize: 10,
          },
        },
        tooltip: {
          title: (d: Datum) => `${d.weekday} / ${d.week}`,
          items: [{ field: 'orders', name: '订单量' }],
        },
      });

      chart.render();
      charts.push(chart);
    });

    return () => {
      charts.forEach((chart) => chart.destroy());
    };
  }, [data]);

  return (
    <div className="w-full h-[320px]">
      <div className="mb-2 px-1 text-xs font-medium text-slate-600">同一星期位置在不同周次的波动（季节子序列）</div>
      <div className="grid h-[292px] grid-cols-4 gap-2">
        {WEEKDAYS.map((day) => (
          <div key={day} className="rounded-md border border-slate-200 bg-white p-1">
            <div className="px-1 pb-0.5 text-[11px] font-semibold text-slate-600">{day}</div>
            <div
              ref={(node) => {
                panelRefs.current[day] = node;
              }}
              className="h-[100px] w-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
