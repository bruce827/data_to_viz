'use client';

import React, { useEffect, useRef } from 'react';
import type { Scene as L7Scene } from '@antv/l7';
import type { L7Container } from '@antv/l7-core';

type PieSlice = {
  label: string;
  value: number;
  color: string;
};

type CompositeDemoDatum = {
  id: string;
  city: string;
  lng: number;
  lat: number;
  total_cny: number;
  slices: PieSlice[];
};

const PIE_COLORS = {
  工程款: '#2563eb',
  材料款: '#f59e0b',
  监管留存: '#14b8a6',
} as const;

const demoData: CompositeDemoDatum[] = [
  {
    id: 'CMP_DEMO_001',
    city: '深圳',
    lng: 113.9345,
    lat: 22.5407,
    total_cny: 92000000,
    slices: [
      { label: '工程款', value: 52, color: PIE_COLORS.工程款 },
      { label: '材料款', value: 31, color: PIE_COLORS.材料款 },
      { label: '监管留存', value: 17, color: PIE_COLORS.监管留存 },
    ],
  },
  {
    id: 'CMP_DEMO_002',
    city: '广州',
    lng: 113.3618,
    lat: 23.1228,
    total_cny: 76000000,
    slices: [
      { label: '工程款', value: 44, color: PIE_COLORS.工程款 },
      { label: '材料款', value: 39, color: PIE_COLORS.材料款 },
      { label: '监管留存', value: 17, color: PIE_COLORS.监管留存 },
    ],
  },
  {
    id: 'CMP_DEMO_003',
    city: '武汉',
    lng: 114.314,
    lat: 30.5983,
    total_cny: 68000000,
    slices: [
      { label: '工程款', value: 36, color: PIE_COLORS.工程款 },
      { label: '材料款', value: 46, color: PIE_COLORS.材料款 },
      { label: '监管留存', value: 18, color: PIE_COLORS.监管留存 },
    ],
  },
  {
    id: 'CMP_DEMO_004',
    city: '杭州',
    lng: 120.1551,
    lat: 30.2741,
    total_cny: 54000000,
    slices: [
      { label: '工程款', value: 49, color: PIE_COLORS.工程款 },
      { label: '材料款', value: 27, color: PIE_COLORS.材料款 },
      { label: '监管留存', value: 24, color: PIE_COLORS.监管留存 },
    ],
  },
];

function buildPieGradient(slices: PieSlice[]) {
  let start = 0;
  const parts = slices.map((slice) => {
    const end = start + slice.value;
    const segment = `${slice.color} ${start}% ${end}%`;
    start = end;
    return segment;
  });

  return `conic-gradient(${parts.join(', ')})`;
}

function createPopupHtml(datum: CompositeDemoDatum) {
  const rows = datum.slices
    .map(
      (slice) => `
        <div class="composite-popup-row">
          <span class="composite-popup-key">${slice.label}</span>
          <span class="composite-popup-value">${slice.value}%</span>
        </div>
      `,
    )
    .join('');

  return `
    <div class="composite-popup-card">
      <div class="composite-popup-header">${datum.city}资金结构</div>
      <div class="composite-popup-grid">
        <div class="composite-popup-row">
          <span class="composite-popup-key">示例ID</span>
          <span class="composite-popup-value">${datum.id}</span>
        </div>
        <div class="composite-popup-row">
          <span class="composite-popup-key">总金额</span>
          <span class="composite-popup-value">${(datum.total_cny / 1000000).toFixed(1)} 百万元</span>
        </div>
        ${rows}
      </div>
    </div>
  `;
}

function createPieMarkerElement(datum: CompositeDemoDatum) {
  const el = document.createElement('div');
  el.className = 'composite-marker';
  el.innerHTML = `
    <div class="composite-marker-ring" style="background:${buildPieGradient(datum.slices)};">
      <div class="composite-marker-core">${datum.city}</div>
    </div>
  `;
  return el;
}

export function CompositeMapL7() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<L7Scene | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let disposed = false;

    const setupScene = async () => {
      const [{ Marker, Popup, Scene }, { GaodeMap }] = await Promise.all([
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

      containerRef.current.innerHTML = '';

      const scene = new Scene({
        id: containerRef.current,
        map: new GaodeMap({
          style: 'normal',
          center: [114.2, 27.2],
          zoom: 4.55,
          pitch: 0,
          token: process.env.NEXT_PUBLIC_AMAP_KEY,
        }),
      });

      sceneRef.current = scene;

      scene.on('loaded', () => {
        if (disposed) return;

        demoData.forEach((datum) => {
          const markerEl = createPieMarkerElement(datum);
          const popup = new Popup({
            closeButton: false,
            closeOnClick: false,
            anchor: 'top',
            offsets: [0, -8],
          }).setHTML(createPopupHtml(datum));

          const marker = new Marker({
            element: markerEl,
            offsets: [0, -18],
          })
            .setLnglat({ lng: datum.lng, lat: datum.lat })
            .setPopup(popup);

          markerEl.addEventListener('mouseenter', () => {
            marker.openPopup();
          });

          markerEl.addEventListener('mouseleave', () => {
            marker.closePopup();
          });

          marker.addTo(scene as unknown as L7Container);
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
    <div className="space-y-3">
      <div
        ref={containerRef}
        style={{ width: '100%', height: '320px', position: 'relative' }}
        className="overflow-hidden rounded-md border border-slate-200"
      />
      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: PIE_COLORS.工程款 }} />
          <span>工程款</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: PIE_COLORS.材料款 }} />
          <span>材料款</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: PIE_COLORS.监管留存 }} />
          <span>监管留存</span>
        </div>
        <span className="text-slate-500">鼠标悬停查看各城市的资金结构弹窗</span>
      </div>
      <style jsx global>{`
        .composite-marker {
          width: 52px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          filter: drop-shadow(0 4px 8px rgba(15, 23, 42, 0.18));
        }

        .composite-marker-ring {
          width: 52px;
          height: 52px;
          border-radius: 9999px;
          padding: 5px;
          box-sizing: border-box;
        }

        .composite-marker-core {
          width: 100%;
          height: 100%;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.96);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0f172a;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.01em;
        }

        .l7-popup .composite-popup-card {
          min-width: 190px;
        }

        .l7-popup .composite-popup-header {
          font-size: 11px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 6px;
        }

        .l7-popup .composite-popup-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          column-gap: 8px;
          row-gap: 4px;
          font-size: 10px;
          line-height: 1.25;
        }

        .l7-popup .composite-popup-row {
          display: flex;
          flex-direction: column;
        }

        .l7-popup .composite-popup-key {
          color: #64748b;
          font-size: 9px;
        }

        .l7-popup .composite-popup-value {
          color: #0f172a;
          word-break: break-all;
        }
      `}</style>
    </div>
  );
}
