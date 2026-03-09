import treeNumeric from '@/data/tree-numeric.json';
import treeCategoric from '@/data/tree-categoric.json';
import treeCatNum from '@/data/tree-catnum.json';
import treeMaps from '@/data/tree-maps.json';
import treeNetwork from '@/data/tree-network.json';
import treeTime from '@/data/tree-time.json';

export const TREE_DATA_MAP = {
  num: treeNumeric,
  cat: treeCategoric,
  catnum: treeCatNum,
  geo: treeMaps,
  relationnal: treeNetwork,
  time: treeTime,
} as const;

export type TreeTabKey = keyof typeof TREE_DATA_MAP;

function getNodeStoryPath(node: { data?: unknown }): string | undefined {
  if (!node.data || typeof node.data !== 'object') return undefined;

  const storyPath = (node.data as { storyPath?: unknown }).storyPath;
  return typeof storyPath === 'string' ? storyPath : undefined;
}

const STORY_PATH_TO_TABS = Object.entries(TREE_DATA_MAP).reduce((acc, [tab, tree]) => {
  tree.nodes.forEach((node) => {
    const storyPath = getNodeStoryPath(node);
    if (!storyPath) return;

    const tabs = acc.get(storyPath) ?? new Set<TreeTabKey>();
    tabs.add(tab as TreeTabKey);
    acc.set(storyPath, tabs);
  });

  return acc;
}, new Map<string, Set<TreeTabKey>>());

export function isTreeTabKey(value: string | null | undefined): value is TreeTabKey {
  return typeof value === 'string' && value in TREE_DATA_MAP;
}

export function getDecisionTreeTabByStoryPath(storyPath: string): TreeTabKey | undefined {
  const tabs = STORY_PATH_TO_TABS.get(storyPath);
  if (!tabs || tabs.size !== 1) return undefined;

  return tabs.values().next().value;
}

export function buildDecisionTreeHref(storyPath: string, preferredTab?: TreeTabKey): string {
  const tab = preferredTab ?? getDecisionTreeTabByStoryPath(storyPath);
  return tab ? `/?tab=${tab}` : '/';
}
