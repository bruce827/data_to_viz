export function normalizeSearchText(input: string): string {
  return input
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[，。！？：；、()[\]{}]/g, ' ')
    .replace(/[/_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function splitSearchTerms(input: string): string[] {
  const normalized = normalizeSearchText(input);
  return normalized ? normalized.split(' ') : [];
}
