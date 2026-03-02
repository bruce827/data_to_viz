'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import density2Data from './demoData/Density2DG2.json';

type PointDatum = {
  x: number;
  y: number;
};

type HeatCell = {
  x: number;
  y: number;
  count: number;
};

function buildHeatCells(points: PointDatum[], binsX: number, binsY: number): HeatCell[] {
  const xValues = points.map((d) => d.x);
  const yValues = points.map((d) => d.y);
  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);

  const stepX = (maxX - minX) / binsX;
  const stepY = (maxY - minY) / binsY;
  const counter = new Map<string, number>();

  points.forEach((point) => {
    const ix = Math.min(binsX - 1, Math.max(0, Math.floor((point.x - minX) / stepX)));
    const iy = Math.min(binsY - 1, Math.max(0, Math.floor((point.y - minY) / stepY)));
    const key = `${ix}-${iy}`;
    counter.set(key, (counter.get(key) ?? 0) + 1);
  });

  const cells: HeatCell[] = [];
  for (let ix = 0; ix < binsX; ix += 1) {
    for (let iy = 0; iy < binsY; iy += 1) {
      const key = `${ix}-${iy}`;
      const count = counter.get(key) ?? 0;
      cells.push({
        x: minX + ix * stepX + stepX / 2,
        y: minY + iy * stepY + stepY / 2,
        count,
      });
    }
  }

  return cells;
}

export function Density2DG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const points = density2Data as PointDatum[];
    const cells = buildHeatCells(points, 22, 22);

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 300,
    });

    chart.options({
      type: 'view',
      children: [
        {
          type: 'cell',
          data: {
            type: 'inline',
            value: cells,
          },
          encode: {
            x: 'x',
            y: 'y',
            color: 'count',
          },
          scale: {
            color: { palette: 'blues' },
          },
          style: {
            stroke: '#ffffff',
            lineWidth: 0.4,
            fillOpacity: 0.85,
          },
          tooltip: {
            title: '局部密度',
            items: [{ field: 'count', name: '样本数' }],
          },
        },
        {
          type: 'point',
          data: {
            type: 'inline',
            value: points,
          },
          encode: {
            x: 'x',
            y: 'y',
          },
          style: {
            fill: '#ffffff',
            fillOpacity: 0.2,
            stroke: '#0f172a',
            strokeOpacity: 0.12,
            lineWidth: 0.8,
            r: 1.8,
          },
          tooltip: false,
        },
      ],
      axis: {
        x: { title: '变量 X' },
        y: { title: '变量 Y' },
      },
    });

    chart.render();
    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '300px' }} />;
}
