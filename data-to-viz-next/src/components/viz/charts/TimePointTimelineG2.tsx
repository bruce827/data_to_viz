'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type Datum = {
  time: Date;
  lane: string;
  severity: '提示' | '预警' | '严重';
  score: number;
  event: string;
};

const SEVERITY_COLORS: Record<Datum['severity'], string> = {
  提示: '#3b82f6',
  预警: '#f59e0b',
  严重: '#ef4444',
};

function formatHourMinute(value: string | number | Date): string {
  const date = new Date(value);
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${hour}:${minute}`;
}

function buildTimelineData(): Datum[] {
  return [
    { time: new Date('2026-02-26T07:38:00'), lane: '支付路由', severity: '提示', score: 28, event: '延迟抬升' },
    { time: new Date('2026-02-26T07:45:00'), lane: '短信网关', severity: '提示', score: 24, event: '回执变慢' },
    { time: new Date('2026-02-26T07:52:00'), lane: '风控引擎', severity: '预警', score: 48, event: '阈值收紧' },
    { time: new Date('2026-02-26T08:00:00'), lane: '核心清算', severity: '严重', score: 86, event: '人工接管' },
    { time: new Date('2026-02-26T08:08:00'), lane: '支付路由', severity: '严重', score: 92, event: '备通道切入' },
    { time: new Date('2026-02-26T08:18:00'), lane: '客服热线', severity: '预警', score: 55, event: '投诉抬升' },
    { time: new Date('2026-02-26T08:30:00'), lane: '核心清算', severity: '预警', score: 44, event: '人工退坡' },
    { time: new Date('2026-02-26T08:44:00'), lane: '支付路由', severity: '提示', score: 26, event: '趋于稳定' },
  ];
}

export function TimePointTimelineG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 320,
      paddingLeft: 86,
      paddingRight: 16,
      paddingTop: 20,
      paddingBottom: 42,
    });

    const data = buildTimelineData();

    chart.options({
      type: 'point',
      data: {
        type: 'inline',
        value: data,
      },
      scale: {
        color: {
          domain: ['提示', '预警', '严重'],
          range: ['#3b82f6', '#f59e0b', '#ef4444'],
        },
      },
      encode: {
        x: 'time',
        y: 'lane',
        color: 'severity',
      },
      style: {
        fill: (d: Datum) => SEVERITY_COLORS[d.severity],
        stroke: '#ffffff',
        lineWidth: 1.4,
        r: (d: Datum) => 4 + ((d.score - 20) / 80) * 6,
        fillOpacity: 0.9,
      },
      labels: [
        {
          text: (d: Datum) => (d.severity === '严重' ? d.event : ''),
          dy: -12,
          fill: '#0f172a',
          fontSize: 10,
          fontWeight: 600,
        },
      ],
      axis: {
        x: {
          title: '事件时间',
          labelFormatter: formatHourMinute,
        },
        y: {
          title: false,
        },
      },
      legend: {
        color: {
          title: '事件级别',
        },
      },
      tooltip: {
        title: (d: Datum) => formatHourMinute(d.time),
        items: [
          { field: 'lane', name: '链路' },
          { field: 'event', name: '事件' },
          { field: 'severity', name: '级别' },
          { field: 'score', name: '影响分' },
        ],
      },
      interaction: [{ type: 'elementHighlight', background: true }],
    });

    chart.render();
    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '320px' }} />;
}
