'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useRef } from 'react';
import { Text } from '@antv/g';
import { BaseTransform, ExtensionCategory, Graph, register, treeToGraphData } from '@antv/g6';

const FISHBONE_DATA = {
  id: 'Product Profitability\nBelow Expectations',
  children: [
    {
      id: 'Problem Description',
      children: [
        { id: 'Brand Sales Volume' },
        { id: 'Market Capacity' },
        { id: 'Brand Market Share' },
        { id: 'Total Contribution Margin' },
      ],
    },
    {
      id: 'Brand Positioning',
      children: [{ id: 'Packaging' }, { id: 'Brand Name' }, { id: 'Selling Price' }, { id: 'Product Specifications' }],
    },
    {
      id: 'Distribution Channels',
      children: [{ id: 'Region' }, { id: 'Channel' }, { id: 'Customer Type' }, { id: 'Sales Personnel Coverage' }],
    },
    {
      id: 'Market Awareness',
      children: [
        { id: 'Regional Weighting' },
        { id: 'Media Mix' },
        { id: 'Advertising Investment' },
        { id: 'Quality Perception' },
      ],
    },
    {
      id: 'Trial Purchase',
      children: [
        { id: 'In-store Display' },
        { id: 'Promotion Type' },
        { id: 'Timing of Promotion' },
        { id: 'Supply Assurance' },
      ],
    },
    {
      id: 'Repeat Purchase',
      children: [
        { id: 'Consumer Profile' },
        { id: 'Usage Occasion' },
        { id: 'Frequency of Use' },
        { id: 'Returns Due to Product Issues' },
      ],
    },
  ],
};

let textShape: Text | null = null;
let transformRegistered = false;

type TextMeasureStyle = {
  text: string;
  fontSize: number;
  fontWeight?: number | 'bold' | 'normal' | 'bolder' | 'lighter';
  fontFamily?: string;
};

const measureText = (style: TextMeasureStyle) => {
  if (!textShape) textShape = new Text({ style });
  textShape.attr(style);
  return textShape.getBBox().width;
};

class AssignColorByBranch extends BaseTransform {
  static defaultOptions = {
    colors: ['#1783FF', '#F08F56', '#D580FF', '#00C9C9', '#7863FF', '#DB9D0D', '#60C42D', '#FF80CA', '#2491B3', '#17C76F'],
  };

  constructor(context: any, options: any) {
    super(context, Object.assign({}, AssignColorByBranch.defaultOptions, options));
  }

  beforeDraw(input: any) {
    const nodes = this.context.model.getNodeData();
    if (nodes.length === 0) return input;

    let colorIndex = 0;
    const dfs = (nodeId: string, color?: string) => {
      const node = nodes.find((datum: any) => datum.id === nodeId);
      if (!node) return;

      node.style ||= {};
      node.style.color = color || this.options.colors[colorIndex++ % this.options.colors.length];
      const nextColor = typeof node.style?.color === 'string' ? node.style.color : undefined;
      node.children?.forEach((childId: string) => dfs(childId, nextColor));
    };

    nodes.filter((node: any) => node.depth === 1).forEach((rootNode: any) => dfs(rootNode.id));
    return input;
  }
}

class ArrangeEdgeZIndex extends BaseTransform {
  beforeDraw(input: any) {
    const { model } = this.context;
    const { nodes, edges } = model.getData();

    const oneLevelNodes = nodes.filter((node: any) => node.depth === 1);
    const oneLevelNodeIds = oneLevelNodes.map((node: any) => node.id);

    edges.forEach((edge: any) => {
      if (!oneLevelNodeIds.includes(edge.target)) return;
      edge.style ||= {};
      edge.style.zIndex = oneLevelNodes.length - oneLevelNodes.findIndex((node: any) => node.id === edge.target);
    });

    return input;
  }
}

function ensureTransformsRegistered() {
  if (transformRegistered) return;
  register(ExtensionCategory.TRANSFORM, 'assign-color-by-branch', AssignColorByBranch);
  register(ExtensionCategory.TRANSFORM, 'arrange-edge-z-index', ArrangeEdgeZIndex);
  transformRegistered = true;
}

function getNodeSize(id: string, depth: number) {
  const FONT_FAMILY = 'system-ui, sans-serif';
  if (depth === 0) {
    return [measureText({ text: id, fontSize: 24, fontWeight: 'bold', fontFamily: FONT_FAMILY }) + 80, 90];
  }
  if (depth === 1) {
    return [measureText({ text: id, fontSize: 18, fontFamily: FONT_FAMILY }) + 50, 42];
  }
  return [2, 30];
}

export function FishboneG6() {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = '';

    ensureTransformsRegistered();

    let disposed = false;
    let rendered = false;
    let destroyed = false;
    const mountNode = document.createElement('div');
    mountNode.style.width = '100%';
    mountNode.style.height = '100%';
    container.appendChild(mountNode);

    const graph = new Graph({
      container: mountNode,
      autoFit: 'view',
      padding: 30,
      data: treeToGraphData(FISHBONE_DATA as any),
      node: {
        type: 'rect',
        style: (d: any) => {
          const depth = d.depth ?? 0;
          const style: any = {
            radius: 8,
            size: getNodeSize(d.id, depth),
            labelText: d.id,
            labelPlacement: 'left',
            labelFontFamily: 'Gill Sans',
          };

          if (depth === 0) {
            Object.assign(style, {
              fill: '#EFF0F0',
              labelFill: '#262626',
              labelFontWeight: 'bold',
              labelFontSize: 24,
              labelOffsetY: 3,
              labelPlacement: 'center',
              labelLineHeight: 32,
            });
          } else if (depth === 1) {
            Object.assign(style, {
              labelFontSize: 18,
              labelFill: '#252525',
              labelFillOpacity: 0.9,
              labelOffsetY: 5,
              labelPlacement: 'center',
              labelFontWeight: 600,
              fill: d.style?.color,
              fillOpacity: 0.6,
              lineWidth: 2,
              stroke: '#252525',
            });
          } else {
            Object.assign(style, {
              fill: 'transparent',
              labelFontSize: 16,
              labelFill: '#262626',
            });
          }

          return style;
        },
      },
      edge: {
        type: 'polyline',
        style: {
          lineWidth: 3,
          stroke: '#252525',
        },
      },
      layout: {
        type: 'fishbone',
        direction: 'RL',
        hGap: 40,
        vGap: 60,
        getRibSep: (node: any) => (node.depth === 0 ? 0 : -50),
      },
      behaviors: ['zoom-canvas', 'drag-canvas'],
      transforms: ['assign-color-by-branch', 'arrange-edge-z-index'],
      animation: false,
    });

    graphRef.current = graph;

    const safeDestroy = () => {
      if (destroyed || graphRef.current !== graph) return;
      destroyed = true;
      try {
        graph.destroy();
      } catch {
        // ignore
      }
      graphRef.current = null;
      if (mountNode.parentNode === container) {
        container.removeChild(mountNode);
      }
    };

    const renderPromise = graph
      .render()
      .then(() => {
        rendered = true;
        if (disposed) safeDestroy();
      })
      .catch((error: unknown) => {
        if (!disposed) {
          console.error(error);
        }
        if (disposed) safeDestroy();
      });

    return () => {
      disposed = true;
      if (rendered) {
        safeDestroy();
      } else {
        void renderPromise.finally(() => {
          safeDestroy();
        });
      }
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '420px' }} />;
}
