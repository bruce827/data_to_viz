'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { Chart } from '@antv/g2';

type AlluvialRaw = {
  month: string;
  acqChannel: string;
  product: string;
  riskState: string;
  customerCnt: number;
};

type AlluvialLinkDatum = {
  source: string;
  target: string;
  value: number;
  stage: '渠道到产品' | '产品到风险';
  flowLabel: string;
  month: string;
};

// 数据源：docs/catenum-deep-research-report.md（ALLU / chart-structure-flow-alluvial）
const scenarioRawData: AlluvialRaw[] = [
  { month: '2025-10', acqChannel: '线上广告', product: '消费贷', riskState: '正常', customerCnt: 42000 },
  { month: '2025-10', acqChannel: '线上广告', product: '消费贷', riskState: '逾期30+', customerCnt: 2100 },
  { month: '2025-10', acqChannel: '线下网点', product: '消费贷', riskState: '正常', customerCnt: 28000 },
  { month: '2025-10', acqChannel: '合作平台', product: '信用卡', riskState: '正常', customerCnt: 36000 },
  { month: '2025-10', acqChannel: '合作平台', product: '信用卡', riskState: '逾期30+', customerCnt: 3200 },
  { month: '2025-10', acqChannel: '线下网点', product: '按揭', riskState: '正常', customerCnt: 12000 },
];

function aggregateLinks(rows: AlluvialRaw[]): AlluvialLinkDatum[] {
  const chToProd = new Map<string, number>();
  const prodToRisk = new Map<string, number>();

  rows.forEach((row) => {
    const k1 = `${row.acqChannel}|||${row.product}`;
    const k2 = `${row.product}|||${row.riskState}`;
    chToProd.set(k1, (chToProd.get(k1) || 0) + row.customerCnt);
    prodToRisk.set(k2, (prodToRisk.get(k2) || 0) + row.customerCnt);
  });

  const links1 = Array.from(chToProd.entries()).map(([key, value]) => {
    const [source, target] = key.split('|||');
    return {
      source,
      target,
      value,
      stage: '渠道到产品' as const,
      flowLabel: `${value.toLocaleString()} 户`,
      month: '2025-10',
    };
  });

  const links2 = Array.from(prodToRisk.entries()).map(([key, value]) => {
    const [source, target] = key.split('|||');
    return {
      source,
      target,
      value,
      stage: '产品到风险' as const,
      flowLabel: `${value.toLocaleString()} 户`,
      month: '2025-10',
    };
  });

  return [...links1, ...links2];
}

export function AlluvialLifecycleScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);
  const linkData = useMemo(() => aggregateLinks(scenarioRawData), []);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 440,
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 52,
      paddingBottom: 18,
    });

    chart.options({
      type: 'sankey',
      data: {
        value: { links: linkData },
      },
      layout: {
        nodeAlign: 'center',
        nodePadding: 0.04,
      },
      encode: {
        color: 'stage',
      },
      scale: {
        color: {
          domain: ['渠道到产品', '产品到风险'],
          range: ['#2563eb', '#f59e0b'],
        },
      },
      legend: {
        color: {
          title: '流向层级',
          position: 'top',
        },
      },
      style: {
        nodeStroke: '#ffffff',
        nodeStrokeWidth: 1,
        labelFontSize: 11,
        labelFontWeight: 700,
        labelSpacing: 4,
        linkFillOpacity: 0.42,
      },
      tooltip: {
        title: (d: AlluvialLinkDatum) => `${d.source} → ${d.target}（${d.month}）`,
        items: [{ field: 'flowLabel', name: '客户数' }],
      },
      interaction: [{ type: 'elementHighlight', background: true }],
    });

    chart.render();
    return () => chart.destroy();
  }, [linkData]);

  return <div ref={containerRef} style={{ width: '100%', height: '440px' }} />;
}
