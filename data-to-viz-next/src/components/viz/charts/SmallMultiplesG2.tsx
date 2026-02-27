'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { Chart } from '@antv/g2';
import smallMultiplesData from './demoData/SmallMultiplesG2.json';

const METRIC_COLORS: Record<string, string> = {
  销售额: '#2563eb',
  利润: '#16a34a',
};

const REGIONS = ['华东', '华南', '华北', '西南'];

export function SmallMultiplesG2() {
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({
    华东: null,
    华南: null,
    华北: null,
    西南: null,
  });

  const dataByRegion = useMemo(() => {
    return REGIONS.reduce<Record<string, typeof smallMultiplesData>>((acc, region) => {
      acc[region] = smallMultiplesData.filter((d) => d.region === region);
      return acc;
    }, {});
  }, []);

  useEffect(() => {
    const charts: Chart[] = [];

    REGIONS.forEach((region) => {
      const container = panelRefs.current[region];
      if (!container) return;

      const chart = new Chart({
        container,
        autoFit: true,
        height: 128,
        paddingLeft: 28,
        paddingRight: 12,
        paddingTop: 12,
        paddingBottom: 20,
      });

      chart.options({
        type: 'line',
        data: {
          type: 'inline',
          value: dataByRegion[region],
        },
        encode: {
          x: 'month',
          y: 'value',
          color: 'metric',
          shape: 'metric',
        },
        scale: {
          y: { nice: true },
          color: { domain: ['销售额', '利润'], range: ['#2563eb', '#16a34a'] },
        },
        axis: {
          x: {
            tick: false,
            labelFontSize: 10,
            title: false,
          },
          y: {
            gridLineDash: [2, 2],
            labelFontSize: 10,
            title: false,
          },
        },
        style: {
          lineWidth: 2,
        },
        legend: false,
        tooltip: {
          items: ['region', 'month', 'metric', 'value'],
        },
      });

      chart.point().encode('x', 'month').encode('y', 'value').encode('color', 'metric').style({
        r: 2.5,
      });

      chart.render();
      charts.push(chart);
    });

    return () => {
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
