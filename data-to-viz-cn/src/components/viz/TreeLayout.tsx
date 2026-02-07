'use client';

import React, { useMemo } from 'react';
import * as d3Hierarchy from 'd3-hierarchy';
import * as d3Shape from 'd3-shape';
import { decisionTreeData, TreeNode as TreeNodeType } from '@/data/tree-data';
import { TreeNode } from './TreeNode';

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 600;
const MARGIN = { top: 20, right: 120, bottom: 20, left: 120 };

export const TreeLayout = () => {
  // 1. 计算布局
  const root = useMemo(() => {
    const hierarchy = d3Hierarchy.hierarchy<TreeNodeType>(decisionTreeData);
    
    const treeLayout = d3Hierarchy.tree<TreeNodeType>()
      .size([
        CANVAS_HEIGHT - MARGIN.top - MARGIN.bottom,
        CANVAS_WIDTH - MARGIN.left - MARGIN.right
      ]);

    return treeLayout(hierarchy);
  }, []);

  // 2. 生成连线路径 (贝塞尔曲线)
  const generateLinkPath = (link: d3Hierarchy.HierarchyPointLink<TreeNodeType>) => {
    return d3Shape.linkHorizontal()
      .x((d: any) => d.y)
      .y((d: any) => d.x)(link as any) || "";
  };

  const handleNodeClick = (id: string) => {
    console.log("Clicked node:", id);
    // TODO: 实现聚焦逻辑或跳转
  };

  return (
    <div className="w-full h-full overflow-auto bg-slate-50 flex items-center justify-center">
      <svg width={CANVAS_WIDTH} height={CANVAS_HEIGHT} viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}>
        <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
          {/* 绘制连线 */}
          {root.links().map((link, i) => (
            <path
              key={`link-${i}`}
              d={generateLinkPath(link)}
              fill="none"
              stroke="#cbd5e1"
              strokeWidth={1.5}
              className="transition-colors duration-300 hover:stroke-blue-400"
            />
          ))}

          {/* 绘制节点 */}
          {root.descendants().map((node) => (
            <TreeNode 
              key={node.data.id} 
              node={node} 
              onClick={handleNodeClick} 
            />
          ))}
        </g>
      </svg>
    </div>
  );
};
