'use client';

import React, { useEffect, useRef } from 'react';
import type { Scene as L7Scene } from '@antv/l7';
import type { ILayer } from '@antv/l7-core';

export type BubbleMapCreditDatum = {
  obligor_id: string;
  obligor_name_mask: string;
  industry_lv2: string;
  rating: string;
  pd_1y: number;
  lgd: number;
  ead_cny: number;
  raroc: number;
  collateral_ltv: number;
  park_name: string;
  city: string;
  lng: number;
  lat: number;
  raroc_band: '高回报' | '平衡' | '低回报';
};

export const bubbleMapCreditScenarioData: BubbleMapCreditDatum[] = [
  {
    obligor_id: 'OBL_SH_PARK_00031',
    obligor_name_mask: '某某智能制造有限公司',
    industry_lv2: '高端装备',
    rating: 'A-',
    pd_1y: 0.018,
    lgd: 0.42,
    ead_cny: 120000000,
    raroc: 0.135,
    collateral_ltv: 0.58,
    park_name: '张江科学城',
    city: '上海市',
    lng: 121.5976,
    lat: 31.2053,
    raroc_band: '高回报',
  },
  {
    obligor_id: 'OBL_BJ_PARK_00108',
    obligor_name_mask: '某某软件科技有限公司',
    industry_lv2: '软件与信息服务',
    rating: 'BBB+',
    pd_1y: 0.032,
    lgd: 0.47,
    ead_cny: 68000000,
    raroc: 0.082,
    collateral_ltv: 0.65,
    park_name: '中关村',
    city: '北京市',
    lng: 116.3269,
    lat: 39.9834,
    raroc_band: '低回报',
  },
  {
    obligor_id: 'OBL_SZ_PARK_00072',
    obligor_name_mask: '某某芯片设计有限公司',
    industry_lv2: '集成电路',
    rating: 'A',
    pd_1y: 0.016,
    lgd: 0.39,
    ead_cny: 105000000,
    raroc: 0.126,
    collateral_ltv: 0.54,
    park_name: '南山科技园',
    city: '深圳市',
    lng: 113.9436,
    lat: 22.5407,
    raroc_band: '高回报',
  },
  {
    obligor_id: 'OBL_SZ_PARK_00113',
    obligor_name_mask: '某某新能源材料有限公司',
    industry_lv2: '新材料',
    rating: 'BBB+',
    pd_1y: 0.024,
    lgd: 0.44,
    ead_cny: 76000000,
    raroc: 0.097,
    collateral_ltv: 0.61,
    park_name: '坪山产业园',
    city: '深圳市',
    lng: 114.3463,
    lat: 22.6907,
    raroc_band: '平衡',
  },
  {
    obligor_id: 'OBL_GZ_PARK_00054',
    obligor_name_mask: '某某工业互联网有限公司',
    industry_lv2: '工业软件',
    rating: 'BBB',
    pd_1y: 0.034,
    lgd: 0.49,
    ead_cny: 88000000,
    raroc: 0.078,
    collateral_ltv: 0.67,
    park_name: '黄埔科学城',
    city: '广州市',
    lng: 113.4808,
    lat: 23.1815,
    raroc_band: '低回报',
  },
  {
    obligor_id: 'OBL_HZ_PARK_00029',
    obligor_name_mask: '某某电商服务有限公司',
    industry_lv2: '平台服务',
    rating: 'BBB+',
    pd_1y: 0.027,
    lgd: 0.45,
    ead_cny: 74000000,
    raroc: 0.096,
    collateral_ltv: 0.63,
    park_name: '未来科技城',
    city: '杭州市',
    lng: 119.9887,
    lat: 30.3615,
    raroc_band: '平衡',
  },
  {
    obligor_id: 'OBL_SZH_PARK_00044',
    obligor_name_mask: '某某精密部件有限公司',
    industry_lv2: '精密制造',
    rating: 'A-',
    pd_1y: 0.021,
    lgd: 0.41,
    ead_cny: 92000000,
    raroc: 0.118,
    collateral_ltv: 0.56,
    park_name: '苏州工业园',
    city: '苏州市',
    lng: 120.7288,
    lat: 31.3222,
    raroc_band: '平衡',
  },
  {
    obligor_id: 'OBL_WH_PARK_00061',
    obligor_name_mask: '某某医疗设备有限公司',
    industry_lv2: '医疗器械',
    rating: 'BBB',
    pd_1y: 0.031,
    lgd: 0.46,
    ead_cny: 83000000,
    raroc: 0.089,
    collateral_ltv: 0.64,
    park_name: '光谷生物城',
    city: '武汉市',
    lng: 114.4202,
    lat: 30.5155,
    raroc_band: '低回报',
  },
  {
    obligor_id: 'OBL_CD_PARK_00036',
    obligor_name_mask: '某某云计算服务有限公司',
    industry_lv2: '云服务',
    rating: 'BBB+',
    pd_1y: 0.026,
    lgd: 0.43,
    ead_cny: 61000000,
    raroc: 0.101,
    collateral_ltv: 0.6,
    park_name: '天府软件园',
    city: '成都市',
    lng: 104.0753,
    lat: 30.5484,
    raroc_band: '平衡',
  },
  {
    obligor_id: 'OBL_HF_PARK_00022',
    obligor_name_mask: '某某汽车电子有限公司',
    industry_lv2: '汽车电子',
    rating: 'A-',
    pd_1y: 0.019,
    lgd: 0.4,
    ead_cny: 72000000,
    raroc: 0.116,
    collateral_ltv: 0.57,
    park_name: '合肥高新区',
    city: '合肥市',
    lng: 117.1972,
    lat: 31.8206,
    raroc_band: '平衡',
  },
];

