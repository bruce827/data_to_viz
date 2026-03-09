'use client';

import React, { useEffect, useRef } from 'react';
import type { Scene as L7Scene } from '@antv/l7';

const demoPoints = [
  { name: '北京', lng: 116.4074, lat: 39.9042, value: 16 },
  { name: '上海', lng: 121.4737, lat: 31.2304, value: 24 },
  { name: '深圳', lng: 114.0579, lat: 22.5431, value: 26 },
  { name: '杭州', lng: 120.1551, lat: 30.2741, value: 21 },
  { name: '成都', lng: 104.0665, lat: 30.5728, value: 18 },
];

export function Map3DBarL7() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<L7Scene | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let disposed = false;

    const setupScene = async () => {
      const [{ Scene, PointLayer }, { GaodeMap }] = await Promise.all([
        import('@antv/l7'),
        import('@antv/l7-maps'),
      ]);
      if (disposed || !containerRef.current) return;

      const amapSecurityJsCode = process.env.NEXT_PUBLIC_AMAP_SECURITY_JS_CODE;
      if (amapSecurityJsCode) {
        (window as Window & { _AMapSecurityConfig?: { securityJsCode: string } })._AMapSecurityConfig =
          { securityJsCode: amapSecurityJsCode };
      }

      // Keep one scene instance for one container lifecycle.
      containerRef.current.innerHTML = '';

      const scene = new Scene({
        id: containerRef.current,
        map: new GaodeMap({
          pitch: 58,
          style: 'normal',
          center: [112.8, 33.4],
          zoom: 3.65,
          rotation: 8,
          token: process.env.NEXT_PUBLIC_AMAP_KEY,
        }),
      });
      sceneRef.current = scene;

      scene.on('loaded', () => {
        if (disposed) return;

        const pointLayer = new PointLayer()
          .source(demoPoints, {
            parser: {
              type: 'json',
              x: 'lng',
              y: 'lat',
            },
          })
          .shape('cylinder')
          .size('value', (height: number | string) => {
            const value = Number(height) || 0;
            return [10, 10, value];
          })
          .color('#2563eb')
          .style({
            opacity: 0.85,
          });

        const labelLayer = new PointLayer()
          .source(demoPoints, {
            parser: {
              type: 'json',
              x: 'lng',
              y: 'lat',
            },
          })
          .shape('name', 'text')
          .size(11)
          .color('#0f172a')
          .style({
            textOffset: [0, 16],
            stroke: '#ffffff',
            strokeWidth: 1.2,
          });

        scene.addLayer(pointLayer);
        scene.addLayer(labelLayer);
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
