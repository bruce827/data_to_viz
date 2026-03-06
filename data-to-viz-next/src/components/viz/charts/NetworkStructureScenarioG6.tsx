'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { Graph } from '@antv/g6';

type EdgeRaw = {
  as_of: string;
  source: string;
  target: string;
  relation: '股权控制' | '担保' | '互保';
  exposure_cny_100m: number;
};

type NodeKind = '集团' | '子公司' | '供应商' | '项目公司';

type NodeStyleDatum = {
  data?: {
    label?: string;
    kind?: NodeKind;
    size?: number;
  };
};

type EdgeStyleDatum = {
  data?: {
    relation?: EdgeRaw['relation'];
    exposure_cny_100m?: number;
  };
};

// 数据源：docs/catenum-deep-research-report.md（NETW / chart-structure-network-network）
const rawEdges: EdgeRaw[] = [
  { as_of: '2025-12-31', source: '集团A', target: '子公司A1', relation: '股权控制', exposure_cny_100m: 0 },
  { as_of: '2025-12-31', source: '集团A', target: '子公司A2', relation: '股权控制', exposure_cny_100m: 0 },
  { as_of: '2025-12-31', source: '子公司A1', target: '供应商S1', relation: '担保', exposure_cny_100m: 8.5 },
  { as_of: '2025-12-31', source: '子公司A2', target: '供应商S1', relation: '担保', exposure_cny_100m: 6.0 },
  { as_of: '2025-12-31', source: '供应商S1', target: '供应商S2', relation: '互保', exposure_cny_100m: 3.2 },
  { as_of: '2025-12-31', source: '供应商S2', target: '项目公司P1', relation: '担保', exposure_cny_100m: 4.1 },
];

const nodeColorMap: Record<NodeKind, string> = {
  集团: '#1d4ed8',
  子公司: '#2563eb',
  供应商: '#0ea5a4',
  项目公司: '#ef4444',
};

const edgeColorMap: Record<EdgeRaw['relation'], string> = {
  股权控制: '#64748b',
  担保: '#2563eb',
  互保: '#f59e0b',
};

function getNodeKind(name: string): NodeKind {
  if (name.startsWith('集团')) return '集团';
  if (name.startsWith('子公司')) return '子公司';
  if (name.startsWith('供应商')) return '供应商';
  return '项目公司';
}

function calcNodeSize(totalExposure: number) {
  const min = 0;
  const max = 14.5;
  return 24 + ((totalExposure - min) / (max - min)) * 22;
}

export function NetworkStructureGuaranteeScenarioG6() {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);

  const graphData = useMemo(() => {
    const nodeSet = new Set<string>();
    const exposureByNode = new Map<string, number>();

    rawEdges.forEach((edge) => {
      nodeSet.add(edge.source);
      nodeSet.add(edge.target);
      exposureByNode.set(edge.source, (exposureByNode.get(edge.source) || 0) + edge.exposure_cny_100m);
      exposureByNode.set(edge.target, (exposureByNode.get(edge.target) || 0) + edge.exposure_cny_100m);
    });

    const nodes = Array.from(nodeSet).map((name) => {
      const exposure = exposureByNode.get(name) || 0;
      return {
        id: name,
        data: {
          label: name,
          kind: getNodeKind(name),
          size: calcNodeSize(exposure),
        },
      };
    });

    const edges = rawEdges.map((edge) => ({
      source: edge.source,
      target: edge.target,
      data: {
        relation: edge.relation,
        exposure_cny_100m: edge.exposure_cny_100m,
      },
    }));

    return { nodes, edges };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const mountEl = document.createElement('div');
    mountEl.style.width = '100%';
    mountEl.style.height = '100%';
    containerRef.current.appendChild(mountEl);

    let disposed = false;
    let rendered = false;
    let destroyed = false;

    const graph = new Graph({
      container: mountEl,
      data: graphData,
      padding: 20,
      autoFit: { type: 'view' },
      layout: {
        type: 'force',
        preventOverlap: true,
        gravity: 0.28,
        linkDistance: 135,
      },
      node: {
        type: 'circle',
        style: {
          size: (d: NodeStyleDatum) => d.data?.size ?? 28,
          fill: (d: NodeStyleDatum) => {
            const kind = d.data?.kind || '子公司';
            return nodeColorMap[kind];
          },
          stroke: '#ffffff',
          lineWidth: 1.6,
          labelText: (d: NodeStyleDatum) => d.data?.label || '',
          labelPlacement: 'bottom',
          labelFill: '#0f172a',
          labelFontSize: 12,
          labelFontWeight: 700,
          labelOffsetY: 8,
        },
      },
      edge: {
        type: 'line',
        style: {
          stroke: (d: EdgeStyleDatum) =>
            edgeColorMap[(d.data?.relation as EdgeRaw['relation']) || '担保'],
          lineWidth: (d: EdgeStyleDatum) => {
            const exposure = d.data?.exposure_cny_100m ?? 0;
            return exposure > 0 ? 1.5 + exposure * 0.45 : 1.8;
          },
          strokeOpacity: 0.7,
          lineDash: (d: EdgeStyleDatum) => (d.data?.relation === '股权控制' ? [5, 4] : []),
          targetArrow: true,
          labelText: (d: EdgeStyleDatum) => {
            const relation = d.data?.relation || '';
            const exposure = d.data?.exposure_cny_100m ?? 0;
            if (relation === '股权控制') return '股权控制';
            if (exposure < 4) return '';
            return `${relation} ${exposure.toFixed(1)}亿元`;
          },
          labelFill: '#334155',
          labelFontSize: 11,
          labelFontWeight: 600,
        },
      },
      behaviors: ['drag-canvas', 'zoom-canvas', 'drag-element'],
      animation: true,
    });

    graphRef.current = graph;

    const safeDestroy = () => {
      if (destroyed) return;
      destroyed = true;
      try {
        graph.stopLayout();
      } catch {
        // ignore
      }
      try {
        graph.destroy();
      } catch {
        // ignore
      }
      if (mountEl.parentNode) {
        mountEl.parentNode.removeChild(mountEl);
      }
      if (graphRef.current === graph) {
        graphRef.current = null;
      }
    };

    graph
      .render()
      .then(() => {
        rendered = true;
        if (disposed) safeDestroy();
      })
      .catch(() => {
        if (disposed) safeDestroy();
      });

    return () => {
      disposed = true;
      if (rendered) safeDestroy();
    };
  }, [graphData]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-blue-700" />
          <span>集团/子公司节点</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-teal-500" />
          <span>供应商节点</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-red-500" />
          <span>项目公司节点</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-0.5 w-6 bg-slate-500" />
          <span>股权控制（虚线）</span>
        </div>
      </div>
      <div ref={containerRef} style={{ width: '100%', height: '470px' }} />
    </div>
  );
}
