'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

type LtvPieRaw = {
  ltvBand: string;
  loanAmountYi: number;
  share: number;
  asOf: string;
};

type LtvPieDatum = LtvPieRaw & {
  shareLabel: string;
  amountLabel: string;
  segmentLabel: string;
};

// 数据源：docs/cate-deep-research-report.md（chart-pie）
const scenarioRawData: LtvPieRaw[] = [
  { ltvBand: '<=50%', loanAmountYi: 1800, share: 0.1528, asOf: '2025-09-30' },
  { ltvBand: '50-60%', loanAmountYi: 2200, share: 0.18669, asOf: '2025-09-30' },
  { ltvBand: '60-70%', loanAmountYi: 3100, share: 0.26272, asOf: '2025-09-30' },
  { ltvBand: '70-80%', loanAmountYi: 2600, share: 0.22034, asOf: '2025-09-30' },
  { ltvBand: '80-90%', loanAmountYi: 1400, share: 0.11865, asOf: '2025-09-30' },
  { ltvBand: '90-100%', loanAmountYi: 600, share: 0.05089, asOf: '2025-09-30' },
  { ltvBand: '100%+', loanAmountYi: 80, share: 0.00678, asOf: '2025-09-30' },
];

const scenarioData: LtvPieDatum[] = scenarioRawData.map((row) => {
  const shareLabel = `${(row.share * 100).toFixed(2)}%`;
  return {
    ...row,
    shareLabel,
    amountLabel: `${row.loanAmountYi.toLocaleString()} 亿元`,
    segmentLabel: `${row.ltvBand} ${shareLabel}`,
  };
});

export function PieLtvScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 380,
      paddingTop: 46,
      paddingRight: 160,
      paddingBottom: 24,
      paddingLeft: 24,
    });

    chart
      .interval()
      .data(scenarioData)
      .transform({ type: 'stackY' })
      .coordinate({ type: 'theta', innerRadius: 0.5, outerRadius: 0.82 })
      .encode('y', 'share')
      .encode('color', 'ltvBand')
      .scale('color', {
        domain: ['<=50%', '50-60%', '60-70%', '70-80%', '80-90%', '90-100%', '100%+'],
        range: ['#2563eb', '#3b82f6', '#60a5fa', '#f59e0b', '#fb923c', '#ef4444', '#b91c1c'],
      })
      .style('stroke', '#ffffff')
      .style('lineWidth', 2)
      .legend('color', {
        title: 'LTV（贷款价值比）分段',
        position: 'right',
      })
      .axis(false)
      .label({
        text: 'segmentLabel',
        fontSize: 11,
        fontWeight: 600,
        fill: '#0f172a',
        connector: true,
        connectorStroke: '#94a3b8',
      })
      .tooltip({
        title: (d: LtvPieDatum) => `LTV 分段：${d.ltvBand}（${d.asOf}）`,
        items: [
          { field: 'shareLabel', name: '占比' },
          { field: 'amountLabel', name: '按揭投放金额' },
        ],
      });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '380px' }} />;
}
