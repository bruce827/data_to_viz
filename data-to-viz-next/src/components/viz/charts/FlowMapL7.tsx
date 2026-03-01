'use client';

/* eslint-disable react-hooks/unsupported-syntax */
import React, { useEffect, useRef } from 'react';
import type { Scene as L7Scene } from '@antv/l7';

type FlyLineItem = {
  from: string;
  to: string;
};

export function FlowMapL7() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<L7Scene | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let disposed = false;

    const setupScene = async () => {
      const [{ LineLayer, PointLayer, Scene }, { GaodeMap }] = await Promise.all([
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
          pitch: 40,
          center: [40, 40.16797],
          style: 'dark',
          zoom: 2.5,
          token: process.env.NEXT_PUBLIC_AMAP_KEY,
        }),
      });
      sceneRef.current = scene;

      scene.addImage('plane', 'https://gw.alipayobjects.com/zos/bmw-prod/0ca1668e-38c2-4010-8568-b57cb33839b9.svg');

      scene.on('loaded', () => {
        if (disposed) return;

        Promise.all([
          fetch('https://gw.alipayobjects.com/os/bmw-prod/2960e1fc-b543-480f-a65e-d14c229dd777.json').then((d) =>
            d.json(),
          ),
          fetch('https://gw.alipayobjects.com/os/basement_prod/4472780b-fea1-4fc2-9e4b-3ca716933dc7.json').then((d) =>
            d.text(),
          ),
          fetch('https://gw.alipayobjects.com/os/basement_prod/a5ac7bce-181b-40d1-8a16-271356264ad8.json').then((d) =>
            d.text(),
          ),
        ])
          .then(([world, dot, flyline]) => {
            if (disposed) return;

            const dotData = eval(dot) as Array<{ lng: number; lat: number }>;
            const flyDataRaw = eval(flyline) as FlyLineItem[];
            const flyData = flyDataRaw.map((item) => {
              const latlng1 = item.from.split(',').map((e) => Number(e));
              const latlng2 = item.to.split(',').map((e) => Number(e));
              return { coord: [latlng1, latlng2] };
            });

            const worldLine = new LineLayer().source(world).color('#41fc9d').size(0.5).style({
              opacity: 0.4,
            });

            const dotPoint = new PointLayer()
              .source(dotData, {
                parser: {
                  type: 'json',
                  x: 'lng',
                  y: 'lat',
                },
              })
              .shape('circle')
              .color('#ffed11')
              .animate(true)
              .size(40);

            const flyLine = new LineLayer({ blend: 'normal' })
              .source(flyData, {
                parser: {
                  type: 'json',
                  coordinates: 'coord',
                },
              })
              .color('#ff6b34')
              .texture('plane')
              .shape('arc')
              .size(15)
              .animate({
                duration: 1,
                interval: 0.2,
                trailLength: 0.05,
              })
              .style({
                textureBlend: 'replace',
                lineTexture: true,
                iconStep: 10,
              });

            const flyLine2 = new LineLayer()
              .source(flyData, {
                parser: {
                  type: 'json',
                  coordinates: 'coord',
                },
              })
              .color('#ff6b34')
              .shape('arc')
              .size(1)
              .style({
                lineType: 'dash',
                dashArray: [5, 5],
                opacity: 0.5,
              });

            scene.addLayer(worldLine);
            scene.addLayer(dotPoint);
            scene.addLayer(flyLine2);
            scene.addLayer(flyLine);
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
