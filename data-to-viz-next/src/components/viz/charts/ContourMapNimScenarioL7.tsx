'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import type { Scene as L7Scene } from '@antv/l7';
import { applyAmapSecurityConfig, destroyScene } from './mapScenarioUtils';

export type ContourNimSampleDatum = {
  sample_id: string;
  city: string;
  loan_yield_pct: number;
  ftp_cost_pct: number;
  ecl_cost_pct: number;
  nim_stress_pct: number;
  lng: number;
  lat: number;
  band_index: number;
  stress_band: '安全带' | '观察带' | '承压带' | '临界带';
};

type ContourLineDatum = {
  contour_id: string;
  band_index: number;
  stress_band: ContourNimSampleDatum['stress_band'];
  label: string;
  lng: number;
  lat: number;
  coordinates: number[][];
};

export const contourNimSampleData: ContourNimSampleDatum[] = [
  { sample_id: 'NIM_PT_1100_001', city: '北京市', loan_yield_pct: 0.043, ftp_cost_pct: 0.027, ecl_cost_pct: 0.007, nim_stress_pct: 0.009, lng: 116.4074, lat: 39.9042, band_index: 0, stress_band: '安全带' },
  { sample_id: 'NIM_PT_5101_001', city: '成都市', loan_yield_pct: 0.046, ftp_cost_pct: 0.027, ecl_cost_pct: 0.009, nim_stress_pct: 0.010, lng: 104.0665, lat: 30.5728, band_index: 0, stress_band: '安全带' },
  { sample_id: 'NIM_PT_6101_001', city: '西安市', loan_yield_pct: 0.044, ftp_cost_pct: 0.028, ecl_cost_pct: 0.008, nim_stress_pct: 0.008, lng: 108.9398, lat: 34.3416, band_index: 1, stress_band: '观察带' },
  { sample_id: 'NIM_PT_3100_001', city: '上海市', loan_yield_pct: 0.041, ftp_cost_pct: 0.028, ecl_cost_pct: 0.006, nim_stress_pct: 0.007, lng: 121.4737, lat: 31.2304, band_index: 1, stress_band: '观察带' },
  { sample_id: 'NIM_PT_4403_001', city: '深圳市', loan_yield_pct: 0.045, ftp_cost_pct: 0.031, ecl_cost_pct: 0.007, nim_stress_pct: 0.007, lng: 114.0579, lat: 22.5431, band_index: 1, stress_band: '观察带' },
  { sample_id: 'NIM_PT_4201_001', city: '武汉市', loan_yield_pct: 0.040, ftp_cost_pct: 0.029, ecl_cost_pct: 0.005, nim_stress_pct: 0.006, lng: 114.3055, lat: 30.5928, band_index: 2, stress_band: '承压带' },
  { sample_id: 'NIM_PT_3205_001', city: '苏州市', loan_yield_pct: 0.039, ftp_cost_pct: 0.028, ecl_cost_pct: 0.0057, nim_stress_pct: 0.0053, lng: 120.5853, lat: 31.2989, band_index: 2, stress_band: '承压带' },
  { sample_id: 'NIM_PT_4401_001', city: '广州市', loan_yield_pct: 0.038, ftp_cost_pct: 0.028, ecl_cost_pct: 0.005, nim_stress_pct: 0.005, lng: 113.2644, lat: 23.1291, band_index: 2, stress_band: '承压带' },
  { sample_id: 'NIM_PT_4101_001', city: '郑州市', loan_yield_pct: 0.037, ftp_cost_pct: 0.029, ecl_cost_pct: 0.0039, nim_stress_pct: 0.0041, lng: 113.6254, lat: 34.7466, band_index: 3, stress_band: '临界带' },
  { sample_id: 'NIM_PT_4501_001', city: '南宁市', loan_yield_pct: 0.036, ftp_cost_pct: 0.028, ecl_cost_pct: 0.0042, nim_stress_pct: 0.0038, lng: 108.3669, lat: 22.8170, band_index: 3, stress_band: '临界带' },
];

