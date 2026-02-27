'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import stackedBarData from './demoData/StackedBarG2.json';

export function StackedBarG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 300,
      paddingLeft: 52,
      paddingRight: 20,
      paddingTop: 24,
      paddingBottom: 72,
    });

    chart
      .interval()
      .data({
        type: 'inline',
        value: stackedBarData,
      })
      .transform({ type: 'stackY' })
      .transform({ type: 'sortX', by: 'y', reverse: true })
      .encode('x', 'state')
      .encode('y', 'population')
      .encode('color', 'age')
      .axis('x', {
        labelSpacing: 4,
        labelTransform: 'rotate(90)',
      })
      .axis('y', { labelFormatter: '~s' });

    chart
      .interaction('tooltip', { shared: true })
      .interaction('elementHighlightByColor', { background: true });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '300px' }} />;
}
