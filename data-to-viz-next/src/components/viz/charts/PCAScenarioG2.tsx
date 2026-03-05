'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type PCAScenarioDatum = {
  customer: string;
  industry: string;
  pc1: number;
  pc2: number;
  esgScore: number;
  carbonIntensity: number;
  transitionCluster: '高转型风险簇' | '过渡观察簇' | '低转型风险簇';
  trendSignal: '簇内正相关' | '簇内负相关' | '相关性较弱' | '离群点';
  pointType: '常规样本' | '离群点';
  esgLabel: string;
  carbonLabel: string;
};

type PCARawDatum = Omit<PCAScenarioDatum, 'esgLabel' | 'carbonLabel'>;
const numberFormatter = new Intl.NumberFormat('zh-CN');

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

function seedFromText(text: string) {
  return text.split('').reduce((sum, char, index) => sum + char.charCodeAt(0) * (index + 17), 0);
}

function jitter(text: string, amplitude: number) {
  const seed = seedFromText(text);
  return (pseudoRandom(seed) - 0.5) * 2 * amplitude;
}

// 数据源：基于 docs/deep-research-report.md 的 chart-pca 口径扩展示例样本（加入真实业务中的噪声与局部反向扰动）
const pcaRawData: PCARawDatum[] = [
  // 高转型风险簇：整体正相关，但存在局部回撤（更贴近真实业务）
  { customer: 'R01', industry: '钢铁', pc1: 1.05, pc2: -0.32, esgScore: 58, carbonIntensity: 710, transitionCluster: '高转型风险簇', trendSignal: '簇内正相关', pointType: '常规样本' },
  { customer: 'R02', industry: '钢铁', pc1: 1.18, pc2: -0.06, esgScore: 57, carbonIntensity: 750, transitionCluster: '高转型风险簇', trendSignal: '簇内正相关', pointType: '常规样本' },
  { customer: 'R03', industry: '煤化工', pc1: 1.37, pc2: -0.12, esgScore: 56, carbonIntensity: 810, transitionCluster: '高转型风险簇', trendSignal: '簇内正相关', pointType: '常规样本' },
  { customer: 'R04', industry: '煤化工', pc1: 1.56, pc2: 0.21, esgScore: 54, carbonIntensity: 860, transitionCluster: '高转型风险簇', trendSignal: '簇内正相关', pointType: '常规样本' },
  { customer: 'R05', industry: '建材', pc1: 1.74, pc2: 0.05, esgScore: 53, carbonIntensity: 900, transitionCluster: '高转型风险簇', trendSignal: '簇内正相关', pointType: '常规样本' },
  { customer: 'R06', industry: '建材', pc1: 1.96, pc2: 0.44, esgScore: 52, carbonIntensity: 960, transitionCluster: '高转型风险簇', trendSignal: '簇内正相关', pointType: '常规样本' },
  { customer: 'R07', industry: '有色', pc1: 2.18, pc2: 0.31, esgScore: 50, carbonIntensity: 1010, transitionCluster: '高转型风险簇', trendSignal: '簇内正相关', pointType: '常规样本' },
  { customer: 'R08', industry: '有色', pc1: 2.42, pc2: 0.67, esgScore: 49, carbonIntensity: 1080, transitionCluster: '高转型风险簇', trendSignal: '簇内正相关', pointType: '常规样本' },
  { customer: 'R09', industry: '焦化', pc1: 2.58, pc2: 0.55, esgScore: 48, carbonIntensity: 1150, transitionCluster: '高转型风险簇', trendSignal: '簇内正相关', pointType: '常规样本' },

  // 低转型风险簇：整体负相关，但中段有重叠区
  { customer: 'L01', industry: '风电', pc1: -2.32, pc2: 1.03, esgScore: 74, carbonIntensity: 220, transitionCluster: '低转型风险簇', trendSignal: '簇内负相关', pointType: '常规样本' },
  { customer: 'L02', industry: '风电', pc1: -2.08, pc2: 0.92, esgScore: 76, carbonIntensity: 198, transitionCluster: '低转型风险簇', trendSignal: '簇内负相关', pointType: '常规样本' },
  { customer: 'L03', industry: '电网', pc1: -1.86, pc2: 0.74, esgScore: 78, carbonIntensity: 172, transitionCluster: '低转型风险簇', trendSignal: '簇内负相关', pointType: '常规样本' },
  { customer: 'L04', industry: '电网', pc1: -1.63, pc2: 0.61, esgScore: 80, carbonIntensity: 158, transitionCluster: '低转型风险簇', trendSignal: '簇内负相关', pointType: '常规样本' },
  { customer: 'L05', industry: '电网', pc1: -1.45, pc2: 0.67, esgScore: 79, carbonIntensity: 148, transitionCluster: '低转型风险簇', trendSignal: '簇内负相关', pointType: '常规样本' },
  { customer: 'L06', industry: '水务', pc1: -1.26, pc2: 0.29, esgScore: 83, carbonIntensity: 126, transitionCluster: '低转型风险簇', trendSignal: '簇内负相关', pointType: '常规样本' },
  { customer: 'L07', industry: '水务', pc1: -1.08, pc2: 0.11, esgScore: 84, carbonIntensity: 116, transitionCluster: '低转型风险簇', trendSignal: '簇内负相关', pointType: '常规样本' },
  { customer: 'L08', industry: '水务', pc1: -0.95, pc2: 0.02, esgScore: 85, carbonIntensity: 108, transitionCluster: '低转型风险簇', trendSignal: '簇内负相关', pointType: '常规样本' },
  { customer: 'L09', industry: '环保服务', pc1: -0.78, pc2: -0.12, esgScore: 86, carbonIntensity: 98, transitionCluster: '低转型风险簇', trendSignal: '簇内负相关', pointType: '常规样本' },

  // 过渡观察簇：分布更散，相关性较弱
  { customer: 'M01', industry: '物流', pc1: -0.12, pc2: 0.92, esgScore: 69, carbonIntensity: 255, transitionCluster: '过渡观察簇', trendSignal: '相关性较弱', pointType: '常规样本' },
  { customer: 'M02', industry: '物流', pc1: 0.05, pc2: 0.58, esgScore: 68, carbonIntensity: 286, transitionCluster: '过渡观察簇', trendSignal: '相关性较弱', pointType: '常规样本' },
  { customer: 'M03', industry: '制造', pc1: 0.23, pc2: 0.77, esgScore: 67, carbonIntensity: 318, transitionCluster: '过渡观察簇', trendSignal: '相关性较弱', pointType: '常规样本' },
  { customer: 'M04', industry: '制造', pc1: 0.42, pc2: 0.35, esgScore: 66, carbonIntensity: 348, transitionCluster: '过渡观察簇', trendSignal: '相关性较弱', pointType: '常规样本' },
  { customer: 'M05', industry: '交通', pc1: 0.56, pc2: 0.64, esgScore: 64, carbonIntensity: 372, transitionCluster: '过渡观察簇', trendSignal: '相关性较弱', pointType: '常规样本' },
  { customer: 'M06', industry: '交通', pc1: 0.71, pc2: 0.21, esgScore: 63, carbonIntensity: 402, transitionCluster: '过渡观察簇', trendSignal: '相关性较弱', pointType: '常规样本' },
  { customer: 'M07', industry: '零售', pc1: 0.88, pc2: 0.48, esgScore: 62, carbonIntensity: 435, transitionCluster: '过渡观察簇', trendSignal: '相关性较弱', pointType: '常规样本' },
  { customer: 'M08', industry: '零售', pc1: 1.04, pc2: 0.33, esgScore: 61, carbonIntensity: 462, transitionCluster: '过渡观察簇', trendSignal: '相关性较弱', pointType: '常规样本' },
  { customer: 'M09', industry: '物流', pc1: 0.34, pc2: 0.94, esgScore: 65, carbonIntensity: 336, transitionCluster: '过渡观察簇', trendSignal: '相关性较弱', pointType: '常规样本' },
  { customer: 'M10', industry: '制造', pc1: 0.62, pc2: 0.02, esgScore: 64, carbonIntensity: 352, transitionCluster: '过渡观察簇', trendSignal: '相关性较弱', pointType: '常规样本' },

  // 离群点：相对极端但不“离谱”
  { customer: 'O01', industry: '煤化工', pc1: 2.24, pc2: -0.78, esgScore: 44, carbonIntensity: 1240, transitionCluster: '高转型风险簇', trendSignal: '离群点', pointType: '离群点' },
  { customer: 'O02', industry: '电网', pc1: -2.46, pc2: -0.62, esgScore: 87, carbonIntensity: 88, transitionCluster: '低转型风险簇', trendSignal: '离群点', pointType: '离群点' },
];

