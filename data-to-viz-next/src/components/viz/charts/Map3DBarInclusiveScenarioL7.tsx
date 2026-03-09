'use client';

import React, { useEffect, useRef } from 'react';
import type { Scene as L7Scene } from '@antv/l7';
import type { ILayer } from '@antv/l7-core';

export type Map3DBarInclusiveDatum = {
  branch_id: string;
  branch_name: string;
  biz_date: string;
  new_loan_amt_cny: number;
  new_loan_cnt: number;
  avg_apr: number;
  dq_7d_rate: number;
  dq_30d_rate: number;
  approval_rate: number;
  lng: number;
  lat: number;
  dq_band: '稳定' | '观察' | '高压力';
};

export const map3DBarInclusiveScenarioData: Map3DBarInclusiveDatum[] = [
  {
    branch_id: 'BR_4403_0107',
    branch_name: '深圳福田支行',
    biz_date: '2026-03-05',
    new_loan_amt_cny: 18500000,
    new_loan_cnt: 63,
    avg_apr: 0.092,
    dq_7d_rate: 0.006,
    dq_30d_rate: 0.014,
    approval_rate: 0.41,
    lng: 114.0596,
    lat: 22.541,
    dq_band: '稳定',
  },
  {
    branch_id: 'BR_1101_0032',
    branch_name: '北京海淀支行',
    biz_date: '2026-03-05',
    new_loan_amt_cny: 13200000,
    new_loan_cnt: 51,
    avg_apr: 0.088,
    dq_7d_rate: 0.004,
    dq_30d_rate: 0.011,
    approval_rate: 0.38,
    lng: 116.3269,
    lat: 39.9834,
    dq_band: '稳定',
  },
  {
    branch_id: 'BR_3101_0075',
    branch_name: '上海浦东支行',
    biz_date: '2026-03-05',
    new_loan_amt_cny: 17600000,
    new_loan_cnt: 59,
    avg_apr: 0.091,
    dq_7d_rate: 0.005,
    dq_30d_rate: 0.013,
    approval_rate: 0.4,
    lng: 121.5443,
    lat: 31.2215,
    dq_band: '稳定',
  },
  {
    branch_id: 'BR_4401_0066',
    branch_name: '广州天河支行',
    biz_date: '2026-03-05',
    new_loan_amt_cny: 15400000,
    new_loan_cnt: 57,
    avg_apr: 0.094,
    dq_7d_rate: 0.008,
    dq_30d_rate: 0.019,
    approval_rate: 0.44,
    lng: 113.3615,
    lat: 23.1247,
    dq_band: '高压力',
  },
  {
    branch_id: 'BR_3301_0041',
    branch_name: '杭州西湖支行',
    biz_date: '2026-03-05',
    new_loan_amt_cny: 16800000,
    new_loan_cnt: 61,
    avg_apr: 0.089,
    dq_7d_rate: 0.005,
    dq_30d_rate: 0.012,
    approval_rate: 0.43,
    lng: 120.1307,
    lat: 30.2596,
    dq_band: '稳定',
  },
  {
    branch_id: 'BR_4201_0089',
    branch_name: '武汉光谷支行',
    biz_date: '2026-03-05',
    new_loan_amt_cny: 12900000,
    new_loan_cnt: 49,
    avg_apr: 0.096,
    dq_7d_rate: 0.009,
    dq_30d_rate: 0.021,
    approval_rate: 0.46,
    lng: 114.4202,
    lat: 30.5155,
    dq_band: '高压力',
  },
  {
    branch_id: 'BR_5101_0028',
    branch_name: '成都高新支行',
    biz_date: '2026-03-05',
    new_loan_amt_cny: 14100000,
    new_loan_cnt: 55,
    avg_apr: 0.093,
    dq_7d_rate: 0.007,
    dq_30d_rate: 0.015,
    approval_rate: 0.42,
    lng: 104.0658,
    lat: 30.5489,
    dq_band: '观察',
  },
  {
    branch_id: 'BR_3205_0031',
    branch_name: '苏州工业园支行',
    biz_date: '2026-03-05',
    new_loan_amt_cny: 13800000,
    new_loan_cnt: 52,
    avg_apr: 0.09,
    dq_7d_rate: 0.005,
    dq_30d_rate: 0.013,
    approval_rate: 0.41,
    lng: 120.7262,
    lat: 31.3248,
    dq_band: '稳定',
  },
  {
    branch_id: 'BR_4101_0019',
    branch_name: '郑州郑东支行',
    biz_date: '2026-03-05',
    new_loan_amt_cny: 11700000,
    new_loan_cnt: 48,
    avg_apr: 0.097,
    dq_7d_rate: 0.009,
    dq_30d_rate: 0.022,
    approval_rate: 0.47,
    lng: 113.7518,
    lat: 34.7601,
    dq_band: '高压力',
  },
  {
    branch_id: 'BR_6101_0052',
    branch_name: '西安高新支行',
    biz_date: '2026-03-05',
    new_loan_amt_cny: 10900000,
    new_loan_cnt: 44,
    avg_apr: 0.095,
    dq_7d_rate: 0.007,
    dq_30d_rate: 0.017,
    approval_rate: 0.45,
    lng: 108.9004,
    lat: 34.2271,
    dq_band: '观察',
  },
];

