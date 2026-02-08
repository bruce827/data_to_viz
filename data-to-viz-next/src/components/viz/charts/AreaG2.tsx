'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

export function AreaG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. 初始化图表
    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 300,
    });

    // 2. 生成模拟数据 (格式需完全符合官方示例的要求)
    // 两个城市在连续时间点的温度
    const data = Array.from({ length: 100 }, (_, i) => {
      const date = new Date(2023, 0, 1 + i).toISOString().split('T')[0]; // "2023-01-01"
      const trend = Math.sin(i / 10) * 10;
      return {
        date,
        'San Francisco': 15 + trend + Math.random() * 2,
        'New York': 12 + trend + Math.sin(i / 3) * 8 // 制造明显的交叉
      };
    });

    // 3. 使用 Options API (Spec 写法) - 这是你提供的官方范例写法
    chart.options({
      type: 'area',
      data: {
        value: data,
        // 关键：先通过 fold 将宽表变长表
        transform: [
          {
            type: 'fold',
            fields: ['San Francisco', 'New York'],
            key: 'city',
            value: 'temperature',
          },
        ],
      },
      // 关键：应用 diffY 变换
      transform: [{ type: 'diffY' }], 
      encode: {
        x: 'date',
        y: 'temperature',
        color: 'city',
      },
      scale: {
        color: { range: ['#3b82f6', '#ef4444'] }, // 蓝 vs 红
      },
      axis: {
        x: { title: 'Date' },
        y: { title: 'Temperature' }
      },
      style: {
        fillOpacity: 0.7
      }
    });

    // 4. 渲染
    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '300px' }} />;
}
