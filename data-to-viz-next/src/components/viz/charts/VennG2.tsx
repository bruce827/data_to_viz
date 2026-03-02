'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import vennData from './demoData/VennG2.json';

type VennTransformedDatum = {
  label?: string;
  sets?: string[];
  size?: number;
};

export function VennG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 300,
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 20,
      paddingBottom: 20,
    });

    // Follow the official G2 venn example: path mark + venn data transform.
    chart
      .path()
      .data({
        type: 'inline',
        value: vennData,
        transform: [{ type: 'venn', sets: 'sets', size: 'size', as: ['key', 'path'] }],
      })
      .encode('d', 'path')
      .encode('color', 'key')
      .style('fillOpacity', 0.28)
      .style('stroke', '#ffffff')
      .style('lineWidth', 2)
      .style('labelText', (d: VennTransformedDatum) => d.label || d.sets?.join('&'))
      .style('labelFill', '#1e293b')
      .style('labelFontWeight', 700)
      .style('labelFontSize', 12)
      .legend('color', false)
      .tooltip({
        title: (d: VennTransformedDatum) => d.sets?.join(' ∩ ') ?? '',
        items: [{ field: 'size', name: '规模' }],
      });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '300px' }} />;
}
