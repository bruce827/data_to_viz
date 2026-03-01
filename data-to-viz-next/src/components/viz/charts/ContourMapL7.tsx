'use client';

import React, { useEffect, useRef } from 'react';
import type { Scene as L7Scene } from '@antv/l7';

export function ContourMapL7() {
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

      // Prevent duplicated scene layers in modal reopen / hot reload.
      containerRef.current.innerHTML = '';

      const scene = new Scene({
        id: containerRef.current,
        map: new GaodeMap({
          pitch: 53.6305,
          style: 'light',
          center: [102.600579, 23.114887],
          zoom: 13.5,
          token: process.env.NEXT_PUBLIC_AMAP_KEY,
        }),
      });
      sceneRef.current = scene;

      scene.on('loaded', () => {
        if (disposed) return;

        fetch('https://gw.alipayobjects.com/os/rmsportal/ZVfOvhVCzwBkISNsuKCc.json')
          .then((res) => res.json())
          .then((data) => {
            if (disposed) return;

            const layer = new LineLayer({})
              .source(data)
              .size('ELEV', (h: number | string) => {
                const value = Number(h) || 0;
                return [value % 50 === 0 ? 1.0 : 0.5, (value - 1400) * 20];
              })
              .shape('line')
              .scale('ELEV', {
                type: 'quantize',
              })
              .style({
                heightfixed: true,
              })
              .color(
                'ELEV',
                [
                  '#E4682F',
                  '#FF8752',
                  '#FFA783',
                  '#FFBEA8',
                  '#FFDCD6',
                  '#EEF3FF',
                  '#C8D7F5',
                  '#A5C1FC',
                  '#7FA7F9',
                  '#5F8AE5',
                ].reverse(),
              );

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
