'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type TreemapDatum = {
  path?: string[];
  data: {
    name: string;
  };
  value?: number;
};

const budgetData = {
  name: '年度预算',
  children: [
    {
      name: '研发部门',
      children: [
        { name: '前端开发', value: 1200 },
        { name: '后端开发', value: 1500 },
        { name: '测试', value: 800 },
        { name: '设计', value: 600 },
      ],
    },
    {
      name: '市场部门',
      children: [
        { name: '广告投放', value: 2000 },
        { name: '活动策划', value: 800 },
        { name: '内容营销', value: 500 },
      ],
    },
    {
      name: '运营部门',
      children: [
        { name: '客户服务', value: 700 },
        { name: '数据分析', value: 400 },
        { name: '运营支持', value: 300 },
      ],
    },
    { name: '其他支出', value: 1200 },
  ],
};


export function DendrogramG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 300,
    });


    chart.options({
        type: 'treemap',
  data: { value: budgetData },
  layout: {
    tile: 'treemapSquarify',
    paddingInner: 2,
  },
  encode: {
    value: 'value',
    color: (d: TreemapDatum) => d.path?.[1] || d.data.name,
  },
  style: {
    labelText: (d: TreemapDatum) => d.data.name,
    // labelFill: '#fff',
    // labelStroke: '#000',
    labelLineWidth: 0.5,
    labelFontSize: 12,
  },
  tooltip: {
    title: (d: TreemapDatum) => d.data.name,
    items: [
      { field: 'value', name: '预算', valueFormatter: (v: number) => `${v}万元` },
    ],
  },
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return (
    <div className="relative w-full bg-slate-50/50 rounded-lg border border-slate-100 overflow-hidden">
      <div ref={containerRef} style={{ width: '100%', height: '300px' }} />
    </div>
  );
}