// 对非离群点加入可复现小扰动：模拟采样误差与口径波动，但保持整体业务结构。
const pcaPerturbedData: PCARawDatum[] = pcaRawData.map((item) => {
  if (item.pointType === '离群点') return item;

  const pc1 = Number((item.pc1 + jitter(`${item.customer}-pc1`, 0.11)).toFixed(2));
  const pc2 = Number((item.pc2 + jitter(`${item.customer}-pc2`, 0.16)).toFixed(2));
  const esgScore = Math.round(clamp(item.esgScore + jitter(`${item.customer}-esg`, 2.2), 40, 90));
  const carbonIntensity = Math.round(clamp(item.carbonIntensity + jitter(`${item.customer}-carbon`, 32), 80, 1300));

  return {
    ...item,
    pc1,
    pc2,
    esgScore,
    carbonIntensity,
  };
});

const pcaScenarioData: PCAScenarioDatum[] = pcaPerturbedData.map((item) => ({
  ...item,
  esgLabel: numberFormatter.format(item.esgScore),
  carbonLabel: numberFormatter.format(item.carbonIntensity),
}));

const regularPoints = pcaScenarioData.filter((item) => item.pointType === '常规样本');
const outlierPoints = pcaScenarioData.filter((item) => item.pointType === '离群点');

