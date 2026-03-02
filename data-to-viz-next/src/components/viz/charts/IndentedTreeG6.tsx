/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
'use client';

import React, { useEffect, useRef } from 'react';
import { Text as GText, Rect } from '@antv/g';
import {
  Badge,
  BaseBehavior,
  BaseNode,
  CommonEvent,
  ExtensionCategory,
  Graph,
  NodeEvent,
  Polyline,
  iconfont,
  idOf,
  register,
  subStyleProps,
  treeToGraphData,
} from '@antv/g6';
import treeData from './demoData/IndentedTreeG6.json';

const ROOT_ID = 'Modeling Methods';

const COLORS = [
  '#5B8FF9',
  '#F6BD16',
  '#5AD8A6',
  '#945FB9',
  '#E86452',
  '#6DC8EC',
  '#FF99C3',
  '#1E9493',
  '#FF9845',
  '#5D7092',
];

const TREE_EVENT = {
  COLLAPSE_EXPAND: 'collapse-expand',
  ADD_CHILD: 'add-child',
};

let textShape: GText | null = null;
let extensionRegistered = false;

const measureText = (text: { text: string; fontSize: number }) => {
  if (!textShape) textShape = new GText({ style: text });
  textShape.attr(text);
  return textShape.getBBox().width;
};

class IndentedNode extends BaseNode {
  static defaultStyleProps = {
    ports: [
      { key: 'in', placement: 'right-bottom' },
      { key: 'out', placement: 'left-bottom' },
    ],
  };

  constructor(options: any) {
    options.style = { ...(options.style || {}), ...IndentedNode.defaultStyleProps };
    super(options);
  }

  get childrenData() {
    return this.context.model.getChildrenData(this.id);
  }

  getKeyStyle(attributes: any) {
    const [width, height] = this.getSize(attributes);
    const keyStyle = super.getKeyStyle(attributes);
    return {
      width,
      height,
      ...keyStyle,
      fill: 'transparent',
    };
  }

  drawKeyShape(attributes: any, container: any) {
    const keyStyle = this.getKeyStyle(attributes);
    return this.upsert('key', 'rect', keyStyle, container);
  }

  drawIconArea(attributes: any, container: any) {
    const [, h] = this.getSize(attributes);
    const iconAreaStyle = {
      fill: 'transparent',
      height: 30,
      width: 12,
      x: -6,
      y: h,
      zIndex: -1,
    };
    this.upsert('icon-area', Rect, iconAreaStyle, container);
  }

  forwardEvent(target: any, type: string, listener: (event: any) => void) {
    if (target && !Reflect.has(target, '__bind__')) {
      Reflect.set(target, '__bind__', true);
      target.addEventListener(type, listener);
    }
  }

  getCountStyle(attributes: any) {
    const { collapsed, color } = attributes;
    if (collapsed) {
      const [, height] = this.getSize(attributes);
      return {
        backgroundFill: color,
        cursor: 'pointer',
        fill: '#fff',
        fontSize: 8,
        padding: [0, 10],
        text: `${this.childrenData.length}`,
        textAlign: 'center',
        y: height + 8,
      };
    }
    return false;
  }

  drawCountShape(attributes: any, container: any) {
    const countStyle = this.getCountStyle(attributes);
    const btn = this.upsert('count', Badge, countStyle, container);
    this.forwardEvent(btn, CommonEvent.CLICK, (event) => {
      event.stopPropagation();
      this.context.graph.emit(TREE_EVENT.COLLAPSE_EXPAND, {
        id: this.id,
        collapsed: false,
      });
    });
  }

  isShowCollapse(attributes: any) {
    return !attributes.collapsed && this.childrenData.length > 0;
  }

  getCollapseStyle(attributes: any) {
    const { showIcon, color } = attributes;
    if (!this.isShowCollapse(attributes)) return false;
    const [, height] = this.getSize(attributes);
    return {
      visibility: showIcon ? 'visible' : 'hidden',
      backgroundFill: color,
      backgroundHeight: 12,
      backgroundWidth: 12,
      cursor: 'pointer',
      fill: '#fff',
      fontFamily: 'iconfont',
      fontSize: 8,
      text: '\ue6e4',
      textAlign: 'center',
      x: -1,
      y: height + 8,
    };
  }

