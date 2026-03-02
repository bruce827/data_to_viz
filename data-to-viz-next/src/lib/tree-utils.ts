interface RawNodeData {
  label?: string;
  'label-cn'?: string;
  icon?: string;
  storyPath?: string;
  description?: string;
  'description-cn'?: string;
}

interface RawNode {
  id: string;
  type: string;
  data: RawNodeData;
}

interface RawEdge {
  source: string;
  target: string;
}

export interface TreeNode {
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

// Helper to convert flat graph data (nodes/edges) to nested tree.
export function buildNestedTree(nodes: RawNode[], edges: RawEdge[], rootId: string = 'root'): TreeNode | null {
  const rootNode = nodes.find((node) => node.id === rootId);
  if (!rootNode) return null;

  const children = edges
    .filter((edge) => edge.source === rootId)
    .map((edge) => buildNestedTree(nodes, edges, edge.target))
    .filter((node): node is TreeNode => node !== null);

  return {
    id: rootNode.id,
    label: rootNode.data.label ?? rootNode.id,
    labelCn: rootNode.data['label-cn'],
    type: rootNode.type,
    icon: rootNode.data.icon,
    storyPath: rootNode.data.storyPath,
    description: rootNode.data.description,
    descriptionCn: rootNode.data['description-cn'],
    children,
  };
}
