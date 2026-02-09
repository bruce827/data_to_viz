'use client';

import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import dendrogramData from './demoData/DendrogramG2.json';

/**
 * 手动计算树形布局的简单算法
 * 目标：将嵌套 JSON 转为带 x, y 坐标的节点和连线
 */
function layoutTree(data: any) {
  const nodes: any[] = [];
  const links: any[] = [];
  let leafCount = 0;

  // 1. 递归计算位置
  function traverse(node: any, depth: number) {
    if (!node.children || node.children.length === 0) {
      // 叶子节点：x 均匀分布，y 为深度
      const x = leafCount++;
      const y = depth;
      const result = { ...node, x, y };
      nodes.push(result);
      return result;
    }

    // 内部节点：y 为深度，x 为子节点 x 的平均值
    const childNodes = node.children.map((c: any) => traverse(c, depth + 1));
    const x = childNodes.reduce((acc: number, c: any) => acc + c.x, 0) / childNodes.length;
    const y = depth;
    const result = { ...node, x, y };
    
    nodes.push(result);
    
    // 生成连线数据 (从父到子)
    childNodes.forEach((c: any) => {
      links.push({
        sourceX: x,
        sourceY: y,
        targetX: c.x,
        targetY: c.y,
        name: c.name
      });
    });

    return result;
  }

  traverse(data, 0);
  return { nodes, links };
}

export function DendrogramG2() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 300,
      paddingTop: 20,
      paddingBottom: 40,
    });

    // 计算布局
    const { nodes, links } = layoutTree(dendrogramData);

    chart.options({
      type: 'view',
      children: [
        // 1. 绘制连线 (使用 link 标记)
        {
          type: 'link',
          data: links,
          encode: {
            x: ['sourceX', 'targetX'],
            y: ['sourceY', 'targetY'],
          },
          style: {
            stroke: '#94a3b8',
            lineWidth: 1.5,
          },
          tooltip: false
        },
        // 2. 绘制节点 (使用 point 标记)
        {
          type: 'point',
          data: nodes,
          encode: {
            x: 'x',
            y: 'y',
            color: 'name',
            size: 6,
          },
          style: {
            fillOpacity: 1,
            stroke: '#fff',
            lineWidth: 1
          },
          tooltip: {
            items: [{ field: 'name', name: '节点' }]
          }
        },
        // 3. 绘制文字 (只给叶子节点画文字，避免重叠)
        {
          type: 'text',
          data: nodes.filter(n => !n.children),
          encode: {
            x: 'x',
            y: 'y',
            text: 'name',
          },
          style: {
            fontSize: 10,
            textAlign: 'center',
            dy: 15,
          }
        }
      ],
      // 隐藏轴，因为树形图的坐标轴没有物理意义
      axis: false,
    });

    chart.render();

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '300px' }} />;
}
