'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type FacetRiskRaw = {
  quarter: string;
  product: string;
  customerType: string;
  riskGrade: string;
  nplRatio: number;
  complaintRate: number;
};

type FacetRiskDatum = FacetRiskRaw & {
  nplLabel: string;
  complaintLabel: string;
};

// 数据源：docs/catenum-deep-research-report.md（FREC / chart-combo-mcat-mnum-facet-rect）
const scenarioRawData: FacetRiskRaw[] = [
  { quarter: '2025Q4', product: '消费贷', customerType: '新客', riskGrade: '高', nplRatio: 0.028, complaintRate: 0.0040 },
  { quarter: '2025Q4', product: '消费贷', customerType: '新客', riskGrade: '中', nplRatio: 0.020, complaintRate: 0.0032 },
  { quarter: '2025Q4', product: '消费贷', customerType: '新客', riskGrade: '低', nplRatio: 0.012, complaintRate: 0.0019 },
  { quarter: '2025Q4', product: '消费贷', customerType: '存量', riskGrade: '高', nplRatio: 0.019, complaintRate: 0.0028 },
  { quarter: '2025Q4', product: '消费贷', customerType: '存量', riskGrade: '中', nplRatio: 0.014, complaintRate: 0.0020 },
  { quarter: '2025Q4', product: '消费贷', customerType: '存量', riskGrade: '低', nplRatio: 0.009, complaintRate: 0.0012 },

  { quarter: '2025Q4', product: '信用卡', customerType: '新客', riskGrade: '高', nplRatio: 0.035, complaintRate: 0.0060 },
  { quarter: '2025Q4', product: '信用卡', customerType: '新客', riskGrade: '中', nplRatio: 0.024, complaintRate: 0.0044 },
  { quarter: '2025Q4', product: '信用卡', customerType: '新客', riskGrade: '低', nplRatio: 0.015, complaintRate: 0.0025 },
  { quarter: '2025Q4', product: '信用卡', customerType: '存量', riskGrade: '高', nplRatio: 0.023, complaintRate: 0.0041 },
  { quarter: '2025Q4', product: '信用卡', customerType: '存量', riskGrade: '中', nplRatio: 0.018, complaintRate: 0.0030 },
  { quarter: '2025Q4', product: '信用卡', customerType: '存量', riskGrade: '低', nplRatio: 0.011, complaintRate: 0.0017 },

  { quarter: '2025Q4', product: '按揭', customerType: '新客', riskGrade: '中', nplRatio: 0.0040, complaintRate: 0.0010 },
  { quarter: '2025Q4', product: '按揭', customerType: '新客', riskGrade: '低', nplRatio: 0.0036, complaintRate: 0.0008 },
  { quarter: '2025Q4', product: '按揭', customerType: '存量', riskGrade: '中', nplRatio: 0.0038, complaintRate: 0.0008 },
  { quarter: '2025Q4', product: '按揭', customerType: '存量', riskGrade: '低', nplRatio: 0.0030, complaintRate: 0.0006 },
];

const scenarioData: FacetRiskDatum[] = scenarioRawData.map((row) => ({
  ...row,
  nplLabel: `${(row.nplRatio * 100).toFixed(2)}%`,
  complaintLabel: `${(row.complaintRate * 100).toFixed(2)}%`,
}));

const riskColorMap: Record<string, string> = {
  低: '#16a34a',
  中: '#f59e0b',
  高: '#ef4444',
};

export function FacetRectRiskScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 430,
      paddingLeft: 56,
      paddingRight: 18,
      paddingTop: 24,
      paddingBottom: 30,
    });

    const facet = chart
      .facetRect()
      .data(scenarioData)
      .encode('x', 'product')
      .encode('y', 'customerType')
      .legend('color', false)
      .legend('size', false);

    facet
      .point()
      .encode('x', 'riskGrade')
      .encode('y', 'nplRatio')
      .encode('size', 'complaintRate')
      .scale('size', { range: [10, 28] })
      .style('fill', (d: FacetRiskDatum) => riskColorMap[d.riskGrade] || '#64748b')
      .style('fillOpacity', 0.92)
      .style('stroke', '#ffffff')
      .style('lineWidth', 1.2)
      .style('opacity', 1)
      .tooltip({
        title: (d: FacetRiskDatum) => `${d.product}｜${d.customerType}｜${d.quarter}`,
        items: [
          { field: 'riskGrade', name: '风险等级' },
          { field: 'nplLabel', name: 'NPL率（不良贷款率）' },
          { field: 'complaintLabel', name: '投诉率' },
        ],
      });

    chart.axis('x', {
      title: false,
      labelAutoHide: false,
      labelAutoRotate: false,
    });
    chart.axis('y', {
      title: false,
      labelFormatter: (value: string) => `${(Number(value) * 100).toFixed(2)}%`,
    });
    chart.interaction('tooltip', { shared: false });

    chart.render();
    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '430px' }} />;
}
