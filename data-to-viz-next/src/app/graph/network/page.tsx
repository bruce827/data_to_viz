'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper, CodeBlock } from '@/components/viz/story/StoryComponents';
import { NetworkIcon } from '@/components/viz/icons';
import { NetworkG6 } from '@/components/viz/charts/NetworkG6';

export default function NetworkStory() {
  return (
    <StoryLayout
      title="Network Graph"
      subtitle="Use nodes and edges to show entities and their relationships."
      icon={NetworkIcon}
    >
      <StorySection title="What is a Network Graph?">
        <p>
          A network graph represents objects as nodes and relationships as edges.
          It is suitable for revealing central entities, clusters, and bridge connections.
        </p>
      </StorySection>

      <ChartWrapper title="Interactive Demo (AntV G6)">
        <NetworkG6 />
      </ChartWrapper>

      <StorySection title="When to use it">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>Analyze many-to-many relationships among entities.</li>
          <li>Find hubs, communities, and critical connectors.</li>
          <li>Display topology where flow charts are not expressive enough.</li>
        </ul>
      </StorySection>

      <StorySection title="Implementation">
        <p>AntV G6 code example (force-directed network):</p>
        <CodeBlock
          language="typescript"
          code={`
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  data,
  layout: { type: 'force', preventOverlap: true },
  node: { type: 'circle' },
  edge: { type: 'line' },
  behaviors: ['drag-canvas', 'zoom-canvas', 'drag-element'],
});

graph.render();
          `}
        />
      </StorySection>
    </StoryLayout>
  );
}