const contourLineData: ContourLineDatum[] = [
  {
    contour_id: 'CONTOUR_SAFE',
    band_index: 0,
    stress_band: '安全带',
    label: '安全带 0.9%+',
    lng: 109.8,
    lat: 35.8,
    coordinates: [[103.5, 30.8], [106.2, 33.4], [110.4, 36.2], [114.2, 38.5], [116.6, 39.9]],
  },
  {
    contour_id: 'CONTOUR_OBSERVE',
    band_index: 1,
    stress_band: '观察带',
    label: '观察带 0.7%-0.9%',
    lng: 112.2,
    lat: 32.8,
    coordinates: [[103.2, 29.4], [107.8, 31.1], [112.1, 32.6], [117.8, 34.1], [121.4, 31.6]],
  },
  {
    contour_id: 'CONTOUR_PRESSURE',
    band_index: 2,
    stress_band: '承压带',
    label: '承压带 0.5%-0.7%',
    lng: 112.6,
    lat: 28.8,
    coordinates: [[106.0, 26.9], [110.5, 29.0], [114.0, 30.4], [118.1, 31.1], [121.0, 28.7]],
  },
  {
    contour_id: 'CONTOUR_CRITICAL',
    band_index: 3,
    stress_band: '临界带',
    label: '临界带 <0.5%',
    lng: 113.5,
    lat: 25.8,
    coordinates: [[108.0, 22.5], [111.2, 24.6], [114.0, 26.8], [116.7, 28.0], [119.0, 29.1]],
  },
];

const CONTOUR_COLORS = ['#15803d', '#0ea5e9', '#f59e0b', '#dc2626'];

export function ContourMapNimScenarioL7() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<L7Scene | null>(null);

  const contourLabels = useMemo(
    () =>
      contourLineData.map((item) => ({
        label: item.label,
        lng: item.lng,
        lat: item.lat,
      })),
    [],
  );

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
          style: 'light',
          center: [111.2, 31.2],
          zoom: 4.1,
          token: process.env.NEXT_PUBLIC_AMAP_KEY,
        }),
      });
      sceneRef.current = scene;

      scene.on('loaded', () => {
        if (disposed) return;

        const contourLayer = new LineLayer()
          .source(contourLineData, {
            parser: {
              type: 'json',
              coordinates: 'coordinates',
            },
          })
          .shape('line')
          .size(3)
          .color('band_index', CONTOUR_COLORS)
          .style({
            opacity: 0.88,
            lineType: 'dash',
            dashArray: [6, 4],
          });

        const sampleLayer = new PointLayer()
          .source(contourNimSampleData, {
            parser: {
              type: 'json',
              x: 'lng',
              y: 'lat',
            },
          })
          .shape('circle')
          .size('nim_stress_pct', [8, 16])
          .color('band_index', CONTOUR_COLORS)
          .style({
            opacity: 0.92,
            stroke: '#ffffff',
            strokeWidth: 1.5,
          });

        const labelLayer = new PointLayer()
          .source(contourLabels, {
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
            textOffset: [0, 8],
            stroke: '#ffffff',
            strokeWidth: 1.4,
          });

        scene.addLayer(contourLayer);
        scene.addLayer(sampleLayer);
        scene.addLayer(labelLayer);
      });
    };

    setupScene();

    return () => {
      disposed = true;
      destroyScene(sceneRef);
    };
  }, [contourLabels]);

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        style={{ width: '100%', height: '380px', position: 'relative' }}
        className="overflow-hidden rounded-md border border-slate-200"
      />
      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
        <span className="text-slate-500">圆点代表采样城市，虚线代表由采样点插值得到的净利差阈值线。</span>
        <div className="flex flex-wrap items-center gap-3">
          {['安全带', '观察带', '承压带', '临界带'].map((band, index) => (
            <div key={band} className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-8 rounded-full" style={{ backgroundColor: CONTOUR_COLORS[index] }} />
              <span>{band}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
