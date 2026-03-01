'use client';

import React, { useEffect, useRef } from 'react';
import type { Scene as L7Scene } from '@antv/l7';
import bubbleMapPoints from './demoData/BubbleMapPoints.json';

type BubbleDatum = {
  name: string;
  lng: number;
  lat: number;
  value: number;
};

export function BubbleMapL7() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<L7Scene | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const points = bubbleMapPoints as BubbleDatum[];
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

      // Prevent duplicated canvases/layers after hot reload or modal reopen.
      containerRef.current.innerHTML = '';

      const scene = new Scene({
        id: containerRef.current,
        map: new GaodeMap({
          style: 'normal',
          center: [104.114129, 37.550339],
          zoom: 3.7,
          pitch: 0,
          token: process.env.NEXT_PUBLIC_AMAP_KEY,
        }),
      });
      sceneRef.current = scene;

      scene.on('loaded', () => {
        if (disposed) return;

        const bubbleLayer = new PointLayer({ autoFit: true })
          .source(points, {
            parser: {
              type: 'json',
              x: 'lng',
              y: 'lat',
            },
          })
          .shape('circle')
          .size('value', [8, 28])
          .color('value', ['#bfdbfe', '#60a5fa', '#2563eb'])
          .style({
            opacity: 0.5,
            stroke: '#1d4ed8',
            strokeWidth: 1.2,
          });

        const labelLayer = new PointLayer()
          .source(points, {
            parser: {
              type: 'json',
              x: 'lng',
              y: 'lat',
            },
          })
          .shape('name', 'text')
          .size(11)
          .color('#1e293b')
          .style({
            textOffset: [0, 12],
            stroke: '#ffffff',
            strokeWidth: 0.8,
          });

        scene.addLayer(bubbleLayer);
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
