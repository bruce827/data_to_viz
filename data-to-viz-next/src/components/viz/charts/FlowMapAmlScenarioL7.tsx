'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import type { Scene as L7Scene } from '@antv/l7';
import { applyAmapSecurityConfig, destroyScene } from './mapScenarioUtils';

export type FlowMapAmlDatum = {
  transfer_id: string;
  txn_time: string;
  from_acct_hash: string;
  to_acct_hash: string;
  amount_cny: number;
  rule_hits: string;
  risk_level: '高' | '中' | '观察';
  from_city: string;
  to_city: string;
  from_lng: number;
  from_lat: number;
  to_lng: number;
  to_lat: number;
};

export const flowMapAmlScenarioData: FlowMapAmlDatum[] = [
  { transfer_id: 'TRF_20260305_99012', txn_time: '2026-03-05T23:18:33+08:00', from_acct_hash: 'fa_***', to_acct_hash: 'ta_***', amount_cny: 98000, rule_hits: 'SPLIT,FREQ_NIGHT', risk_level: '高', from_city: '上海市', to_city: '广州市', from_lng: 121.4737, from_lat: 31.2304, to_lng: 113.2644, to_lat: 23.1291 },
  { transfer_id: 'TRF_20260305_99021', txn_time: '2026-03-05T23:21:07+08:00', from_acct_hash: 'fa_***', to_acct_hash: 'ta2_***', amount_cny: 97000, rule_hits: 'SPLIT,FREQ_NIGHT', risk_level: '高', from_city: '上海市', to_city: '深圳市', from_lng: 121.4737, from_lat: 31.2304, to_lng: 114.0579, to_lat: 22.5431 },
  { transfer_id: 'TRF_20260305_99036', txn_time: '2026-03-05T23:24:55+08:00', from_acct_hash: 'fa_***', to_acct_hash: 'ta3_***', amount_cny: 92000, rule_hits: 'SPLIT,ROUND_TXN', risk_level: '高', from_city: '上海市', to_city: '长沙市', from_lng: 121.4737, from_lat: 31.2304, to_lng: 112.9388, to_lat: 28.2282 },
  { transfer_id: 'TRF_20260305_99102', txn_time: '2026-03-05T23:39:18+08:00', from_acct_hash: 'fa2_***', to_acct_hash: 'tb_***', amount_cny: 78000, rule_hits: 'DEVICE_SHARE,FREQ_NIGHT', risk_level: '中', from_city: '杭州市', to_city: '南宁市', from_lng: 120.1551, from_lat: 30.2741, to_lng: 108.3669, to_lat: 22.8170 },
  { transfer_id: 'TRF_20260305_99118', txn_time: '2026-03-05T23:43:46+08:00', from_acct_hash: 'fa2_***', to_acct_hash: 'tb2_***', amount_cny: 75000, rule_hits: 'DEVICE_SHARE', risk_level: '观察', from_city: '杭州市', to_city: '福州市', from_lng: 120.1551, from_lat: 30.2741, to_lng: 119.2965, to_lat: 26.0745 },
  { transfer_id: 'TRF_20260305_99177', txn_time: '2026-03-05T23:51:09+08:00', from_acct_hash: 'fa3_***', to_acct_hash: 'tc_***', amount_cny: 83000, rule_hits: 'MULTI_CARD,ROUND_TXN', risk_level: '中', from_city: '苏州市', to_city: '武汉市', from_lng: 120.5853, from_lat: 31.2989, to_lng: 114.3055, to_lat: 30.5928 },
  { transfer_id: 'TRF_20260306_00008', txn_time: '2026-03-06T00:03:11+08:00', from_acct_hash: 'fa3_***', to_acct_hash: 'tc2_***', amount_cny: 69000, rule_hits: 'MULTI_CARD', risk_level: '观察', from_city: '苏州市', to_city: '郑州市', from_lng: 120.5853, from_lat: 31.2989, to_lng: 113.6254, to_lat: 34.7466 },
  { transfer_id: 'TRF_20260306_00027', txn_time: '2026-03-06T00:16:44+08:00', from_acct_hash: 'fa4_***', to_acct_hash: 'td_***', amount_cny: 86000, rule_hits: 'SPLIT,AGENT_POOL', risk_level: '高', from_city: '上海市', to_city: '昆明市', from_lng: 121.4737, from_lat: 31.2304, to_lng: 102.8329, to_lat: 24.8801 },
];