const RAROC_META: Record<BubbleMapCreditDatum['raroc_band'], { color: string; label: string }> = {
  高回报: { color: '#059669', label: '高回报' },
  平衡: { color: '#2563eb', label: '平衡' },
  低回报: { color: '#e11d48', label: '低回报' },
};

const popupFields = [
  { field: 'obligor_id', formatField: '借款人ID' },
  { field: 'obligor_name_mask', formatField: '企业名称' },
  { field: 'industry_lv2', formatField: '二级行业' },
  { field: 'rating', formatField: '内评等级' },
  {
    field: 'pd_1y',
    formatField: '1年PD',
    formatValue: (value: unknown) => (typeof value === 'number' ? `${(value * 100).toFixed(2)}%` : String(value ?? '')),
  },
  {
    field: 'lgd',
    formatField: 'LGD',
    formatValue: (value: unknown) => (typeof value === 'number' ? `${(value * 100).toFixed(0)}%` : String(value ?? '')),
  },
  {
    field: 'ead_cny',
    formatField: 'EAD',
    formatValue: (value: unknown) =>
      typeof value === 'number' ? `${(value / 1000000).toFixed(1)} 百万元` : String(value ?? ''),
  },
  {
    field: 'raroc',
    formatField: 'RAROC',
    formatValue: (value: unknown) => (typeof value === 'number' ? `${(value * 100).toFixed(1)}%` : String(value ?? '')),
  },
  {
    field: 'collateral_ltv',
    formatField: '抵押率LTV',
    formatValue: (value: unknown) => (typeof value === 'number' ? `${(value * 100).toFixed(0)}%` : String(value ?? '')),
  },
  { field: 'park_name', formatField: '园区' },
  { field: 'city', formatField: '城市' },
  { field: 'raroc_band', formatField: '回报分层' },
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

export function BubbleMapCreditScenarioL7() {
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
          style: 'normal',
          center: [113.8, 32.1],
          zoom: 4.05,
          pitch: 0,
          token: process.env.NEXT_PUBLIC_AMAP_KEY,
        }),
      });
      sceneRef.current = scene;

      scene.on('loaded', () => {
        if (disposed) return;
        const popupItems: Array<{
          layer: ILayer;
          title: (feature: BubbleMapCreditDatum) => string;
          fields: typeof popupFields;
        }> = [];

        (Object.keys(RAROC_META) as BubbleMapCreditDatum['raroc_band'][]).forEach((band) => {
          const rows = bubbleMapCreditScenarioData.filter((row) => row.raroc_band === band);
          if (!rows.length) return;

          const layer = new PointLayer()
            .source(rows, {
              parser: {
                type: 'json',
                x: 'lng',
                y: 'lat',
              },
            })
            .shape('circle')
            .size('ead_cny', [10, 34])
            .color(RAROC_META[band].color)
            .style({
              opacity: 0.72,
              stroke: RAROC_META[band].color,
              strokeWidth: 1.8,
            });

          scene.addLayer(layer);
          popupItems.push({
            layer,
            title: (feature) => `${feature.park_name} · ${feature.raroc_band}`,
            fields: popupFields,
          });
        });

        const labelRows = bubbleMapCreditScenarioData
          .filter((row) => row.ead_cny >= 90000000 || row.raroc_band === '低回报')
          .map((row) => ({
            ...row,
            label: `${row.city.replace('市', '')}·${row.park_name}`,
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
            textOffset: [0, 14],
            stroke: '#ffffff',
            strokeWidth: 1.2,
          });

        scene.addLayer(labelLayer);
        popupItems.push({
          layer: labelLayer,
          title: (feature) => `${feature.park_name} · ${feature.raroc_band}`,
          fields: popupFields,
        });

        const popup = new LayerPopup({
          className: 'bubblemap-credit-popup-compact',
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

  const legendItems = Object.entries(RAROC_META) as Array<[BubbleMapCreditDatum['raroc_band'], { color: string; label: string }]>;

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        style={{ width: '100%', height: '360px', position: 'relative' }}
        className="overflow-hidden rounded-md border border-slate-200"
      />
      <style jsx global>{`
        .bubblemap-credit-popup-compact {
          max-width: 280px;
        }

        .bubblemap-credit-popup-compact .l7-popup-content {
          min-width: 0;
          padding: 0;
        }

        .bubblemap-credit-popup-compact .l7-popup-content__title {
          padding: 6px 8px 3px;
          font-size: 11px;
          font-weight: 600;
          line-height: 1.2;
        }

        .bubblemap-credit-popup-compact .l7-popup-content__panel {
          padding: 0 8px 7px;
          font-size: 10px;
          line-height: 1.2;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          column-gap: 8px;
          row-gap: 3px;
        }

        .bubblemap-credit-popup-compact .l7-layer-popup__row {
          display: flex;
          flex-direction: column;
          align-items: start;
          line-height: 1.2;
        }

        .bubblemap-credit-popup-compact .l7-layer-popup__row + .l7-layer-popup__row {
          margin-top: 0;
        }

        .bubblemap-credit-popup-compact .l7-layer-popup__key {
          color: #475569;
          white-space: nowrap;
          font-size: 9px;
        }

        .bubblemap-credit-popup-compact .l7-layer-popup__value {
          color: #0f172a;
          word-break: break-all;
          font-size: 10px;
        }
      `}</style>
      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
        {legendItems.map(([band, meta]) => (
          <div key={band} className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: meta.color }} />
            <span>{meta.label}</span>
          </div>
        ))}
        <span className="text-slate-500">气泡大小 = EAD</span>
      </div>
    </div>
  );
}
