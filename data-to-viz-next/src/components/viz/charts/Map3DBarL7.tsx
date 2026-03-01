'use client';

import React, { useEffect, useRef } from 'react';
import type { Scene as L7Scene } from '@antv/l7';

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
          pitch: 66.02383,
          style: 'dark',
          center: [121.400257, 31.25287],
          zoom: 14.55,
          rotation: 134.95,
          token: process.env.NEXT_PUBLIC_AMAP_KEY,
        }),
      });
      sceneRef.current = scene;

      scene.on('loaded', () => {
        if (disposed) return;
        fetch('https://gw.alipayobjects.com/os/basement_prod/893d1d5f-11d9-45f3-8322-ee9140d288ae.json')
          .then((res) => res.json())
          .then((data) => {
            if (disposed) return;

            const pointLayer = new PointLayer({})
              .source(data, {
                parser: {
                  type: 'json',
                  x: 'longitude',
                  y: 'latitude',
                },
              })
              .animate(true)
              .active(true)
              .shape('name', ['cylinder', 'triangleColumn', 'hexagonColumn', 'squareColumn'])
              .size('unit_price', (h: number | string) => {
                const value = Number(h) || 0;
                return [6, 6, value / 500];
              })
              .color('name', ['#739DFF', '#61FCBF', '#FFDE74', '#FF896F']);

            scene.addLayer(pointLayer);
          })
          .catch(() => {
            // Keep UI stable when remote demo data is unavailable.
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

  return <div ref={containerRef} style={{ width: '100%', height: '320px', position: 'relative' }} />;
}