const FLOW_META: Record<FlowMapAmlDatum['risk_level'], { color: string; label: string }> = {
  高: { color: '#dc2626', label: '高风险' },
  中: { color: '#f59e0b', label: '中风险' },
  观察: { color: '#2563eb', label: '观察' },
};

export function FlowMapAmlScenarioL7() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<L7Scene | null>(null);

  const { flowLines, cityNodes, cityLabels } = useMemo(() => {
    const flowLineData = flowMapAmlScenarioData.map((item) => ({
      ...item,
      coord: [
        [item.from_lng, item.from_lat],
        [item.to_lng, item.to_lat],
      ],
    }));

    const nodeMap = new Map<string, { city: string; lng: number; lat: number; role: '源头城市' | '落点城市' }>();

    flowMapAmlScenarioData.forEach((item) => {
      if (!nodeMap.has(item.from_city)) {
        nodeMap.set(item.from_city, {
          city: item.from_city,
          lng: item.from_lng,
          lat: item.from_lat,
          role: '源头城市',
        });
      }
      if (!nodeMap.has(item.to_city)) {
        nodeMap.set(item.to_city, {
          city: item.to_city,
          lng: item.to_lng,
          lat: item.to_lat,
          role: '落点城市',
        });
      }
    });

    const nodes = Array.from(nodeMap.values());

    return {
      flowLines: flowLineData,
      cityNodes: nodes,
      cityLabels: nodes.map((node) => ({
        label: node.city,
        lng: node.lng,
        lat: node.lat,
      })),
    };
  }, []);

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
          style: 'dark',
          center: [113.5, 29.2],
          zoom: 4.15,
          pitch: 30,
          token: process.env.NEXT_PUBLIC_AMAP_KEY,
        }),
      });
      sceneRef.current = scene;

      scene.on('loaded', () => {
        if (disposed) return;

        const baseLineLayer = new LineLayer()
          .source(flowLines, {
            parser: {
              type: 'json',
              coordinates: 'coord',
            },
          })
          .shape('arc')
          .size(1.2)
          .color('#94a3b8')
          .style({
            opacity: 0.28,
            lineType: 'dash',
            dashArray: [4, 4],
          });

        const flowLayer = new LineLayer()
          .source(flowLines, {
            parser: {
              type: 'json',
              coordinates: 'coord',
            },
          })
          .shape('arc')
          .size('amount_cny', [2, 6])
          .color('risk_level', [FLOW_META.高.color, FLOW_META.中.color, FLOW_META.观察.color])
          .animate({
            duration: 1.8,
            interval: 0.25,
            trailLength: 0.8,
          })
          .style({
            opacity: 0.9,
          });

        const pointLayer = new PointLayer()
          .source(cityNodes, {
            parser: {
              type: 'json',
              x: 'lng',
              y: 'lat',
            },
          })
          .shape('circle')
          .size('role', [12, 9])
          .color('role', ['#38bdf8', '#f8fafc'])
          .style({
            stroke: '#0f172a',
            strokeWidth: 1.4,
            opacity: 0.95,
          });

        const labelLayer = new PointLayer()
          .source(cityLabels, {
            parser: {
              type: 'json',
              x: 'lng',
              y: 'lat',
            },
          })
          .shape('label', 'text')
          .size(11)
          .color('#f8fafc')
          .style({
            textOffset: [0, 14],
            stroke: '#0f172a',
            strokeWidth: 1.2,
          });

        scene.addLayer(baseLineLayer);
        scene.addLayer(flowLayer);
        scene.addLayer(pointLayer);
        scene.addLayer(labelLayer);
      });
    };

    setupScene();

    return () => {
      disposed = true;
      destroyScene(sceneRef);
    };
  }, [cityLabels, cityNodes, flowLines]);

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        style={{ width: '100%', height: '380px', position: 'relative' }}
        className="overflow-hidden rounded-md border border-slate-200"
      />
      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
        {(Object.keys(FLOW_META) as Array<FlowMapAmlDatum['risk_level']>).map((level) => (
          <div key={level} className="flex items-center gap-2">
            <span
              className="inline-block h-2.5 w-8 rounded-full"
              style={{ backgroundColor: FLOW_META[level].color }}
            />
            <span>{FLOW_META[level].label}</span>
          </div>
        ))}
        <span className="text-slate-500">线宽随转账金额变化，方向表示疑似资金外流路径。</span>
      </div>
    </div>
  );
}
