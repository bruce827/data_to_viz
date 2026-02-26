'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper, CodeBlock } from '@/components/viz/story/StoryComponents';
import { SunburstIcon } from '@/components/viz/icons';
import { SunburstG2 } from '@/components/viz/charts/SunburstG2';

export default function SunburstStory() {
  return (
    <StoryLayout
      title="Sunburst"
      subtitle="Use radial layers to visualize hierarchical part-to-whole data."
      icon={SunburstIcon}
    >
      <StorySection title="What is a Sunburst?">
        <p>
          A sunburst chart places hierarchy levels on concentric rings.
          It shows composition and depth simultaneously, with arc size representing magnitude.
        </p>
      </StorySection>

      <ChartWrapper title="Interactive Demo (AntV G2)">
        <SunburstG2 />
      </ChartWrapper>

      <StorySection title="When to use it">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>Display hierarchical categories with multiple levels.</li>
          <li>Compare branch proportions in a radial layout.</li>
          <li>Highlight dominant top-level and second-level groups.</li>
        </ul>
      </StorySection>

      <StorySection title="Implementation">
        <p>AntV G2 code example (sunburst API with runtime extension):</p>
        <CodeBlock
          language="typescript"
          code={`
import { Runtime, corelib, graphlib, extend } from '@antv/g2';

const lib = graphlib();
const SunburstChart = extend(Runtime, {
  ...corelib(),
  ...lib,
  'mark.sunburst': lib['mark.partition'],
});

const chart = new SunburstChart({
  container: 'container',
  autoFit: true,
});

chart.options({
  type: 'sunburst',
  data: [data],
  coordinate: { type: 'polar' },
  encode: { value: 'value', color: 'name' },
});

chart.render();
          `}
        />
      </StorySection>
    </StoryLayout>
  );
}
