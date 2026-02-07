'use client';

import React, { useEffect, useRef } from 'react';
import { Graph } from '@antv/x6';
import { register } from '@antv/x6-react-shape';
import { NodeData } from './FixedTreeNode';
import nodesData from '@/data/extracted_nodes_v2.json';
import { numericEdges, numericBranchNodes } from '@/data/edges-config'; // 引入新配置
import { motion } from 'framer-motion';

// --- 自定义 React 节点 ---
const CustomNode = ({ node }: { node: any }) => {
  const data = node.getData();
  const [hover, setHover] = React.useState(false);
  const isBranch = data.type === 'branch';
  const isRoot = data.id === 'root';

  return (
    <div 
      className="relative flex flex-col items-center justify-center w-full h-full"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* 分支节点 (纯文字或简单的框) */}
      {isBranch && (
        <div className={`px-3 py-1 bg-white border-2 border-slate-800 text-slate-800 font-bold text-xs uppercase tracking-wider ${isRoot ? 'text-lg px-6 py-2 bg-slate-800 text-white' : ''}`}>
          {data.label}
        </div>
      )}

      {/* 叶子节点 (图表) */}
      {!isBranch && (
        <>
          {hover && (
            <motion.div 
              layoutId="glow"
              className="absolute w-[80px] h-[80px] bg-[#69b3a2]/30 rounded-full blur-md"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            />
          )}
          <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center bg-white z-10 transition-colors ${
            hover ? 'border-[#69b3a2]' : 'border-gray-300 text-gray-400'
          }`}>
            <span className="text-[10px] font-bold">{data.id.slice(0,2).toUpperCase()}</span>
          </div>
          <span className="mt-1 text-[10px] font-bold text-slate-700 bg-white/90 px-1 rounded z-10 whitespace-nowrap">
            {data.label}
          </span>
        </>
      )}
    </div>
  );
};

register({
  shape: 'custom-react-node',
  width: 100,
  height: 100,
  component: CustomNode,
});

interface AntVGraphProps {
  group: string;
}

export const AntVGraph: React.FC<AntVGraphProps> = ({ group }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const graph = new Graph({
      container: containerRef.current,
      background: { color: '#f8f9fa' },
      grid: { visible: true, type: 'dot', args: [{ color: '#ccc', thickness: 1 }] },
      panning: true,
      mousewheel: true,
      interacting: { nodeMovable: true },
      
      // --- 硬朗连线配置 ---
      connecting: {
        connector: {
          name: 'rounded', // 圆角折线
          args: { radius: 10 }, 
        },
        router: {
          name: 'manhattan', // 曼哈顿路由 (走直角)
          args: { 
            padding: 20,
            startDirections: ['bottom'], // 强制从下方引出
            endDirections: ['top', 'left', 'right'], // 从上方或左右进入
          },
        },
        anchor: 'center',
        connectionPoint: 'boundary',
      },
    });

    graphRef.current = graph;

    // --- 响应式监听 ---
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        // 只有当尺寸有效时才调整
        if (width > 0 && height > 0) {
            graph.resize(width, height);
            // Optional: Debounce zoomToFit if needed, but for now simple resize is key.
            // graph.zoomToFit({ padding: 20 }); 
        }
      }
    });
    resizeObserver.observe(containerRef.current);

    const nodes: any[] = [];
    const edges: any[] = [];
    const idMap = new Map<string, string>(); // 原始ID -> 唯一ID

    // 1. 加载中间节点 (Branches)
    if (group === 'num') {
      numericBranchNodes.forEach(branch => {
        nodes.push({
          id: branch.id,
          shape: 'custom-react-node',
          x: branch.x,
          y: branch.y,
          data: { ...branch, type: 'branch' },
          width: branch.id === 'root' ? 150 : 120, // 分支节点宽度大一点
          height: 50,
        });
        idMap.set(branch.id, branch.id);
      });
    }

    // 2. 加载图表节点 (Leaves)
    const rawNodes = (nodesData as NodeData[]).filter(n => n.group === group);
    
    // 解决 ID 重复问题: 为每个节点分配唯一 ID，并记录 "Type -> [UniqueID1, UniqueID2]" 的映射
    // 这样连线时，如果 Edge 说连到 "boxplot"，我们可以找到最近的那个 "boxplot_x"
    const typeToIds = new Map<string, string[]>();

    rawNodes.forEach(node => {
      let uniqueId = node.id;
      // 简单去重逻辑
      let counter = 1;
      while (idMap.has(uniqueId)) {
        uniqueId = `${node.id}_${counter++}`;
      }
      idMap.set(uniqueId, uniqueId); // 占位
      
      // 记录类型映射
      if (!typeToIds.has(node.id)) typeToIds.set(node.id, []);
      typeToIds.get(node.id)!.push(uniqueId);

      nodes.push({
        id: uniqueId,
        shape: 'custom-react-node',
        x: node.x - 50,
        y: node.y - 50,
        data: { ...node, type: 'leaf' },
      });
    });

    // 3. 生成连线
    if (group === 'num') {
      numericEdges.forEach(edge => {
        // 寻找目标节点
        // 如果 target 是 "boxplot"，而图上有 "boxplot_1", "boxplot_2"
        // 我们应该连哪一个？
        // 智能逻辑：寻找距离 source 最近的那个 target 实例
        
        const sourceId = edge.source; // 假设 source 都是 branch，是唯一的
        const targetType = edge.target;
        
        const possibleTargets = typeToIds.get(targetType) || (idMap.has(targetType) ? [targetType] : []);
        
        if (possibleTargets.length > 0) {
           // 找到源节点位置
           const srcNode = nodes.find(n => n.id === sourceId);
           if (srcNode) {
             // 寻找最近的目标
             let bestTarget = possibleTargets[0];
             let minDistance = Infinity;
             
             possibleTargets.forEach(tid => {
               const tgtNode = nodes.find(n => n.id === tid);
               if (tgtNode) {
                 const dist = Math.pow(tgtNode.x - srcNode.x, 2) + Math.pow(tgtNode.y - srcNode.y, 2);
                 if (dist < minDistance) {
                   minDistance = dist;
                   bestTarget = tid;
                 }
               }
             });
             
             edges.push({
               source: sourceId,
               target: bestTarget,
               attrs: {
                 line: {
                   stroke: '#333', // 硬朗风格用深色
                   strokeWidth: 2,
                   targetMarker: { name: 'block', width: 8, height: 8 }, // 箭头
                 },
               },
             });
           }
        }
      });
    }

    graph.fromJSON({ nodes, edges });
    graph.zoomToFit({ padding: 20 });

    return () => {
      resizeObserver.disconnect();
      graph.dispose();
    };
  }, [group]);

  return (
    <div className="w-full h-full relative">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};

export default AntVGraph;
