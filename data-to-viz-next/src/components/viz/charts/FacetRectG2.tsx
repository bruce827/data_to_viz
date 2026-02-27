'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import facetRectData from './demoData/FacetRectG2.json';

export function FacetRectG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 300,
      paddingLeft: 40,
      paddingRight: 16,
      paddingTop: 28,
      paddingBottom: 28,
    });

    const facetRect = chart
      .facetRect()
      .data({
        type: 'inline',
        value: facetRectData,
        transform: [
          {
            type: 'map',
            callback: ({ culmen_depth_mm: depth, culmen_length_mm: length, ...d }) => ({
              ...d,
              culmen_depth_mm: depth === 'NaN' ? NaN : depth,
              culmen_length_mm: length === 'NaN' ? NaN : length,
            }),
          },
        ],
      })
      .encode('x', 'sex')
      .encode('y', 'species');

    facetRect
      .point()
      .attr('facet', false)
      .attr('frame', false)
      .encode('x', 'culmen_depth_mm')
      .encode('y', 'culmen_length_mm')
      .style('fill', '#ddd')
      .style('lineWidth', 0);

    facetRect
      .point()
      .encode('x', 'culmen_depth_mm')
      .encode('y', 'culmen_length_mm')
      .encode('color', 'island');

    chart.interaction('tooltip', { shared: false });

    chart.axis('x', {
      title: false,
    });
    chart.axis('y', {
      title: false,
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '300px' }} />;
}
