'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type TreemapScenarioRow = {
  industry: string;
  subIndustry: string;
  eadYi: number;
  rwaYi: number;
  pd: number;
  lgd: number;
  expectedLossYi: number;
  asOf: string;
};

type TreemapHierarchyNode = {
  name: string;
  eadYi: number;
  rwaYi: number;
  pd: number;
  lgd: number;
  expectedLossYi: number;
  riskDensity: number;
  rwaEadRatio: number;
  riskBand: '高风险密度' | '中风险密度' | '低风险密度';
  asOf: string;
  children?: TreemapHierarchyNode[];
};

type TreemapDatum = {
  path?: string[];
  x0?: number;
  x1?: number;
  data?: TreemapHierarchyNode;
};

// 数据源：docs/cate-deep-research-report.md（chart-treemap）
const scenarioRows: TreemapScenarioRow[] = [
  { industry: '制造业', subIndustry: '高端装备', eadYi: 820, rwaYi: 520, pd: 0.018, lgd: 0.35, expectedLossYi: 5.17, asOf: '2025-12-31' },
  { industry: '制造业', subIndustry: '汽车零部件', eadYi: 610, rwaYi: 380, pd: 0.022, lgd: 0.38, expectedLossYi: 5.1, asOf: '2025-12-31' },
  { industry: '制造业', subIndustry: '化工/新材料', eadYi: 540, rwaYi: 410, pd: 0.028, lgd: 0.45, expectedLossYi: 6.8, asOf: '2025-12-31' },
  { industry: '基建', subIndustry: '市政公用', eadYi: 760, rwaYi: 390, pd: 0.016, lgd: 0.3, expectedLossYi: 3.65, asOf: '2025-12-31' },
  { industry: '基建', subIndustry: '交通运输', eadYi: 680, rwaYi: 360, pd: 0.019, lgd: 0.32, expectedLossYi: 4.13, asOf: '2025-12-31' },
  { industry: '房地产', subIndustry: '住宅开发', eadYi: 420, rwaYi: 610, pd: 0.045, lgd: 0.55, expectedLossYi: 10.4, asOf: '2025-12-31' },
  { industry: '房地产', subIndustry: '商业地产', eadYi: 260, rwaYi: 390, pd: 0.052, lgd: 0.6, expectedLossYi: 8.11, asOf: '2025-12-31' },
  { industry: '能源', subIndustry: '新能源', eadYi: 590, rwaYi: 340, pd: 0.021, lgd: 0.33, expectedLossYi: 4.09, asOf: '2025-12-31' },
  { industry: '能源', subIndustry: '传统能源', eadYi: 310, rwaYi: 260, pd: 0.03, lgd: 0.4, expectedLossYi: 3.72, asOf: '2025-12-31' },
  { industry: '批发零售', subIndustry: '连锁零售', eadYi: 370, rwaYi: 280, pd: 0.026, lgd: 0.42, expectedLossYi: 4.04, asOf: '2025-12-31' },
  { industry: '科技', subIndustry: '软件服务', eadYi: 450, rwaYi: 240, pd: 0.02, lgd: 0.35, expectedLossYi: 3.15, asOf: '2025-12-31' },
  { industry: '普惠', subIndustry: '小微工商户', eadYi: 520, rwaYi: 420, pd: 0.034, lgd: 0.5, expectedLossYi: 8.84, asOf: '2025-12-31' },
];

function getRiskBand(riskDensity: number): TreemapHierarchyNode['riskBand'] {
  if (riskDensity >= 0.018) return '高风险密度';
  if (riskDensity >= 0.010) return '中风险密度';
  return '低风险密度';
}

