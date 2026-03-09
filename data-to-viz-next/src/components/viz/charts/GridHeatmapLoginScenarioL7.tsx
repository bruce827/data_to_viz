'use client';

import React, { useEffect, useRef } from 'react';
import type { Scene as L7Scene } from '@antv/l7';
import { applyAmapSecurityConfig, destroyScene } from './mapScenarioUtils';

export type GridHeatmapLoginDatum = {
  login_id: string;
  login_time: string;
  user_id_hash: string;
  device_id_hash: string;
  ip_asn: string;
  failed_cnt_10m: number;
  geo_jump_km: number;
  anomaly_score: number;
  lng: number;
  lat: number;
  city: string;
  risk_weight: number;
  anomaly_band?: '观察' | '关注' | '高危';
};

export const gridHeatmapLoginScenarioData: GridHeatmapLoginDatum[] = [
  { login_id: 'LGN_20260305_883901', login_time: '2026-03-05T02:41:09+08:00', user_id_hash: 'u_19a***', device_id_hash: 'dev_5c2***', ip_asn: 'AS4134', failed_cnt_10m: 9, geo_jump_km: 1450, anomaly_score: 0.93, lng: 113.2644, lat: 23.1291, city: '广州市', risk_weight: 10.2 },
  { login_id: 'LGN_20260305_883917', login_time: '2026-03-05T02:42:02+08:00', user_id_hash: 'u_19a***', device_id_hash: 'dev_5c2***', ip_asn: 'AS4134', failed_cnt_10m: 7, geo_jump_km: 1448, anomaly_score: 0.90, lng: 113.2700, lat: 23.1350, city: '广州市', risk_weight: 8.9 },
  { login_id: 'LGN_20260305_883955', login_time: '2026-03-05T02:44:18+08:00', user_id_hash: 'u_88d***', device_id_hash: 'dev_7f1***', ip_asn: 'AS4837', failed_cnt_10m: 6, geo_jump_km: 1120, anomaly_score: 0.84, lng: 113.2579, lat: 23.1218, city: '广州市', risk_weight: 6.9 },
  { login_id: 'LGN_20260305_884013', login_time: '2026-03-05T02:46:09+08:00', user_id_hash: 'u_04c***', device_id_hash: 'dev_8a0***', ip_asn: 'AS4134', failed_cnt_10m: 8, geo_jump_km: 980, anomaly_score: 0.86, lng: 113.2815, lat: 23.1386, city: '广州市', risk_weight: 8.1 },
  { login_id: 'LGN_20260305_884072', login_time: '2026-03-05T02:49:41+08:00', user_id_hash: 'u_48m***', device_id_hash: 'dev_8a0***', ip_asn: 'AS4134', failed_cnt_10m: 5, geo_jump_km: 820, anomaly_score: 0.74, lng: 113.2460, lat: 23.1174, city: '广州市', risk_weight: 5.0 },
  { login_id: 'LGN_20260305_884101', login_time: '2026-03-05T02:51:33+08:00', user_id_hash: 'u_48m***', device_id_hash: 'dev_8a0***', ip_asn: 'AS4134', failed_cnt_10m: 7, geo_jump_km: 1040, anomaly_score: 0.81, lng: 113.2754, lat: 23.1432, city: '广州市', risk_weight: 7.4 },
  { login_id: 'LGN_20260305_884220', login_time: '2026-03-05T03:02:08+08:00', user_id_hash: 'u_71q***', device_id_hash: 'dev_3b1***', ip_asn: 'AS17623', failed_cnt_10m: 6, geo_jump_km: 660, anomaly_score: 0.72, lng: 114.0579, lat: 22.5431, city: '深圳市', risk_weight: 5.2 },
  { login_id: 'LGN_20260305_884246', login_time: '2026-03-05T03:04:57+08:00', user_id_hash: 'u_71q***', device_id_hash: 'dev_3b1***', ip_asn: 'AS17623', failed_cnt_10m: 7, geo_jump_km: 702, anomaly_score: 0.77, lng: 114.0662, lat: 22.5478, city: '深圳市', risk_weight: 6.5 },
  { login_id: 'LGN_20260305_884279', login_time: '2026-03-05T03:07:41+08:00', user_id_hash: 'u_54h***', device_id_hash: 'dev_9z6***', ip_asn: 'AS17623', failed_cnt_10m: 5, geo_jump_km: 580, anomaly_score: 0.69, lng: 114.0803, lat: 22.5399, city: '深圳市', risk_weight: 4.8 },
  { login_id: 'LGN_20260305_884331', login_time: '2026-03-05T03:11:26+08:00', user_id_hash: 'u_54h***', device_id_hash: 'dev_9z6***', ip_asn: 'AS17623', failed_cnt_10m: 8, geo_jump_km: 930, anomaly_score: 0.82, lng: 114.0941, lat: 22.5485, city: '深圳市', risk_weight: 7.9 },
  { login_id: 'LGN_20260305_884404', login_time: '2026-03-05T03:15:03+08:00', user_id_hash: 'u_54h***', device_id_hash: 'dev_9z6***', ip_asn: 'AS17623', failed_cnt_10m: 6, geo_jump_km: 610, anomaly_score: 0.71, lng: 114.1095, lat: 22.5440, city: '深圳市', risk_weight: 5.3 },
  { login_id: 'LGN_20260305_885112', login_time: '2026-03-05T03:58:44+08:00', user_id_hash: 'u_22f***', device_id_hash: 'dev_1c7***', ip_asn: 'AS9808', failed_cnt_10m: 4, geo_jump_km: 430, anomaly_score: 0.63, lng: 104.0668, lat: 30.5728, city: '成都市', risk_weight: 3.5 },
  { login_id: 'LGN_20260305_885169', login_time: '2026-03-05T04:02:10+08:00', user_id_hash: 'u_22f***', device_id_hash: 'dev_1c7***', ip_asn: 'AS9808', failed_cnt_10m: 5, geo_jump_km: 510, anomaly_score: 0.68, lng: 104.0630, lat: 30.5737, city: '成都市', risk_weight: 4.5 },
  { login_id: 'LGN_20260305_885238', login_time: '2026-03-05T04:07:55+08:00', user_id_hash: 'u_63k***', device_id_hash: 'dev_7n3***', ip_asn: 'AS9808', failed_cnt_10m: 4, geo_jump_km: 390, anomaly_score: 0.59, lng: 104.0704, lat: 30.5709, city: '成都市', risk_weight: 3.1 },
];