const CLUSTER_DOMAIN: Array<PCAScenarioDatum['transitionCluster']> = ['高转型风险簇', '过渡观察簇', '低转型风险簇'];
const CLUSTER_COLORS = ['#dc2626', '#f59e0b', '#16a34a'];
const CLUSTER_COLOR_MAP: Record<PCAScenarioDatum['transitionCluster'], string> = {
  高转型风险簇: '#dc2626',
  过渡观察簇: '#f59e0b',
  低转型风险簇: '#16a34a',
};

type TrendLinePoint = {
  pc1: number;
  pc2: number;
  trend: string;
};

function buildRegressionLine(
  data: PCAScenarioDatum[],
  cluster: PCAScenarioDatum['transitionCluster'],
  trend: string,
): TrendLinePoint[] {
  const rows = data.filter((d) => d.transitionCluster === cluster && d.pointType === '常规样本');
  if (rows.length < 2) return [];

  const meanX = rows.reduce((sum, row) => sum + row.pc1, 0) / rows.length;
  const meanY = rows.reduce((sum, row) => sum + row.pc2, 0) / rows.length;
  const numerator = rows.reduce((sum, row) => sum + (row.pc1 - meanX) * (row.pc2 - meanY), 0);
  const denominator = rows.reduce((sum, row) => sum + (row.pc1 - meanX) ** 2, 0);
  const slope = Math.abs(denominator) < 1e-6 ? 0 : numerator / denominator;
  const intercept = meanY - slope * meanX;

  const minX = Math.min(...rows.map((row) => row.pc1));
  const maxX = Math.max(...rows.map((row) => row.pc1));

  return [
    { pc1: Number((minX - 0.04).toFixed(2)), pc2: Number((slope * (minX - 0.04) + intercept).toFixed(2)), trend },
    { pc1: Number((maxX + 0.04).toFixed(2)), pc2: Number((slope * (maxX + 0.04) + intercept).toFixed(2)), trend },
  ];
}

const positiveTrendLine = buildRegressionLine(pcaScenarioData, '高转型风险簇', '正相关趋势线');
const negativeTrendLine = buildRegressionLine(pcaScenarioData, '低转型风险簇', '负相关趋势线');
const trendLabel = [
  {
    pc1: (positiveTrendLine[1]?.pc1 ?? 2.3) - 0.38,
    pc2: (positiveTrendLine[1]?.pc2 ?? 0.86) + 0.12,
    label: '高风险簇：整体正相关',
  },
  {
    pc1: (negativeTrendLine[0]?.pc1 ?? -2.2) - 0.12,
    pc2: (negativeTrendLine[0]?.pc2 ?? 0.96) + 0.1,
    label: '低风险簇：整体负相关',
  },
  { pc1: 1.82, pc2: -0.75, label: 'O01 离群点' },
  { pc1: -2.6, pc2: -0.58, label: 'O02 离群点' },
];

