'use client';

import React, { useEffect, useRef } from 'react';
import type { Scene as L7Scene } from '@antv/l7';

export function GridHeatmapMapL7() {
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

      // 防止弹窗多次打开导致同容器叠层
      containerRef.current.innerHTML = '';

      const scene = new Scene({
        id: containerRef.current,
        map: new GaodeMap({
          style: 'light',
          center: [107.054293, 35.246265],
          zoom: 4.056,
          token: process.env.NEXT_PUBLIC_AMAP_KEY,
        }),
      });
      sceneRef.current = scene;

      scene.on('loaded', () => {
        if (disposed) return;

        fetch('https://gw.alipayobjects.com/os/basement_prod/7359a5e9-3c5e-453f-b207-bc892fb23b84.csv')
          .then((res) => res.text())
          .then((data) => {
            if (disposed) return;

            const layer = new HeatmapLayer({})
              .source(data, {
                parser: {
                  type: 'csv',
                  x: 'lng',
                  y: 'lat',
                },
                transforms: [
                  {
                    type: 'grid',
                    size: 20000,
                    field: 'v',
                    method: 'sum',
                  },
                ],
              })
              .shape('square')
              .style({
                coverage: 1,
                angle: 0,
              })
              .color(
                'count',
                [
                  '#0B0030',
                  '#100243',
                  '#100243',
                  '#1B048B',
                  '#051FB7',
                  '#0350C1',
                  '#0350C1',
                  '#0072C4',
                  '#0796D3',
                  '#2BA9DF',
                  '#30C7C4',
                  '#6BD5A0',
                  '#A7ECB2',
                  '#D0F4CA',
                ].reverse(),
              );

            scene.addLayer(layer);
          })
          .catch(() => {
            // 网络数据不可用时保持页面稳定
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

