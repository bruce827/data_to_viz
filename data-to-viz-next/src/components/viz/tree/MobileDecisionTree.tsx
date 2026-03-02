import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import * as Icons from '@/components/viz/icons';
import { buildNestedTree, type TreeNode } from '@/lib/tree-utils';

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface DecisionGraphData {
  nodes: Array<{
    id: string;
    type: string;
    data: {
      label?: string;
      'label-cn'?: string;
      icon?: string;
      storyPath?: string;
      description?: string;
      'description-cn'?: string;
    };
  }>;
  edges: Array<{
    source: string;
    target: string;
  }>;
}

const iconsMap = Icons as Record<string, IconComponent>;

function resolveIcon(iconName?: string): IconComponent | null {
  if (!iconName) return null;
  return iconsMap[iconName] ?? null;
}

function renderIcon(iconName: string | undefined, className: string): React.ReactNode {
  const Icon = resolveIcon(iconName);
  return Icon ? React.createElement(Icon, { className }) : null;
}

export function MobileDecisionTree({ data }: { data: DecisionGraphData }) {
  const nestedTree = buildNestedTree(data.nodes, data.edges, 'root');

  if (!nestedTree) return <div>No data</div>;

  const renderTreeLevel = (node: TreeNode, level: number = 0): React.ReactNode => {
    const isLeaf = node.children.length === 0;

    if (isLeaf && node.type === 'decision-question') {
      return (
        <div key={node.id} className="pl-4 py-3 border-l-2 border-slate-100 ml-2">
          <div className="w-full flex items-center gap-3 py-3 px-4 rounded-lg bg-white border border-slate-200">
            {renderIcon(node.icon, 'w-5 h-5 text-slate-400')}
            <div className="font-semibold text-slate-700">{node.labelCn || node.label}</div>
          </div>
        </div>
      );
    }

    if (isLeaf) {
      return (
        <div key={node.id} className="pl-4 py-3 border-l-2 border-slate-100 ml-2">
          <Button
            variant="outline"
            className="w-full justify-start gap-4 h-auto py-4 bg-white hover:border-blue-300 hover:bg-blue-50"
            disabled={!node.storyPath}
            onClick={() => {
              if (node.storyPath) window.location.href = node.storyPath;
            }}
          >
            {renderIcon(node.icon, 'w-6 h-6 text-blue-600')}
            <div className="text-left">
              <div className="font-bold text-base text-slate-800">{node.labelCn || node.label}</div>
              <div className="text-sm text-slate-500 font-normal mt-0.5">查看图表指南 →</div>
            </div>
          </Button>
        </div>
      );
    }

    return (
      <AccordionItem value={node.id} key={node.id} className="border-b-0">
        <AccordionTrigger
          className={`hover:no-underline py-4 ${level === 0 ? 'text-xl font-bold' : 'text-base font-semibold text-slate-700'}`}
        >
          <div className="flex items-center gap-3">
            {renderIcon(node.icon, 'w-6 h-6 text-slate-400')}
            {node.labelCn || node.label}
          </div>
        </AccordionTrigger>
        <AccordionContent className="pl-4">
          <Accordion type="multiple" className="w-full border-l border-slate-200 pl-2">
            {node.children.map((child) => renderTreeLevel(child, level + 1))}
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
        {nestedTree.children.map((child) => renderTreeLevel(child))}
      </Accordion>
    </div>
  );
}
