'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type BoxScenarioDatum = {
  industry: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
};

type OutlierPoint = {
  industry: string;
  value: number;
};

// 数据源：docs/deep-research-report.md 中 chart-boxplot 场景（单位：bp）
const BOXPLOT_SCENARIO_DATA: BoxScenarioDatum[] = [
  { industry: '住宿餐饮', min: 130, q1: 180, median: 240, q3: 310, max: 350 },
  { industry: '批发零售', min: 120, q1: 160, median: 210, q3: 260, max: 290 },
  { industry: '建筑分包', min: 140, q1: 190, median: 230, q3: 290, max: 340 },
  { industry: '制造业（中游）', min: 110, q1: 140, median: 190, q3: 240, max: 275 },
  { industry: '科技服务', min: 90, q1: 120, median: 170, q3: 230, max: 270 },
];

const outlierConfig: Record<string, number> = {
  '住宿餐饮': 3,
  '批发零售': 1,
  '建筑分包': 5,
  '制造业（中游）': 0,
  '科技服务': 2,
};

function buildOutlierPoints(data: BoxScenarioDatum[]): OutlierPoint[] {
  const points: OutlierPoint[] = [];

  data.forEach((item) => {
    const count = outlierConfig[item.industry] ?? 0;
    for (let i = 0; i < count; i += 1) {
      points.push({
        industry: item.industry,
        value: item.max + 8 + i * 7,
      });
    }
  });

  return points;
}

export function BoxplotPricingScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 330,
      paddingLeft: 78,
      paddingRight: 28,
      paddingBottom: 56,
    });

    const outlierPoints = buildOutlierPoints(BOXPLOT_SCENARIO_DATA);

    chart
      .box()
      .data(BOXPLOT_SCENARIO_DATA)
      .encode('x', 'industry')
      .encode('y', (d: BoxScenarioDatum) => [d.min, d.q1, d.median, d.q3, d.max])
      .style('fill', '#3b82f6')
      .style('fillOpacity', 0.5)
      .style('stroke', '#1d4ed8')
      .style('lineWidth', 1.2)
      .axis('x', { title: '行业' })
      .axis('y', { title: '利差 / 风险溢价（bp）' })
      .tooltip({
        title: (d: BoxScenarioDatum) => d.industry,
        items: [
          { name: '最大值', field: 'max' },
          { name: 'Q3', field: 'q3' },
          { name: '中位数', field: 'median' },
          { name: 'Q1', field: 'q1' },
          { name: '最小值', field: 'min' },
        ],
      });

    chart
      .point()
      .data(outlierPoints)
      .encode('x', 'industry')
      .encode('y', 'value')
      .style('fill', '#ef4444')
      .style('stroke', '#fff')
      .style('lineWidth', 1)
      .style('r', 3.5)
      .tooltip({
        title: (d: OutlierPoint) => `${d.industry} 异常点`,
        items: [{ channel: 'y', name: '异常值（bp）' }],
      });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '330px' }} />;
}
