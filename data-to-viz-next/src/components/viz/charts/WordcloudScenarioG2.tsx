'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type RiskLevel = '高' | '中' | '低';

type ComplaintWordRaw = {
  keyword: string;
  complaintCount: number;
  avgResolutionDays: number;
  severityScore: number;
  estimatedLossCny: number;
  riskLevel: RiskLevel;
  asOf: string;
};

type ComplaintWordDatum = ComplaintWordRaw & {
  weightedHotness: number;
  complaintLabel: string;
  avgResolutionLabel: string;
  severityLabel: string;
  lossLabel: string;
  weightedLabel: string;
};

// 数据源：docs/cate-deep-research-report.md（chart-wordcloud）
const scenarioRawData: ComplaintWordRaw[] = [
  { keyword: '限额/验证码', complaintCount: 860, avgResolutionDays: 2.6, severityScore: 4.2, estimatedLossCny: 1800000, riskLevel: '高', asOf: '2025-12-31' },
  { keyword: '转账失败', complaintCount: 740, avgResolutionDays: 2.2, severityScore: 4.0, estimatedLossCny: 1200000, riskLevel: '高', asOf: '2025-12-31' },
  { keyword: '存量房贷利率调整', complaintCount: 630, avgResolutionDays: 4.8, severityScore: 4.6, estimatedLossCny: 700000, riskLevel: '高', asOf: '2025-12-31' },
  { keyword: '提前还款/还款计划', complaintCount: 510, avgResolutionDays: 3.1, severityScore: 3.4, estimatedLossCny: 500000, riskLevel: '中', asOf: '2025-12-31' },
  { keyword: '信用卡分期退订', complaintCount: 420, avgResolutionDays: 5.2, severityScore: 3.7, estimatedLossCny: 400000, riskLevel: '中', asOf: '2025-12-31' },
  { keyword: '反诈拦截误伤', complaintCount: 395, avgResolutionDays: 6.5, severityScore: 4.8, estimatedLossCny: 2600000, riskLevel: '中', asOf: '2025-12-31' },
  { keyword: '开户/实名校验', complaintCount: 360, avgResolutionDays: 2.9, severityScore: 3.2, estimatedLossCny: 300000, riskLevel: '中', asOf: '2025-12-31' },
  { keyword: '理财净值波动', complaintCount: 330, avgResolutionDays: 7.8, severityScore: 3.9, estimatedLossCny: 900000, riskLevel: '中', asOf: '2025-12-31' },
  { keyword: '跨行到账延迟', complaintCount: 220, avgResolutionDays: 1.9, severityScore: 2.6, estimatedLossCny: 150000, riskLevel: '低', asOf: '2025-12-31' },
  { keyword: 'APP闪退', complaintCount: 210, avgResolutionDays: 1.4, severityScore: 2.1, estimatedLossCny: 50000, riskLevel: '低', asOf: '2025-12-31' },
  { keyword: '人脸识别失败', complaintCount: 180, avgResolutionDays: 2.0, severityScore: 2.4, estimatedLossCny: 80000, riskLevel: '低', asOf: '2025-12-31' },
  { keyword: '客服排队', complaintCount: 160, avgResolutionDays: 3.6, severityScore: 2.9, estimatedLossCny: 120000, riskLevel: '低', asOf: '2025-12-31' },
];

const scenarioData: ComplaintWordDatum[] = scenarioRawData.map((row) => {
  const weightedHotness = Math.round(row.complaintCount * row.severityScore);
  return {
    ...row,
    weightedHotness,
    complaintLabel: `${row.complaintCount.toLocaleString()} 单`,
    avgResolutionLabel: `${row.avgResolutionDays.toFixed(1)} 天`,
    severityLabel: `${row.severityScore.toFixed(1)} / 5`,
    lossLabel: `${row.estimatedLossCny.toLocaleString()} 元`,
    weightedLabel: weightedHotness.toLocaleString(),
  };
});

export function WordcloudComplaintScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 380,
      paddingTop: 46,
      paddingRight: 20,
      paddingBottom: 20,
      paddingLeft: 20,
    });

    chart.options({
      type: 'wordCloud',
      data: {
        type: 'inline',
        value: scenarioData,
      },
      encode: {
        text: 'keyword',
        value: 'weightedHotness',
        color: 'riskLevel',
      },
      scale: {
        color: {
          domain: ['高', '中', '低'],
          range: ['#dc2626', '#f59e0b', '#2563eb'],
        },
      },
      style: {
        fontFamily: 'PingFang SC, Microsoft YaHei, sans-serif',
        fontWeight: 600,
      },
      layout: {
        fontSize: [14, 62],
        rotate: () => 0,
        spiral: 'archimedean',
        padding: 3,
      },
      legend: {
        color: {
          title: '风险等级',
          position: 'top',
          cols: 3,
          offsetY: -8,
        },
      },
      tooltip: {
        title: (d: ComplaintWordDatum) => `${d.keyword}（${d.asOf}）`,
        items: [
          { field: 'riskLevel', name: '风险等级' },
          { field: 'complaintLabel', name: '投诉量' },
          { field: 'severityLabel', name: '严重度' },
          { field: 'avgResolutionLabel', name: '平均结案天数' },
          { field: 'lossLabel', name: '估算损失' },
          { field: 'weightedLabel', name: '加权热度（投诉量×严重度）' },
        ],
      },
      interaction: [{ type: 'elementHighlight' }],
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '380px' }} />;
}
