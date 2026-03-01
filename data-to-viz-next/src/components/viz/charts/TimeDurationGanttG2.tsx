'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import data from './demoData/TimeDurationGanttG2.json';

type Datum = {
  task: string;
  phase: string;
  owner: string;
  startDay: number;
  endDay: number;
  progress: number;
};

export function TimeDurationGanttG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 320,
      paddingLeft: 94,
      paddingRight: 18,
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
        x: 'task',
        y: 'startDay',
        y1: 'endDay',
        color: 'phase',
      },
      coordinate: {
        transform: [{ type: 'transpose' }],
      },
      scale: {
        color: {
          domain: ['规划', '设计', '开发', '测试', '发布'],
          range: ['#3b82f6', '#0ea5a4', '#6366f1', '#f59e0b', '#ef4444'],
        },
      },
      style: {
        radiusTopLeft: 4,
        radiusTopRight: 4,
        radiusBottomLeft: 4,
        radiusBottomRight: 4,
      },
      labels: [
        {
          text: (d: Datum) => `${d.startDay}-${d.endDay}天`,
          fill: '#0f172a',
          fontSize: 10,
          fontWeight: 600,
          dy: -2,
        },
      ],
      axis: {
        x: {
          title: false,
        },
        y: {
          title: '项目时间（天）',
        },
      },
      legend: {
        color: {
          title: false,
        },
      },
      tooltip: {
        title: (d: Datum) => d.task,
        items: [
          { field: 'phase', name: '阶段' },
          { field: 'owner', name: '负责人' },
          { field: 'startDay', name: '开始天' },
          { field: 'endDay', name: '结束天' },
          { field: 'progress', name: '完成度(%)' },
        ],
      },
      interaction: [{ type: 'elementHighlight', background: true }],
    });

    chart.render();
    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '320px' }} />;
}
