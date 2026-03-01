'use client';

import React, { useEffect, useRef } from 'react';
import type { Scene as L7Scene } from '@antv/l7';

export function PathMapL7() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<L7Scene | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let disposed = false;

    const setupScene = async () => {
      const [{ LineLayer, Scene }, { GaodeMap }] = await Promise.all([
        import('@antv/l7'),
        import('@antv/l7-maps'),
      ]);
      if (disposed || !containerRef.current) return;

      const amapSecurityJsCode = process.env.NEXT_PUBLIC_AMAP_SECURITY_JS_CODE;
      if (amapSecurityJsCode) {
        (window as Window & { _AMapSecurityConfig?: { securityJsCode: string } })._AMapSecurityConfig =
          { securityJsCode: amapSecurityJsCode };
      }

      // Prevent stale canvas/layer stack in hot reload or modal reopen.
      containerRef.current.innerHTML = '';

      const scene = new Scene({
        id: containerRef.current,
        map: new GaodeMap({
          center: [121.472644, 31.231706],
          zoom: 8.15,
          style: 'dark',
          token: process.env.NEXT_PUBLIC_AMAP_KEY,
        }),
      });
      sceneRef.current = scene;

      scene.on('loaded', () => {
        if (disposed) return;

        fetch('https://gw.alipayobjects.com/os/bmw-prod/0290a972-eedd-42f6-b69e-50a35e8a0824.json')
          .then((res) => res.json())
          .then((data) => {
            if (disposed) return;

            const layer = new LineLayer({})
              .source(data, {
                parser: {
                  type: 'json',
                  coordinates: 'coordinates',
                },
              })
              .size(0.5)
              .shape('line')
              .active(true)
              .color('length', [
                '#0A3663',
                '#1558AC',
                '#3771D9',
                '#4D89E5',
                '#64A5D3',
                '#72BED6',
                '#83CED6',
                '#A6E1E0',
                '#B8EFE2',
                '#D7F9F0',
              ]);

            scene.addLayer(layer);
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
