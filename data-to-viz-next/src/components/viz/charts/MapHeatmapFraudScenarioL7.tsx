'use client';

import React, { useEffect, useRef } from 'react';
import type { Scene as L7Scene } from '@antv/l7';

export type MapHeatmapFraudDatum = {
  app_id: string;
  app_time: string;
  product: string;
  req_amt_cny: number;
  model_score: number;
  multi_loan_hits: number;
  device_id_hash: string;
  lng: number;
  lat: number;
  city: string;
  heat_weight: number;
};

export const mapHeatmapFraudScenarioData: MapHeatmapFraudDatum[] = [
  { app_id: 'APP_20260305_10441', app_time: '2026-03-05T09:12:33+08:00', product: '线上信用贷', req_amt_cny: 200000, model_score: 0.87, multi_loan_hits: 5, device_id_hash: 'd_77c1***', lng: 104.0668, lat: 30.5728, city: '成都市', heat_weight: 4.35 },
  { app_id: 'APP_20260305_10902', app_time: '2026-03-05T09:15:10+08:00', product: '线上信用贷', req_amt_cny: 150000, model_score: 0.91, multi_loan_hits: 7, device_id_hash: 'd_77c1***', lng: 104.0630, lat: 30.5737, city: '成都市', heat_weight: 6.37 },
  { app_id: 'APP_20260305_10941', app_time: '2026-03-05T09:21:54+08:00', product: '线上信用贷', req_amt_cny: 180000, model_score: 0.83, multi_loan_hits: 5, device_id_hash: 'd_77c1***', lng: 104.0704, lat: 30.5709, city: '成都市', heat_weight: 4.15 },
  { app_id: 'APP_20260305_11018', app_time: '2026-03-05T09:28:11+08:00', product: '线上信用贷', req_amt_cny: 220000, model_score: 0.89, multi_loan_hits: 6, device_id_hash: 'd_77c1***', lng: 104.0722, lat: 30.5689, city: '成都市', heat_weight: 5.34 },
  { app_id: 'APP_20260305_11127', app_time: '2026-03-05T09:36:42+08:00', product: '线上消费贷', req_amt_cny: 120000, model_score: 0.81, multi_loan_hits: 4, device_id_hash: 'd_81b4***', lng: 104.0612, lat: 30.5694, city: '成都市', heat_weight: 3.24 },
  { app_id: 'APP_20260305_11203', app_time: '2026-03-05T09:41:26+08:00', product: '线上信用贷', req_amt_cny: 260000, model_score: 0.86, multi_loan_hits: 5, device_id_hash: 'd_84d2***', lng: 104.0756, lat: 30.5761, city: '成都市', heat_weight: 4.30 },
  { app_id: 'APP_20260305_11268', app_time: '2026-03-05T09:46:17+08:00', product: '线上信用贷', req_amt_cny: 140000, model_score: 0.79, multi_loan_hits: 4, device_id_hash: 'd_81b4***', lng: 104.0586, lat: 30.5750, city: '成都市', heat_weight: 3.16 },
  { app_id: 'APP_20260305_11342', app_time: '2026-03-05T09:53:01+08:00', product: '线上消费贷', req_amt_cny: 110000, model_score: 0.77, multi_loan_hits: 3, device_id_hash: 'd_90aa***', lng: 104.0684, lat: 30.5792, city: '成都市', heat_weight: 2.31 },
  { app_id: 'APP_20260305_11409', app_time: '2026-03-05T09:57:38+08:00', product: '线上信用贷', req_amt_cny: 175000, model_score: 0.84, multi_loan_hits: 4, device_id_hash: 'd_84d2***', lng: 104.0655, lat: 30.5665, city: '成都市', heat_weight: 3.36 },
  { app_id: 'APP_20260305_11831', app_time: '2026-03-05T10:18:22+08:00', product: '线上信用贷', req_amt_cny: 190000, model_score: 0.82, multi_loan_hits: 4, device_id_hash: 'd_a712***', lng: 106.5516, lat: 29.5630, city: '重庆市', heat_weight: 3.28 },
  { app_id: 'APP_20260305_11888', app_time: '2026-03-05T10:22:47+08:00', product: '线上消费贷', req_amt_cny: 130000, model_score: 0.76, multi_loan_hits: 4, device_id_hash: 'd_a712***', lng: 106.5478, lat: 29.5585, city: '重庆市', heat_weight: 3.04 },
  { app_id: 'APP_20260305_11944', app_time: '2026-03-05T10:29:10+08:00', product: '线上信用贷', req_amt_cny: 240000, model_score: 0.88, multi_loan_hits: 5, device_id_hash: 'd_b933***', lng: 106.5559, lat: 29.5667, city: '重庆市', heat_weight: 4.40 },
  { app_id: 'APP_20260305_12017', app_time: '2026-03-05T10:37:51+08:00', product: '线上信用贷', req_amt_cny: 170000, model_score: 0.80, multi_loan_hits: 4, device_id_hash: 'd_b933***', lng: 106.5602, lat: 29.5609, city: '重庆市', heat_weight: 3.20 },
  { app_id: 'APP_20260305_12094', app_time: '2026-03-05T10:45:34+08:00', product: '线上消费贷', req_amt_cny: 105000, model_score: 0.73, multi_loan_hits: 3, device_id_hash: 'd_b933***', lng: 106.5459, lat: 29.5541, city: '重庆市', heat_weight: 2.19 },
  { app_id: 'APP_20260305_12162', app_time: '2026-03-05T10:53:16+08:00', product: '线上信用贷', req_amt_cny: 210000, model_score: 0.85, multi_loan_hits: 5, device_id_hash: 'd_c014***', lng: 106.5525, lat: 29.5702, city: '重庆市', heat_weight: 4.25 },
  { app_id: 'APP_20260305_12238', app_time: '2026-03-05T10:59:27+08:00', product: '线上信用贷', req_amt_cny: 145000, model_score: 0.74, multi_loan_hits: 3, device_id_hash: 'd_c014***', lng: 106.5588, lat: 29.5527, city: '重庆市', heat_weight: 2.22 },
  { app_id: 'APP_20260305_12614', app_time: '2026-03-05T11:18:11+08:00', product: '线上信用贷', req_amt_cny: 160000, model_score: 0.71, multi_loan_hits: 3, device_id_hash: 'd_d219***', lng: 108.9402, lat: 34.3416, city: '西安市', heat_weight: 2.13 },
  { app_id: 'APP_20260305_12671', app_time: '2026-03-05T11:24:36+08:00', product: '线上信用贷', req_amt_cny: 185000, model_score: 0.78, multi_loan_hits: 4, device_id_hash: 'd_d219***', lng: 108.9468, lat: 34.3472, city: '西安市', heat_weight: 3.12 },
  { app_id: 'APP_20260305_12723', app_time: '2026-03-05T11:31:42+08:00', product: '线上消费贷', req_amt_cny: 98000, model_score: 0.69, multi_loan_hits: 2, device_id_hash: 'd_e301***', lng: 108.9347, lat: 34.3388, city: '西安市', heat_weight: 1.38 },
  { app_id: 'APP_20260305_12786', app_time: '2026-03-05T11:38:29+08:00', product: '线上信用贷', req_amt_cny: 205000, model_score: 0.82, multi_loan_hits: 4, device_id_hash: 'd_e301***', lng: 108.9515, lat: 34.3449, city: '西安市', heat_weight: 3.28 },
];

