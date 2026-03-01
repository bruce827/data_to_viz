'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import data from './demoData/TimeDurationIntervalG2.json';

type Datum = {
  service: string;
  state: string;
  startMinute: number;
  endMinute: number;
  startLabel: string;
  endLabel: string;
};

function minuteToLabel(totalMinute: number): string {
  const baseHour = 9;
  const hour = baseHour + Math.floor(totalMinute / 60);
  const minute = totalMinute % 60;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

export function TimeDurationIntervalG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 320,
      paddingLeft: 92,
      paddingRight: 16,
      paddingTop: 20,
      paddingBottom: 40,
    });

    chart.options({
      type: 'interval',
      data: {
        type: 'inline',
        value: data,
      },
      encode: {
        x: 'service',
        y: 'startMinute',
        y1: 'endMinute',
        color: 'state',
      },
      coordinate: {
        transform: [{ type: 'transpose' }],
      },
      scale: {
        color: {
          domain: ['正常', '降级', '故障', '恢复'],
          range: ['#22c55e', '#f59e0b', '#ef4444', '#3b82f6'],
        },
      },
      style: {
        radiusTopLeft: 3,
        radiusTopRight: 3,
        radiusBottomLeft: 3,
        radiusBottomRight: 3,
      },
      labels: [
        {
          text: (d: Datum) => (d.endMinute - d.startMinute >= 20 ? d.state : ''),
          fill: '#0f172a',
          fontSize: 10,
          fontWeight: 600,
          dy: -1,
        },
      ],
      axis: {
        x: {
          title: false,
        },
        y: {
          title: '时间',
          labelFormatter: (v: string | number) => minuteToLabel(Number(v)),
        },
      },
      legend: {
        color: {
          title: false,
        },
      },
      tooltip: {
        title: (d: Datum) => d.service,
        items: [
          { field: 'state', name: '状态' },
          { field: 'startLabel', name: '开始时间' },
          { field: 'endLabel', name: '结束时间' },
        ],
      },
      interaction: [{ type: 'elementHighlight', background: true }],
    });

    chart.render();
    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '320px' }} />;
}
