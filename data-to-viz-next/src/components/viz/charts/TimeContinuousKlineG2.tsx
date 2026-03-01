'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type KlineDatum = {
  Date: Date;
  Low: number;
  High: number;
  Open: number;
  Close: number;
};

type RawKlineDatum = {
  Date: string;
  Low: number;
  High: number;
  Open: number;
  Close: number;
};

export function TimeContinuousKlineG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 320,
      paddingLeft: 48,
      paddingRight: 20,
      paddingTop: 20,
      paddingBottom: 40,
    });

    chart
      .data({
        type: 'fetch',
        value: 'https://assets.antv.antgroup.com/g2/aapl2.json',
        transform: [
          {
            type: 'map',
            callback: (d: RawKlineDatum) => ({
              ...d,
              Date: new Date(d.Date),
            }),
          },
        ],
      })
      .scale('color', {
        domain: [1, 0, -1],
        range: ['#4daf4a', '#999999', '#e41a1c'],
      });

    chart
      .link()
      .encode('x', 'Date')
      .encode('y', ['Low', 'High'])
      .encode('color', (d: KlineDatum) => Math.sign(d.Close - d.Open))
      .style('stroke', 'black')
      .tooltip({
        title: (d: KlineDatum) => d.Date.toLocaleString(),
        items: [
          { field: 'Low', name: 'low' },
          { field: 'High', name: 'high' },
        ],
      });

    chart
      .link()
      .encode('x', 'Date')
      .encode('y', ['Open', 'Close'])
      .encode('color', (d: KlineDatum) => Math.sign(d.Close - d.Open))
      .style('radius', 2)
      .style('fillOpacity', 1)
      .style('lineWidth', 4)
      .style('lineCap', 'round')
      .tooltip({
        title: '',
        items: [
          { field: 'Open', name: 'open' },
          { field: 'Close', name: 'close' },
        ],
      });

    chart.interaction('tooltip', { shared: true, groupName: false });
    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '320px' }} />;
}
