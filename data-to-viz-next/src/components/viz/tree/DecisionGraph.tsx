'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Graph, register } from '@antv/g6';
import { ReactNode } from '@antv/g6-extension-react';
import * as Icons from '../icons';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HistogramG2 } from '../charts/HistogramG2';
import { BarplotG2 } from '../charts/BarplotG2';
import { LollipopG2 } from '../charts/LollipopG2';
import { WordcloudG2 } from '../charts/WordcloudG2';
import { PieG2 } from '../charts/PieG2';
import { TreemapG2 } from '../charts/TreemapG2';
import { VennG2 } from '../charts/VennG2';
import { SankeyG2 } from '../charts/SankeyG2';
import { ChordG2 } from '../charts/ChordG2';
import { NetworkG6 } from '../charts/NetworkG6';
import { CircularPackingG2 } from '../charts/CircularPackingG2';
import { CircularPackingSetG2 } from '../charts/CircularPackingSetG2';
import { SunburstG2 } from '../charts/SunburstG2';
import { SpiderG2 } from '../charts/SpiderG2';
import { ScatterG2 } from '../charts/ScatterG2';
import { DensityG2 } from '../charts/DensityG2';
import { BoxplotG2 } from '../charts/BoxplotG2';
import { LineG2 } from '../charts/LineG2';
import { LineSevG2 } from '../charts/LineSevG2';
import { AreaG2 } from '../charts/AreaG2';
import { ConnectedScatterG2 } from '../charts/ConnectedScatterG2';
import { ViolinG2 } from '../charts/ViolinG2';
import { Density2DG2 } from '../charts/Density2DG2';
import { HexbinG2 } from '../charts/HexbinG2';
import { HeatmapG2 } from '../charts/HeatmapG2';
import { StackedAreaG2 } from '../charts/StackedAreaG2';
import { DensityHeatmapG2 } from '../charts/DensityHeatmapG2';
import { BubbleG2 } from '../charts/BubbleG2';
import { Scatter3DG2 } from '../charts/Scatter3DG2';
import { PCAG2 } from '../charts/PCAG2';
import { RidgelineG2 } from '../charts/RidgelineG2';
import { StreamgraphG2 } from '../charts/StreamgraphG2';
import { ParallelG2 } from '../charts/ParallelG2';
import { DendrogramG2 } from '../charts/DendrogramG2';
import { HeatmapSevG2 } from '../charts/HeatmapSevG2';

// Register the extension
register('node', 'react-node', ReactNode);

// --- Chart Component Mapping ---
const CHART_COMPONENTS: Record<string, React.ComponentType> = {
  'chart-hist': HistogramG2,
  'chart-hist-few': HistogramG2,
  'chart-barplot': BarplotG2,
  'chart-lollipop': LollipopG2,
  'chart-wordcloud': WordcloudG2,
  'chart-pie': PieG2,
  'chart-treemap': TreemapG2,
  'chart-venn': VennG2,
  'chart-circular-packing': CircularPackingG2,
  'chart-circular-packing-set': CircularPackingSetG2,
  'chart-sunburst': SunburstG2,
  'chart-spider': SpiderG2,
  'chart-sankey-set': SankeyG2,
  'chart-chord-set': ChordG2,
  'chart-network-set': NetworkG6,
  'chart-scatter': ScatterG2,
  'chart-density': DensityG2,
  'chart-boxplot': BoxplotG2,
  'chart-violin': ViolinG2,
  'chart-line': LineG2,
  'chart-line-sev': LineSevG2,
  'chart-area': AreaG2,
  'chart-connected-scatter': ConnectedScatterG2,
  'chart-heatmap-many': HeatmapG2,
  'chart-stacked-area-many': StackedAreaG2,
  'chart-stacked-area': StackedAreaG2,
  'chart-density-heatmap': DensityHeatmapG2,
  'chart-bubble': BubbleG2,
  'chart-scatter3d': Scatter3DG2,
  'chart-pca': PCAG2,
  'chart-correlogram': RidgelineG2,
  'chart-stream': StreamgraphG2,
  'chart-parallel': ParallelG2,
  'chart-dendrogram': DendrogramG2,
  'chart-heatmap': HeatmapSevG2,
  // More charts will be added here
};

// --- Custom Node Component (Rendered by G6) ---
const NodeComponent = ({ data }: { data: any }) => {
  const { label, icon } = data.data;
  const labelCn = data.data['label-cn'];
  const displayLabel = labelCn || label;

  // Dynamic Icon loading
  const Icon = (Icons as any)[icon || 'NumericIcon'] || Icons.NumericIcon;
  
  const type = data.type;
  const isChart = type === 'decision-chart';
  const isQuestion = type === 'decision-question';
  const isCategory = type === 'decision-category';

  // UI/UX Styling Strategy:
  // - Category (Root): Prominent, larger, brand color border.
  // - Question (Branch): Pill shape, subtle background, distinct text.
  // - Chart (Leaf): Card-like, visual focus, interactive hover state.

  if (isCategory) {
    return (
      <div className="flex flex-col items-center justify-center w-[160px] h-[70px] bg-slate-900 text-white rounded-lg shadow-lg border-2 border-slate-700">
        <span className="font-bold text-[28px] tracking-wide ">{displayLabel}</span>
      </div>
    );
  }

  if (isQuestion) {
    return (
      <div className="flex items-center justify-center w-full text-center px-5 py-2.5 bg-slate-100 border border-slate-300 rounded-full shadow-sm min-w-[120px]">
         <span className="text-[24px] font-bold text-slate-700 tracking-normal">{displayLabel}</span>
      </div>
    );
  }

  // Chart Node
  return (
    <Card className="gap-1 flex flex-col items-center justify-center w-[120px] h-[120px]  hover:shadow-xl hover:border-blue-400 hover:-translate-y-1 transition-all duration-300 cursor-pointer group bg-white">
      <div className="flex-1 flex items-center justify-center w-full pt-3">
         {/* Icon Container with subtle animation */}
         <Icon className="w-16 h-16 text-slate-400 group-hover:text-blue-600 transition-colors duration-300" />
      </div>
      <div className="mt-2 w-full text-center border-t border-slate-100 group-hover:border-blue-100 py-2">
        <span className="text-xl font-bold text-slate-600 group-hover:text-blue-700 leading-normal block px-1">
          {displayLabel}
        </span>
      </div>
    </Card>
  );
};