  drawCollapseShape(attributes: any, container: any) {
    const iconStyle = this.getCollapseStyle(attributes);
    const btn = this.upsert('collapse-expand', Badge, iconStyle, container);
    this.forwardEvent(btn, CommonEvent.CLICK, (event) => {
      event.stopPropagation();
      this.context.graph.emit(TREE_EVENT.COLLAPSE_EXPAND, {
        id: this.id,
        collapsed: !attributes.collapsed,
      });
    });
  }

  getAddStyle(attributes: any) {
    const { collapsed, showIcon } = attributes;
    if (collapsed) return false;
    const [, height] = this.getSize(attributes);
    const color = '#ddd';
    const lineWidth = 1;
    return {
      visibility: showIcon ? 'visible' : 'hidden',
      backgroundFill: '#fff',
      backgroundHeight: 12,
      backgroundLineWidth: lineWidth,
      backgroundStroke: color,
      backgroundWidth: 12,
      cursor: 'pointer',
      fill: color,
      fontFamily: 'iconfont',
      text: '\ue664',
      textAlign: 'center',
      x: -1,
      y: height + (this.isShowCollapse(attributes) ? 22 : 8),
    };
  }

  drawAddShape(attributes: any, container: any) {
    const addStyle = this.getAddStyle(attributes);
    const btn = this.upsert('add', Badge, addStyle, container);
    this.forwardEvent(btn, CommonEvent.CLICK, (event) => {
      event.stopPropagation();
      this.context.graph.emit(TREE_EVENT.ADD_CHILD, { id: this.id });
    });
  }

  render(attributes = this.parsedAttributes, container = this) {
    super.render(attributes, container);
    this.drawCountShape(attributes, container);
    this.drawIconArea(attributes, container);
    this.drawCollapseShape(attributes, container);
    this.drawAddShape(attributes, container);
  }
}

class IndentedEdge extends Polyline {
  getControlPoints(attributes: any) {
    const [sourcePoint, targetPoint] = this.getEndpoints(attributes, false);
    const [sx] = sourcePoint;
    const [, ty] = targetPoint;
    return [[sx, ty]];
  }
}

class CollapseExpandTree extends BaseBehavior {
  private status = 'idle';

  constructor(context: any, options: any) {
    super(context, options);
    this.bindEvents();
  }

  update(options: any) {
    this.unbindEvents();
    super.update(options);
    this.bindEvents();
  }

  bindEvents() {
    const { graph } = this.context;
    graph.on(NodeEvent.POINTER_ENTER, this.showIcon);
    graph.on(NodeEvent.POINTER_LEAVE, this.hideIcon);
    graph.on(TREE_EVENT.COLLAPSE_EXPAND, this.onCollapseExpand);
    graph.on(TREE_EVENT.ADD_CHILD, this.addChild);
  }

  unbindEvents() {
    const { graph } = this.context;
    graph.off(NodeEvent.POINTER_ENTER, this.showIcon);
    graph.off(NodeEvent.POINTER_LEAVE, this.hideIcon);
    graph.off(TREE_EVENT.COLLAPSE_EXPAND, this.onCollapseExpand);
    graph.off(TREE_EVENT.ADD_CHILD, this.addChild);
  }

  showIcon = (event: any) => this.setIcon(event, true);

  hideIcon = (event: any) => this.setIcon(event, false);

  setIcon = (event: any, show: boolean) => {
    if (this.status !== 'idle') return;
    const id = event?.target?.id;
    if (!id) return;
    const { graph, element } = this.context;
    graph.updateNodeData([{ id, style: { showIcon: show } }]);
    element.draw({ animation: false, silence: true });
  };

  onCollapseExpand = async (event: any) => {
    this.status = 'busy';
    const { id, collapsed } = event;
    const { graph } = this.context;
    if (collapsed) await graph.collapseElement(id);
    else await graph.expandElement(id);
    this.status = 'idle';
  };

