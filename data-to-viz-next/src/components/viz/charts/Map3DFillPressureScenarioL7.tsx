'use client';

import React, { useEffect, useRef } from 'react';
import type { Scene as L7Scene } from '@antv/l7';
import {
  applyAmapSecurityConfig,
  destroyScene,
  loadChinaProvinceFeatureCollection,
} from './mapScenarioUtils';

export type Map3DFillPressureDatum = {
  region_adcode: string;
  region_name: string;
  stat_quarter: string;
  re_loan_ratio: number;
  mortgage_ratio: number;
  limit_ratio: number;
  over_limit_bp: number;
  pressure_band: '安全边际' | '观察' | '高压监测' | '接近红线';
  height_level: number;
  lng: number;
  lat: number;
};

export const map3DFillPressureScenarioData: Map3DFillPressureDatum[] = [
  { region_adcode: '110000', region_name: '北京市', stat_quarter: '2025Q4', re_loan_ratio: 0.227, mortgage_ratio: 0.166, limit_ratio: 0.250, over_limit_bp: -23, pressure_band: '观察', height_level: 2, lng: 116.4074, lat: 39.9042 },
  { region_adcode: '310000', region_name: '上海市', stat_quarter: '2025Q4', re_loan_ratio: 0.238, mortgage_ratio: 0.172, limit_ratio: 0.275, over_limit_bp: -37, pressure_band: '安全边际', height_level: 1, lng: 121.4737, lat: 31.2304 },
  { region_adcode: '320000', region_name: '江苏省', stat_quarter: '2025Q4', re_loan_ratio: 0.249, mortgage_ratio: 0.181, limit_ratio: 0.260, over_limit_bp: -11, pressure_band: '高压监测', height_level: 4, lng: 118.7969, lat: 32.0603 },
  { region_adcode: '330000', region_name: '浙江省', stat_quarter: '2025Q4', re_loan_ratio: 0.241, mortgage_ratio: 0.176, limit_ratio: 0.260, over_limit_bp: -19, pressure_band: '观察', height_level: 3, lng: 120.1536, lat: 30.2655 },
  { region_adcode: '350000', region_name: '福建省', stat_quarter: '2025Q4', re_loan_ratio: 0.256, mortgage_ratio: 0.188, limit_ratio: 0.250, over_limit_bp: 6, pressure_band: '接近红线', height_level: 5, lng: 119.2965, lat: 26.0745 },
  { region_adcode: '440000', region_name: '广东省', stat_quarter: '2025Q4', re_loan_ratio: 0.214, mortgage_ratio: 0.158, limit_ratio: 0.225, over_limit_bp: -11, pressure_band: '高压监测', height_level: 4, lng: 113.2665, lat: 23.1322 },
  { region_adcode: '460000', region_name: '海南省', stat_quarter: '2025Q4', re_loan_ratio: 0.262, mortgage_ratio: 0.184, limit_ratio: 0.255, over_limit_bp: 7, pressure_band: '接近红线', height_level: 5, lng: 110.3486, lat: 20.0199 },
  { region_adcode: '500000', region_name: '重庆市', stat_quarter: '2025Q4', re_loan_ratio: 0.231, mortgage_ratio: 0.171, limit_ratio: 0.235, over_limit_bp: -4, pressure_band: '高压监测', height_level: 4, lng: 106.5516, lat: 29.5630 },
];

const PRESSURE_META: Record<Map3DFillPressureDatum['pressure_band'], { color: string; label: string }> = {
  安全边际: { color: '#60a5fa', label: '安全边际' },
  观察: { color: '#34d399', label: '观察' },
  高压监测: { color: '#f59e0b', label: '高压监测' },
  接近红线: { color: '#dc2626', label: '接近红线' },
};

export function Map3DFillPressureScenarioL7() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<L7Scene | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let disposed = false;

    const setupScene = async () => {
      const [{ PointLayer, PolygonLayer, Scene }, { GaodeMap }] = await Promise.all([
        import('@antv/l7'),
        import('@antv/l7-maps'),
      ]);
      if (disposed || !containerRef.current) return;

      applyAmapSecurityConfig();
      containerRef.current.innerHTML = '';

      const scene = new Scene({
        id: containerRef.current,
        map: new GaodeMap({
          style: 'dark',
          center: [111.5, 29.8],
          zoom: 4.15,
          pitch: 42,
          token: process.env.NEXT_PUBLIC_AMAP_KEY,
        }),
      });
      sceneRef.current = scene;

      scene.on('loaded', async () => {
        if (disposed) return;

        try {
          const featureCollection = await loadChinaProvinceFeatureCollection(
            map3DFillPressureScenarioData,
            'region_adcode',
          );
          if (disposed) return;

          (Object.keys(PRESSURE_META) as Array<Map3DFillPressureDatum['pressure_band']>).forEach((band) => {
            const layer = new PolygonLayer()
              .source({
                type: 'FeatureCollection',
                features: featureCollection.features.filter(
                  (feature) => feature.properties.pressure_band === band,
                ),
              })
              .shape('extrude')
              .size('height_level', [120, 180, 260, 340, 430, 520])
              .color(PRESSURE_META[band].color)
              .style({
                opacity: 0.92,
              });

            scene.addLayer(layer);
          });

          const labelLayer = new PointLayer()
            .source(
              map3DFillPressureScenarioData.map((item) => ({
                label: `${item.region_name.replace('省', '').replace('市', '')} ${item.over_limit_bp}bp`,
                lng: item.lng,
                lat: item.lat,
              })),
              {
                parser: {
                  type: 'json',
                  x: 'lng',
                  y: 'lat',
                },
              },
            )
            .shape('label', 'text')
            .size(11)
            .color('#f8fafc')
            .style({
              textOffset: [0, 12],
              stroke: '#0f172a',
              strokeWidth: 1.4,
            });

          scene.addLayer(labelLayer);
        } catch {
          // 保持页面稳定，避免远程区划数据不可用时中断整个 story。
        }
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
        {(Object.keys(PRESSURE_META) as Array<Map3DFillPressureDatum['pressure_band']>).map((band) => (
          <div key={band} className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: PRESSURE_META[band].color }} />
            <span>{PRESSURE_META[band].label}</span>
          </div>
        ))}
        <span className="text-slate-500">柱高优先表达“距离监管上限的压力程度”，越高越接近红线。</span>
      </div>
    </div>
  );
}
