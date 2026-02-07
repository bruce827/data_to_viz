import { G6Node, G6Edge } from '@/types/graph'; // We need to define types properly first, but for now using any

interface TreeNode {
  id: string;
  label: string;
  labelCn?: string;
  type: string;
  icon?: string;
  storyPath?: string;
  description?: string;
  descriptionCn?: string;
  children: TreeNode[];
}

// Helper to convert flat graph data (nodes/edges) to nested tree
export function buildNestedTree(nodes: any[], edges: any[], rootId: string = 'root'): TreeNode | null {
  const rootNode = nodes.find(n => n.id === rootId);
  if (!rootNode) return null;

  const childrenEdges = edges.filter(e => e.source === rootId);
  const children = childrenEdges.map(edge => {
     // Find the target node
     return buildNestedTree(nodes, edges, edge.target);
  }).filter(Boolean) as TreeNode[];

  return {
    id: rootNode.id,
    label: rootNode.data.label,
    labelCn: rootNode.data['label-cn'],
    type: rootNode.type,
    icon: rootNode.data.icon,
    storyPath: rootNode.data.storyPath,
    description: rootNode.data.description,
    descriptionCn: rootNode.data['description-cn'],
    children
  };
}