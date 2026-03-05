'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type BranchRadarRaw = {
  branch: string;
  metric: string;
  score: number;
  asOf: string;
};

type BranchRadarDatum = BranchRadarRaw & {
  scoreLabel: string;
};

// 数据源：docs/cate-deep-research-report.md（chart-spider）
const scenarioRawData: BranchRadarRaw[] = [
  { branch: '上海分行', metric: 'NIM（净息差，基点↑）', score: 100.0, asOf: '2025-12-31' },
  { branch: '上海分行', metric: 'NPL（不良贷款率，%↓）', score: 100.0, asOf: '2025-12-31' },
  { branch: '上海分行', metric: 'RAROC（风险调整后资本回报率，%↑）', score: 100.0, asOf: '2025-12-31' },
  { branch: '上海分行', metric: '成本收入比（%↓）', score: 100.0, asOf: '2025-12-31' },
  { branch: '上海分行', metric: '数字零售渗透率（%↑）', score: 100.0, asOf: '2025-12-31' },

  { branch: '广东分行', metric: 'NIM（净息差，基点↑）', score: 35.0, asOf: '2025-12-31' },
  { branch: '广东分行', metric: 'NPL（不良贷款率，%↓）', score: 81.1, asOf: '2025-12-31' },
  { branch: '广东分行', metric: 'RAROC（风险调整后资本回报率，%↑）', score: 70.4, asOf: '2025-12-31' },
  { branch: '广东分行', metric: '成本收入比（%↓）', score: 72.9, asOf: '2025-12-31' },
  { branch: '广东分行', metric: '数字零售渗透率（%↑）', score: 78.6, asOf: '2025-12-31' },

  { branch: '四川分行', metric: 'NIM（净息差，基点↑）', score: 70.0, asOf: '2025-12-31' },
  { branch: '四川分行', metric: 'NPL（不良贷款率，%↓）', score: 50.0, asOf: '2025-12-31' },
  { branch: '四川分行', metric: 'RAROC（风险调整后资本回报率，%↑）', score: 40.7, asOf: '2025-12-31' },
  { branch: '四川分行', metric: '成本收入比（%↓）', score: 32.9, asOf: '2025-12-31' },
  { branch: '四川分行', metric: '数字零售渗透率（%↑）', score: 42.9, asOf: '2025-12-31' },

  { branch: '湖北分行', metric: 'NIM（净息差，基点↑）', score: 60.0, asOf: '2025-12-31' },
  { branch: '湖北分行', metric: 'NPL（不良贷款率，%↓）', score: 60.8, asOf: '2025-12-31' },
  { branch: '湖北分行', metric: 'RAROC（风险调整后资本回报率，%↑）', score: 50.0, asOf: '2025-12-31' },
  { branch: '湖北分行', metric: '成本收入比（%↓）', score: 52.9, asOf: '2025-12-31' },
  { branch: '湖北分行', metric: '数字零售渗透率（%↑）', score: 57.1, asOf: '2025-12-31' },

  { branch: '辽宁分行', metric: 'NIM（净息差，基点↑）', score: 0.0, asOf: '2025-12-31' },
  { branch: '辽宁分行', metric: 'NPL（不良贷款率，%↓）', score: 0.0, asOf: '2025-12-31' },
  { branch: '辽宁分行', metric: 'RAROC（风险调整后资本回报率，%↑）', score: 0.0, asOf: '2025-12-31' },
  { branch: '辽宁分行', metric: '成本收入比（%↓）', score: 0.0, asOf: '2025-12-31' },
  { branch: '辽宁分行', metric: '数字零售渗透率（%↑）', score: 0.0, asOf: '2025-12-31' },
];

const scenarioData: BranchRadarDatum[] = scenarioRawData.map((row) => ({
  ...row,
  scoreLabel: `${row.score.toFixed(1)} 分`,
}));

export function SpiderBranchScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 420,
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 72,
      paddingBottom: 18,
    });

    chart.coordinate({ type: 'polar' });

    chart.scale('y', { min: 0, max: 100, tickCount: 5 });
    chart.scale('color', {
      domain: ['上海分行', '广东分行', '四川分行', '湖北分行', '辽宁分行'],
      range: ['#2563eb', '#22c55e', '#f59e0b', '#a855f7', '#ef4444'],
    });

    chart.axis('x', {
      title: false,
      labelAutoHide: false,
      labelAutoRotate: false,
      labelFontSize: 13,
      labelFill: '#0f172a',
      labelFontWeight: 800,
    });

    chart.axis('y', {
      title: false,
      grid: true,
      labelFontSize: 12,
      labelFill: '#0f172a',
      labelFontWeight: 700,
    });

    chart
      .area()
      .data(scenarioData)
      .encode('x', 'metric')
      .encode('y', 'score')
      .encode('color', 'branch')
      .style('fillOpacity', 0.08)
      .legend(true)
      .tooltip(false);

    chart
      .line()
      .data(scenarioData)
      .encode('x', 'metric')
      .encode('y', 'score')
      .encode('color', 'branch')
      .style('lineWidth', 2)
      .legend('color', {
        title: '分行',
        position: 'top',
        cols: 3,
        crossPadding: 8,
      })
      .tooltip(false);

    chart
      .point()
      .data(scenarioData)
      .encode('x', 'metric')
      .encode('y', 'score')
      .encode('color', 'branch')
      .style('r', 3.2)
      .style('stroke', '#ffffff')
      .style('lineWidth', 1.2)
      .legend(true)
      .tooltip({
        title: (d: BranchRadarDatum) => `${d.branch} · ${d.metric}（${d.asOf}）`,
        items: [{ field: 'scoreLabel', name: '综合得分（归一化）' }],
      });

    chart.interaction('elementHighlight', { background: true });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '420px' }} />;
}
