'use client';

import React, { useEffect, useRef } from 'react';
import type { Scene as L7Scene } from '@antv/l7';

type WavePoint = {
  lng: number;
  lat: number;
  level: number;
  color: string;
};

type DrawOption = {
  size: [number, number];
  ctx: CanvasRenderingContext2D;
  mapService: {
    lngLatToContainer: (lnglat: [number, number]) => { x: number; y: number };
  };
};

const WAVE_POINTS: WavePoint[] = [
  { lng: 108.544921875, lat: 30.977609093348686, level: 85, color: 'rgba(220,20,60,0.6)' },
  { lng: 110.654296875, lat: 31.090574094954192, level: 75, color: 'rgba(255,140,0,0.6)' },
  { lng: 112.5, lat: 29.80251790576445, level: 65, color: 'rgba(255,165,0,0.6)' },
  { lng: 114.78515624999999, lat: 30.64867367928756, level: 40, color: 'rgba(30,144,255,0.6)' },
  { lng: 116.49902343749999, lat: 29.84064389983441, level: 50, color: 'rgba(30,144,255,0.6)' },
  { lng: 118.21289062499999, lat: 31.16580958786196, level: 20, color: 'rgba(127,255,0,0.6)' },
  { lng: 119.091796875, lat: 32.509761735919426, level: 50, color: 'rgba(30,144,255,0.6)' },
  { lng: 121.0693359374999, lat: 31.80289258670676, level: 45, color: 'rgba(30,144,255,0.6)' },
];

export function CompositeMapL7() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<L7Scene | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let disposed = false;
    let wavePhase = 0;
    let timerId: number | null = null;

    const setupScene = async () => {
      const [{ CanvasLayer, Scene }, { GaodeMap }] = await Promise.all([
        import('@antv/l7'),
        import('@antv/l7-maps'),
      ]);
      if (disposed || !containerRef.current) return;

      const amapSecurityJsCode = process.env.NEXT_PUBLIC_AMAP_SECURITY_JS_CODE;
      if (amapSecurityJsCode) {
        (window as Window & { _AMapSecurityConfig?: { securityJsCode: string } })._AMapSecurityConfig =
          { securityJsCode: amapSecurityJsCode };
      }

      // Prevent duplicate canvas stack on hot reload / modal reopen.
      containerRef.current.innerHTML = '';

      const scene = new Scene({
        id: containerRef.current,
        map: new GaodeMap({
          style: 'fresh',
          center: [115, 31],
          zoom: 5.0,
          token: process.env.NEXT_PUBLIC_AMAP_KEY,
        }),
      });
      sceneRef.current = scene;

      const draw = (option: DrawOption) => {
        const { size, ctx, mapService } = option;
        const [width, height] = size;
        const radius = 30;
        const rectWidth = radius * 2;
        const rectHeight = rectWidth;

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'rgb(35,75,225)';
        ctx.font = 'normal small-caps bold 14px arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        WAVE_POINTS.forEach((point) => {
          const pixelCenter = mapService.lngLatToContainer([point.lng, point.lat]);
          const dpr = window.devicePixelRatio || 1;
          const cx = pixelCenter.x * dpr;
          const cy = pixelCenter.y * dpr;
          const rectStartX = cx - radius;
          const rectStartY = cy - radius;

          ctx.save();
          ctx.fillText(`${point.level}%`, cx, cy);

          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(135,206,250,0.2)';
          ctx.closePath();
          ctx.fill();
          ctx.clip();

          ctx.beginPath();
          ctx.fillStyle = point.color;
          ctx.moveTo(rectStartX, cy);

          const waterheight = rectStartY + ((100 - point.level) / 100) * rectHeight;
          for (let i = 0; i <= rectWidth; i += 10) {
            ctx.lineTo(rectStartX + i, waterheight + Math.sin(Math.PI * 2 * (i / rectWidth) + wavePhase) * 3 + 1);
          }

          ctx.lineTo(cx + radius, cy + radius);
          ctx.lineTo(rectStartX, cy + radius);
          ctx.lineTo(rectStartX, cy);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        });
      };

      scene.on('loaded', () => {
        if (disposed) return;

        const layer = new CanvasLayer({
          zIndex: 10,
          trigger: 'change',
        });
        layer.draw(draw);
        scene.addLayer(layer);

        timerId = window.setInterval(() => {
          wavePhase += 0.1;
          scene.render();
        }, 30);
      });
    };

    setupScene();

    return () => {
      disposed = true;
      if (timerId !== null) {
        window.clearInterval(timerId);
      }
      if (sceneRef.current) {
        sceneRef.current.destroy();
        sceneRef.current = null;
      }
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '320px', position: 'relative' }} />;
}
