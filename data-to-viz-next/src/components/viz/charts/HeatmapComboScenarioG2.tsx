'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type RegionIndustryRiskRaw = {
  month: string;
  province: string;
  industry: string;
  nplRatio: number;
  loanBalanceCny100m: number;
};

type RegionIndustryRiskDatum = RegionIndustryRiskRaw & {
  nplLabel: string;
  balanceLabel: string;
};

// 数据源：docs/catenum-deep-research-report.md（HEAT / chart-combo-mcat-mnum-heatmap）
const scenarioRawData: RegionIndustryRiskRaw[] = [
  { month: '2025-12', province: '广东', industry: '制造业', nplRatio: 0.012, loanBalanceCny100m: 8200 },
  { month: '2025-12', province: '广东', industry: '房地产相关', nplRatio: 0.026, loanBalanceCny100m: 2100 },
  { month: '2025-12', province: '广东', industry: '批发零售', nplRatio: 0.017, loanBalanceCny100m: 3000 },
  { month: '2025-12', province: '江苏', industry: '制造业', nplRatio: 0.011, loanBalanceCny100m: 7600 },
  { month: '2025-12', province: '江苏', industry: '房地产相关', nplRatio: 0.024, loanBalanceCny100m: 1800 },
  { month: '2025-12', province: '江苏', industry: '批发零售', nplRatio: 0.016, loanBalanceCny100m: 2800 },
  { month: '2025-12', province: '四川', industry: '制造业', nplRatio: 0.015, loanBalanceCny100m: 3500 },
  { month: '2025-12', province: '四川', industry: '批发零售', nplRatio: 0.018, loanBalanceCny100m: 2400 },
  { month: '2025-12', province: '四川', industry: '房地产相关', nplRatio: 0.03, loanBalanceCny100m: 1300 },
  { month: '2025-12', province: '北京', industry: '制造业', nplRatio: 0.01, loanBalanceCny100m: 2900 },
  { month: '2025-12', province: '北京', industry: '房地产相关', nplRatio: 0.021, loanBalanceCny100m: 1200 },
  { month: '2025-12', province: '北京', industry: '批发零售', nplRatio: 0.014, loanBalanceCny100m: 1600 },
  { month: '2025-12', province: '浙江', industry: '制造业', nplRatio: 0.0125, loanBalanceCny100m: 6400 },
  { month: '2025-12', province: '浙江', industry: '房地产相关', nplRatio: 0.023, loanBalanceCny100m: 1700 },
  { month: '2025-12', province: '浙江', industry: '批发零售', nplRatio: 0.0155, loanBalanceCny100m: 2500 },
  { month: '2025-12', province: '山东', industry: '制造业', nplRatio: 0.0135, loanBalanceCny100m: 5800 },
  { month: '2025-12', province: '山东', industry: '房地产相关', nplRatio: 0.027, loanBalanceCny100m: 1900 },
  { month: '2025-12', province: '山东', industry: '批发零售', nplRatio: 0.0195, loanBalanceCny100m: 2600 },
];

const scenarioData: RegionIndustryRiskDatum[] = scenarioRawData.map((row) => ({
  ...row,
  nplLabel: `${(row.nplRatio * 100).toFixed(2)}%`,
  balanceLabel: `${row.loanBalanceCny100m.toLocaleString()} 亿元`,
}));

export function HeatmapRegionIndustryScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 420,
      paddingLeft: 86,
      paddingRight: 16,
      paddingTop: 58,
      paddingBottom: 56,
    });

    chart
      .cell()
      .data(scenarioData)
      .encode('x', 'province')
      .encode('y', 'industry')
      .encode('color', 'nplRatio')
      .scale('color', {
        domain: [0.01, 0.03],
        range: ['#dcfce7', '#f59e0b', '#dc2626'],
      })
      .legend('color', {
        title: 'NPL率（不良贷款率）',
        position: 'top',
      })
      .style('stroke', '#ffffff')
      .style('lineWidth', 1.2)
      .axis('x', { title: false })
      .axis('y', { title: false })
      .tooltip({
        title: (d: RegionIndustryRiskDatum) => `${d.province}｜${d.industry}｜${d.month}`,
        items: [
          { field: 'nplLabel', name: 'NPL率（不良贷款率）' },
          { field: 'balanceLabel', name: '贷款余额' },
        ],
      });

    chart
      .text()
      .data(scenarioData)
      .encode('x', 'province')
      .encode('y', 'industry')
      .encode('text', 'nplLabel')
      .style('fontSize', 11)
      .style('fontWeight', 700)
      .style('fill', (d: RegionIndustryRiskDatum) => (d.nplRatio >= 0.022 ? '#ffffff' : '#0f172a'))
      .tooltip(false);

    chart.interaction('tooltip', { shared: false });
    chart.interaction('elementHighlight', { background: true });

    chart.render();
    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '420px' }} />;
}
