'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { Graph } from '@antv/g6';

type GroupNodeRaw = {
  id: string;
  entityType: string;
  internalRating: string;
  eadYi: number;
};

type GroupEdgeRaw = {
  source: string;
  target: string;
  relation: string;
  guaranteeYi: number;
};

type G6NodeData = {
  label: string;
  entityType: string;
  internalRating: string;
  eadYi: number;
  riskLevel: '低风险' | '中风险' | '高风险';
  size: number;
};

type NodeStyleDatum = {
  data?: {
    label?: string;
    entityType?: string;
    internalRating?: string;
    eadYi?: number;
    riskLevel?: G6NodeData['riskLevel'];
    size?: number;
  };
};

type EdgeStyleDatum = {
  data?: {
    relation?: string;
    guaranteeYi?: number;
  };
};

const rawNodes: GroupNodeRaw[] = [
  { id: 'GroupA', entityType: '集团母公司', internalRating: 'BBB+', eadYi: 180 },
  { id: 'A-RealEstate', entityType: '子公司-地产', internalRating: 'BB', eadYi: 95 },
  { id: 'A-Construction', entityType: '子公司-建筑', internalRating: 'BB+', eadYi: 70 },
  { id: 'A-PropertyMgmt', entityType: '子公司-物业', internalRating: 'BBB', eadYi: 25 },
  { id: 'A-Logistics', entityType: '子公司-物流', internalRating: 'BBB', eadYi: 40 },
  { id: 'A-FinanceLease', entityType: '子公司-融资租赁', internalRating: 'BBB-', eadYi: 60 },
  { id: 'Core_SOE_Counterparty', entityType: '核心客户-央国企', internalRating: 'A', eadYi: 120 },
];

const rawEdges: GroupEdgeRaw[] = [
  { source: 'GroupA', target: 'A-RealEstate', relation: '担保', guaranteeYi: 60 },
  { source: 'GroupA', target: 'A-Construction', relation: '担保', guaranteeYi: 45 },
  { source: 'A-Construction', target: 'A-RealEstate', relation: '互保', guaranteeYi: 25 },
  { source: 'A-PropertyMgmt', target: 'A-RealEstate', relation: '保证金质押担保', guaranteeYi: 8 },
  { source: 'A-Logistics', target: 'A-Construction', relation: '互保', guaranteeYi: 12 },
  { source: 'A-FinanceLease', target: 'A-Logistics', relation: '回购/差额补足', guaranteeYi: 20 },
  { source: 'Core_SOE_Counterparty', target: 'A-Construction', relation: '应收账款确权', guaranteeYi: 30 },
];

const nameMap: Record<string, string> = {
  GroupA: '集团A母公司',
  'A-RealEstate': 'A地产',
  'A-Construction': 'A建筑',
  'A-PropertyMgmt': 'A物业',
  'A-Logistics': 'A物流',
  'A-FinanceLease': 'A融资租赁',
  Core_SOE_Counterparty: '核心央国企客户',
};

const riskColorMap: Record<G6NodeData['riskLevel'], string> = {
  低风险: '#16a34a',
  中风险: '#2563eb',
  高风险: '#ef4444',
};

const relationColorMap: Record<string, string> = {
  担保: '#2563eb',
  互保: '#f59e0b',
  保证金质押担保: '#0ea5a4',
  '回购/差额补足': '#8b5cf6',
  应收账款确权: '#16a34a',
};

function toRiskLevel(internalRating: string): G6NodeData['riskLevel'] {
  if (internalRating.startsWith('A')) return '低风险';
  if (internalRating.startsWith('BBB')) return '中风险';
  return '高风险';
}

function nodeSizeByEad(eadYi: number) {
  const min = 25;
  const max = 180;
  return 26 + ((eadYi - min) / (max - min)) * 30;
}

export function NetworkGuaranteeScenarioG6() {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);

  const graphData = useMemo(
    () => ({
      nodes: rawNodes.map((n) => ({
        id: n.id,
        data: {
          label: nameMap[n.id] || n.id,
          entityType: n.entityType,
          internalRating: n.internalRating,
          eadYi: n.eadYi,
          riskLevel: toRiskLevel(n.internalRating),
          size: nodeSizeByEad(n.eadYi),
        },
      })),
      edges: rawEdges.map((e) => ({
        source: e.source,
        target: e.target,
        data: {
          relation: e.relation,
          guaranteeYi: e.guaranteeYi,
        },
      })),
    }),
    [],
  );

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
      padding: 16,
      autoFit: {
        type: 'view',
      },
      layout: {
        type: 'force',
        preventOverlap: true,
        gravity: 0.2,
        linkDistance: 140,
      },
      node: {
        type: 'circle',
        style: {
          size: (d: NodeStyleDatum) => d.data?.size ?? 28,
          fill: (d: NodeStyleDatum) => {
            const level = d.data?.riskLevel;
            return level ? riskColorMap[level] : '#94a3b8';
          },
          stroke: '#ffffff',
          lineWidth: 1.6,
          labelText: (d: NodeStyleDatum) => d.data?.label ?? '',
          labelPlacement: 'bottom',
          labelFill: '#0f172a',
          labelFontWeight: 700,
          labelFontSize: 12,
          labelOffsetY: 8,
        },
      },
      edge: {
        type: 'line',
        style: {
          stroke: (d: EdgeStyleDatum) =>
            (d.data?.relation && relationColorMap[d.data.relation]) || '#94a3b8',
          strokeOpacity: 0.62,
          lineWidth: (d: EdgeStyleDatum) => Math.max(1.5, (d.data?.guaranteeYi ?? 8) / 9),
          targetArrow: true,
          labelText: (d: EdgeStyleDatum) => {
            const relation = d.data?.relation || '';
            const guaranteeYi = d.data?.guaranteeYi || 0;
            if (guaranteeYi < 25) return '';
            return `${relation} ${guaranteeYi}亿元`;
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
          <span className="inline-block h-3 w-3 rounded-full bg-red-500" />
          <span>高风险评级（BB 段）</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-blue-600" />
          <span>中风险评级（BBB 段）</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-green-600" />
          <span>低风险评级（A 段）</span>
        </div>
      </div>
      <div ref={containerRef} style={{ width: '100%', height: '460px' }} />
    </div>
  );
}
