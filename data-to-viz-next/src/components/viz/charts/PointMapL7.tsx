'use client';

import React, { useEffect, useRef } from 'react';
import type { Scene as L7Scene } from '@antv/l7';

export function PointMapL7() {
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

      // 清理容器，避免开发模式重复挂载导致的叠层错位
      containerRef.current.innerHTML = '';

      const scene = new Scene({
        id: containerRef.current,
        map: new GaodeMap({
          style: 'normal',
          center: [121.434765, 31.256735],
          zoom: 14.83,
          pitch: 0,
          token: process.env.NEXT_PUBLIC_AMAP_KEY,
        }),
      });
      sceneRef.current = scene;

      scene.addImage('00', '/images/map-point-marker.png');
      scene.addImage('01', '/images/map-point-marker.png');
      scene.addImage('02', '/images/map-point-marker.png');

      scene.on('loaded', () => {
        if (disposed) return;
        fetch('https://gw.alipayobjects.com/os/basement_prod/893d1d5f-11d9-45f3-8322-ee9140d288ae.json')
          .then((res) => res.json())
          .then((data) => {
            if (disposed) return;

            const imageLayer = new PointLayer()
              .source(data, {
                parser: {
                  type: 'json',
                  x: 'longitude',
                  y: 'latitude',
                },
              })
              .shape('name', ['00', '01', '02'])
              .size(10);

            const imageLayerText = new PointLayer()
              .source(data, {
                parser: {
                  type: 'json',
                  x: 'longitude',
                  y: 'latitude',
                },
              })
              .shape('name', 'text')
              .color('#f00')
              .size(25)
              .style({
                textOffset: [0, 20],
              });

            scene.addLayer(imageLayer);
            scene.addLayer(imageLayerText);
          })
          .catch(() => {
            // Keep UI silent in demo mode if remote data is unavailable.
          });
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

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '320px', position: 'relative' }}
    />
  );
}
