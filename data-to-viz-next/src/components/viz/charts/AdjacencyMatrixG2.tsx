'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { Chart } from '@antv/g2';
import adjacencyData from './demoData/AdjacencyMatrixG2.json';

type MatrixLink = {
  source: string;
  target: string;
  value: number;
};

type MatrixCell = {
  source: string;
  target: string;
  value: number;
};

export function AdjacencyMatrixG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  const matrixCells = useMemo(() => {
    const nodes = adjacencyData.nodes;
    const links = adjacencyData.links as MatrixLink[];
    const linkMap = new Map<string, number>();

    links.forEach((link) => {
      linkMap.set(`${link.source}|${link.target}`, link.value);
      linkMap.set(`${link.target}|${link.source}`, link.value);
    });

    const cells: MatrixCell[] = [];
    nodes.forEach((rowNode) => {
      nodes.forEach((colNode) => {
        const value = rowNode === colNode ? 0 : linkMap.get(`${rowNode}|${colNode}`) ?? 0;
        cells.push({
          source: rowNode,
          target: colNode,
          value,
        });
      });
    });
    return cells;
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 360,
      paddingLeft: 88,
      paddingBottom: 72,
      paddingTop: 16,
      paddingRight: 16,
    });

    chart.options({
      type: 'heatmap',
      data: {
        type: 'inline',
        value: matrixCells,
      },
      encode: {
        x: 'source',
        y: 'target',
        color: 'value',
      },
      scale: {
        color: {
          domain: [0, 12],
          palette: 'blues',
        },
      },
      style: {
        stroke: '#ffffff',
        lineWidth: 1,
      },
      labels: [
        {
          text: (d: MatrixCell) => (d.value > 0 ? `${d.value}` : ''),
          fill: '#0f172a',
          fontSize: 10,
          fontWeight: 600,
        },
      ],
      axis: {
        x: {
          title: false,
          labelTransform: 'rotate(35)',
          labelFontSize: 11,
        },
        y: {
          title: false,
          labelFontSize: 11,
        },
      },
      legend: {
        color: {
          title: '关联强度',
        },
      },
      tooltip: {
        title: (d: MatrixCell) => `${d.source} ↔ ${d.target}`,
        items: [{ field: 'value', name: '强度' }],
      },
    });

    chart.render();
    return () => chart.destroy();
  }, [matrixCells]);

  return <div ref={containerRef} style={{ width: '100%', height: '360px' }} />;
}
