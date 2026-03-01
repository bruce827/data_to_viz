'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useRef } from 'react';
import { Bug } from 'lucide-react';
import {
  ExtensionCategory,
  Graph,
  HoverActivate,
  idOf,
  register,
} from '@antv/g6';
import { ReactNode } from '@antv/g6-extension-react';
import dagData from './demoData/DagFlowG6.json';

const ACTIVE_COLOR = '#f6c523';
const COLOR_MAP: Record<string, string> = {
  'pre-inspection': '#3fc1c9',
  problem: '#8983f3',
  inspection: '#f48db4',
  solution: '#ffaa64',
};

let extensionRegistered = false;

type GraphNodeDatum = {
  data?: {
    text?: string;
    type?: string;
  };
  states?: string[];
};

type GraphEdgeDatum = {
  data?: {
    text?: string;
  };
};

class HoverElement extends HoverActivate {
  getActiveIds(event: any) {
    const { model, graph } = this.context;
    const { targetType, target } = event;
    const targetId = target.id;

    const ids = [targetId];
    if (targetType === 'edge') {
      const edge = model.getEdgeDatum(targetId);
      ids.push(edge.source, edge.target);
    } else if (targetType === 'node') {
      ids.push(...model.getRelatedEdgesData(targetId).map(idOf));
    }

    graph.frontElement(ids);
    return ids;
  }
}

function ensureExtensionsRegistered() {
  if (extensionRegistered) return;
  register(ExtensionCategory.NODE, 'dag-react', ReactNode);
  register(ExtensionCategory.BEHAVIOR, 'dag-hover-element', HoverElement);
  extensionRegistered = true;
}

function NodeCard({ data }: { data: GraphNodeDatum }) {
  const { text = '', type = 'inspection' } = data.data || {};
  const isHovered = data.states?.includes('active');
  const isSelected = data.states?.includes('selected');
  const color = isHovered ? ACTIVE_COLOR : COLOR_MAP[type] || '#3fc1c9';

  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    background: color,
    border: `3px solid ${isSelected ? '#0f172a' : color}`,
    borderRadius: 16,
    cursor: 'pointer',
    boxSizing: 'border-box',
  };

  return (
    <div style={containerStyle}>
      <div
        style={{
          padding: '8px 16px',
          textAlign: 'center',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {type === 'problem' && (
          <Bug
            size={22}
            color="#ffffff"
            strokeWidth={2.5}
            style={{ marginBottom: 8 }}
          />
        )}
        <span style={{ color: '#ffffff', fontWeight: 700, fontSize: 16, lineHeight: 1.25 }}>{text}</span>
      </div>
    </div>
  );
}

export function DagFlowG6() {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    ensureExtensionsRegistered();

    let disposed = false;
    const mountNode = document.createElement('div');
    mountNode.style.width = '100%';
    mountNode.style.height = '100%';
    containerRef.current.appendChild(mountNode);

    const graph = new Graph({
      container: mountNode,
      data: dagData as any,
      autoFit: 'view',
      node: {
        type: 'dag-react',
        style: (d: GraphNodeDatum) => {
          const sizeMap: Record<string, [number, number]> = {
            'pre-inspection': [240, 120],
            problem: [200, 120],
            inspection: [330, 100],
            solution: [200, 120],
          };
          const nodeType = d.data?.type || 'inspection';
          const size = sizeMap[nodeType] || [200, 80];

          return {
            component: <NodeCard data={d} />,
            ports: [{ placement: 'top' }, { placement: 'bottom' }],
            size,
            dx: -size[0] / 2,
            dy: -size[1] / 2,
          };
        },
        state: {
          active: { halo: false },
          selected: { halo: false },
        },
      },
      edge: {
        type: 'polyline',
        style: {
          lineWidth: 3,
          radius: 20,
          stroke: '#8b9baf',
          endArrow: true,
          labelText: (d: GraphEdgeDatum) => d.data?.text || '',
          labelFill: '#8b9baf',
          labelFontWeight: 700,
          labelBackground: true,
          labelBackgroundFill: '#f8f8f8',
          labelBackgroundOpacity: 1,
          labelBackgroundLineWidth: 3,
          labelBackgroundStroke: '#8b9baf',
          labelPadding: [1, 10],
          labelBackgroundRadius: 4,
          router: { type: 'orth' },
        },
        state: {
          active: {
            stroke: ACTIVE_COLOR,
            labelBackgroundStroke: ACTIVE_COLOR,
            halo: false,
          },
        },
      },
      layout: {
        type: 'antv-dagre',
        ranksep: 50,
        nodesep: 40,
      },
      behaviors: ['zoom-canvas', 'drag-canvas', 'dag-hover-element', 'click-select'],
      animation: true,
    });

    graphRef.current = graph;

    const safeDestroy = () => {
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
      if (graphRef.current === graph) graphRef.current = null;
    };

    graph
      .render()
      .then(() => {
        if (disposed) safeDestroy();
      })
      .catch(() => {
        if (disposed) return;
      });

    return () => {
      disposed = true;
      safeDestroy();
      if (mountNode.parentNode) {
        mountNode.parentNode.removeChild(mountNode);
      }
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '360px' }} />;
}
