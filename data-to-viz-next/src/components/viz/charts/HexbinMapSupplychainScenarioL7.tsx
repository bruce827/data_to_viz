'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import DataSet from '@antv/data-set';
import hexbinChinaData from './demoData/hexbin-china.json';

export type HexbinSupplychainDatum = {
  trx_id: string;
  trx_time: string;
  anchor_id: string;
  supplier_id: string;
  invoice_amt_cny: number;
  anomaly_score: number;
  lng: number;
  lat: number;
  cluster: '杭州核心蜂窝' | '苏州观察蜂窝' | '宁波跟踪蜂窝';
  hex_weight: number;
};

export const hexbinSupplychainScenarioData: HexbinSupplychainDatum[] = [
  { trx_id: 'SCF_TRX_20260305_0091', trx_time: '2026-03-05T14:22:10+08:00', anchor_id: 'ANCH_3301_0021', supplier_id: 'SUP_3301_0199', invoice_amt_cny: 980000, anomaly_score: 0.79, lng: 120.1551, lat: 30.2741, cluster: '杭州核心蜂窝', hex_weight: 0.77 },
  { trx_id: 'SCF_TRX_20260305_0102', trx_time: '2026-03-05T15:01:55+08:00', anchor_id: 'ANCH_3301_0021', supplier_id: 'SUP_3301_0207', invoice_amt_cny: 1240000, anomaly_score: 0.88, lng: 120.1620, lat: 30.2773, cluster: '杭州核心蜂窝', hex_weight: 1.09 },
  { trx_id: 'SCF_TRX_20260305_0108', trx_time: '2026-03-05T15:14:11+08:00', anchor_id: 'ANCH_3301_0021', supplier_id: 'SUP_3301_0241', invoice_amt_cny: 860000, anomaly_score: 0.74, lng: 120.1504, lat: 30.2705, cluster: '杭州核心蜂窝', hex_weight: 0.64 },
  { trx_id: 'SCF_TRX_20260305_0117', trx_time: '2026-03-05T15:33:28+08:00', anchor_id: 'ANCH_3301_0021', supplier_id: 'SUP_3301_0315', invoice_amt_cny: 1320000, anomaly_score: 0.92, lng: 120.1674, lat: 30.2808, cluster: '杭州核心蜂窝', hex_weight: 1.21 },
  { trx_id: 'SCF_TRX_20260305_0123', trx_time: '2026-03-05T15:47:53+08:00', anchor_id: 'ANCH_3301_0021', supplier_id: 'SUP_3301_0328', invoice_amt_cny: 1110000, anomaly_score: 0.83, lng: 120.1586, lat: 30.2819, cluster: '杭州核心蜂窝', hex_weight: 0.92 },
  { trx_id: 'SCF_TRX_20260305_0131', trx_time: '2026-03-05T16:03:09+08:00', anchor_id: 'ANCH_3301_0021', supplier_id: 'SUP_3301_0354', invoice_amt_cny: 930000, anomaly_score: 0.76, lng: 120.1498, lat: 30.2786, cluster: '杭州核心蜂窝', hex_weight: 0.71 },
  { trx_id: 'SCF_TRX_20260305_0205', trx_time: '2026-03-05T16:22:18+08:00', anchor_id: 'ANCH_3205_0082', supplier_id: 'SUP_3205_0116', invoice_amt_cny: 780000, anomaly_score: 0.61, lng: 120.7288, lat: 31.3222, cluster: '苏州观察蜂窝', hex_weight: 0.48 },
  { trx_id: 'SCF_TRX_20260305_0214', trx_time: '2026-03-05T16:31:42+08:00', anchor_id: 'ANCH_3205_0082', supplier_id: 'SUP_3205_0144', invoice_amt_cny: 1180000, anomaly_score: 0.69, lng: 120.7342, lat: 31.3251, cluster: '苏州观察蜂窝', hex_weight: 0.81 },
  { trx_id: 'SCF_TRX_20260305_0222', trx_time: '2026-03-05T16:46:07+08:00', anchor_id: 'ANCH_3205_0082', supplier_id: 'SUP_3205_0151', invoice_amt_cny: 890000, anomaly_score: 0.72, lng: 120.7419, lat: 31.3196, cluster: '苏州观察蜂窝', hex_weight: 0.64 },
  { trx_id: 'SCF_TRX_20260305_0233', trx_time: '2026-03-05T17:05:33+08:00', anchor_id: 'ANCH_3205_0082', supplier_id: 'SUP_3205_0179', invoice_amt_cny: 1020000, anomaly_score: 0.67, lng: 120.7244, lat: 31.3284, cluster: '苏州观察蜂窝', hex_weight: 0.68 },
  { trx_id: 'SCF_TRX_20260305_0304', trx_time: '2026-03-05T17:18:26+08:00', anchor_id: 'ANCH_3302_0047', supplier_id: 'SUP_3302_0284', invoice_amt_cny: 650000, anomaly_score: 0.54, lng: 121.5503, lat: 29.8746, cluster: '宁波跟踪蜂窝', hex_weight: 0.35 },
  { trx_id: 'SCF_TRX_20260305_0312', trx_time: '2026-03-05T17:27:40+08:00', anchor_id: 'ANCH_3302_0047', supplier_id: 'SUP_3302_0298', invoice_amt_cny: 720000, anomaly_score: 0.57, lng: 121.5574, lat: 29.8812, cluster: '宁波跟踪蜂窝', hex_weight: 0.41 },
  { trx_id: 'SCF_TRX_20260305_0318', trx_time: '2026-03-05T17:35:29+08:00', anchor_id: 'ANCH_3302_0047', supplier_id: 'SUP_3302_0307', invoice_amt_cny: 810000, anomaly_score: 0.63, lng: 121.5621, lat: 29.8697, cluster: '宁波跟踪蜂窝', hex_weight: 0.51 },
  { trx_id: 'SCF_TRX_20260305_0327', trx_time: '2026-03-05T17:49:11+08:00', anchor_id: 'ANCH_3302_0047', supplier_id: 'SUP_3302_0314', invoice_amt_cny: 950000, anomaly_score: 0.65, lng: 121.5458, lat: 29.8789, cluster: '宁波跟踪蜂窝', hex_weight: 0.62 },
];

