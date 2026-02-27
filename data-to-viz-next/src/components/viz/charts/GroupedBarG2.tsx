'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import groupedBarData from './demoData/GroupedBarG2.json';

export function GroupedBarG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 300,
      paddingLeft: 44,
      paddingRight: 20,
      paddingTop: 24,
      paddingBottom: 36,
    });

    chart.title({
      title: 'Population by age and state',
      subtitle: 'It shows the population of U.S. by age and state.',
    });

    chart
      .interval()
      .data({
        type: 'inline',
        value: groupedBarData,
      })
      .transform({ type: 'sortX', by: 'y', reverse: true, slice: 6 })
      .transform({ type: 'dodgeX' })
      .encode('x', 'state')
      .encode('y', 'population')
      .encode('color', 'age')
      .scale('y', { nice: true })
      .axis('y', { labelFormatter: '~s' });

    chart
      .interaction('tooltip', { shared: true })
      .interaction('elementHighlightByColor', { background: true });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '300px' }} />;
}
