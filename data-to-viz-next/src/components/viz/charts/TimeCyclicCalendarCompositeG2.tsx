'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type Datum = {
  activity: string;
  value: number;
  week: string;
  day: string;
};

const DAYS = ['Sun.', 'Mon.', 'Tues.', 'Wed.', 'Thur.', 'Fri.', 'Sat.'];

function createSeededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function mockData(): Datum[] {
  const rand = createSeededRandom(20260304);
  const names = ['Eat', 'Play', 'Sleep'];

  const getWeek = (date: Date) => {
    const currentDate = date.getDate();
    const newDate = new Date(date);
    const firstDay = new Date(newDate.setDate(1)).getDay();
    return Math.ceil((currentDate + firstDay) / 7);
  };

  const getDay = (date: Date) => date.getDay();

  return Array.from({ length: 35 }, (_, i) => {
    const date = new Date(2022, 5, i + 1);
    return names.map((name, idx) => {
      const base = [0.34, 0.28, 0.38][idx];
      const noise = (rand() - 0.5) * 0.1;
      return {
        activity: name,
        value: Math.max(0.08, Math.min(0.88, Number((base + noise).toFixed(3)))),
        week: `${getWeek(date)}`,
        day: DAYS[getDay(date)],
      };
    });
  }).flat();
}

export function TimeCyclicCalendarCompositeG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 320,
      paddingLeft: 42,
      paddingBottom: 40,
    });

    const facetRect = chart
      .facetRect()
      .data(mockData())
      .encode('x', 'day')
      .encode('y', 'week')
      .scale('x', { domain: DAYS })
      .legend('color', { position: 'right' })
      .attr('paddingRight', 88);

    facetRect
      .interval()
      .transform({ type: 'stackY' })
      .axis('x', { labelAutoRotate: false })
      .encode('x', 'activity')
      .encode('y', 'value')
      .encode('color', 'activity')
      .tooltip({
        title: (d: Datum) => `Week ${d.week} / ${d.day}`,
        items: [
          { field: 'activity', name: 'Activity' },
          { field: 'value', name: 'Ratio' },
        ],
      });

    chart.render();
    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '320px' }} />;
}
