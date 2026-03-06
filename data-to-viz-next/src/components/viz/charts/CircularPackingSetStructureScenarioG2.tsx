'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type RiskBucketRaw = {
  month: string;
  risk_bucket: string;
  event_cnt: number;
  loss_cny_10k: number;
  close_rate: number;
};

type RiskBucketNode = {
  id: string;
  name: string;
  event_cnt: number;
  loss_cny_10k: number;
  close_rate: number;
  month: string;
  share_of_root: number;
  risk_level: '总盘' | '高关注' | '中关注' | '低关注';
  children?: RiskBucketNode[];
};

type PackDatum = {
  depth?: number;
  r?: number;
  data?: RiskBucketNode;
};

// 数据源：docs/catenum-deep-research-report.md（CPAKS / chart-structure-set-circular-packing）
const scenarioRows: RiskBucketRaw[] = [
  { month: '2025-12', risk_bucket: 'AML可疑交易', event_cnt: 8200, loss_cny_10k: 0, close_rate: 0.91 },
  { month: '2025-12', risk_bucket: '客户投诉', event_cnt: 12600, loss_cny_10k: 180, close_rate: 0.88 },
  { month: '2025-12', risk_bucket: '操作风险事件', event_cnt: 430, loss_cny_10k: 520, close_rate: 0.76 },
  { month: '2025-12', risk_bucket: '数据安全告警', event_cnt: 980, loss_cny_10k: 0, close_rate: 0.84 },
  { month: '2025-12', risk_bucket: '授信合规缺陷', event_cnt: 210, loss_cny_10k: 60, close_rate: 0.72 },
  { month: '2025-12', risk_bucket: '交易异常/欺诈', event_cnt: 1600, loss_cny_10k: 240, close_rate: 0.79 },
];

function getRiskLevel(row: RiskBucketRaw): RiskBucketNode['risk_level'] {
  if (row.close_rate < 0.8 || row.loss_cny_10k >= 200) return '高关注';
  if (row.close_rate < 0.87 || row.loss_cny_10k >= 60) return '中关注';
  return '低关注';
}

function buildHierarchy(rows: RiskBucketRaw[]): RiskBucketNode {
  const grouped = new Map<RiskBucketNode['risk_level'], RiskBucketRaw[]>();
  rows.forEach((row) => {
    const level = getRiskLevel(row);
    const list = grouped.get(level);
    if (list) list.push(row);
    else grouped.set(level, [row]);
  });

  const levelOrder: RiskBucketNode['risk_level'][] = ['高关注', '中关注', '低关注'];
  const month = rows[0]?.month ?? '';
  const totalEvents = rows.reduce((sum, row) => sum + row.event_cnt, 0);
  const totalLoss = rows.reduce((sum, row) => sum + row.loss_cny_10k, 0);
  const weightedCloseRate =
    totalEvents > 0 ? rows.reduce((sum, row) => sum + row.close_rate * row.event_cnt, 0) / totalEvents : 0;

  const levelNodes: RiskBucketNode[] = levelOrder
    .filter((level) => grouped.has(level))
    .map((level) => {
      const list = grouped.get(level) || [];
      const levelEvents = list.reduce((sum, row) => sum + row.event_cnt, 0);
      const levelLoss = list.reduce((sum, row) => sum + row.loss_cny_10k, 0);
      const levelCloseRate =
        levelEvents > 0 ? list.reduce((sum, row) => sum + row.close_rate * row.event_cnt, 0) / levelEvents : 0;

      return {
        id: `level-${level}`,
        name: level,
        event_cnt: levelEvents,
        loss_cny_10k: levelLoss,
        close_rate: levelCloseRate,
        month,
        share_of_root: 0,
        risk_level: level,
        children: list.map((row) => ({
          id: `bucket-${row.risk_bucket}`,
          name: row.risk_bucket,
          event_cnt: row.event_cnt,
          loss_cny_10k: row.loss_cny_10k,
          close_rate: row.close_rate,
          month: row.month,
          share_of_root: 0,
          risk_level: level,
        })),
      };
    });

  const root: RiskBucketNode = {
    id: 'risk-bucket-root',
    name: '合规风险事件总盘',
    event_cnt: totalEvents,
    loss_cny_10k: totalLoss,
    close_rate: weightedCloseRate,
    month,
    share_of_root: 1,
    risk_level: '总盘',
    children: levelNodes,
  };

  function annotate(node: RiskBucketNode) {
    node.share_of_root = totalEvents > 0 ? node.event_cnt / totalEvents : 0;
    (node.children || []).forEach((child) => annotate(child));
  }

  annotate(root);
  return root;
}