function buildHierarchy(rows: TreemapScenarioRow[]): TreemapHierarchyNode {
  const byIndustry = new Map<string, TreemapScenarioRow[]>();

  rows.forEach((row) => {
    const list = byIndustry.get(row.industry);
    if (list) {
      list.push(row);
    } else {
      byIndustry.set(row.industry, [row]);
    }
  });

  const industryNodes: TreemapHierarchyNode[] = Array.from(byIndustry.entries()).map(
    ([industry, group]) => {
      const eadYi = group.reduce((sum, row) => sum + row.eadYi, 0);
      const rwaYi = group.reduce((sum, row) => sum + row.rwaYi, 0);
      const expectedLossYi = group.reduce((sum, row) => sum + row.expectedLossYi, 0);
      const pd = group.reduce((sum, row) => sum + row.pd * row.eadYi, 0) / eadYi;
      const lgd = group.reduce((sum, row) => sum + row.lgd * row.eadYi, 0) / eadYi;
      const riskDensity = expectedLossYi / eadYi;
      const rwaEadRatio = rwaYi / eadYi;

      const children: TreemapHierarchyNode[] = group.map((row) => {
        const childRiskDensity = row.expectedLossYi / row.eadYi;
        return {
          name: row.subIndustry,
          eadYi: row.eadYi,
          rwaYi: row.rwaYi,
          pd: row.pd,
          lgd: row.lgd,
          expectedLossYi: row.expectedLossYi,
          riskDensity: childRiskDensity,
          rwaEadRatio: row.rwaYi / row.eadYi,
          riskBand: getRiskBand(childRiskDensity),
          asOf: row.asOf,
        };
      });

      return {
        name: industry,
        eadYi,
        rwaYi,
        pd,
        lgd,
        expectedLossYi,
        riskDensity,
        rwaEadRatio,
        riskBand: getRiskBand(riskDensity),
        asOf: group[0]?.asOf ?? '',
        children,
      };
    },
  );

  const rootEadYi = industryNodes.reduce((sum, node) => sum + node.eadYi, 0);
  const rootRwaYi = industryNodes.reduce((sum, node) => sum + node.rwaYi, 0);
  const rootExpectedLossYi = industryNodes.reduce((sum, node) => sum + node.expectedLossYi, 0);

  return {
    name: '对公授信组合',
    eadYi: rootEadYi,
    rwaYi: rootRwaYi,
    pd: industryNodes.reduce((sum, node) => sum + node.pd * node.eadYi, 0) / rootEadYi,
    lgd: industryNodes.reduce((sum, node) => sum + node.lgd * node.eadYi, 0) / rootEadYi,
    expectedLossYi: rootExpectedLossYi,
    riskDensity: rootExpectedLossYi / rootEadYi,
    rwaEadRatio: rootRwaYi / rootEadYi,
    riskBand: getRiskBand(rootExpectedLossYi / rootEadYi),
    asOf: industryNodes[0]?.asOf ?? '',
    children: industryNodes,
  };
}

const treemapData = buildHierarchy(scenarioRows);

function formatYi(value: unknown) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return '-';
  return `${numeric.toFixed(2)} 亿元`;
}

function formatPercent(value: unknown) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return '-';
  return `${(numeric * 100).toFixed(2)}%`;
}

export function TreemapCorpExposureScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 420,
      paddingTop: 54,
      paddingRight: 20,
      paddingBottom: 16,
      paddingLeft: 16,
    });

    chart.options({
      type: 'treemap',
      data: { value: treemapData },
      layout: {
        tile: 'treemapSquarify',
        paddingInner: 2,
      },
      encode: {
        value: 'eadYi',
        color: (d: TreemapDatum) => d.data?.riskBand ?? '中风险密度',
      },
      scale: {
        color: {
          domain: ['高风险密度', '中风险密度', '低风险密度'],
          range: ['#dc2626', '#f59e0b', '#2563eb'],
        },
      },
      legend: {
        color: {
          title: '风险密度分层（EL/EAD）',
          position: 'top',
          cols: 3,
          offsetY: -8,
        },
      },
      style: {
        labelText: (d: TreemapDatum) => {
          const name = d.data?.name ?? '';
          const eadYi = d.data?.eadYi;
          const isLeaf = (d.path?.length ?? 0) >= 3;
          if (!isLeaf || typeof eadYi !== 'number') return name;
          return `${name}\nEAD ${eadYi.toFixed(0)}亿`;
        },
        labelPosition: 'top-left',
        labelDx: 4,
        labelDy: 4,
        labelWordWrap: true,
        labelMaxLines: 2,
        labelWordWrapWidth: (d: TreemapDatum) =>
          Math.max((d.x1 ?? 0) - (d.x0 ?? 0) - 8, 20),
        labelFill: '#ffffff',
        labelFontSize: 11,
        labelFontWeight: 700,
        labelLineHeight: 15,
      },
      tooltip: {
        title: (d: TreemapDatum) => `${d.data?.name ?? ''}（${d.data?.asOf ?? ''}）`,
        items: [
          {
            field: 'eadYi',
            name: 'EAD（风险暴露）',
            valueFormatter: (value: unknown) => formatYi(value),
          },
          {
            field: 'rwaYi',
            name: 'RWA（风险加权资产）',
            valueFormatter: (value: unknown) => formatYi(value),
          },
          {
            field: 'rwaEadRatio',
            name: 'RWA/EAD',
            valueFormatter: (value: unknown) => formatPercent(value),
          },
          {
            field: 'pd',
            name: 'PD（违约概率）',
            valueFormatter: (value: unknown) => formatPercent(value),
          },
          {
            field: 'lgd',
            name: 'LGD（违约损失率）',
            valueFormatter: (value: unknown) => formatPercent(value),
          },
          {
            field: 'expectedLossYi',
            name: 'EL（期望损失）',
            valueFormatter: (value: unknown) => formatYi(value),
          },
          {
            field: 'riskDensity',
            name: '风险密度（EL/EAD）',
            valueFormatter: (value: unknown) => formatPercent(value),
          },
          { field: 'riskBand', name: '风险分层' },
        ],
      },
      interaction: [{ type: 'elementHighlight' }],
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '420px' }} />;
}