const DQ_META: Record<Map3DBarInclusiveDatum['dq_band'], { color: string; label: string }> = {
  稳定: { color: '#2563eb', label: '稳定' },
  观察: { color: '#f59e0b', label: '观察' },
  高压力: { color: '#e11d48', label: '高压力' },
};

const popupFields = [
  { field: 'branch_id', formatField: '网点ID' },
  { field: 'branch_name', formatField: '网点名称' },
  { field: 'biz_date', formatField: '业务日期' },
  {
    field: 'new_loan_amt_cny',
    formatField: '新发放金额',
    formatValue: (value: unknown) =>
      typeof value === 'number' ? `${(value / 1000000).toFixed(1)} 百万元` : String(value ?? ''),
  },
  { field: 'new_loan_cnt', formatField: '新发放笔数' },
  {
    field: 'avg_apr',
    formatField: '平均年化利率',
    formatValue: (value: unknown) => (typeof value === 'number' ? `${(value * 100).toFixed(1)}%` : String(value ?? '')),
  },
  {
    field: 'dq_7d_rate',
    formatField: '7天DQ率',
    formatValue: (value: unknown) => (typeof value === 'number' ? `${(value * 100).toFixed(2)}%` : String(value ?? '')),
  },
  {
    field: 'dq_30d_rate',
    formatField: '30天DQ率',
    formatValue: (value: unknown) => (typeof value === 'number' ? `${(value * 100).toFixed(2)}%` : String(value ?? '')),
  },
  {
    field: 'approval_rate',
    formatField: '审批通过率',
    formatValue: (value: unknown) => (typeof value === 'number' ? `${(value * 100).toFixed(0)}%` : String(value ?? '')),
  },
  { field: 'dq_band', formatField: '质量分层' },
  {
    field: 'lng',
    formatField: '经度',
    formatValue: (value: unknown) => (typeof value === 'number' ? value.toFixed(4) : String(value ?? '')),
  },
  {
    field: 'lat',
    formatField: '纬度',
    formatValue: (value: unknown) => (typeof value === 'number' ? value.toFixed(4) : String(value ?? '')),
  },
];

