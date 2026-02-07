'use client';

import React from 'react';
import { FixedTreeNode, NodeData } from './FixedTreeNode';
import nodesData from '@/data/extracted_nodes_v2.json';

interface FixedLayoutTreeProps {
  group: string; 
}

// 原版 SVG viewBox="0 0 1508.3 1502.4"
const CANVAS_WIDTH = 1600;
const CANVAS_HEIGHT = 1600;

export const FixedLayoutTree: React.FC<FixedLayoutTreeProps> = ({ group }) => {
  // 过滤当前组的节点
  const activeNodes = (nodesData as NodeData[]).filter(n => n.group === group);

  const handleNodeClick = (id: string) => {
    console.log("Clicked node:", id);
    // TODO: 跳转到详情页
  };

  if (activeNodes.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-slate-400">
        该分支下暂无数据或数据提取不完整。
      </div>
    );
  }

  return (
    // 使用 cursor-grab 暗示可拖动（虽未实现拖动，但这是大图交互惯例）
    <div className="w-full h-full overflow-auto cursor-grab active:cursor-grabbing">
      <div className="min-w-[1000px] min-h-[1000px] flex items-center justify-center p-10">
        <svg 
          width={CANVAS_WIDTH} 
          height={CANVAS_HEIGHT} 
          viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
          className="bg-white/50 rounded-xl"
        >
          {/* 辅助网格 */}
          <defs>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* 节点层 */}
          {activeNodes.map((node, i) => (
            <FixedTreeNode 
              key={`${node.id}-${i}`} 
              node={node} 
              onClick={handleNodeClick} 
            />
          ))}
        </svg>
      </div>
    </div>
  );
};