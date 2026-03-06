'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type RetailRiskRaw = {
  week: string;
  product: string;
  channel: string;
  customerCohort: string;
  dpd7Ratio: number;
  dpd30Ratio: number;
  activeAccounts: number;
};

type RetailRiskDatum = RetailRiskRaw & {
  channelLabel: string;
  dpd7Label: string;
  dpd30Label: string;
  activeAccountsLabel: string;
};

// 数据源：docs/catenum-deep-research-report.md（GBAR / chart-combo-mcat-1num-grouped-bar）
const scenarioRawData: RetailRiskRaw[] = [
  {
    week: '2025-W48',
    product: '信用卡',
    channel: '线上',
    customerCohort: '新客',
    dpd7Ratio: 0.012,
    dpd30Ratio: 0.006,
    activeAccounts: 182000,
  },
  {
    week: '2025-W48',
    product: '信用卡',
    channel: '线下',
    customerCohort: '新客',
    dpd7Ratio: 0.009,
    dpd30Ratio: 0.004,
    activeAccounts: 76000,
  },
  {
    week: '2025-W48',
    product: '消费贷',
    channel: '线上',
    customerCohort: '新客',
    dpd7Ratio: 0.008,
    dpd30Ratio: 0.003,
    activeAccounts: 54000,
  },
  {
    week: '2025-W48',
    product: '消费贷',
    channel: '线下',
    customerCohort: '新客',
    dpd7Ratio: 0.006,
    dpd30Ratio: 0.002,
    activeAccounts: 41000,
  },
  {
    week: '2025-W48',
    product: '按揭',
    channel: '线上',
    customerCohort: '新客',
    dpd7Ratio: 0.001,
    dpd30Ratio: 0.0006,
    activeAccounts: 12000,
  },
  {
    week: '2025-W48',
    product: '按揭',
    channel: '线下',
    customerCohort: '新客',
    dpd7Ratio: 0.0012,
    dpd30Ratio: 0.0007,
    activeAccounts: 18000,
  },
];

const scenarioData: RetailRiskDatum[] = scenarioRawData.map((row) => ({
  ...row,
  channelLabel: `${row.channel}-${row.customerCohort}`,
  dpd7Label: `${(row.dpd7Ratio * 100).toFixed(2)}%`,
  dpd30Label: `${(row.dpd30Ratio * 100).toFixed(2)}%`,
  activeAccountsLabel: `${row.activeAccounts.toLocaleString()} 户`,
}));

export function GroupedBarRetailRiskScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 400,
      paddingLeft: 54,
      paddingRight: 16,
      paddingTop: 56,
      paddingBottom: 44,
    });

    chart
      .interval()
      .data(scenarioData)
      .transform({ type: 'dodgeX' })
      .encode('x', 'product')
      .encode('y', 'dpd30Ratio')
      .encode('color', 'channelLabel')
      .scale('color', {
        domain: ['线上-新客', '线下-新客'],
        range: ['#2563eb', '#f59e0b'],
      })
      .legend('color', {
        title: '渠道-客群',
        position: 'top',
      })
      .axis('y', {
        title: false,
        labelFormatter: (value: string) => `${(Number(value) * 100).toFixed(2)}%`,
      })
      .style('radiusTopLeft', 3)
      .style('radiusTopRight', 3)
      .tooltip({
        title: (d: RetailRiskDatum) => `${d.product}｜${d.channelLabel}｜${d.week}`,
        items: [
          { field: 'dpd30Label', name: 'DPD30逾期率（30天逾期率）' },
          { field: 'dpd7Label', name: 'DPD7逾期率（7天逾期率）' },
          { field: 'activeAccountsLabel', name: '活跃账户数' },
        ],
      });

    chart.interaction('tooltip', { shared: true });
    chart.interaction('elementHighlightByColor', { background: true });

    chart.render();
    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '400px' }} />;
}
