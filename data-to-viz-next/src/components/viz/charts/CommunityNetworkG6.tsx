'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

export function CommunityNetworkG6() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 360,
      paddingLeft: 12,
      paddingRight: 12,
      paddingTop: 12,
      paddingBottom: 12,
    });

    chart
      .forceGraph()
      .data({
        type: 'fetch',
        value: 'https://assets.antv.antgroup.com/g2/miserable-disjoint.json',
      })
      .encode('color', 'group')
      .layout({
        joint: false,
      })
      .scale('color', { palette: 'tableau10' });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '360px' }} />;
}
