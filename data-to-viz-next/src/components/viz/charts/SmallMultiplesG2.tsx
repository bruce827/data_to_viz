'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { Chart } from '@antv/g2';
import smallMultiplesData from './demoData/SmallMultiplesG2.json';

const METRIC_COLORS: Record<string, string> = {
  销售额: '#2563eb',
  利润: '#16a34a',
};

const REGIONS = ['华东', '华南', '华北', '西南'];
const MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月'];

type SmallMultiplesDatum = {
  region: string;
  month: string;
  metric: string;
  value: number;
};

export function SmallMultiplesG2() {
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({
    华东: null,
    华南: null,
    华北: null,
    西南: null,
  });

  const dataByRegion = useMemo(() => {
    return REGIONS.reduce<Record<string, SmallMultiplesDatum[]>>((acc, region) => {
      acc[region] = (smallMultiplesData as SmallMultiplesDatum[]).filter((d) => d.region === region);
      return acc;
    }, {});
  }, []);

  useEffect(() => {
    const charts: Chart[] = [];
    let disposed = false;
    let frameId = 0;

    const mountCharts = () => {
      if (disposed) return;
      const ready = REGIONS.every((region) => {
        const el = panelRefs.current[region];
        return !!el && el.clientWidth > 0 && el.clientHeight > 0;
      });
      if (!ready) {
        frameId = window.requestAnimationFrame(mountCharts);
        return;
      }

      REGIONS.forEach((region) => {
        const container = panelRefs.current[region];
        if (!container) return;
        container.innerHTML = '';

        const chart = new Chart({
          container,
          autoFit: true,
          height: container.clientHeight || 108,
          paddingLeft: 28,
          paddingRight: 12,
          paddingTop: 10,
          paddingBottom: 20,
        });

        chart
          .line()
          .data({
            type: 'inline',
            value: dataByRegion[region],
          })
          .encode('x', 'month')
          .encode('y', 'value')
          .encode('color', 'metric')
          .scale('x', { domain: MONTHS })
          .scale('y', { nice: true })
          .scale('color', {
            domain: ['销售额', '利润'],
            range: ['#2563eb', '#16a34a'],
          })
          .style('lineWidth', 2);

        chart
          .point()
          .data({
            type: 'inline',
            value: dataByRegion[region],
          })
          .encode('x', 'month')
          .encode('y', 'value')
          .encode('color', 'metric')
          .style('r', 2.5);

        chart.axis('x', {
          tick: false,
          labelAutoRotate: false,
          labelFontSize: 10,
          title: false,
        });
        chart.axis('y', {
          gridLineDash: [2, 2],
          labelFontSize: 10,
          title: false,
        });
        chart.legend('color', false);
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
  }, [dataByRegion]);

  return (
    <div className="w-full h-[300px]">
      <div className="mb-2 flex items-center gap-4 px-1 text-xs text-slate-600">
        {Object.entries(METRIC_COLORS).map(([metric, color]) => (
          <div key={metric} className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="font-medium">{metric}</span>
          </div>
        ))}
      </div>
      <div className="grid h-[268px] grid-cols-2 gap-2">
        {REGIONS.map((region) => (
          <div key={region} className="rounded-md border border-slate-200 bg-white p-1">
            <div className="px-1 pb-0.5 text-[11px] font-semibold text-slate-600">{region}</div>
            <div ref={(node) => { panelRefs.current[region] = node; }} className="h-[108px] w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
