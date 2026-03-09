'use client';

import React, { useEffect, useRef } from 'react';
import type { Scene as L7Scene } from '@antv/l7';

const demoPoints = [
  { name: '北京运营中心', lng: 116.4074, lat: 39.9042 },
  { name: '上海科创客群', lng: 121.4737, lat: 31.2304 },
  { name: '深圳零售商圈', lng: 114.0579, lat: 22.5431 },
  { name: '成都普惠服务', lng: 104.0665, lat: 30.5728 },
  { name: '武汉制造走廊', lng: 114.3055, lat: 30.5928 },
];

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
          center: [112.8, 33.4],
          zoom: 3.55,
          pitch: 0,
          token: process.env.NEXT_PUBLIC_AMAP_KEY,
        }),
      });
      sceneRef.current = scene;

      scene.on('loaded', () => {
        if (disposed) return;

        const pointLayer = new PointLayer({ autoFit: true })
          .source(demoPoints, {
            parser: {
              type: 'json',
              x: 'lng',
              y: 'lat',
            },
          })
          .shape('circle')
          .size(11)
          .color('#2563eb')
          .style({
            opacity: 0.9,
            stroke: '#eff6ff',
            strokeWidth: 1.4,
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
          .size(12)
          .color('#0f172a')
          .style({
            textOffset: [0, 12],
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

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '320px', position: 'relative' }}
    />
  );
}
