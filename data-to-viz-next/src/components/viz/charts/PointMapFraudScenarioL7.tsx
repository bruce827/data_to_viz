'use client';

import React, { useEffect, useRef } from 'react';
import type { Scene as L7Scene } from '@antv/l7';
import type { ILayer } from '@antv/l7-core';

export type PointMapFraudDatum = {
  txn_id: string;
  event_time: string;
  card_id_hash: string;
  channel: string;
  mcc: string;
  merchant_id: string;
  amount_cny: number;
  risk_score: number;
  decision: '放行' | '拒绝' | '人工复核';
  province: string;
  city: string;
  lng: number;
  lat: number;
};

export const pointMapFraudScenarioData: PointMapFraudDatum[] = [
  {
    txn_id: 'TXN20260305A0007',
    event_time: '2026-03-05T20:31:18+08:00',
    card_id_hash: 'c_8f3a***',
    channel: 'POS',
    mcc: '5812',
    merchant_id: 'MCH_4403_01921',
    amount_cny: 4880.5,
    risk_score: 0.92,
    decision: '拒绝',
    province: '广东省',
    city: '深圳市',
    lng: 114.0579,
    lat: 22.5431,
  },
  {
    txn_id: 'TXN20260305A0012',
    event_time: '2026-03-05T21:02:44+08:00',
    card_id_hash: 'c_1b20***',
    channel: 'POS',
    mcc: '5411',
    merchant_id: 'MCH_4403_08811',
    amount_cny: 1260.0,
    risk_score: 0.81,
    decision: '人工复核',
    province: '广东省',
    city: '深圳市',
    lng: 114.1095,
    lat: 22.544,
  },
  {
    txn_id: 'TXN20260305A0015',
    event_time: '2026-03-05T21:27:33+08:00',
    card_id_hash: 'c_4d61***',
    channel: 'POS',
    mcc: '5999',
    merchant_id: 'MCH_4403_02763',
    amount_cny: 3560.0,
    risk_score: 0.89,
    decision: '拒绝',
    province: '广东省',
    city: '深圳市',
    lng: 114.0662,
    lat: 22.5478,
  },
  {
    txn_id: 'TXN20260305A0017',
    event_time: '2026-03-05T21:43:56+08:00',
    card_id_hash: 'c_9a44***',
    channel: 'ATM',
    mcc: '6011',
    merchant_id: 'MCH_4403_00308',
    amount_cny: 3000.0,
    risk_score: 0.91,
    decision: '拒绝',
    province: '广东省',
    city: '深圳市',
    lng: 114.0803,
    lat: 22.5399,
  },
  {
    txn_id: 'TXN20260305A0018',
    event_time: '2026-03-05T21:58:21+08:00',
    card_id_hash: 'c_7c13***',
    channel: 'POS',
    mcc: '5814',
    merchant_id: 'MCH_4403_06102',
    amount_cny: 860.0,
    risk_score: 0.68,
    decision: '放行',
    province: '广东省',
    city: '深圳市',
    lng: 114.0941,
    lat: 22.5485,
  },
  {
    txn_id: 'TXN20260305A0019',
    event_time: '2026-03-05T22:11:09+08:00',
    card_id_hash: 'c_732a***',
    channel: '线上',
    mcc: '5732',
    merchant_id: 'MCH_3100_00411',
    amount_cny: 7999.0,
    risk_score: 0.95,
    decision: '拒绝',
    province: '上海市',
    city: '上海市',
    lng: 121.4737,
    lat: 31.2304,
  },
  {
    txn_id: 'TXN20260305A0021',
    event_time: '2026-03-05T22:18:44+08:00',
    card_id_hash: 'c_2f88***',
    channel: '线上',
    mcc: '5942',
    merchant_id: 'MCH_3100_01608',
    amount_cny: 5320.0,
    risk_score: 0.84,
    decision: '人工复核',
    province: '上海市',
    city: '上海市',
    lng: 121.491,
    lat: 31.2276,
  },
  {
    txn_id: 'TXN20260305A0023',
    event_time: '2026-03-05T22:26:31+08:00',
    card_id_hash: 'c_6b05***',
    channel: 'POS',
    mcc: '5311',
    merchant_id: 'MCH_3100_02172',
    amount_cny: 980.0,
    risk_score: 0.72,
    decision: '放行',
    province: '上海市',
    city: '上海市',
    lng: 121.4663,
    lat: 31.2381,
  },
  {
    txn_id: 'TXN20260305A0027',
    event_time: '2026-03-05T22:42:57+08:00',
    card_id_hash: 'c_5e72***',
    channel: 'POS',
    mcc: '5812',
    merchant_id: 'MCH_4401_00864',
    amount_cny: 4290.0,
    risk_score: 0.88,
    decision: '拒绝',
    province: '广东省',
    city: '广州市',
    lng: 113.2644,
    lat: 23.1291,
  },
  {
    txn_id: 'TXN20260305A0029',
    event_time: '2026-03-05T22:55:08+08:00',
    card_id_hash: 'c_0f91***',
    channel: 'ATM',
    mcc: '6011',
    merchant_id: 'MCH_4401_00215',
    amount_cny: 2500.0,
    risk_score: 0.79,
    decision: '人工复核',
    province: '广东省',
    city: '广州市',
    lng: 113.2705,
    lat: 23.136,
  },
  {
    txn_id: 'TXN20260305A0032',
    event_time: '2026-03-05T23:07:14+08:00',
    card_id_hash: 'c_3d07***',
    channel: '线上',
    mcc: '5734',
    merchant_id: 'MCH_3301_00518',
    amount_cny: 6180.0,
    risk_score: 0.86,
    decision: '拒绝',
    province: '浙江省',
    city: '杭州市',
    lng: 120.1551,
    lat: 30.2741,
  },
  {
    txn_id: 'TXN20260305A0036',
    event_time: '2026-03-05T23:24:39+08:00',
    card_id_hash: 'c_1e56***',
    channel: 'POS',
    mcc: '5499',
    merchant_id: 'MCH_5101_01907',
    amount_cny: 720.0,
    risk_score: 0.66,
    decision: '放行',
    province: '四川省',
    city: '成都市',
    lng: 104.0665,
    lat: 30.5728,
  },
];

