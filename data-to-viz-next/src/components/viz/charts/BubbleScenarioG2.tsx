'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type IndustryBubbleDatum = {
  industry: string;
  pd: number;
  raroc: number;
  ead: number;
  remark: string;
  riskTag: '高风险低收益' | '均衡经营' | '结构转型候选';
  eadLabel: string;
  pdLabel: string;
  rarocLabel: string;
};

// 数据源：docs/deep-research-report.md 中 chart-bubble 场景（示例数据）
const industryBubbleData: IndustryBubbleDatum[] = [
  { industry: '房地产上下游', pd: 3.8, raroc: 6.2, ead: 2400, remark: '规模大、收益一般', riskTag: '高风险低收益', eadLabel: '2,400', pdLabel: '3.8%', rarocLabel: '6.2%' },
  { industry: '建工/基建', pd: 3.2, raroc: 7.0, ead: 1900, remark: '项目回款依赖强', riskTag: '均衡经营', eadLabel: '1,900', pdLabel: '3.2%', rarocLabel: '7.0%' },
  { industry: '制造业中游', pd: 2.1, raroc: 8.5, ead: 2200, remark: '可分层经营', riskTag: '均衡经营', eadLabel: '2,200', pdLabel: '2.1%', rarocLabel: '8.5%' },
  { industry: '科技创新', pd: 2.6, raroc: 9.8, ead: 800, remark: '政策支持方向', riskTag: '结构转型候选', eadLabel: '800', pdLabel: '2.6%', rarocLabel: '9.8%' },
  { industry: '绿色能源', pd: 1.9, raroc: 8.9, ead: 1050, remark: 'ESG/转型相关', riskTag: '结构转型候选', eadLabel: '1,050', pdLabel: '1.9%', rarocLabel: '8.9%' },
  { industry: '批发零售', pd: 2.9, raroc: 7.5, ead: 1300, remark: '周期波动明显', riskTag: '均衡经营', eadLabel: '1,300', pdLabel: '2.9%', rarocLabel: '7.5%' },
];

const PD_THRESHOLD = 3.0;
const RAROC_THRESHOLD = 8.0;

const thresholdLinePd = [
  { pd: PD_THRESHOLD, raroc: 5.7 },
  { pd: PD_THRESHOLD, raroc: 10.2 },
];

const thresholdLineRaroc = [
  { pd: 1.6, raroc: RAROC_THRESHOLD },
  { pd: 4.1, raroc: RAROC_THRESHOLD },
];

const thresholdLabels = [
  { pd: 3.04, raroc: 10.1, label: 'PD 阈值 3.0%' },
  { pd: 1.66, raroc: 8.05, label: 'RAROC 资本成本线 8.0%' },
];

const RISK_COLOR_MAP: Record<IndustryBubbleDatum['riskTag'], string> = {
  高风险低收益: '#ef4444',
  均衡经营: '#3b82f6',
  结构转型候选: '#10b981',
};

export function BubblePortfolioScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 350,
      paddingLeft: 68,
      paddingRight: 28,
      paddingTop: 44,
      paddingBottom: 52,
    });

    chart.options({
      type: 'view',
      data: {
        type: 'inline',
        value: industryBubbleData,
      },
      scale: {
        x: { domain: [1.6, 4.1], nice: true },
        y: { domain: [5.7, 10.2], nice: true },
        size: { type: 'sqrt', range: [14, 58] },
        color: {
          domain: ['高风险低收益', '均衡经营', '结构转型候选'],
          range: ['#ef4444', '#3b82f6', '#10b981'],
        },
      },
      axis: {
        x: { title: 'PD（%）' },
        y: { title: 'RAROC（%）' },
      },
      legend: {
        color: {
          title: '行业策略分层',
          position: 'top',
          offsetY: 8,
        },
        size: {
          title: 'EAD（亿元）',
          itemMarker: 'circle',
        },
      },
      children: [
        {
          type: 'point',
          encode: {
            x: 'pd',
            y: 'raroc',
            size: 'ead',
            color: 'riskTag',
          },
          style: {
            fillOpacity: 0.98,
            stroke: (d: IndustryBubbleDatum) => RISK_COLOR_MAP[d.riskTag],
            strokeOpacity: 1,
            lineWidth: 1.2,
          },
          labels: [
            {
              text: (d: IndustryBubbleDatum) => d.industry,
              fontSize: 10,
              fill: '#334155',
              dy: -8,
            },
          ],
          tooltip: {
            title: (d: IndustryBubbleDatum) => d.industry,
            items: [
              { field: 'pdLabel', name: 'PD' },
              { field: 'rarocLabel', name: 'RAROC' },
              { field: 'eadLabel', name: 'EAD（亿元）' },
              { field: 'riskTag', name: '策略分层' },
              { field: 'remark', name: '备注' },
            ],
          },
        },
        {
          type: 'line',
          data: {
            type: 'inline',
            value: thresholdLinePd,
          },
          encode: {
            x: 'pd',
            y: 'raroc',
          },
          style: {
            stroke: '#f97316',
            lineDash: [6, 4],
            lineWidth: 1.6,
          },
          tooltip: false,
          legend: false,
        },
        {
          type: 'line',
          data: {
            type: 'inline',
            value: thresholdLineRaroc,
          },
          encode: {
            x: 'pd',
            y: 'raroc',
          },
          style: {
            stroke: '#f59e0b',
            lineDash: [6, 4],
            lineWidth: 1.6,
          },
          tooltip: false,
          legend: false,
        },
        {
          type: 'text',
          data: {
            type: 'inline',
            value: thresholdLabels,
          },
          encode: {
            x: 'pd',
            y: 'raroc',
            text: 'label',
          },
          style: {
            fill: '#92400e',
            fontSize: 10,
            fontWeight: 600,
            dx: 6,
            dy: -6,
          },
          tooltip: false,
          legend: false,
        },
      ],
      interaction: [{ type: 'elementHighlight', background: true }],
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '350px' }} />;
}
