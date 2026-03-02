'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type ConnectedScatterDatum = {
  year: string;
  unemployment: number;
  inflation: number;
};

export function ConnectedScatterG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 300,
    });

    // 模拟数据：类似菲利普斯曲线的经济周期轨迹
    // 两个数值 (Unemployment, Inflation) 随时间 (Year) 的演变
    const data: ConnectedScatterDatum[] = Array.from({ length: 15 }, (_, i) => {
      const t = i / 14 * Math.PI * 2; // 一个完整的圆周周期
      const year = 2010 + i;
      // 制造一个循环轨迹
      return {
        year: year.toString(),
        unemployment: 5 + Math.cos(t) * 2 + Math.random() * 0.5,
        inflation: 3 + Math.sin(t) * 2 + Math.random() * 0.5
      };
    });

    chart.options({
      type: 'view', // 显式声明视图
      data,
      children: [
        // 1. 轨迹线 (Line) - 必须按时间排序连接
        {
          type: 'line',
          encode: {
            x: 'unemployment',
            y: 'inflation',
            shape: 'smooth', // 平滑曲线更能体现“轨迹”感
          },
          style: {
            stroke: '#94a3b8', // 灰色轨迹，不喧宾夺主
            lineWidth: 2,
            lineDash: [4, 4]   // 虚线表示路径
          },
          tooltip: false
        },
        // 2. 数据点 (Point)
        {
          type: 'point',
          encode: {
            x: 'unemployment',
            y: 'inflation',
            color: 'year', // 颜色随时间渐变，体现流动感
            shape: 'point'
          },
          scale: {
            color: { palette: 'cool' } 
          },
          style: {
            stroke: '#fff',
            lineWidth: 1,
            fillOpacity: 1
          },
           tooltip: {
            title: (d: ConnectedScatterDatum) => `${d.year} 年`,
            items: ['unemployment', 'inflation']
          }
        },
        // 3. 文本标签 (Text) - 标注年份
        {
          type: 'text',
          encode: {
            x: 'unemployment',
            y: 'inflation',
            text: 'year'
          },
          style: {
            fontSize: 10,
            fill: '#64748b',
            dy: -10 // 向上偏移，避免挡住点
          }
        }
      ],
      axis: {
        x: { title: '失业率 (%) - Numeric 1' },
        y: { title: '通货膨胀率 (%) - Numeric 2' }
      }
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '300px' }} />;
}