const DECISION_META: Record<PointMapFraudDatum['decision'], { label: string; color: string }> = {
  放行: { label: '放行', color: '#2563eb' },
  拒绝: { label: '拒绝', color: '#e11d48' },
  人工复核: { label: '人工复核', color: '#f59e0b' },
};

const popupFields = [
  { field: 'txn_id', formatField: '交易流水' },
  { field: 'event_time', formatField: '时间' },
  { field: 'card_id_hash', formatField: '卡号哈希' },
  { field: 'channel', formatField: '渠道' },
  { field: 'mcc', formatField: 'MCC' },
  { field: 'merchant_id', formatField: '商户ID' },
  {
    field: 'amount_cny',
    formatField: '金额（元）',
    formatValue: (value: unknown) => (typeof value === 'number' ? value.toFixed(2) : String(value ?? '')),
  },
  {
    field: 'risk_score',
    formatField: '风险评分',
    formatValue: (value: unknown) => (typeof value === 'number' ? value.toFixed(2) : String(value ?? '')),
  },
  { field: 'decision', formatField: '处置结果' },
  { field: 'province', formatField: '省份' },
  { field: 'city', formatField: '城市' },
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

export function PointMapFraudScenarioL7() {
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
          center: [118.15, 27.2],
          zoom: 4.1,
          pitch: 0,
          token: process.env.NEXT_PUBLIC_AMAP_KEY,
        }),
      });
      sceneRef.current = scene;

      scene.on('loaded', () => {
        if (disposed) return;
        const popupItems: Array<{
          layer: ILayer;
          title: (feature: PointMapFraudDatum) => string;
          fields: typeof popupFields;
        }> = [];

        (Object.keys(DECISION_META) as PointMapFraudDatum['decision'][]).forEach((decision) => {
          const rows = pointMapFraudScenarioData.filter((row) => row.decision === decision);
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
            .size('risk_score', [10, 22])
            .color(DECISION_META[decision].color)
            .style({
              opacity: 0.84,
              stroke: '#ffffff',
              strokeWidth: 1.6,
            });

          scene.addLayer(layer);
          popupItems.push({
            layer,
            title: (feature) => `${feature.city} · ${feature.channel} · ${feature.decision}`,
            fields: popupFields,
          });
        });

        const labelRows = pointMapFraudScenarioData
          .filter((row) => row.risk_score >= 0.9 || row.decision === '人工复核')
          .map((row) => ({
            ...row,
            label: `${row.city.replace('市', '')}·${row.channel}`,
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
          .size(12)
          .color('#0f172a')
          .style({
            textOffset: [0, 14],
            stroke: '#ffffff',
            strokeWidth: 1.4,
          });

        scene.addLayer(labelLayer);

        popupItems.push({
          layer: labelLayer,
          title: (feature) => `${feature.city} · ${feature.channel} · ${feature.decision}`,
          fields: popupFields,
        });

        const popup = new LayerPopup({
          className: 'pointmap-fraud-popup-compact',
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

  const legendItems = (Object.keys(DECISION_META) as PointMapFraudDatum['decision'][]).filter((decision) =>
    pointMapFraudScenarioData.some((row) => row.decision === decision),
  );

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        style={{ width: '100%', height: '360px', position: 'relative' }}
        className="overflow-hidden rounded-md border border-slate-200"
      />
      <style jsx global>{`
        .pointmap-fraud-popup-compact {
          max-width: 280px;
        }

        .pointmap-fraud-popup-compact .l7-popup-content {
          min-width: 0;
          padding: 0;
        }

        .pointmap-fraud-popup-compact .l7-popup-content__title {
          padding: 6px 8px 3px;
          font-size: 11px;
          font-weight: 600;
          line-height: 1.2;
        }

        .pointmap-fraud-popup-compact .l7-popup-content__panel {
          padding: 0 8px 7px;
          font-size: 10px;
          line-height: 1.2;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          column-gap: 8px;
          row-gap: 3px;
        }

        .pointmap-fraud-popup-compact .l7-layer-popup__row {
          display: flex;
          flex-direction: column;
          align-items: start;
          line-height: 1.2;
        }

        .pointmap-fraud-popup-compact .l7-layer-popup__row + .l7-layer-popup__row {
          margin-top: 0;
        }

        .pointmap-fraud-popup-compact .l7-layer-popup__key {
          color: #475569;
          white-space: nowrap;
          font-size: 9px;
        }

        .pointmap-fraud-popup-compact .l7-layer-popup__value {
          color: #0f172a;
          word-break: break-all;
          font-size: 10px;
        }
      `}</style>
      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
        {legendItems.map((decision) => (
          <div key={decision} className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ backgroundColor: DECISION_META[decision].color }}
            />
            <span>{DECISION_META[decision].label}</span>
          </div>
        ))}
        <span className="text-slate-500">点大小 = 风险评分</span>
      </div>
    </div>
  );
}
