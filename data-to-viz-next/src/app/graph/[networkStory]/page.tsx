import { notFound } from 'next/navigation';
import { NetworkStoryPage } from '@/components/viz/story/NetworkStoryPage';
import { NETWORK_STORY_KEYS } from '@/lib/network-story-configs';

type NetworkStoryRoutePageProps = {
  params: Promise<{
    networkStory: string;
  }>;
};

export function generateStaticParams() {
  return NETWORK_STORY_KEYS.map((networkStory) => ({ networkStory }));
}

export default async function NetworkStoryRoutePage({ params }: NetworkStoryRoutePageProps) {
  const { networkStory } = await params;

  if (!NETWORK_STORY_KEYS.includes(networkStory)) {
    notFound();
  }

  return <NetworkStoryPage storyKey={networkStory} />;
}
