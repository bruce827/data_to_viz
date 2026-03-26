import { normalizeSearchText, splitSearchTerms } from '@/lib/search/normalize';
import type { SearchDoc, SearchResult } from '@/lib/search/types';

function scoreExactMatch(query: string, candidate: string, exact: number, prefix: number, includes: number) {
  if (!candidate) return 0;
  if (candidate === query) return exact;
  if (candidate.startsWith(query)) return prefix;
  if (candidate.includes(query)) return includes;
  return 0;
}

function scoreSubsequenceMatch(query: string, candidate: string, baseScore: number) {
  if (!query || !candidate) return 0;

  let queryIndex = 0;
  let gapPenalty = 0;
  let lastMatchIndex = -1;

  for (let candidateIndex = 0; candidateIndex < candidate.length; candidateIndex += 1) {
    if (candidate[candidateIndex] !== query[queryIndex]) continue;

    if (lastMatchIndex >= 0) {
      gapPenalty += candidateIndex - lastMatchIndex - 1;
    }

    lastMatchIndex = candidateIndex;
    queryIndex += 1;

    if (queryIndex === query.length) {
      return Math.max(baseScore - gapPenalty, 1);
    }
  }

  return 0;
}

function scoreField(query: string, candidate: string, weights: { exact: number; prefix: number; includes: number; fuzzy: number }) {
  const directScore = scoreExactMatch(query, candidate, weights.exact, weights.prefix, weights.includes);
  if (directScore > 0) return directScore;
  return scoreSubsequenceMatch(query, candidate, weights.fuzzy);
}

function scoreToken(token: string, doc: SearchDoc, normalizedFields: Record<string, string>) {
  let bestScore = 0;

  bestScore = Math.max(
    bestScore,
    scoreField(token, normalizedFields.title, { exact: 1200, prefix: 900, includes: 760, fuzzy: 500 }),
  );

  bestScore = Math.max(
    bestScore,
    scoreField(token, normalizedFields.sectionTitle, { exact: 900, prefix: 680, includes: 540, fuzzy: 320 }),
  );

  bestScore = Math.max(
    bestScore,
    scoreField(token, normalizedFields.scenarioName, { exact: 820, prefix: 620, includes: 520, fuzzy: 280 }),
  );

  bestScore = Math.max(
    bestScore,
    ...doc.aliases.map((alias) =>
      scoreField(token, normalizeSearchText(alias), { exact: 980, prefix: 760, includes: 620, fuzzy: 360 }),
    ),
  );

  bestScore = Math.max(
    bestScore,
    ...doc.keywords.map((keyword) =>
      scoreField(token, normalizeSearchText(keyword), { exact: 420, prefix: 360, includes: 300, fuzzy: 180 }),
    ),
  );

  bestScore = Math.max(
    bestScore,
    scoreField(token, normalizedFields.subtitle, { exact: 420, prefix: 360, includes: 280, fuzzy: 160 }),
  );

  bestScore = Math.max(
    bestScore,
    scoreField(token, normalizedFields.content, { exact: 280, prefix: 220, includes: 180, fuzzy: 90 }),
  );

  return bestScore;
}

export function searchDocs(docs: SearchDoc[], query: string, limit: number = 12): SearchResult[] {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return docs
      .filter((doc) => doc.kind === 'story')
      .sort((left, right) => right.priority - left.priority || left.title.localeCompare(right.title, 'zh-Hans'))
      .slice(0, limit)
      .map((doc) => ({ ...doc, score: doc.priority }));
  }

  const terms = splitSearchTerms(normalizedQuery);
  const results: SearchResult[] = [];

  for (const doc of docs) {
    const normalizedFields = {
      title: normalizeSearchText(doc.title),
      subtitle: normalizeSearchText(doc.subtitle),
      scenarioName: normalizeSearchText(doc.scenarioName),
      sectionTitle: normalizeSearchText(doc.sectionTitle),
      content: normalizeSearchText(doc.content),
    };

    let totalScore = doc.priority;

    for (const term of terms) {
      const tokenScore = scoreToken(term, doc, normalizedFields);
      if (tokenScore <= 0) {
        totalScore = 0;
        break;
      }

      totalScore += tokenScore;
    }

    if (totalScore <= 0) continue;

    const fullQueryScore = scoreField(normalizedQuery, normalizedFields.title, {
      exact: 1600,
      prefix: 1300,
      includes: 1100,
      fuzzy: 620,
    });

    totalScore += fullQueryScore;
    results.push({ ...doc, score: totalScore });
  }

  return results
    .sort((left, right) => right.score - left.score || right.priority - left.priority || left.title.localeCompare(right.title, 'zh-Hans'))
    .slice(0, limit);
}
