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

export function Scatter3DG2() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<DestroyableChart | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let isMounted = true;

    const renderChart = async () => {
      // 1. 动态加载所有相关依赖
      const [
        { CameraType },
        { Renderer: WebGLRenderer },
        { Plugin: ThreeDPlugin, DirectionalLight },
        { Plugin: ControlPlugin },
        { Runtime, corelib, extend },
        { threedlib }
      ] = await Promise.all([
        import('@antv/g'),
        import('@antv/g-webgl'),
        import('@antv/g-plugin-3d'),
        import('@antv/g-plugin-control'),
        import('@antv/g2'),
        import('@antv/g2-extension-3d')
      ]);

      if (!isMounted || !containerRef.current) return;

      // 2. 准备渲染器
      const renderer = new WebGLRenderer();
      renderer.registerPlugin(new ThreeDPlugin());
      renderer.registerPlugin(new ControlPlugin());

      // 3. 自定义 Chart 类
      const Chart = extend(Runtime, { ...corelib(), ...threedlib() });

      // 4. 初始化图表 (移除深色背景配置)
      const chart = new Chart({
        container: containerRef.current,
        renderer,
        depth: 400,
        autoFit: true,
        height: 350,
      });

      // 5. 模拟数据
      const data = Array.from({ length: 80 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        z: Math.random() * 100,
        Origin: Math.random() > 0.5 ? 'A' : 'B'
      }));

      // 6. 配置图表 (增强坐标轴视觉)
      chart
        .point3D()
        .data(data)
        .encode('x', 'x')
        .encode('y', 'y')
        .encode('z', 'z')
        .encode('color', 'Origin')
        .encode('shape', 'cube')
        .coordinate({ type: 'cartesian3D' })
        .scale('x', { nice: true })
        .scale('y', { nice: true })
        .scale('z', { nice: true })
        .legend(false)
        .axis('x', { 
          gridLineWidth: 1, 
          gridStroke: '#e2e8f0', 
          title: '维度 X',
          titleFill: '#64748b'
        })
        .axis('y', { 
          gridLineWidth: 1, 
          gridStroke: '#e2e8f0', 
          title: '维度 Y',
          titleFill: '#64748b',
          titleBillboardRotation: -Math.PI / 2
        })
        .axis('z', { 
          gridLineWidth: 1, 
          gridStroke: '#e2e8f0', 
          title: '维度 Z',
          titleFill: '#64748b'
        });

      // 7. 渲染并设置相机与光照
      try {
        await chart.render();
        
        if (!isMounted) {
          chart.destroy();
          return;
        }

        const { canvas } = chart.getContext();
        const typedCanvas = canvas as CanvasLike | undefined;
        const camera = typedCanvas?.getCamera?.();
        
        if (camera) {
          camera.setPerspective(0.1, 5000, 45, containerRef.current.clientWidth / 350);
          camera.setType(CameraType.ORBITING);
        }

        // 添加平行光 (针对浅色背景微调强度)
        const light = new DirectionalLight({
          style: {
            intensity: 3,
            fill: 'white',
            direction: [-1, -1, 1],
          },
        });
        typedCanvas?.appendChild(light);
        
        chartRef.current = chart as DestroyableChart;
      } catch (e) {
        console.error("G2 3D Render Error:", e);
      }
    };

    renderChart();

    return () => {
      isMounted = false;
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full bg-white rounded-lg border border-slate-100 overflow-hidden">
      <div ref={containerRef} style={{ width: '100%', height: '350px' }} />
    </div>
  );
}
