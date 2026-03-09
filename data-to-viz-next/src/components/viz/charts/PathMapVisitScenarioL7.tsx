'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import type { Scene as L7Scene } from '@antv/l7';
import { applyAmapSecurityConfig, destroyScene } from './mapScenarioUtils';

export type PathMapVisitDatum = {
  visit_id: string;
  staff_id: string;
  ts: string;
  lng: number;
  lat: number;
  speed_kmh: number;
  checkin_flag: boolean;
  evidence_uri_mask: string;
  site_name: string;
  phase: '出发' | '途中' | '打卡' | '复核';
};

export const pathMapVisitScenarioData: PathMapVisitDatum[] = [
  { visit_id: 'VISIT_20260305_SZ_0031', staff_id: 'STAFF_4403_0077', ts: '2026-03-05T15:21:10+08:00', lng: 114.0620, lat: 22.5480, speed_kmh: 18.2, checkin_flag: false, evidence_uri_mask: '', site_name: '支行出发点', phase: '出发' },
  { visit_id: 'VISIT_20260305_SZ_0031', staff_id: 'STAFF_4403_0077', ts: '2026-03-05T15:26:32+08:00', lng: 114.0586, lat: 22.5464, speed_kmh: 16.4, checkin_flag: false, evidence_uri_mask: '', site_name: '沿途采样点A', phase: '途中' },
  { visit_id: 'VISIT_20260305_SZ_0031', staff_id: 'STAFF_4403_0077', ts: '2026-03-05T15:33:48+08:00', lng: 114.0550, lat: 22.5420, speed_kmh: 3.1, checkin_flag: true, evidence_uri_mask: 'EVD_***_001.png', site_name: '借款人门店', phase: '打卡' },
  { visit_id: 'VISIT_20260305_SZ_0031', staff_id: 'STAFF_4403_0077', ts: '2026-03-05T15:38:41+08:00', lng: 114.0518, lat: 22.5391, speed_kmh: 4.4, checkin_flag: false, evidence_uri_mask: '', site_name: '周边经营圈', phase: '复核' },
  { visit_id: 'VISIT_20260305_SZ_0031', staff_id: 'STAFF_4403_0077', ts: '2026-03-05T15:44:26+08:00', lng: 114.0489, lat: 22.5365, speed_kmh: 2.2, checkin_flag: true, evidence_uri_mask: 'EVD_***_002.png', site_name: '仓储点', phase: '打卡' },
  { visit_id: 'VISIT_20260305_SZ_0031', staff_id: 'STAFF_4403_0077', ts: '2026-03-05T15:51:59+08:00', lng: 114.0461, lat: 22.5339, speed_kmh: 11.6, checkin_flag: false, evidence_uri_mask: '', site_name: '沿途采样点B', phase: '途中' },
  { visit_id: 'VISIT_20260305_SZ_0031', staff_id: 'STAFF_4403_0077', ts: '2026-03-05T15:58:37+08:00', lng: 114.0430, lat: 22.5316, speed_kmh: 5.0, checkin_flag: true, evidence_uri_mask: 'EVD_***_003.png', site_name: '商圈回访点', phase: '打卡' },
  { visit_id: 'VISIT_20260305_SZ_0031', staff_id: 'STAFF_4403_0077', ts: '2026-03-05T16:05:12+08:00', lng: 114.0404, lat: 22.5298, speed_kmh: 19.1, checkin_flag: false, evidence_uri_mask: '', site_name: '返程结束点', phase: '复核' },
];

const CHECKIN_META: Record<'打卡' | '采样', { label: string; color: string }> = {
  打卡: { label: '打卡点', color: '#dc2626' },
  采样: { label: '轨迹采样', color: '#2563eb' },
};

export function PathMapVisitScenarioL7() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<L7Scene | null>(null);

  const { checkins, labels, trackLine } = useMemo(() => {
    const sorted = [...pathMapVisitScenarioData].sort((a, b) => a.ts.localeCompare(b.ts));

    return {
      checkins: sorted.map((point) => ({
        ...point,
        marker_type: point.checkin_flag ? '打卡' : '采样',
      })),
      labels: sorted
        .filter((point) => point.checkin_flag)
        .map((point) => ({
          label: `${point.site_name}\n${point.ts.slice(11, 16)}`,
          lng: point.lng,
          lat: point.lat,
        })),
      trackLine: [
        {
          visit_id: sorted[0]?.visit_id ?? 'VISIT_20260305_SZ_0031',
          coordinates: sorted.map((point) => [point.lng, point.lat]),
        },
      ],
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    let disposed = false;

    const setupScene = async () => {
      const [{ LineLayer, PointLayer, Scene }, { GaodeMap }] = await Promise.all([
        import('@antv/l7'),
        import('@antv/l7-maps'),
      ]);
      if (disposed || !containerRef.current) return;

      applyAmapSecurityConfig();
      containerRef.current.innerHTML = '';

      const scene = new Scene({
        id: containerRef.current,
        map: new GaodeMap({
          style: 'normal',
          center: [114.0500, 22.5398],
          zoom: 12.1,
          token: process.env.NEXT_PUBLIC_AMAP_KEY,
        }),
      });
      sceneRef.current = scene;

      scene.on('loaded', () => {
        if (disposed) return;

        const lineLayer = new LineLayer()
          .source(trackLine, {
            parser: {
              type: 'json',
              coordinates: 'coordinates',
            },
          })
          .shape('line')
          .size(4)
          .color('#2563eb')
          .style({
            opacity: 0.88,
          });

        const pointLayer = new PointLayer()
          .source(checkins, {
            parser: {
              type: 'json',
              x: 'lng',
              y: 'lat',
            },
          })
          .shape('circle')
          .size('marker_type', [8, 14])
          .color('marker_type', [CHECKIN_META.采样.color, CHECKIN_META.打卡.color])
          .style({
            opacity: 0.92,
            stroke: '#ffffff',
            strokeWidth: 1.5,
          });

        const labelLayer = new PointLayer()
          .source(labels, {
            parser: {
              type: 'json',
              x: 'lng',
              y: 'lat',
            },
          })
          .shape('label', 'text')
          .size(11)
          .color('#0f172a')
          .style({
            textOffset: [0, 18],
            stroke: '#ffffff',
            strokeWidth: 1.4,
            textAllowOverlap: true,
          });

        scene.addLayer(lineLayer);
        scene.addLayer(pointLayer);
        scene.addLayer(labelLayer);
      });
    };

    setupScene();

    return () => {
      disposed = true;
      destroyScene(sceneRef);
    };
  }, [checkins, labels, trackLine]);

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        style={{ width: '100%', height: '380px', position: 'relative' }}
        className="overflow-hidden rounded-md border border-slate-200"
      />
      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-8 rounded-full bg-blue-600" />
          <span>走访轨迹</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-red-600" />
          <span>打卡与证据点</span>
        </div>
        <span className="text-slate-500">本次任务共 8 个采样点，3 个已固化证据打卡点。</span>
      </div>
    </div>
  );
}
