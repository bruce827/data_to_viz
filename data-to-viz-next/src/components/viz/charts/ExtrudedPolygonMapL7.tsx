'use client';

import React, { useEffect, useRef } from 'react';
import type { Scene as L7Scene } from '@antv/l7';

export function ExtrudedPolygonMapL7() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<L7Scene | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let disposed = false;

    const setupScene = async () => {
      const [{ PolygonLayer, Scene }, { GaodeMap }] = await Promise.all([
        import('@antv/l7'),
        import('@antv/l7-maps'),
      ]);
      if (disposed || !containerRef.current) return;

      const amapSecurityJsCode = process.env.NEXT_PUBLIC_AMAP_SECURITY_JS_CODE;
      if (amapSecurityJsCode) {
        (window as Window & { _AMapSecurityConfig?: { securityJsCode: string } })._AMapSecurityConfig =
          { securityJsCode: amapSecurityJsCode };
      }

      // Prevent duplicate canvases/layers in modal reopen or hot reload.
      containerRef.current.innerHTML = '';

      const scene = new Scene({
        id: containerRef.current,
        map: new GaodeMap({
          style: 'dark',
          center: [114.050008, 22.529272],
          zoom: 14.1,
          token: process.env.NEXT_PUBLIC_AMAP_KEY,
        }),
      });
      sceneRef.current = scene;

      scene.on('loaded', () => {
        if (disposed) return;

        fetch('https://gw.alipayobjects.com/os/basement_prod/972566c5-a2b9-4a7e-8da1-bae9d0eb0117.json')
          .then((res) => res.json())
          .then((data) => {
            if (disposed) return;

            const layer = new PolygonLayer({})
              .source(data)
              .shape('extrude')
              .size('h20', [100, 120, 160, 200, 260, 500])
              .color('h20', ['#816CAD', '#A67FB5', '#C997C7', '#DEB8D4', '#F5D4E6', '#FAE4F1', '#FFF3FC']);

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
