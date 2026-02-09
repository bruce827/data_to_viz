'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import pcaData from './demoData/PCAG2.json';

export function PCAG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 300,
    });

    chart.options({
      type: 'view',
      data: {
        type: 'inline',
        value: pcaData,
      },
      children: [
        // 1. 绘制散点
        {
          type: 'point',
          encode: {
            x: 'pc1',
            y: 'pc2',
            color: 'group',
            shape: 'point',
          },
          scale: {
            x: { nice: true },
            y: { nice: true },
            color: { range: ['#3b82f6', '#10b981', '#f59e0b'] }
          },
          style: {
            fillOpacity: 0.8,
            stroke: '#fff',
            lineWidth: 1,
            size: 5
          },
          tooltip: {
            items: [
              { field: 'pc1', name: 'PC1 (方差贡献)' },
              { field: 'pc2', name: 'PC2 (方差贡献)' },
              { field: 'group', name: '分类' }
            ]
          }
        },
        // 2. 增加辅助辅助线（原点十字线，PCA图标配）
        {
          type: 'lineX',
          data: [0],
          style: { stroke: '#cbd5e1', lineDash: [4, 4] }
        },
        {
          type: 'lineY',
          data: [0],
          style: { stroke: '#cbd5e1', lineDash: [4, 4] }
        }
      ],
      axis: {
        x: { title: '第一主成分 (PC1)', titleFontSize: 12 },
        y: { title: '第二主成分 (PC2)', titleFontSize: 12 }
      }
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '300px' }} />;
}
