import type { TreeTabKey } from '@/lib/story-navigation';

export type SearchDocKind = 'story' | 'section';

export interface SearchDoc {
  id: string;
  kind: SearchDocKind;
  href: string;
  route: string;
  anchor: string | null;
  tab: TreeTabKey;
  nodeId: string;
  nodePath: string;
  title: string;
  subtitle: string;
  scenarioName: string;
  sectionTitle: string;
  aliases: string[];
  keywords: string[];
  content: string;
  snippet: string;
  priority: number;
}

export interface SearchResult extends SearchDoc {
  score: number;
}
