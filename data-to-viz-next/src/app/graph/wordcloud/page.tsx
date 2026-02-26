'use client';

import React from 'react';
import { StoryLayout, StorySection, ChartWrapper, CodeBlock } from '@/components/viz/story/StoryComponents';
import { WordcloudIcon } from '@/components/viz/icons';
import { WordcloudG2 } from '@/components/viz/charts/WordcloudG2';

export default function WordcloudStory() {
  return (
    <StoryLayout
      title="Wordcloud"
      subtitle="Visualize text frequency by encoding word importance with size."
      icon={WordcloudIcon}
    >
      <StorySection title="What is a Wordcloud?">
        <p>
          A wordcloud is used to summarize text data by displaying words at different sizes.
          Larger words represent higher frequency or weight, helping readers quickly identify dominant themes.
        </p>
      </StorySection>

      <ChartWrapper title="Interactive Demo (AntV G2)">
        <WordcloudG2 />
      </ChartWrapper>

      <StorySection title="When to use it">
        <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
          <li>Summarize keywords from comments, feedback, or search logs.</li>
          <li>Highlight high-frequency concepts in unstructured text.</li>
          <li>Provide a fast qualitative overview before deeper analysis.</li>
        </ul>
      </StorySection>

      <StorySection title="Implementation">
        <p>AntV G2 code example (wordCloud mark):</p>
        <CodeBlock
          language="typescript"
          code={`
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  autoFit: true,
});

chart.options({
  type: 'wordCloud',
  data: { value: data },
  encode: { text: 'text', value: 'value' },
  layout: { fontSize: [14, 54], rotate: () => 0 },
});

chart.render();
          `}
        />
      </StorySection>
    </StoryLayout>
  );
}