const HOTSPOT_LABELS = [
  { label: '杭州核心蜂窝', lng: 120.1586, lat: 30.2864 },
  { label: '苏州观察蜂窝', lng: 120.7342, lat: 31.3326 },
  { label: '宁波跟踪蜂窝', lng: 121.5540, lat: 29.8872 },
];

type HexbinMapSourceDatum = {
  longitude: number;
  latitude: number;
};

type HexbinScenarioPoint = {
  longitude: number;
  latitude: number;
  trx_id: string;
  cluster: HexbinSupplychainDatum['cluster'];
};

type HexbinPolygonDatum = {
  longitude: number[];
  latitude: number[];
  count: number;
};

const HEXBIN_COLOR_DOMAIN = [1, 3, 5, 6];
const HEXBIN_COLOR_RANGE = ['#BAE7FF', '#69B1FF', '#1677FF', '#003EB3'];
const HEXBIN_BASE_FILL = '#dbeafe';
const HEXBIN_BASE_STROKE = '#ffffff';

const hexbinScenarioPoints: HexbinScenarioPoint[] = hexbinSupplychainScenarioData.map((item) => ({
  longitude: item.lng,
  latitude: item.lat,
  trx_id: item.trx_id,
  cluster: item.cluster,
}));

export function HexbinMapSupplychainScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 380,
      padding: 24,
    });

    chart.options({
      type: 'view',
      axis: false,
      legend: false,
      children: [
        {
          type: 'polygon',
          data: {
            type: 'inline',
            value: hexbinChinaData,
            transform: [
              {
                type: 'custom',
                callback: (data: HexbinMapSourceDatum[]) => {
                  const dv = new DataSet.View().source(data).transform({
                    type: 'bin.hexagon',
                    fields: ['longitude', 'latitude'],
                    binWidth: [2, 3],
                    as: ['longitude', 'latitude', 'count'],
                  });
                  return dv.rows as HexbinPolygonDatum[];
                },
              },
            ],
          },
          encode: {
            x: 'longitude',
            y: 'latitude',
          },
          style: {
            fill: HEXBIN_BASE_FILL,
            fillOpacity: 0.45,
            stroke: HEXBIN_BASE_STROKE,
            lineWidth: 2.2,
          },
          tooltip: false,
        },
        {
          type: 'polygon',
          data: {
            type: 'inline',
            value: hexbinScenarioPoints,
            transform: [
              {
                type: 'custom',
                callback: (data: HexbinScenarioPoint[]) => {
                  const dv = new DataSet.View().source(data).transform({
                    type: 'bin.hexagon',
                    fields: ['longitude', 'latitude'],
                    binWidth: [2, 3],
                    as: ['longitude', 'latitude', 'count'],
                  });
                  return dv.rows as HexbinPolygonDatum[];
                },
              },
            ],
          },
          encode: {
            x: 'longitude',
            y: 'latitude',
            color: 'count',
          },
          scale: {
            color: {
              domain: HEXBIN_COLOR_DOMAIN,
              range: HEXBIN_COLOR_RANGE,
            },
          },
          style: {
            lineWidth: 2.8,
            stroke: '#ffffff',
          },
          tooltip: {
            items: [{ field: 'count', name: '聚合交易笔数' }],
          },
          state: {
            active: {
              fill: '#f97316',
            },
            inactive: { opacity: 0.85 },
          },
        },
        {
          type: 'text',
          data: {
            type: 'inline',
            value: HOTSPOT_LABELS,
          },
          encode: {
            x: 'lng',
            y: 'lat',
            text: 'label',
          },
          style: {
            fontSize: 12,
            fontWeight: 600,
            fill: '#0f172a',
            stroke: '#ffffff',
            lineWidth: 3,
            dy: -18,
          },
          tooltip: false,
        },
      ],
      interaction: [{ type: 'elementHighlight' }],
    });

    chart.render();

    return () => {
      chart.destroy();
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
        <span className="text-slate-500">颜色映射字段：`count`（每个六边形聚合的异常交易笔数）</span>
        <div className="flex items-center gap-2">
          <span className="text-slate-500">1 笔</span>
          <div
            className="h-3 w-36 rounded-full border border-slate-200"
            style={{ background: `linear-gradient(90deg, ${HEXBIN_COLOR_RANGE.join(', ')})` }}
          />
          <span className="text-slate-500">6 笔</span>
        </div>
      </div>
    </div>
  );
}

export const HexbinMapSupplychainScenarioL7 = HexbinMapSupplychainScenarioG2;
