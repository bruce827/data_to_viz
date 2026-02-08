'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

export function LineG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 300,
      paddingLeft: 40,
      paddingRight: 20,
      paddingBottom: 40,
    });

    // 1. 生成模拟语义数据：月度气温
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const data = months.map((month, index) => ({
      month,
      temp: 10 + Math.sin(index / 12 * Math.PI * 2 - Math.PI / 2) * 15 + Math.random() * 3
    }));

    // 2. 绘制折线
    chart
      .line()
      .data(data)
      .encode('x', 'month')
      .encode('y', 'temp')
      .style('stroke', '#2563eb')
      .style('lineWidth', 3)
      .axis('y', { title: '平均气温 (℃/典型数据)', titleFontSize: 12 })
      .axis('x', { title: '月份', titleFontSize: 12 });

    // 3. 绘制数据点（增强交互感）
    chart
      .point()
      .data(data)
      .encode('x', 'month')
      .encode('y', 'temp')
      .style('fill', '#fff')
      .style('stroke', '#2563eb')
      .style('lineWidth', 2)
      .tooltip(false);

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '300px' }} />;
}