const hotspotLabels = [
  { name: '成都主热区', lng: 104.0668, lat: 30.5728 },
  { name: '重庆次热区', lng: 106.5525, lat: 29.5630 },
  { name: '西安观察区', lng: 108.9468, lat: 34.3449 },
];

const HEAT_COLORS = ['#fff7bc', '#fee391', '#fec44f', '#fb8d3c', '#f03b20', '#bd0026'];

export function MapHeatmapFraudScenarioL7() {
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
          style: 'light',
          center: [106.1, 31.5],
          zoom: 4.25,
          pitch: 0,
          token: process.env.NEXT_PUBLIC_AMAP_KEY,
        }),
      });
      sceneRef.current = scene;

      scene.on('loaded', () => {
        if (disposed) return;

        const heatLayer = new HeatmapLayer({})
          .source(mapHeatmapFraudScenarioData, {
            parser: {
              type: 'json',
              x: 'lng',
              y: 'lat',
            },
          })
          .shape('heatmap')
          .size('heat_weight', [0, 1])
          .style({
            intensity: 2.8,
            radius: 32,
            opacity: 0.88,
            rampColors: {
              colors: HEAT_COLORS,
              positions: [0, 0.2, 0.4, 0.6, 0.8, 1],
            },
          });

        const labelLayer = new PointLayer()
          .source(hotspotLabels, {
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
            strokeWidth: 1.4,
          });

        scene.addLayer(heatLayer);
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
    <div className="space-y-3">
      <div
        ref={containerRef}
        style={{ width: '100%', height: '380px', position: 'relative' }}
        className="overflow-hidden rounded-md border border-slate-200"
      />
      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
        <span className="text-slate-500">热力权重 = `model_score × multi_loan_hits`</span>
        <div className="flex items-center gap-2">
          <span className="text-slate-500">低</span>
          <div className="h-3 w-36 rounded-full border border-slate-200" style={{ background: `linear-gradient(90deg, ${HEAT_COLORS.join(', ')})` }} />
          <span className="text-slate-500">高</span>
        </div>
      </div>
    </div>
  );
}
