'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type CustomerRiskRaw = {
  week: string;
  customer_id: string;
  high_leverage: boolean;
  cashflow_down: boolean;
  dpd7_plus: boolean;
  loan_balance_cny_10k: number;
};

type VennDatum = {
  sets: string[];
  size: number;
  comboKey: string;
  countLabel: string;
  shareLabel: string;
  balanceLabel: string;
};

type VennTransformedDatum = VennDatum & {
  key?: string;
  path?: string;
};

// 数据源：docs/catenum-deep-research-report.md（VENN / chart-structure-set-venn）
const rawRows: CustomerRiskRaw[] = [
  { week: '2025-W50', customer_id: 'SME_A', high_leverage: true, cashflow_down: true, dpd7_plus: false, loan_balance_cny_10k: 260 },
  { week: '2025-W50', customer_id: 'SME_B', high_leverage: true, cashflow_down: true, dpd7_plus: true, loan_balance_cny_10k: 180 },
  { week: '2025-W50', customer_id: 'SME_C', high_leverage: false, cashflow_down: true, dpd7_plus: true, loan_balance_cny_10k: 95 },
  { week: '2025-W50', customer_id: 'SME_D', high_leverage: true, cashflow_down: false, dpd7_plus: true, loan_balance_cny_10k: 120 },
  { week: '2025-W50', customer_id: 'SME_E', high_leverage: false, cashflow_down: false, dpd7_plus: true, loan_balance_cny_10k: 60 },
  { week: '2025-W50', customer_id: 'SME_F', high_leverage: true, cashflow_down: true, dpd7_plus: true, loan_balance_cny_10k: 310 },
];

const SET_HIGH_LEVERAGE = '高负债';
const SET_CASHFLOW_DOWN = '现金流转弱';
const SET_DPD7 = 'DPD7+';

const combos: Array<{ sets: string[]; match: (row: CustomerRiskRaw) => boolean }> = [
  { sets: [SET_HIGH_LEVERAGE], match: (row) => row.high_leverage },
  { sets: [SET_CASHFLOW_DOWN], match: (row) => row.cashflow_down },
  { sets: [SET_DPD7], match: (row) => row.dpd7_plus },
  { sets: [SET_HIGH_LEVERAGE, SET_CASHFLOW_DOWN], match: (row) => row.high_leverage && row.cashflow_down },
  { sets: [SET_HIGH_LEVERAGE, SET_DPD7], match: (row) => row.high_leverage && row.dpd7_plus },
  { sets: [SET_CASHFLOW_DOWN, SET_DPD7], match: (row) => row.cashflow_down && row.dpd7_plus },
  {
    sets: [SET_HIGH_LEVERAGE, SET_CASHFLOW_DOWN, SET_DPD7],
    match: (row) => row.high_leverage && row.cashflow_down && row.dpd7_plus,
  },
];

const totalCustomer = rawRows.length;

const scenarioData: VennDatum[] = combos.map((combo) => {
  const matched = rawRows.filter(combo.match);
  const size = matched.length;
  const balance10k = matched.reduce((sum, row) => sum + row.loan_balance_cny_10k, 0);
  const share = totalCustomer > 0 ? size / totalCustomer : 0;
  const comboKey = combo.sets.join('&');
  return {
    sets: combo.sets,
    size,
    comboKey,
    countLabel: `${size} 户`,
    shareLabel: `${(share * 100).toFixed(2)}%`,
    balanceLabel: `${balance10k.toFixed(0)} 万元`,
  };
});

const labelOffsetMap: Record<string, { dx: number; dy: number }> = {
  高负债: { dx: -14, dy: -10 },
  现金流转弱: { dx: 14, dy: -10 },
  'DPD7+': { dx: 0, dy: 12 },
  '高负债&现金流转弱': { dx: -8, dy: -2 },
  '高负债&DPD7+': { dx: -4, dy: 10 },
  '现金流转弱&DPD7+': { dx: 8, dy: 10 },
  '高负债&现金流转弱&DPD7+': { dx: 0, dy: 0 },
};

function getLabelText(d: VennTransformedDatum) {
  const count = d.sets?.length ?? 0;
  if (count === 1) return `${d.sets?.[0]}\n${d.countLabel}`;
  if (count === 3) return `${d.countLabel}`;
  return d.countLabel;
}

export function VennStructureRiskIntersectionScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 390,
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 36,
      paddingBottom: 12,
    });

    chart
      .path()
      .data({
        type: 'inline',
        value: scenarioData,
        transform: [{ type: 'venn', sets: 'sets', size: 'size', as: ['key', 'path'] }],
      })
      .encode('d', 'path')
      .encode('color', (d: VennTransformedDatum) => (d.sets?.length ?? 0).toString())
      .scale('color', {
        domain: ['1', '2', '3'],
        range: ['#2563eb', '#f59e0b', '#dc2626'],
      })
      .style('fillOpacity', (d: VennTransformedDatum) => {
        const setCount = d.sets?.length ?? 0;
        if (setCount === 1) return 0.34;
        if (setCount === 2) return 0.5;
        return 0.68;
      })
      .style('stroke', '#ffffff')
      .style('lineWidth', 2)
      .label({
        text: (d: VennTransformedDatum) => getLabelText(d),
        position: 'inside',
        fill: (d: VennTransformedDatum) => ((d.sets?.length ?? 0) === 3 ? '#ffffff' : '#0f172a'),
        fontWeight: 700,
        fontSize: (d: VennTransformedDatum) => ((d.sets?.length ?? 0) === 3 ? 12 : 10),
        lineHeight: 13,
        textAlign: 'center',
        textBaseline: 'middle',
        dx: (d: VennTransformedDatum) => labelOffsetMap[d.comboKey]?.dx ?? 0,
        dy: (d: VennTransformedDatum) => labelOffsetMap[d.comboKey]?.dy ?? 0,
      })
      .legend('color', {
        title: '交集阶数',
        position: 'top',
        itemLabelFormatter: (value: string) => {
          if (value === '1') return '单标签';
          if (value === '2') return '双标签交集';
          return '三标签交集';
        },
      })
      .tooltip({
        title: (d: VennTransformedDatum) => `${d.comboKey || ''}（2025-W50）`,
        items: [
          {
            field: 'sets',
            name: '风险标签组合',
            valueFormatter: (value: string[]) => value.join(' ∩ '),
          },
          { field: 'countLabel', name: '客户规模' },
          { field: 'balanceLabel', name: '贷款余额' },
          { field: 'shareLabel', name: '占样本客户比例' },
        ],
      })
      .interaction('elementHighlight');

    chart.render();
    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '390px' }} />;
}
