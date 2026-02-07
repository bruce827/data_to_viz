// src/data/edges-config.ts

export interface EdgeConfig {
  source: string;
  target: string;
}

export interface MidNodeConfig {
  id: string;
  label: string;
  x: number;
  y: number;
  type: 'branch'; // 分支节点类型
}

// 1. 定义中间分支节点 (Branches)
// 坐标是根据 extracted_nodes_v2.json 大致估算的中心位置
export const numericBranchNodes: MidNodeConfig[] = [
  { id: 'root', label: 'NUMERIC', x: 800, y: 1400, type: 'branch' },
  
  // 第一层级：变量数量
  { id: 'one_var', label: 'ONE VARIABLE', x: 250, y: 300, type: 'branch' },
  { id: 'two_vars', label: 'TWO VARIABLES', x: 600, y: 300, type: 'branch' },
  { id: 'multi_vars', label: 'SEVERAL VARIABLES', x: 1100, y: 200, type: 'branch' }, // 原图右上角
  
  // 第二层级：有序/无序
  { id: 'one_ordered', label: 'ORDERED', x: 600, y: 800, type: 'branch' }, // 对应 Area/Line (Grouped) 附近
  // 注意：原图中 ordered/not ordered 分布比较散，这里为了演示逻辑简化了层级
];

// 2. 定义连线关系 (Source -> Target)
// Target 必须是 extracted_nodes_v2.json 里的 ID (注意大小写和唯一性)
// 或者上面的 numericBranchNodes 里的 ID
export const numericEdges: EdgeConfig[] = [
  // Root -> Level 1
  { source: 'root', target: 'one_var' },
  { source: 'root', target: 'two_vars' },
  { source: 'root', target: 'multi_vars' },

  // --- One Variable (左下部分) ---
  // 实际上原图左下角是 "ONE NUMERIC"
  // 这里我们把左下的图表连到 one_var
  { source: 'one_var', target: 'histogram' }, 
  { source: 'one_var', target: 'density' },
  { source: 'one_var', target: 'boxplot' },
  { source: 'one_var', target: 'violin' },

  // --- Two Variables (中部) ---
  { source: 'two_vars', target: 'scatter' },
  { source: 'two_vars', target: 'heatmap' }, // 2D Density often called heatmap style
  { source: 'two_vars', target: 'density2d' },
  { source: 'two_vars', target: 'connectedscatter' },
  
  // --- Multi Variables (右上) ---
  { source: 'multi_vars', target: 'pca' },
  { source: 'multi_vars', target: 'correlogram' },
  { source: 'multi_vars', target: 'dendrogram' },
  { source: 'multi_vars', target: 'heatmap' }, // Heatmap 也可以属于这里
  { source: 'multi_vars', target: 'ridgeline' },
  { source: 'multi_vars', target: 'stackedarea' },
  { source: 'multi_vars', target: 'streamgraph' },
];