  addChild = (event: any) => {
    const onCreateChild =
      this.options?.onCreateChild ||
      (() => ({ id: `${Date.now()}`, style: { labelText: 'new node' } }));
    const { graph } = this.context;
    const datum = onCreateChild(event.id);
    graph.addNodeData([datum]);
    graph.addEdgeData([{ source: event.id, target: datum.id }]);
    const parent = graph.getNodeData(event.id);
    graph.updateNodeData([
      { id: event.id, children: [...(parent.children || []), datum.id], style: { collapsed: false } },
    ]);
    graph.render();
  };
}

class DragBranch extends BaseBehavior {
  private enable = true;

  private child?: any;

  private parent?: any;

  private shadow?: Rect;

  constructor(context: any, options: any) {
    super(context, options);
    this.bindEvents();
  }

  update(options: any) {
    this.unbindEvents();
    super.update(options);
    this.bindEvents();
  }

  bindEvents() {
    const { graph } = this.context;
    graph.on(NodeEvent.DRAG_START, this.onDragStart);
    graph.on(NodeEvent.DRAG, this.onDrag);
    graph.on(NodeEvent.DRAG_END, this.onDragEnd);
    graph.on(NodeEvent.DRAG_ENTER, this.onDragEnter);
    graph.on(NodeEvent.DRAG_LEAVE, this.onDragLeave);
  }

  unbindEvents() {
    const { graph } = this.context;
    graph.off(NodeEvent.DRAG_START, this.onDragStart);
    graph.off(NodeEvent.DRAG, this.onDrag);
    graph.off(NodeEvent.DRAG_END, this.onDragEnd);
    graph.off(NodeEvent.DRAG_ENTER, this.onDragEnter);
    graph.off(NodeEvent.DRAG_LEAVE, this.onDragLeave);
  }

  validate(event: any) {
    if (this.destroyed) return false;
    const enable = this.options?.enable || ((evt: any) => evt.target.id !== ROOT_ID);
    return typeof enable === 'function' ? enable(event) : !!enable;
  }

  createShadow(target: any) {
    const shadowStyle = subStyleProps(this.options, 'shadow');
    const positionStyle = target.getShape('label').getBBox();
    this.shadow = new Rect({
      style: {
        pointerEvents: 'none',
        fill: '#F3F9FF',
        fillOpacity: 0.5,
        stroke: '#1890FF',
        strokeOpacity: 0.9,
        lineDash: [5, 5],
        ...shadowStyle,
        ...positionStyle,
      },
    });
    this.context.canvas.appendChild(this.shadow);
  }

  moveShadow(offset: [number, number]) {
    if (!this.shadow) return;
    const [dx, dy] = offset;
    this.shadow.translate(dx, dy);
  }

  destroyShadow() {
    this.shadow?.remove();
    this.shadow = undefined;
  }

  onDragStart = (event: any) => {
    this.enable = this.validate(event);
    if (!this.enable) return;
    this.child = event.target;
    this.createShadow(event.target);
  };

  getDelta(event: any): [number, number] {
    const zoom = this.context.graph.getZoom();
    return [event.dx / zoom, event.dy / zoom];
  }

  onDrag = (event: any) => {
    if (!this.enable) return;
    this.moveShadow(this.getDelta(event));
  };

  onDragEnd = () => {
    this.destroyShadow();
    if (!this.child || !this.parent) return;

    const { graph } = this.context;
    const childId = this.child.id;
    const parentId = this.parent.id;
    const originalParent = graph.getParentData(childId, 'tree');

    if (idOf(originalParent) === parentId) return;

    const ancestors = graph.getAncestorsData(parentId, 'tree');
    if (ancestors.some((ancestor: any) => ancestor.id === childId)) return;

    const edges = graph
      .getEdgeData()
      .filter((edge: any) => edge.target === childId)
      .map(idOf);
    graph.removeEdgeData(edges);
    graph.updateNodeData([
      { id: idOf(originalParent), children: originalParent?.children?.filter((child: string) => child !== childId) },
    ]);
    const modifiedParent = graph.getNodeData(parentId);
    graph.updateNodeData([{ id: parentId, children: [...(modifiedParent.children || []), childId] }]);
    graph.addEdgeData([{ source: parentId, target: childId }]);
    graph.render();
  };

  onDragEnter = (event: any) => {
    const { graph, element } = this.context;
    const targetId = event.target.id;
    if (targetId === this.child?.id || targetId === ROOT_ID) {
      if (targetId === ROOT_ID) this.parent = event.target;
      return;
    }
    this.parent = event.target;
    graph.updateNodeData([{ id: targetId, states: ['selected'] }]);
    element.draw({ animation: false, silence: true });
  };

