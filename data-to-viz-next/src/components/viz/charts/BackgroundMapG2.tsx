'use client';

import React, { useEffect, useRef } from 'react';
import { Chart, register } from '@antv/g2';
import { feature } from 'topojson-client';

let isFeatureTransformRegistered = false;
const featureToCollection = feature as unknown as (
  topology: { objects: Record<string, unknown> },
  object: unknown,
) => { features: unknown[] };

function ensureFeatureTransformRegistered() {
  if (isFeatureTransformRegistered) return;

  register('data.feature', ({ name }: { name: string }) => {
    return (data: { objects: Record<string, unknown> }) =>
      featureToCollection(data, data.objects[name]).features;
  });

  isFeatureTransformRegistered = true;
}

export function BackgroundMapG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    ensureFeatureTransformRegistered();

    let disposed = false;
    let chart: Chart | null = null;

    fetch('https://assets.antv.antgroup.com/g2/unemployment2.json')
      .then((res) => res.json())
      .then((unemploymentData) => {
        if (disposed || !containerRef.current) return;

        chart = new Chart({
          container: containerRef.current,
          autoFit: true,
          height: 320,
          paddingLeft: 12,
          paddingRight: 12,
          paddingTop: 12,
          paddingBottom: 12,
        });

        chart
          .geoPath()
          .coordinate({ type: 'albersUsa' })
          .data({
            type: 'fetch',
            value: 'https://assets.antv.antgroup.com/g2/us-10m.json',
            transform: [
              { type: 'feature', name: 'counties' },
              {
                type: 'join',
                join: unemploymentData,
                on: ['id', 'id'],
                select: ['rate'],
              },
            ],
          })
          .scale('color', {
            palette: 'ylGnBu',
            unknown: '#fff',
          })
          .encode('color', 'rate')
          .legend({
            color: {
              layout: { justifyContent: 'center' },
            },
          });

        chart.render();
      })
      .catch(() => {
        // Keep UI stable when remote demo data is unavailable.
      });

    return () => {
      disposed = true;
      if (chart) chart.destroy();
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '320px' }} />;
}
