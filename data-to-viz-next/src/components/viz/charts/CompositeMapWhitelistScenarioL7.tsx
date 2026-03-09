'use client';

import React, { useEffect, useRef } from 'react';
import type { Scene as L7Scene } from '@antv/l7';
import type { ILayer, L7Container } from '@antv/l7-core';

export type CompositeProjectDatum = {
  project_id: string;
  project_name: string;
  whitelist_batch: string;
  approved_loan_cny: number;
  drawn_loan_cny: number;
  escrow_balance_cny: number;
  delivery_progress_pct: number;
  avg_ltv: number;
  risk_flag: '正常' | '关注' | '预警';
  lng: number;
  lat: number;
};

export type CompositeFlowDatum = {
  pay_id: string;
  project_id: string;
  pay_time: string;
  from_account: string;
  to_counterparty: string;
  purpose: string;
  amount_cny: number;
  from_lng: number;
  from_lat: number;
  to_lng: number;
  to_lat: number;
  risk_score: number;
  risk_flag: '正常' | '关注' | '预警';
  path: [number, number][];
};

export const compositeProjectScenarioData: CompositeProjectDatum[] = [
  {
    project_id: 'RE_PRJ_SZ_2024_0018',
    project_name: '某花园三期',
    whitelist_batch: '2024Q1',
    approved_loan_cny: 1200000000,
    drawn_loan_cny: 680000000,
    escrow_balance_cny: 155000000,
    delivery_progress_pct: 0.62,
    avg_ltv: 0.68,
    risk_flag: '正常',
    lng: 113.9345,
    lat: 22.5407,
  },
  {
    project_id: 'RE_PRJ_GZ_2024_0042',
    project_name: '某城广场二期',
    whitelist_batch: '2024Q2',
    approved_loan_cny: 980000000,
    drawn_loan_cny: 540000000,
    escrow_balance_cny: 102000000,
    delivery_progress_pct: 0.47,
    avg_ltv: 0.71,
    risk_flag: '关注',
    lng: 113.3618,
    lat: 23.1228,
  },
  {
    project_id: 'RE_PRJ_WH_2024_0071',
    project_name: '某国际社区一期',
    whitelist_batch: '2024Q3',
    approved_loan_cny: 860000000,
    drawn_loan_cny: 410000000,
    escrow_balance_cny: 88000000,
    delivery_progress_pct: 0.31,
    avg_ltv: 0.74,
    risk_flag: '预警',
    lng: 114.314,
    lat: 30.5983,
  },
];

