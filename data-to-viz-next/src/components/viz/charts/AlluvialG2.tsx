'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type AlluvialDemoDatum = {
  source: string;
  target: string;
  value: number;
  sourceGroup: '渠道' | '产品';
};

const demoData: AlluvialDemoDatum[] = [
  { source: '线上广告', target: '消费贷', value: 42000, sourceGroup: '渠道' },
  { source: '线下网点', target: '消费贷', value: 28000, sourceGroup: '渠道' },
  { source: '合作平台', target: '信用卡', value: 36000, sourceGroup: '渠道' },
  { source: '线下网点', target: '按揭', value: 12000, sourceGroup: '渠道' },
  { source: '消费贷', target: '正常', value: 70000, sourceGroup: '产品' },
  { source: '消费贷', target: '逾期30+', value: 2100, sourceGroup: '产品' },
  { source: '信用卡', target: '正常', value: 36000, sourceGroup: '产品' },
  { source: '信用卡', target: '逾期30+', value: 3200, sourceGroup: '产品' },
  { source: '按揭', target: '正常', value: 12000, sourceGroup: '产品' },
];

export function AlluvialG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 320,
      paddingLeft: 12,
      paddingRight: 12,
      paddingTop: 12,
      paddingBottom: 12,
    });

    chart.options({
      type: 'sankey',
      data: {
        value: {
          links: demoData,
        },
      },
      layout: {
        nodeAlign: 'center',
        nodePadding: 0.03,
      },
      encode: {
        color: 'sourceGroup',
      },
      scale: {
        color: {
          domain: ['渠道', '产品'],
          range: ['#2563eb', '#f59e0b'],
        },
      },
      legend: {
        color: {
          title: '流入来源层级',
          position: 'top',
        },
      },
      style: {
        labelSpacing: 3,
        labelFontWeight: 'bold',
        nodeStrokeWidth: 1.2,
        linkFillOpacity: 0.4,
      },
      tooltip: {
        title: (d: AlluvialDemoDatum) => `${d.source} → ${d.target}`,
        items: [{ field: 'value', name: '客户数' }],
      },
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '320px' }} />;
}
