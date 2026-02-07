import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import * as Icons from '@/components/viz/icons';
import { buildNestedTree } from '@/lib/tree-utils';

export function MobileDecisionTree({ data }: { data: any }) {
  const nestedTree = buildNestedTree(data.nodes, data.edges, 'root');

  if (!nestedTree) return <div>No data</div>;

  const renderTreeLevel = (node: any, level: number = 0) => {
    const isLeaf = node.children.length === 0;
    const Icon = node.icon ? (Icons as any)[node.icon] : null;

    if (isLeaf) {
      return (
        <div key={node.id} className="pl-4 py-2 border-l-2 border-slate-100 ml-2">
           <Button 
             variant="outline" 
             className="w-full justify-start gap-3 h-auto py-3 bg-white hover:border-blue-300 hover:bg-blue-50"
             onClick={() => node.storyPath && (window.location.href = node.storyPath)}
           >
             {Icon && <Icon className="w-5 h-5 text-blue-600" />}
             <div className="text-left">
                <div className="font-semibold text-slate-800">{node.label}</div>
                <div className="text-xs text-slate-500 font-normal">View Chart Guide →</div>
             </div>
           </Button>
        </div>
      );
    }

    return (
      <AccordionItem value={node.id} key={node.id} className="border-b-0">
        <AccordionTrigger className={`hover:no-underline py-3 ${level === 0 ? 'text-lg font-bold' : 'text-sm font-medium text-slate-600'}`}>
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-5 h-5 text-slate-400" />}
            {node.label}
          </div>
        </AccordionTrigger>
        <AccordionContent className="pl-4">
           <Accordion type="multiple" className="w-full border-l border-slate-200 pl-2">
             {node.children.map((child: any) => renderTreeLevel(child, level + 1))}
           </Accordion>
        </AccordionContent>
      </AccordionItem>
    );
  };

  return (
    <div className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200">
      <div className="text-sm text-slate-400 mb-4 font-medium uppercase tracking-wider text-center">
         Interactive Decision Guide
      </div>
      <Accordion type="single" collapsible defaultValue="root" className="w-full">
         {/* We skip rendering the root wrapper directly to avoid extra nesting, start from children */}
         {nestedTree.children.map((child: any) => renderTreeLevel(child))}
      </Accordion>
    </div>
  );
}
