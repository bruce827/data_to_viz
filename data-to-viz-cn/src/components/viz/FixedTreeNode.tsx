'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface NodeData {
  id: string;
  label: string;
  group: string;
  x: number;
  y: number;
  cx: number;
  cy: number;
}

interface FixedTreeNodeProps {
  node: NodeData;
  onClick: (nodeId: string) => void;
}

export const FixedTreeNode: React.FC<FixedTreeNodeProps> = ({ node, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  // 坐标修正：SVG 提取的是 matrix 的左上角，我们希望中心对齐
  // 假设图标大小 50x50 (原图缩放后)
  // 原 extracted_nodes_v2.json 里已经有了 cx, cy，我们优先用那个
  
  return (
    <g
      transform={`translate(${node.x},${node.y})`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(node.id)}
      style={{ cursor: 'pointer' }}
    >
      {/* 节点外圈光晕 */}
      <AnimatePresence>
        {isHovered && (
          <motion.circle
            cx={48} cy={48} // 相对坐标中心
            initial={{ r: 30, opacity: 0 }}
            animate={{ r: 60, opacity: 0.2 }}
            exit={{ r: 30, opacity: 0 }}
            fill="#69b3a2"
          />
        )}
      </AnimatePresence>

      {/* 核心图标 (这里暂时用圆形代替，后续换 SVG) */}
      <circle
        cx={48} cy={48}
        r={30}
        fill="white"
        stroke="#69b3a2"
        strokeWidth={2}
        className="transition-colors duration-200"
      />
      
      {/* 占位图标文字 */}
       <text
        x={48} y={48}
        dy=".3em"
        textAnchor="middle"
        className="text-[10px] fill-gray-400 font-bold pointer-events-none uppercase"
      >
        {node.id.slice(0, 3)}
      </text>


      {/* 底部文本标签 */}
      <text
        x={48} y={90}
        textAnchor="middle"
        className="text-xs font-bold fill-slate-700 uppercase"
        style={{ textShadow: "0 1px 2px white" }}
      >
        {node.label}
      </text>

      {/* 悬停预览 (简易版) */}
      <AnimatePresence>
        {isHovered && (
          <foreignObject x={60} y={-20} width={200} height={120} style={{ overflow: 'visible', pointerEvents: 'none', zIndex: 50 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: -10 }}
              className="bg-white rounded-lg shadow-xl border border-slate-100 p-3"
            >
              <h4 className="text-sm font-bold text-slate-700 mb-1">{node.label}</h4>
              <p className="text-xs text-slate-500">点击查看 {node.id} 详情</p>
              <div className="mt-2 h-10 bg-slate-100 rounded flex items-center justify-center text-[10px] text-slate-400">
                ECharts Preview
              </div>
            </motion.div>
          </foreignObject>
        )}
      </AnimatePresence>
    </g>
  );
};
