'use client';

import React, { useState } from 'react';
import * as d3 from 'd3-hierarchy';
import { motion, AnimatePresence } from 'framer-motion';
import { TreeNode as TreeNodeType } from '@/data/tree-data';

// 引入 ECharts 组件（稍后实现，先用占位符）
// import MiniChart from './MiniChart'; 

interface TreeNodeProps {
  node: d3.HierarchyPointNode<TreeNodeType>;
  onClick: (nodeId: string) => void;
}

export const TreeNode: React.FC<TreeNodeProps> = ({ node, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { x, y, data } = node;
  const isLeaf = !node.children;

  return (
    <g
      transform={`translate(${y},${x})`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(data.id)}
      style={{ cursor: 'pointer' }}
    >
      {/* 节点外圈光晕 (Hover时显示) */}
      <AnimatePresence>
        {isHovered && (
          <motion.circle
            initial={{ r: 0, opacity: 0 }}
            animate={{ r: 20, opacity: 0.2 }}
            exit={{ r: 0, opacity: 0 }}
            fill="#3b82f6"
          />
        )}
      </AnimatePresence>

      {/* 核心节点点 */}
      <circle
        r={isLeaf ? 6 : 8}
        fill={isLeaf ? "#fff" : "#3b82f6"}
        stroke="#3b82f6"
        strokeWidth={2}
      />

      {/* 文本标签 */}
      <text
        dy=".31em"
        x={!node.children ? 12 : -12}
        textAnchor={!node.children ? "start" : "end"}
        className="text-xs font-medium fill-slate-700 select-none bg-white/80"
        style={{ textShadow: "0 1px 2px rgba(255,255,255,0.8)" }}
      >
        {data.label}
      </text>

      {/* 悬停预览 (仅叶子节点) */}
      {isLeaf && data.previewConfig && (
        <foreignObject x={20} y={-50} width={200} height={150} style={{ overflow: 'visible', pointerEvents: 'none' }}>
           <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: -10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -10 }}
                className="bg-white rounded-lg shadow-xl border border-slate-100 p-2 w-[180px] h-[120px] z-50 relative"
              >
                <div className="text-[10px] font-bold text-slate-500 mb-1 border-b pb-1">
                  {data.label} 预览
                </div>
                {/* 这里稍后放 <ReactECharts /> */}
                <div className="w-full h-[80px] bg-blue-50 flex items-center justify-center text-xs text-blue-400">
                  Mock Chart: {data.previewConfig.chartType}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </foreignObject>
      )}
    </g>
  );
};