  onDragLeave = (event: any) => {
    const { graph, element } = this.context;
    const targetId = event.target.id;
    this.parent = undefined;
    graph.updateNodeData([{ id: targetId, states: [] }]);
    element.draw({ animation: false, silence: true });
  };
}

function ensureIconFont() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('g6-iconfont-style')) return;
  const style = document.createElement('style');
  style.id = 'g6-iconfont-style';
  style.innerHTML = `@import url('${iconfont.css}');`;
  document.head.appendChild(style);
}

function ensureExtensionsRegistered() {
  if (extensionRegistered) return;
  register(ExtensionCategory.NODE, 'indented', IndentedNode);
  register(ExtensionCategory.EDGE, 'indented', IndentedEdge);
  register(ExtensionCategory.BEHAVIOR, 'collapse-expand-tree', CollapseExpandTree);
  register(ExtensionCategory.BEHAVIOR, 'drag-branch', DragBranch);
  extensionRegistered = true;
}

export function IndentedTreeG6() {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);
  const CANVAS_HEIGHT = 980;
  const VIEWPORT_HEIGHT = 420;
  const GRAPH_SCALE = 1.12;

  useEffect(() => {
    if (!containerRef.current) return;
    const containerWidth = Math.max(containerRef.current.clientWidth, 320);

    ensureIconFont();
    ensureExtensionsRegistered();

    let disposed = false;
    let rendered = false;

    const graph = new Graph({
      container: containerRef.current,
      width: containerWidth,
      height: CANVAS_HEIGHT,
      data: treeToGraphData(treeData as any),
      node: {
        type: 'indented',
        style: {
          size: (d: any) => [measureText({ text: d.id, fontSize: 12 }) + 6, 20],
          labelBackground: (datum: any) => datum.id === ROOT_ID,
          labelBackgroundRadius: 0,
          labelBackgroundFill: '#576286',
          labelFill: (datum: any) => (datum.id === ROOT_ID ? '#fff' : '#666'),
          labelText: (d: any) => d.style?.labelText || d.id,
          labelTextAlign: (datum: any) => (datum.id === ROOT_ID ? 'center' : 'left'),
          labelTextBaseline: 'top',
          color: (datum: any) => {
            const depth = graph.getAncestorsData(datum.id, 'tree').length - 1;
            return COLORS[depth % COLORS.length] || '#576286';
          },
        },
        state: {
          selected: {
            lineWidth: 0,
            labelFill: '#40A8FF',
            labelBackground: true,
            labelFontWeight: 'normal',
            labelBackgroundFill: '#e8f7ff',
            labelBackgroundRadius: 10,
          },
        },
      },
      edge: {
        type: 'indented',
        style: {
          radius: 16,
          lineWidth: 2,
          sourcePort: 'out',
          targetPort: 'in',
          stroke: (datum: any) => {
            const depth = graph.getAncestorsData(datum.source, 'tree').length;
            return COLORS[depth % COLORS.length];
          },
        },
      },
      layout: {
        type: 'indented',
        direction: 'LR',
        isHorizontal: true,
        indent: 40,
        getHeight: () => 20,
        getVGap: () => 10,
      },
      behaviors: [
        'scroll-canvas',
        'drag-branch',
        'collapse-expand-tree',
        { type: 'click-select', enable: (event: any) => event.targetType === 'node' && event.target.id !== ROOT_ID },
      ],
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
      .then(async () => {
        rendered = true;
        if (!disposed) {
          try {
            await graph.zoomTo(GRAPH_SCALE, { duration: 0 }, [containerWidth / 2, 0]);
          } catch {
            // ignore
          }
        }
        if (disposed) safeDestroy();
      })
      .catch(() => {
        rendered = true;
        safeDestroy();
      });

    return () => {
      disposed = true;
      if (rendered) safeDestroy();
    };
  }, []);

  return (
    <div
      style={{
        width: '100%',
        height: `${VIEWPORT_HEIGHT}px`,
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: `${CANVAS_HEIGHT}px`,
        }}
      />
    </div>
  );
}
