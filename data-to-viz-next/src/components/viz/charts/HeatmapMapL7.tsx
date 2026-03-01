'use client';

import React, { useEffect, useRef } from 'react';
import type { Scene as L7Scene } from '@antv/l7';

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

      // 防止弹窗多次打开导致同容器叠层
      containerRef.current.innerHTML = '';

      const scene = new Scene({
        id: containerRef.current,
        map: new GaodeMap({
          style: 'dark',
          center: [127.5671666579043, 7.445038892195569],
          zoom: 2.632456779444394,
          token: process.env.NEXT_PUBLIC_AMAP_KEY,
        }),
      });
      sceneRef.current = scene;

      scene.on('loaded', () => {
        if (disposed) return;

        fetch('https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json')
          .then((res) => res.json())
          .then((data) => {
            if (disposed) return;

            const layer = new HeatmapLayer({})
              .source(data)
              .shape('heatmap')
              .size('mag', [0, 1.0])
              .style({
                intensity: 2,
                radius: 20,
                rampColors: {
                  colors: ['#FF4818', '#F7B74A', '#FFF598', '#91EABC', '#2EA9A1', '#206C7C'].reverse(),
                  positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
                },
              });
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