const scenarioData = buildHierarchy(scenarioRows);

function formatEvent(v?: number) {
  if (typeof v !== 'number') return '-';
  return `${v.toLocaleString()} 条`;
}

function formatEventShort(v?: number) {
  if (typeof v !== 'number') return '';
  return v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${v}`;
}

function formatLoss(v?: number) {
  if (typeof v !== 'number') return '-';
  return `${v.toLocaleString()} 万元`;
}

function formatPercent(v?: number) {
  if (typeof v !== 'number') return '-';
  return `${(v * 100).toFixed(2)}%`;
}

export function CircularPackingSetStructureScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 430,
      padding: 8,
    });

    chart.options({
      type: 'pack',
      data: { value: scenarioData },
      layout: { padding: 3 },
      encode: {
        value: 'event_cnt',
        color: (d: PackDatum) => d.data?.risk_level || '总盘',
      },
      scale: {
        color: {
          domain: ['高关注', '中关注', '低关注', '总盘'],
          range: ['#dc2626', '#f59e0b', '#2563eb', '#64748b'],
        },
      },
      legend: {
        color: {
          title: '风险关注等级',
          position: 'top',
          cols: 4,
        },
      },
      style: {
        fillOpacity: (d: PackDatum) => ((d.depth ?? 0) <= 0 ? 0.45 : 0.8),
        stroke: '#ffffff',
        lineWidth: 1.4,
        labelText: (d: PackDatum) => {
          const depth = d.depth ?? 0;
          const r = d.r ?? 0;
          const name = d.data?.name || '';
          if (depth <= 0 || r < 16) return '';
          if (depth === 1 && r >= 30) return `${name}\n${formatEventShort(d.data?.event_cnt)}`;
          if (depth >= 2 && r >= 24) return `${name}\n${formatEventShort(d.data?.event_cnt)}`;
          if (depth >= 2 && r >= 15) return `${formatEventShort(d.data?.event_cnt)}`;
          return '';
        },
        labelFill: '#f8fafc',
        labelStroke: '#0f172a',
        labelLineWidth: 2,
        labelFontWeight: 800,
        labelFontSize: (d: PackDatum) => ((d.depth ?? 0) >= 2 ? 10 : 12),
        labelLineHeight: (d: PackDatum) => ((d.depth ?? 0) >= 2 ? 12 : 15),
      },
      tooltip: {
        title: (d: PackDatum) => `${d.data?.name ?? ''}（${d.data?.month ?? ''}）`,
        items: [
          {
            field: 'event_cnt',
            name: '事件数',
            valueFormatter: (value: number) => formatEvent(value),
          },
          {
            field: 'loss_cny_10k',
            name: '损失金额',
            valueFormatter: (value: number) => formatLoss(value),
          },
          {
            field: 'close_rate',
            name: '整改完成率',
            valueFormatter: (value: number) => formatPercent(value),
          },
          {
            field: 'share_of_root',
            name: '占总事件池比例',
            valueFormatter: (value: number) => formatPercent(value),
          },
          { field: 'risk_level', name: '风险关注等级' },
        ],
      },
      interaction: [{ type: 'elementHighlight' }],
    });

    chart.render();
    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '430px' }} />;
}
