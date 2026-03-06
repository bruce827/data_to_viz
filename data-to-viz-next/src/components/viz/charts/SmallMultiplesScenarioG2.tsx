'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { Chart } from '@antv/g2';

type ProvinceNplRaw = {
  month: string;
  province: string;
  nplRatio: number;
  nplBalanceCny100m: number;
};

type ProvinceNplDatum = ProvinceNplRaw & {
  nplLabel: string;
  balanceLabel: string;
};

// 数据源：docs/catenum-deep-research-report.md（SMUL / chart-combo-mcat-mnum-small-multiples）
const scenarioRawData: ProvinceNplRaw[] = [
  { month: '2025-10', province: '广东', nplRatio: 0.012, nplBalanceCny100m: 380 },
  { month: '2025-11', province: '广东', nplRatio: 0.0122, nplBalanceCny100m: 385 },
  { month: '2025-12', province: '广东', nplRatio: 0.0124, nplBalanceCny100m: 392 },
  { month: '2025-10', province: '河南', nplRatio: 0.018, nplBalanceCny100m: 260 },
  { month: '2025-11', province: '河南', nplRatio: 0.0188, nplBalanceCny100m: 270 },
  { month: '2025-12', province: '河南', nplRatio: 0.0195, nplBalanceCny100m: 282 },
  { month: '2025-10', province: '江苏', nplRatio: 0.0112, nplBalanceCny100m: 248 },
  { month: '2025-11', province: '江苏', nplRatio: 0.0111, nplBalanceCny100m: 246 },
  { month: '2025-12', province: '江苏', nplRatio: 0.0113, nplBalanceCny100m: 250 },
  { month: '2025-10', province: '四川', nplRatio: 0.0168, nplBalanceCny100m: 212 },
  { month: '2025-11', province: '四川', nplRatio: 0.0176, nplBalanceCny100m: 224 },
  { month: '2025-12', province: '四川', nplRatio: 0.0184, nplBalanceCny100m: 236 },
  { month: '2025-10', province: '浙江', nplRatio: 0.0128, nplBalanceCny100m: 206 },
  { month: '2025-11', province: '浙江', nplRatio: 0.0125, nplBalanceCny100m: 202 },
  { month: '2025-12', province: '浙江', nplRatio: 0.0123, nplBalanceCny100m: 198 },
  { month: '2025-10', province: '山东', nplRatio: 0.0148, nplBalanceCny100m: 214 },
  { month: '2025-11', province: '山东', nplRatio: 0.0154, nplBalanceCny100m: 223 },
  { month: '2025-12', province: '山东', nplRatio: 0.0161, nplBalanceCny100m: 235 },
];

const scenarioData: ProvinceNplDatum[] = scenarioRawData.map((row) => ({
  ...row,
  nplLabel: `${(row.nplRatio * 100).toFixed(2)}%`,
  balanceLabel: `${row.nplBalanceCny100m.toFixed(0)} 亿元`,
}));

const MONTH_ORDER = ['2025-10', '2025-11', '2025-12'];
const PROVINCES = Array.from(new Set(scenarioData.map((d) => d.province)));
const DATA_BY_PROVINCE = PROVINCES.reduce<Record<string, ProvinceNplDatum[]>>((acc, province) => {
  acc[province] = scenarioData.filter((d) => d.province === province);
  return acc;
}, {});

export function SmallMultiplesProvinceNplScenarioG2() {
  const provinces = useMemo(() => PROVINCES, []);
  const dataByProvince = useMemo(() => DATA_BY_PROVINCE, []);
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>(
    PROVINCES.reduce<Record<string, HTMLDivElement | null>>((acc, province) => {
      acc[province] = null;
      return acc;
    }, {}),
  );

  const [yMin, yMax] = useMemo(() => {
    const values = scenarioData.map((d) => d.nplRatio);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = Math.max((max - min) * 0.15, 0.0006);
    return [Math.max(0, min - padding), max + padding];
  }, []);

  useEffect(() => {
    const charts: Chart[] = [];
    let disposed = false;
    let frameId = 0;

    const mountCharts = () => {
      if (disposed) return;
      const ready = provinces.every((province) => {
        const el = panelRefs.current[province];
        return !!el && el.clientWidth > 0 && el.clientHeight > 0;
      });

      if (!ready) {
        frameId = window.requestAnimationFrame(mountCharts);
        return;
      }

      provinces.forEach((province) => {
        const container = panelRefs.current[province];
        if (!container) return;
        container.innerHTML = '';

        const chart = new Chart({
          container,
          autoFit: true,
          height: container.clientHeight || 140,
          paddingLeft: 36,
          paddingRight: 12,
          paddingTop: 10,
          paddingBottom: 26,
        });

        chart
          .line()
          .data(dataByProvince[province])
          .encode('x', 'month')
          .encode('y', 'nplRatio')
          .scale('x', { domain: MONTH_ORDER })
          .scale('y', { min: yMin, max: yMax })
          .style('stroke', '#2563eb')
          .style('lineWidth', 2.2)
          .tooltip({
            title: (d: ProvinceNplDatum) => `${d.province}｜${d.month}`,
            items: [
              { field: 'nplLabel', name: 'NPL率（不良贷款率）' },
              { field: 'balanceLabel', name: '不良余额' },
            ],
          });

        chart
          .point()
          .data(dataByProvince[province])
          .encode('x', 'month')
          .encode('y', 'nplRatio')
          .style('fill', '#2563eb')
          .style('stroke', '#ffffff')
          .style('lineWidth', 1)
          .style('r', 3.2)
          .tooltip(false);

        chart.axis('x', {
          title: false,
          labelAutoRotate: false,
          labelFontSize: 10,
        });
        chart.axis('y', {
          title: false,
          labelFormatter: (value: string) => `${(Number(value) * 100).toFixed(2)}%`,
          labelFontSize: 10,
          gridLineDash: [2, 2],
        });
        chart.legend(false);
        chart.interaction('tooltip', { shared: true });

        void chart.render();
        charts.push(chart);
      });
    };

    frameId = window.requestAnimationFrame(mountCharts);

    return () => {
      disposed = true;
      if (frameId) window.cancelAnimationFrame(frameId);
      charts.forEach((chart) => chart.destroy());
    };
  }, [provinces, dataByProvince, yMin, yMax]);

  return (
    <div className="w-full">
      <div className="mb-2 text-xs text-slate-600">
        指标：NPL率（不良贷款率）月度走势；同一纵轴范围便于跨省比较
      </div>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: provinces.length >= 3 ? 'repeat(3, minmax(0, 1fr))' : 'repeat(2, minmax(0, 1fr))' }}
      >
        {provinces.map((province) => (
          <div key={province} className="rounded-md border border-slate-200 bg-white p-2">
            <div className="pb-1 text-xs font-semibold text-slate-700">{province}</div>
            <div
              ref={(node) => {
                panelRefs.current[province] = node;
              }}
              className="h-[150px] w-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