export const compositeFlowScenarioData: CompositeFlowDatum[] = [
  {
    pay_id: 'PAY_20260305_00091',
    project_id: 'RE_PRJ_SZ_2024_0018',
    pay_time: '2026-03-05T10:18:00+08:00',
    from_account: 'ESCROW_RE_0018',
    to_counterparty: '某某建筑公司',
    purpose: '主体结构工程款',
    amount_cny: 28000000,
    from_lng: 113.9345,
    from_lat: 22.5407,
    to_lng: 114.0661,
    to_lat: 22.5485,
    risk_score: 0.21,
    risk_flag: '正常',
    path: [
      [113.9345, 22.5407],
      [114.0661, 22.5485],
    ],
  },
  {
    pay_id: 'PAY_20260305_00096',
    project_id: 'RE_PRJ_SZ_2024_0018',
    pay_time: '2026-03-05T11:42:00+08:00',
    from_account: 'ESCROW_RE_0018',
    to_counterparty: '某某机电安装公司',
    purpose: '机电安装工程款',
    amount_cny: 18000000,
    from_lng: 113.9345,
    from_lat: 22.5407,
    to_lng: 113.9227,
    to_lat: 22.5314,
    risk_score: 0.32,
    risk_flag: '正常',
    path: [
      [113.9345, 22.5407],
      [113.9227, 22.5314],
    ],
  },
  {
    pay_id: 'PAY_20260305_00112',
    project_id: 'RE_PRJ_GZ_2024_0042',
    pay_time: '2026-03-05T13:08:00+08:00',
    from_account: 'ESCROW_RE_0042',
    to_counterparty: '某某土建公司',
    purpose: '土建工程款',
    amount_cny: 22000000,
    from_lng: 113.3618,
    from_lat: 23.1228,
    to_lng: 113.3782,
    to_lat: 23.128,
    risk_score: 0.46,
    risk_flag: '关注',
    path: [
      [113.3618, 23.1228],
      [113.3782, 23.128],
    ],
  },
  {
    pay_id: 'PAY_20260305_00118',
    project_id: 'RE_PRJ_GZ_2024_0042',
    pay_time: '2026-03-05T15:26:00+08:00',
    from_account: 'ESCROW_RE_0042',
    to_counterparty: '某某监理咨询公司',
    purpose: '监理咨询费',
    amount_cny: 8000000,
    from_lng: 113.3618,
    from_lat: 23.1228,
    to_lng: 113.3491,
    to_lat: 23.1095,
    risk_score: 0.58,
    risk_flag: '关注',
    path: [
      [113.3618, 23.1228],
      [113.3491, 23.1095],
    ],
  },
  {
    pay_id: 'PAY_20260305_00127',
    project_id: 'RE_PRJ_WH_2024_0071',
    pay_time: '2026-03-05T09:56:00+08:00',
    from_account: 'ESCROW_RE_0071',
    to_counterparty: '某某钢构工程公司',
    purpose: '钢构工程款',
    amount_cny: 19000000,
    from_lng: 114.314,
    from_lat: 30.5983,
    to_lng: 114.3382,
    to_lat: 30.6031,
    risk_score: 0.63,
    risk_flag: '关注',
    path: [
      [114.314, 30.5983],
      [114.3382, 30.6031],
    ],
  },
  {
    pay_id: 'PAY_20260305_00134',
    project_id: 'RE_PRJ_WH_2024_0071',
    pay_time: '2026-03-05T14:37:00+08:00',
    from_account: 'ESCROW_RE_0071',
    to_counterparty: '某某建材供应商',
    purpose: '材料供应款',
    amount_cny: 14000000,
    from_lng: 114.314,
    from_lat: 30.5983,
    to_lng: 114.2877,
    to_lat: 30.5871,
    risk_score: 0.74,
    risk_flag: '预警',
    path: [
      [114.314, 30.5983],
      [114.2877, 30.5871],
    ],
  },
  {
    pay_id: 'PAY_20260305_00139',
    project_id: 'RE_PRJ_WH_2024_0071',
    pay_time: '2026-03-05T17:15:00+08:00',
    from_account: 'ESCROW_RE_0071',
    to_counterparty: '某某劳务分包公司',
    purpose: '劳务分包款',
    amount_cny: 9000000,
    from_lng: 114.314,
    from_lat: 30.5983,
    to_lng: 114.3005,
    to_lat: 30.6154,
    risk_score: 0.82,
    risk_flag: '预警',
    path: [
      [114.314, 30.5983],
      [114.3005, 30.6154],
    ],
  },
];

const RISK_META: Record<CompositeProjectDatum['risk_flag'], { color: string; label: string }> = {
  正常: { color: '#2563eb', label: '正常' },
  关注: { color: '#f59e0b', label: '关注' },
  预警: { color: '#e11d48', label: '预警' },
};

type PopupFieldConfig = {
  field: string;
  formatField: string;
  formatValue?: (value: unknown) => string;
};