export function Map3DBarInclusiveScenarioL7() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<L7Scene | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let disposed = false;

    const setupScene = async () => {
      const [{ LayerPopup, Scene, PointLayer }, { GaodeMap }] = await Promise.all([
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
          pitch: 60,
          style: 'normal',
          center: [112.9, 33.3],
          zoom: 3.75,
          rotation: 5,
          token: process.env.NEXT_PUBLIC_AMAP_KEY,
        }),
      });
      sceneRef.current = scene;

      scene.on('loaded', () => {
        if (disposed) return;
        const popupItems: Array<{
          layer: ILayer;
          title: (feature: Map3DBarInclusiveDatum) => string;
          fields: typeof popupFields;
        }> = [];

        (Object.keys(DQ_META) as Map3DBarInclusiveDatum['dq_band'][]).forEach((band) => {
          const rows = map3DBarInclusiveScenarioData.filter((row) => row.dq_band === band);
          if (!rows.length) return;

          const layer = new PointLayer()
            .source(rows, {
              parser: {
                type: 'json',
                x: 'lng',
                y: 'lat',
              },
            })
            .shape('cylinder')
            .size('new_loan_amt_cny', (amount: number | string) => {
              const value = Number(amount) || 0;
              return [10, 10, value / 750000];
            })
            .color(DQ_META[band].color)
            .style({
              opacity: 0.78,
            });

          scene.addLayer(layer);
          popupItems.push({
            layer,
            title: (feature) => `${feature.branch_name} · ${feature.dq_band}`,
            fields: popupFields,
          });
        });

        const labelRows = map3DBarInclusiveScenarioData
          .filter((row) => row.new_loan_amt_cny >= 16000000 || row.dq_band === '高压力')
          .map((row) => ({
            ...row,
            label: row.branch_name.replace('支行', ''),
          }));

        const labelLayer = new PointLayer()
          .source(labelRows, {
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
            textOffset: [0, 16],
            stroke: '#ffffff',
            strokeWidth: 1.2,
          });

        scene.addLayer(labelLayer);
        popupItems.push({
          layer: labelLayer,
          title: (feature) => `${feature.branch_name} · ${feature.dq_band}`,
          fields: popupFields,
        });

        const popup = new LayerPopup({
          className: 'map3dbar-popup-compact',
          trigger: 'hover',
          closeButton: false,
          closeOnClick: false,
          items: popupItems,
        });

        scene.addPopup(popup);
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

  const legendItems = Object.entries(DQ_META) as Array<[Map3DBarInclusiveDatum['dq_band'], { color: string; label: string }]>;

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        style={{ width: '100%', height: '380px', position: 'relative' }}
        className="overflow-hidden rounded-md border border-slate-200"
      />
      <style jsx global>{`
        .map3dbar-popup-compact {
          max-width: 280px;
        }

        .map3dbar-popup-compact .l7-popup-content {
          min-width: 0;
          padding: 0;
        }

        .map3dbar-popup-compact .l7-popup-content__title {
          padding: 6px 8px 3px;
          font-size: 11px;
          font-weight: 600;
          line-height: 1.2;
        }

        .map3dbar-popup-compact .l7-popup-content__panel {
          padding: 0 8px 7px;
          font-size: 10px;
          line-height: 1.2;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          column-gap: 8px;
          row-gap: 3px;
        }

        .map3dbar-popup-compact .l7-layer-popup__row {
          display: flex;
          flex-direction: column;
          align-items: start;
          line-height: 1.2;
        }

        .map3dbar-popup-compact .l7-layer-popup__row + .l7-layer-popup__row {
          margin-top: 0;
        }

        .map3dbar-popup-compact .l7-layer-popup__key {
          color: #475569;
          white-space: nowrap;
          font-size: 9px;
        }

        .map3dbar-popup-compact .l7-layer-popup__value {
          color: #0f172a;
          word-break: break-all;
          font-size: 10px;
        }
      `}</style>
      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
        {legendItems.map(([band, meta]) => (
          <div key={band} className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: meta.color }} />
            <span>{meta.label}</span>
          </div>
        ))}
        <span className="text-slate-500">柱高 = 新发放金额</span>
      </div>
    </div>
  );
}