export function PCATransitionRiskScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 350,
      paddingLeft: 64,
      paddingRight: 30,
      paddingTop: 34,
      paddingBottom: 58,
    });

    chart.options({
      type: 'view',
      data: {
        type: 'inline',
        value: pcaScenarioData,
      },
      scale: {
        x: { domain: [-2.8, 2.85], nice: true },
        y: { domain: [-0.92, 1.36], nice: true },
        color: {
          domain: [...CLUSTER_DOMAIN],
          range: [...CLUSTER_COLORS],
        },
        size: {
          type: 'sqrt',
          domain: [88, 1240],
          range: [8, 22],
        },
      },
      axis: {
        x: { title: '第一主成分（PC1）' },
        y: { title: '第二主成分（PC2）' },
      },
      legend: {
        color: {
          title: '转型风险分层',
          position: 'top',
        },
        size: {
          title: '碳强度（tCO2/营收百万）',
          position: 'right',
        },
      },
      children: [
        {
          type: 'lineX',
          data: [0],
          style: {
            stroke: '#cbd5e1',
            lineDash: [4, 4],
          },
          tooltip: false,
          legend: false,
        },
        {
          type: 'lineY',
          data: [0],
          style: {
            stroke: '#cbd5e1',
            lineDash: [4, 4],
          },
          tooltip: false,
          legend: false,
        },
        {
          type: 'line',
          data: {
            type: 'inline',
            value: positiveTrendLine,
          },
          encode: {
            x: 'pc1',
            y: 'pc2',
          },
          style: {
            stroke: '#b91c1c',
            lineDash: [6, 4],
            lineWidth: 1.5,
          },
          tooltip: false,
          legend: false,
        },
        {
          type: 'line',
          data: {
            type: 'inline',
            value: negativeTrendLine,
          },
          encode: {
            x: 'pc1',
            y: 'pc2',
          },
          style: {
            stroke: '#15803d',
            lineDash: [6, 4],
            lineWidth: 1.5,
          },
          tooltip: false,
          legend: false,
        },
        {
          type: 'text',
          data: {
            type: 'inline',
            value: trendLabel,
          },
          encode: {
            x: 'pc1',
            y: 'pc2',
            text: 'label',
          },
          style: {
            fill: '#475569',
            fontSize: 10,
            fontWeight: 600,
            dx: 6,
            dy: -6,
          },
          tooltip: false,
          legend: false,
        },
        {
          type: 'point',
          data: {
            type: 'inline',
            value: regularPoints,
          },
          encode: {
            x: 'pc1',
            y: 'pc2',
            color: 'transitionCluster',
            size: 'carbonIntensity',
            shape: 'point',
          },
          style: {
            fill: (d: PCAScenarioDatum) => CLUSTER_COLOR_MAP[d.transitionCluster],
            fillOpacity: 0.95,
            stroke: '#f8fafc',
            lineWidth: 1.2,
          },
          tooltip: {
            title: (d: PCAScenarioDatum) => `${d.customer}（${d.industry}）`,
            items: [
              { field: 'transitionCluster', name: '风险分层' },
              { field: 'trendSignal', name: '结构特征' },
              { field: 'pc1', name: 'PC1' },
              { field: 'pc2', name: 'PC2' },
              { field: 'esgLabel', name: 'ESG 综合分' },
              { field: 'carbonLabel', name: '碳强度（tCO2/营收百万）' },
            ],
          },
        },
        {
          type: 'point',
          data: {
            type: 'inline',
            value: outlierPoints,
          },
          encode: {
            x: 'pc1',
            y: 'pc2',
            color: 'transitionCluster',
            size: 'carbonIntensity',
            shape: 'point',
          },
          style: {
            fill: (d: PCAScenarioDatum) => CLUSTER_COLOR_MAP[d.transitionCluster],
            fillOpacity: 1,
            stroke: '#111827',
            lineWidth: 2.4,
          },
          labels: [
            {
              text: (d: PCAScenarioDatum) => `${d.customer}`,
              fill: '#0f172a',
              fontSize: 10,
              fontWeight: 700,
              dy: -11,
            },
          ],
          tooltip: {
            title: (d: PCAScenarioDatum) => `${d.customer}（${d.industry}）`,
            items: [
              { field: 'transitionCluster', name: '风险分层' },
              { field: 'trendSignal', name: '结构特征' },
              { field: 'pc1', name: 'PC1' },
              { field: 'pc2', name: 'PC2' },
              { field: 'esgLabel', name: 'ESG 综合分' },
              { field: 'carbonLabel', name: '碳强度（tCO2/营收百万）' },
            ],
          },
        },
      ],
      interaction: [{ type: 'elementHighlight', background: true }],
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '350px' }} />;
}
