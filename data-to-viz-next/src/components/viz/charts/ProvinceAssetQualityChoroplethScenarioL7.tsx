'use client';

import React, { useEffect, useRef } from 'react';
import type { Scene as L7Scene } from '@antv/l7';
import {
  applyAmapSecurityConfig,
  destroyScene,
  loadChinaProvinceFeatureCollection,
} from './mapScenarioUtils';

export type ProvinceAssetQualityDatum = {
  province_adcode: string;
  province: string;
  stat_quarter: string;
  npl_ratio: number;
  special_mention_ratio: number;
  provision_coverage: number;
  npl_band: '稳健' | '均衡' | '关注' | '承压';
  lng: number;
  lat: number;
};

export const provinceAssetQualityScenarioData: ProvinceAssetQualityDatum[] = [
  { province_adcode: '110000', province: '北京市', stat_quarter: '2025Q4', npl_ratio: 0.012, special_mention_ratio: 0.018, provision_coverage: 2.35, npl_band: '稳健', lng: 116.4074, lat: 39.9042 },
  { province_adcode: '310000', province: '上海市', stat_quarter: '2025Q4', npl_ratio: 0.013, special_mention_ratio: 0.019, provision_coverage: 2.28, npl_band: '稳健', lng: 121.4737, lat: 31.2304 },
  { province_adcode: '330000', province: '浙江省', stat_quarter: '2025Q4', npl_ratio: 0.014, special_mention_ratio: 0.019, provision_coverage: 2.18, npl_band: '稳健', lng: 120.1536, lat: 30.2655 },
  { province_adcode: '320000', province: '江苏省', stat_quarter: '2025Q4', npl_ratio: 0.015, special_mention_ratio: 0.021, provision_coverage: 2.12, npl_band: '均衡', lng: 118.7969, lat: 32.0603 },
  { province_adcode: '440000', province: '广东省', stat_quarter: '2025Q4', npl_ratio: 0.016, special_mention_ratio: 0.022, provision_coverage: 2.05, npl_band: '均衡', lng: 113.2665, lat: 23.1322 },
  { province_adcode: '610000', province: '陕西省', stat_quarter: '2025Q4', npl_ratio: 0.018, special_mention_ratio: 0.024, provision_coverage: 1.95, npl_band: '均衡', lng: 108.9542, lat: 34.2655 },
  { province_adcode: '500000', province: '重庆市', stat_quarter: '2025Q4', npl_ratio: 0.020, special_mention_ratio: 0.026, provision_coverage: 1.86, npl_band: '关注', lng: 106.5516, lat: 29.5630 },
  { province_adcode: '420000', province: '湖北省', stat_quarter: '2025Q4', npl_ratio: 0.021, special_mention_ratio: 0.028, provision_coverage: 1.88, npl_band: '关注', lng: 114.3419, lat: 30.5465 },
  { province_adcode: '510000', province: '四川省', stat_quarter: '2025Q4', npl_ratio: 0.019, special_mention_ratio: 0.027, provision_coverage: 1.92, npl_band: '关注', lng: 104.0758, lat: 30.6517 },
  { province_adcode: '410000', province: '河南省', stat_quarter: '2025Q4', npl_ratio: 0.024, special_mention_ratio: 0.031, provision_coverage: 1.74, npl_band: '承压', lng: 113.7530, lat: 34.7657 },
];

const NPL_META: Record<ProvinceAssetQualityDatum['npl_band'], { color: string; label: string }> = {
  稳健: { color: '#bfdbfe', label: '稳健' },
  均衡: { color: '#60a5fa', label: '均衡' },
  关注: { color: '#fbbf24', label: '关注' },
  承压: { color: '#ef4444', label: '承压' },
};

export function ProvinceAssetQualityChoroplethScenarioL7() {
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
          style: 'light',
          center: [104.5, 35.4],
          zoom: 3.6,
          token: process.env.NEXT_PUBLIC_AMAP_KEY,
        }),
      });
      sceneRef.current = scene;

      scene.on('loaded', async () => {
        if (disposed) return;

        try {
          const featureCollection = await loadChinaProvinceFeatureCollection(
            provinceAssetQualityScenarioData,
            'province_adcode',
          );
          if (disposed) return;

          const baseLayer = new PolygonLayer()
            .source(featureCollection)
            .shape('fill')
            .color('#edf2f7')
            .style({
              opacity: 0.96,
              stroke: '#cbd5e1',
              lineWidth: 1.1,
            });

          scene.addLayer(baseLayer);

          (Object.keys(NPL_META) as Array<ProvinceAssetQualityDatum['npl_band']>).forEach((band) => {
            const layer = new PolygonLayer()
              .source({
                type: 'FeatureCollection',
                features: featureCollection.features.filter(
                  (feature) => feature.properties.npl_band === band,
                ),
              })
              .shape('fill')
              .color(NPL_META[band].color)
              .style({
                opacity: 0.94,
                stroke: '#ffffff',
                lineWidth: 1.5,
              });

            scene.addLayer(layer);
          });

          const labelLayer = new PointLayer()
            .source(
              provinceAssetQualityScenarioData.map((item) => ({
                label: item.province.replace('省', '').replace('市', ''),
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
            .color('#0f172a')
            .style({
              stroke: '#ffffff',
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
        {(Object.keys(NPL_META) as Array<ProvinceAssetQualityDatum['npl_band']>).map((band) => (
          <div key={band} className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: NPL_META[band].color }} />
            <span>{NPL_META[band].label}</span>
          </div>
        ))}
        <span className="text-slate-500">颜色代表省级资产质量分层，表格补充关注率与拨备覆盖率口径。</span>
      </div>
    </div>
  );
}
