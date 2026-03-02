'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type BoxDatum = {
  dept: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
};

export function BoxplotG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 300,
      paddingLeft: 60,
      paddingRight: 20,
      paddingBottom: 40,
    });

    // 1. 模拟并手动计算箱线图统计数据
    const departments = ['研发部', '市场部', '设计部', '行政部'];
    
    // 计算分位数的辅助函数
    const calculateBoxStats = (values: number[], dept: string) => {
      values.sort((a, b) => a - b);
      const q1 = values[Math.floor(values.length * 0.25)];
      const median = values[Math.floor(values.length * 0.5)];
      const q3 = values[Math.floor(values.length * 0.75)];
      const min = values[0];
      const max = values[values.length - 1];
      return { dept, min, q1, median, q3, max };
    };

    const boxData = departments.map(dept => {
      const base = dept === '研发部' ? 15000 : dept === '市场部' ? 10000 : dept === '设计部' ? 12000 : 6000;
      const range = dept === '行政部' ? 3000 : 8000;
      const samples = Array.from({ length: 40 }, () => base + Math.random() * range);
      return calculateBoxStats(samples, dept);
    });

    // 2. 渲染箱线图 (直接传入统计好的数组 [min, q1, median, q3, max])
    chart
      .box()
      .data(boxData)
      .encode('x', 'dept')
      .encode('y', (d: BoxDatum) => [d.min, d.q1, d.median, d.q3, d.max])
      .encode('color', 'dept')
      .scale('color', { range: ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'] })
      .style('stroke', '#1e40af')
      .style('fillOpacity', 0.6)
      .axis('y', { title: '月薪 (元/典型数据)', titleFontSize: 12 })
      .axis('x', { title: '部门', titleFontSize: 12 })
      .tooltip({
        items: [
          { name: '最大值', field: 'max' },
          { name: '上四分位', field: 'q3' },
          { name: '中位数', field: 'median' },
          { name: '下四分位', field: 'q1' },
          { name: '最小值', field: 'min' },
        ]
      });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '300px' }} />;
}
