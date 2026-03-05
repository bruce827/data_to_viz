'use client';

import React, { useEffect, useRef } from 'react';

type DestroyableChart = {
  destroy: () => void;
  getContext: () => { canvas?: unknown };
};

type CameraLike = {
  setPerspective: (near: number, far: number, fov: number, aspect: number) => void;
  setType: (type: unknown) => void;
};

type CanvasLike = {
  getCamera?: () => CameraLike | null;
  appendChild: (child: unknown) => void;
};

type CorporateRisk3DDatum = {
  customer: string;
  pd: number;
  lgd: number;
  ead: number;
  industry: string;
  riskLabel: string;
  pdLabel: string;
  lgdLabel: string;
  eadLabel: string;
};

// 数据源：docs/deep-research-report.md 中 chart-scatter3d 场景（示例数据）
const corporateRisk3DData: CorporateRisk3DDatum[] = [
  { customer: 'C01', pd: 1.8, lgd: 65, ead: 120, industry: '轻资产制造', riskLabel: '中低 PD + 高 LGD', pdLabel: '1.8%', lgdLabel: '65%', eadLabel: '120' },
  { customer: 'C02', pd: 3.5, lgd: 45, ead: 80, industry: '建工', riskLabel: '高 PD + 中 LGD', pdLabel: '3.5%', lgdLabel: '45%', eadLabel: '80' },
  { customer: 'C03', pd: 2.6, lgd: 72, ead: 60, industry: '房地产上下游', riskLabel: '中 PD + 极高 LGD', pdLabel: '2.6%', lgdLabel: '72%', eadLabel: '60' },
  { customer: 'C04', pd: 1.2, lgd: 30, ead: 150, industry: '公用事业', riskLabel: '低 PD + 低 LGD + 高 EAD', pdLabel: '1.2%', lgdLabel: '30%', eadLabel: '150' },
  { customer: 'C05', pd: 4.1, lgd: 60, ead: 40, industry: '商贸', riskLabel: '高 PD + 高 LGD', pdLabel: '4.1%', lgdLabel: '60%', eadLabel: '40' },
  { customer: 'C06', pd: 2.0, lgd: 40, ead: 110, industry: '科技服务', riskLabel: '中低 PD + 中 LGD', pdLabel: '2.0%', lgdLabel: '40%', eadLabel: '110' },
];

const INDUSTRY_DOMAIN = ['轻资产制造', '建工', '房地产上下游', '公用事业', '商贸', '科技服务'];
const INDUSTRY_COLORS = ['#3b82f6', '#06b6d4', '#ef4444', '#10b981', '#f97316', '#8b5cf6'];

export function Scatter3DRiskScenarioG2() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<DestroyableChart | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let disposed = false;

    const renderChart = async () => {
      const [
        { CameraType },
        { Renderer: WebGLRenderer },
        { Plugin: ThreeDPlugin, DirectionalLight },
        { Plugin: ControlPlugin },
        { Runtime, corelib, extend },
        { threedlib },
      ] = await Promise.all([
        import('@antv/g'),
        import('@antv/g-webgl'),
        import('@antv/g-plugin-3d'),
        import('@antv/g-plugin-control'),
        import('@antv/g2'),
        import('@antv/g2-extension-3d'),
      ]);

      if (disposed || !containerRef.current) return;

      const renderer = new WebGLRenderer();
      renderer.registerPlugin(new ThreeDPlugin());
      renderer.registerPlugin(new ControlPlugin());

      const Chart = extend(Runtime, { ...corelib(), ...threedlib() });

      const chart = new Chart({
        container: containerRef.current,
        renderer,
        depth: 420,
        autoFit: true,
        height: 360,
      });

      chart
        .point3D()
        .data(corporateRisk3DData)
        .encode('x', 'pd')
        .encode('y', 'lgd')
        .encode('z', 'ead')
        .encode('color', 'industry')
        .encode('shape', 'cube')
        .coordinate({ type: 'cartesian3D' })
        .scale('x', { domain: [1.0, 4.4], nice: true })
        .scale('y', { domain: [25, 75], nice: true })
        .scale('z', { domain: [35, 160], nice: true })
        .scale('color', {
          domain: [...INDUSTRY_DOMAIN],
          range: [...INDUSTRY_COLORS],
        })
        .style('fillOpacity', 0.95)
        .style('lineWidth', 0.6)
        .style('stroke', '#ffffff')
        .legend('color', {
          title: '行业',
          position: 'top',
        })
        .axis('x', {
          title: 'PD（%）',
          gridLineWidth: 1,
          gridStroke: '#e2e8f0',
          titleFill: '#475569',
        })
        .axis('y', {
          title: 'LGD（%）',
          gridLineWidth: 1,
          gridStroke: '#e2e8f0',
          titleFill: '#475569',
          titleBillboardRotation: -Math.PI / 2,
        })
        .axis('z', {
          title: 'EAD（亿元）',
          gridLineWidth: 1,
          gridStroke: '#e2e8f0',
          titleFill: '#475569',
        })
        .tooltip({
          title: (d: CorporateRisk3DDatum) => d.customer,
          items: [
            { field: 'industry', name: '行业' },
            { field: 'pdLabel', name: 'PD' },
            { field: 'lgdLabel', name: 'LGD' },
            { field: 'eadLabel', name: 'EAD（亿元）' },
            { field: 'riskLabel', name: '风险标签' },
          ],
        });

      try {
        await chart.render();
        if (disposed) {
          chart.destroy();
          return;
        }

        const { canvas } = chart.getContext();
        const typedCanvas = canvas as CanvasLike | undefined;
        const camera = typedCanvas?.getCamera?.();

        if (camera) {
          camera.setPerspective(0.1, 5000, 45, containerRef.current.clientWidth / 360);
          camera.setType(CameraType.ORBITING);
        }

        const light = new DirectionalLight({
          style: {
            intensity: 2.8,
            fill: 'white',
            direction: [-1, -1, 1],
          },
        });
        typedCanvas?.appendChild(light);

        chartRef.current = chart as DestroyableChart;
      } catch (error) {
        console.error('G2 3D Render Error (Scenario):', error);
      }
    };

    renderChart();

    return () => {
      disposed = true;
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full bg-white rounded-lg border border-slate-100 overflow-hidden">
      <div ref={containerRef} style={{ width: '100%', height: '360px' }} />
    </div>
  );
}