const projectPopupFields: PopupFieldConfig[] = [
  { field: 'project_id', formatField: '项目ID' },
  { field: 'project_name', formatField: '项目名称' },
  { field: 'whitelist_batch', formatField: '白名单批次' },
  {
    field: 'approved_loan_cny',
    formatField: '批复额度',
    formatValue: (value: unknown) =>
      typeof value === 'number' ? `${(value / 100000000).toFixed(1)} 亿元` : String(value ?? ''),
  },
  {
    field: 'drawn_loan_cny',
    formatField: '已提款',
    formatValue: (value: unknown) =>
      typeof value === 'number' ? `${(value / 100000000).toFixed(1)} 亿元` : String(value ?? ''),
  },
  {
    field: 'escrow_balance_cny',
    formatField: '监管专户余额',
    formatValue: (value: unknown) =>
      typeof value === 'number' ? `${(value / 100000000).toFixed(2)} 亿元` : String(value ?? ''),
  },
  {
    field: 'delivery_progress_pct',
    formatField: '交付进度',
    formatValue: (value: unknown) => (typeof value === 'number' ? `${(value * 100).toFixed(0)}%` : String(value ?? '')),
  },
  {
    field: 'avg_ltv',
    formatField: '平均LTV',
    formatValue: (value: unknown) => (typeof value === 'number' ? `${(value * 100).toFixed(0)}%` : String(value ?? '')),
  },
  { field: 'risk_flag', formatField: '风险状态' },
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

const flowPopupFields: PopupFieldConfig[] = [
  { field: 'pay_id', formatField: '支付ID' },
  { field: 'project_id', formatField: '项目ID' },
  { field: 'pay_time', formatField: '支付时间' },
  { field: 'from_account', formatField: '付款账户' },
  { field: 'to_counterparty', formatField: '对手方' },
  { field: 'purpose', formatField: '用途' },
  {
    field: 'amount_cny',
    formatField: '支付金额',
    formatValue: (value: unknown) =>
      typeof value === 'number' ? `${(value / 1000000).toFixed(1)} 百万元` : String(value ?? ''),
  },
  {
    field: 'risk_score',
    formatField: '风险分',
    formatValue: (value: unknown) => (typeof value === 'number' ? value.toFixed(2) : String(value ?? '')),
  },
  { field: 'risk_flag', formatField: '风险状态' },
  {
    field: 'from_lng',
    formatField: '起点经度',
    formatValue: (value: unknown) => (typeof value === 'number' ? value.toFixed(4) : String(value ?? '')),
  },
  {
    field: 'from_lat',
    formatField: '起点纬度',
    formatValue: (value: unknown) => (typeof value === 'number' ? value.toFixed(4) : String(value ?? '')),
  },
  {
    field: 'to_lng',
    formatField: '终点经度',
    formatValue: (value: unknown) => (typeof value === 'number' ? value.toFixed(4) : String(value ?? '')),
  },
  {
    field: 'to_lat',
    formatField: '终点纬度',
    formatValue: (value: unknown) => (typeof value === 'number' ? value.toFixed(4) : String(value ?? '')),
  },
];

function buildRectFeature(project: CompositeProjectDatum) {
  const dx = 0.026;
  const dy = 0.018;

  return {
    type: 'Feature' as const,
    properties: project,
    geometry: {
      type: 'Polygon' as const,
      coordinates: [[
        [project.lng - dx, project.lat - dy],
        [project.lng + dx, project.lat - dy],
        [project.lng + dx, project.lat + dy],
        [project.lng - dx, project.lat + dy],
        [project.lng - dx, project.lat - dy],
      ]],
    },
  };
}

function createProjectProgressMarkerElement(project: CompositeProjectDatum) {
  const color = RISK_META[project.risk_flag].color;
  const progressPct = Math.max(0, Math.min(100, project.delivery_progress_pct * 100));
  const markerEl = document.createElement('div');
  markerEl.className = 'compositemap-progress-marker';
  markerEl.innerHTML = `
    <div
      class="compositemap-progress-ring"
      style="background:conic-gradient(${color} 0% ${progressPct}%, rgba(226,232,240,0.95) ${progressPct}% 100%);"
    >
      <div class="compositemap-progress-core">${progressPct.toFixed(0)}%</div>
    </div>
  `;
  return markerEl;
}

function buildPopupHtml<T extends Record<string, unknown>>(title: string, datum: T, fields: PopupFieldConfig[]) {
  const rows = fields
    .map((item) => {
      const rawValue = datum[item.field];
      const value = item.formatValue ? item.formatValue(rawValue) : String(rawValue ?? '');
      return `
        <div class="compositemap-popup-row">
          <span class="compositemap-popup-key">${item.formatField}</span>
          <span class="compositemap-popup-value">${value}</span>
        </div>
      `;
    })
    .join('');

  return `
    <div class="compositemap-popup-card">
      <div class="compositemap-popup-title">${title}</div>
      <div class="compositemap-popup-grid">${rows}</div>
    </div>
  `;
}

export function CompositeMapWhitelistScenarioL7() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<L7Scene | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let disposed = false;

    const setupScene = async () => {
      const [{ LayerPopup, LineLayer, Marker, PointLayer, PolygonLayer, Popup, Scene }, { GaodeMap }] = await Promise.all([
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
          center: [113.92, 25.9],
          zoom: 4.8,
          pitch: 42,
          token: process.env.NEXT_PUBLIC_AMAP_KEY,
        }),
      });
      sceneRef.current = scene;

      scene.on('loaded', () => {
        if (disposed) return;
        const popupItems: Array<{
          layer: ILayer;
          title: (feature: CompositeProjectDatum | CompositeFlowDatum) => string;
          fields: typeof projectPopupFields | typeof flowPopupFields;
        }> = [];

        const polygonFeatures = compositeProjectScenarioData.map(buildRectFeature);

        (Object.keys(RISK_META) as CompositeProjectDatum['risk_flag'][]).forEach((flag) => {
          const polygonLayer = new PolygonLayer()
            .source({
              type: 'FeatureCollection',
              features: polygonFeatures.filter((feature) => feature.properties.risk_flag === flag),
            })
            .shape('fill')
            .color(RISK_META[flag].color)
            .style({
              opacity: 0.24,
            });

          scene.addLayer(polygonLayer);
          popupItems.push({
            layer: polygonLayer,
            title: (feature) => `${(feature as CompositeProjectDatum).project_name} · ${(feature as CompositeProjectDatum).risk_flag}`,
            fields: projectPopupFields,
          });

          const flowLayer = new LineLayer()
            .source(compositeFlowScenarioData.filter((row) => row.risk_flag === flag), {
              parser: {
                type: 'json',
                coordinates: 'path',
              },
            })
            .shape('arc')
            .size('amount_cny', [1.6, 4.2])
            .color(RISK_META[flag].color)
            .style({
              opacity: 0.85,
            });

          scene.addLayer(flowLayer);
          popupItems.push({
            layer: flowLayer,
            title: (feature) => `${(feature as CompositeFlowDatum).to_counterparty} · ${(feature as CompositeFlowDatum).risk_flag}`,
            fields: flowPopupFields,
          });
        });

        compositeProjectScenarioData.forEach((project) => {
          const markerEl = createProjectProgressMarkerElement(project);
          const popup = new Popup({
            className: 'compositemap-marker-popup',
            closeButton: false,
            closeOnClick: false,
            anchor: 'top',
            offsets: [0, -10],
          }).setHTML(buildPopupHtml(`${project.project_name} · ${project.risk_flag}`, project, projectPopupFields));

          const marker = new Marker({
            element: markerEl,
            offsets: [0, -22],
          })
            .setLnglat({ lng: project.lng, lat: project.lat })
            .setPopup(popup);

          markerEl.addEventListener('mouseenter', () => {
            marker.openPopup();
          });

          markerEl.addEventListener('mouseleave', () => {
            marker.closePopup();
          });

          marker.addTo(scene as unknown as L7Container);
        });

        const labelLayer = new PointLayer()
          .source(
            compositeProjectScenarioData.map((item) => ({
              ...item,
              label: item.project_name,
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
            textOffset: [0, 28],
            stroke: '#ffffff',
            strokeWidth: 1.2,
          });

        scene.addLayer(labelLayer);
        popupItems.push({
          layer: labelLayer,
          title: (feature) => `${(feature as CompositeProjectDatum).project_name} · ${(feature as CompositeProjectDatum).risk_flag}`,
          fields: projectPopupFields,
        });

        const popup = new LayerPopup({
          className: 'compositemap-popup-compact',
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

  const legendItems = Object.entries(RISK_META) as Array<[CompositeProjectDatum['risk_flag'], { color: string; label: string }]>;

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        style={{ width: '100%', height: '380px', position: 'relative' }}
        className="overflow-hidden rounded-md border border-slate-200"
      />
      <style jsx global>{`
        .compositemap-popup-compact {
          max-width: 290px;
        }

        .compositemap-popup-compact .l7-popup-content {
          min-width: 0;
          padding: 0;
        }

        .compositemap-popup-compact .l7-popup-content__title {
          padding: 6px 8px 3px;
          font-size: 11px;
          font-weight: 600;
          line-height: 1.2;
        }

        .compositemap-popup-compact .l7-popup-content__panel {
          padding: 0 8px 7px;
          font-size: 10px;
          line-height: 1.2;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          column-gap: 8px;
          row-gap: 3px;
        }

        .compositemap-popup-compact .l7-layer-popup__row {
          display: flex;
          flex-direction: column;
          align-items: start;
          line-height: 1.2;
        }

        .compositemap-popup-compact .l7-layer-popup__row + .l7-layer-popup__row {
          margin-top: 0;
        }

        .compositemap-popup-compact .l7-layer-popup__key {
          color: #475569;
          white-space: nowrap;
          font-size: 9px;
        }

        .compositemap-popup-compact .l7-layer-popup__value {
          color: #0f172a;
          word-break: break-all;
          font-size: 10px;
        }

        .compositemap-marker-popup .l7-popup-content {
          min-width: 0;
          padding: 0;
        }

        .compositemap-marker-popup .l7-popup-content__panel {
          padding: 0;
        }

        .compositemap-popup-card {
          min-width: 250px;
          padding: 8px;
        }

        .compositemap-popup-title {
          margin-bottom: 6px;
          font-size: 11px;
          font-weight: 600;
          line-height: 1.2;
          color: #0f172a;
        }

        .compositemap-popup-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          column-gap: 8px;
          row-gap: 3px;
          font-size: 10px;
          line-height: 1.2;
        }

        .compositemap-popup-row {
          display: flex;
          flex-direction: column;
          align-items: start;
        }

        .compositemap-popup-key {
          color: #475569;
          white-space: nowrap;
          font-size: 9px;
        }

        .compositemap-popup-value {
          color: #0f172a;
          word-break: break-all;
          font-size: 10px;
        }

        .compositemap-progress-marker {
          width: 54px;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          filter: drop-shadow(0 4px 10px rgba(15, 23, 42, 0.18));
        }

        .compositemap-progress-ring {
          width: 54px;
          height: 54px;
          border-radius: 9999px;
          padding: 5px;
          box-sizing: border-box;
          transform: rotate(-90deg);
        }

        .compositemap-progress-core {
          width: 100%;
          height: 100%;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid rgba(203, 213, 225, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0f172a;
          font-size: 11px;
          font-weight: 700;
          transform: rotate(90deg);
        }
      `}</style>
      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
        {legendItems.map(([flag, meta]) => (
          <div key={flag} className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: meta.color }} />
            <span>{meta.label}</span>
          </div>
        ))}
        <span className="text-slate-500">面颜色 = 项目风险状态</span>
        <span className="text-slate-500">线颜色 = 资金流风险状态</span>
        <span className="text-slate-500">圆环颜色 = 项目风险状态</span>
        <span className="text-slate-500">圆环进度 = 交付进度百分比</span>
        <span className="text-slate-500">灰色环段 = 未交付部分</span>
      </div>
    </div>
  );
}