const HOTSPOT_LABELS = [
  { label: '广州主异常区', lng: 113.2660, lat: 23.1458 },
  { label: '深圳次异常区', lng: 114.0830, lat: 22.5558 },
  { label: '成都观察区', lng: 104.0668, lat: 30.5818 },
];

const GRID_COLORS = ['#fff7ed', '#fed7aa', '#fb923c', '#f97316', '#dc2626', '#7f1d1d'];
const POINT_DOMAIN = ['观察', '关注', '高危'] as const;
const POINT_COLORS = ['#fde68a', '#f59e0b', '#ef4444'];
const GRID_SIZE = 1800;
const GRID_LEGEND_ITEMS = [
  { label: '≤6', color: '#fff7ed' },
  { label: '6-8', color: '#fed7aa' },
  { label: '8-10', color: '#fb923c' },
  { label: '10-12', color: '#f97316' },
  { label: '12-14', color: '#dc2626' },
  { label: '>14', color: '#7f1d1d' },
];

const gridHeatmapLoginScenarioViewData: GridHeatmapLoginDatum[] = gridHeatmapLoginScenarioData.map((item) => ({
  ...item,
  anomaly_band: item.anomaly_score >= 0.8 ? '高危' : item.anomaly_score >= 0.68 ? '关注' : '观察',
}));

export function GridHeatmapLoginScenarioL7() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<L7Scene | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let disposed = false;

    const setupScene = async () => {
      const [{ HeatmapLayer, PointLayer, Scene }, { GaodeMap }] = await Promise.all([
        import('@antv/l7'),
        import('@antv/l7-maps'),
      ]);
      if (disposed || !containerRef.current) return;

      applyAmapSecurityConfig();
      containerRef.current.innerHTML = '';

      const scene = new Scene({
        id: containerRef.current,
        map: new GaodeMap({
          style: 'light',
          center: [109.2, 26.5],
          zoom: 5.15,
          token: process.env.NEXT_PUBLIC_AMAP_KEY,
        }),
      });
      sceneRef.current = scene;

      scene.on('loaded', () => {
        if (disposed) return;

        const gridLayer = new HeatmapLayer({})
          .source(gridHeatmapLoginScenarioViewData, {
            parser: {
              type: 'json',
              x: 'lng',
              y: 'lat',
            },
            transforms: [
              {
                type: 'grid',
                size: GRID_SIZE,
                field: 'risk_weight',
                method: 'sum',
              },
            ],
          })
          .shape('square')
          .scale('sum', {
            type: 'quantize',
            domain: [4, 17],
          })
          .color('sum', GRID_COLORS)
          .style({
            coverage: 1,
            angle: 0,
            opacity: 0.96,
          });

        const pointLayer = new PointLayer()
          .source(gridHeatmapLoginScenarioViewData, {
            parser: {
              type: 'json',
              x: 'lng',
              y: 'lat',
            },
          })
          .shape('circle')
          .size('risk_weight', [5, 10])
          .color('anomaly_band', POINT_COLORS)
          .style({
            opacity: 0.72,
            stroke: '#ffffff',
            strokeWidth: 1,
          });

        const labelLayer = new PointLayer()
          .source(HOTSPOT_LABELS, {
            parser: {
              type: 'json',
              x: 'lng',
              y: 'lat',
            },
          })
          .shape('label', 'text')
          .size(12)
          .color('#0f172a')
          .style({
            textOffset: [0, 12],
            stroke: '#ffffff',
            strokeWidth: 1.4,
          });

        scene.addLayer(gridLayer);
        scene.addLayer(pointLayer);
        scene.addLayer(labelLayer);
      });
    };

    setupScene();

    return () => {
      disposed = true;
      destroyScene(sceneRef);
    };
  }, []);

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        style={{ width: '100%', height: '380px', position: 'relative' }}
        className="overflow-hidden rounded-md border border-slate-200"
      />
      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
        <span className="text-slate-500">区域颜色表示网格累计风险权重 `sum(risk_weight)`，点位颜色表示异常等级 `anomaly_band`</span>
        <div className="flex items-center gap-2">
          <span className="text-slate-500">区域风险权重</span>
          <div className="flex flex-wrap items-center gap-2">
            {GRID_LEGEND_ITEMS.map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 rounded-sm border border-slate-200" style={{ backgroundColor: item.color }} />
                <span className="text-slate-500">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-500">点位</span>
          <div className="flex flex-wrap items-center gap-2">
            {POINT_DOMAIN.map((label, index) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 rounded-full border border-white" style={{ backgroundColor: POINT_COLORS[index] }} />
                <span className="text-slate-500">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
