'use client';

import React, { useEffect, useRef } from 'react';
import type { Scene as L7Scene } from '@antv/l7';

const demoHeatmapPoints = [
  { lng: 116.4074, lat: 39.9042, weight: 2.4 },
  { lng: 116.4118, lat: 39.9096, weight: 2.8 },
  { lng: 116.4031, lat: 39.8987, weight: 2.2 },
  { lng: 121.4737, lat: 31.2304, weight: 2.9 },
  { lng: 121.4811, lat: 31.2255, weight: 3.4 },
  { lng: 121.4673, lat: 31.2368, weight: 2.5 },
  { lng: 114.0579, lat: 22.5431, weight: 3.6 },
  { lng: 114.0658, lat: 22.5489, weight: 3.8 },
  { lng: 114.0514, lat: 22.5372, weight: 3.1 },
  { lng: 104.0665, lat: 30.5728, weight: 2.7 },
  { lng: 104.0718, lat: 30.5686, weight: 3.1 },
  { lng: 104.0619, lat: 30.5773, weight: 2.4 },
];

export function HeatmapMapL7() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<L7Scene | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let disposed = false;

    const setupScene = async () => {
      const [{ HeatmapLayer, Scene }, { GaodeMap }] = await Promise.all([
        import('@antv/l7'),
        import('@antv/l7-maps'),
      ]);
      if (disposed || !containerRef.current) return;

      const amapSecurityJsCode = process.env.NEXT_PUBLIC_AMAP_SECURITY_JS_CODE;
      if (amapSecurityJsCode) {
        (window as Window & { _AMapSecurityConfig?: { securityJsCode: string } })._AMapSecurityConfig = {
          securityJsCode: amapSecurityJsCode,
        };
      }

      containerRef.current.innerHTML = '';

      const scene = new Scene({
        id: containerRef.current,
        map: new GaodeMap({
          style: 'light',
          center: [112.8, 31.8],
          zoom: 3.55,
          token: process.env.NEXT_PUBLIC_AMAP_KEY,
        }),
      });
      sceneRef.current = scene;

      scene.on('loaded', () => {
        if (disposed) return;

        const layer = new HeatmapLayer({})
          .source(demoHeatmapPoints, {
            parser: {
              type: 'json',
              x: 'lng',
              y: 'lat',
            },
          })
          .shape('heatmap')
          .size('weight', [0, 1])
          .style({
            intensity: 2.2,
            radius: 28,
            rampColors: {
              colors: ['#fff7bc', '#fee391', '#fec44f', '#fb8d3c', '#f03b20', '#bd0026'],
              positions: [0, 0.2, 0.4, 0.6, 0.8, 1],
            },
          });

        scene.addLayer(layer);
      });
    };

    setupScene();

    return () => {
      disposed = true;
      if (sceneRef.current) {
        sceneRef.current.destroy();
        sceneRef.current = null;
      }
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '320px', position: 'relative' }} />;
}