// --- Main Graph Component ---
export function DecisionGraph({ data }: { data: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle Node Click from G6
  const handleNodeClick = (event: any) => {
    const { target } = event;
    // Walk up to find the node element if clicked on child
    // In G6 v5, event.target.id might be the shape ID. 
    // We rely on the event model.
    // However, for React nodes, the click might be captured by React.
    // Best way: G6 event listener.
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const graph = new Graph({
      container: containerRef.current,
      data,
      // Add side padding so outer nodes are not visually clipped.
      padding: [24, 56, 24, 56],
      node: {
        type: 'react-node',
        style: {
          component: (d: any) => <NodeComponent data={d} />,
          // Define standard sizes for layout calculation
          size: (d: any) => {
            if (d.type === 'decision-chart') return [130, 130];
            if (d.type === 'decision-category') return [150, 80];
            return [140, 60]; // Question
          },
          ports: [
            { placement: 'top' }, 
            { placement: 'bottom' }
          ],
        },
      },
      edge: {
        type: 'polyline',
        style: {
          router: { 
            type: 'orth',
            // padding:  90,
            // offset: 30  
          },
          // controlPoints:[5,20],
          stroke: '#94a3b8',
          lineWidth: 2,
          targetArrow: true,
          radius: 4,
        },
      },
      layout: {
        type: 'compact-box',
        direction: 'TB',
        getWidth: () => 140,
        getHeight: () => 60,
        getVGap: () => 60,
        getHGap: () => 10,
      },
      behaviors: [
        'drag-canvas', 
        'zoom-canvas', 
        {
            type: 'click-select',
            multiple: false,
            onClick: (e: any) => {
                if(e.target.id && data.nodes.find((n:any) => n.id === e.target.id)) {
                    const node = data.nodes.find((n:any) => n.id === e.target.id);
                    if(node.type === 'decision-chart') {
                        setSelectedNode(node);
                        setIsModalOpen(true);
                    }
                }
            }
        }
      ],
      autoFit: {
        type: 'view',
        options: {
          when: 'always',
          direction: 'x',
        }
      },
      animation: true, 
    });

    graph.render();
    graphRef.current = graph;
    
    // Event Listener for Node Clicks (Reliable method)
    graph.on('node:click', (e) => {
        const nodeId = e.target.id;
        const nodeData = data.nodes.find((n: any) => n.id === nodeId);
        if (nodeData && nodeData.type === 'decision-chart') {
             setSelectedNode(nodeData);
             setIsModalOpen(true);
        }
    });

    return () => {
      graph.destroy();
    };
  }, [data]);

  return (
    <>
        <div 
          ref={containerRef} 
          className="w-full h-[800px] bg-slate-50/30" 
        />
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-[600px]">
                {selectedNode && (
                    <>
                    <DialogHeader>
                        <div className="flex items-center gap-4 mb-4">
                             {/* Render Icon in Header */}
                             {(() => {
                                 const Icon = (Icons as any)[selectedNode.data.icon || 'NumericIcon'] || Icons.NumericIcon;
                                 return <Icon className="w-12 h-12 text-blue-600" />;
                             })()}
                            <div>
                                <DialogTitle className="text-2xl">{selectedNode.data['label-cn'] || selectedNode.data.label}</DialogTitle>
                                <DialogDescription className="text-base mt-1">
                                    {selectedNode.data['description-cn'] || selectedNode.data.description || "Explore this chart type to understand your data distribution."}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    
                    <div className="flex flex-col gap-6 py-4">
                        {/* Interactive Chart Container */}
                        <div className="w-full bg-slate-50 rounded-xl border border-slate-200 overflow-hidden min-h-[350px] relative">
                             {(() => {
                                 const ChartComponent = CHART_COMPONENTS[selectedNode.id];
                                 if (ChartComponent) {
                                     return <div className="p-4"><ChartComponent /></div>;
                                 }
                                 return (
                                     <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-3">
                                         <Icons.NumericIcon className="w-12 h-12 opacity-20" />
                                         <p className="text-sm">Demo chart coming soon for {selectedNode.data.label}</p>
                                     </div>
                                 );
                             })()}
                        </div>

                        <div className="bg-blue-50/50 p-4 rounded-lg text-sm text-blue-900 border border-blue-100">
                             <div className="font-semibold mb-1 flex items-center gap-2">
                                <Icons.NumericIcon className="w-4 h-4" />
                                核心用途
                             </div>
                             {selectedNode.data['description-cn'] || selectedNode.data.description || "探索此图表类型以了解您的数据分布。"}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                         <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                            关闭
                         </Button>
                         <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => window.location.href = selectedNode.data.storyPath}>
                            查看数据故事
                         </Button>
                    </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    </>
  );
}
