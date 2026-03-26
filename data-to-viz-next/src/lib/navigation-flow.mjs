/**
 * @typedef {'num' | 'cat' | 'catnum' | 'geo' | 'relationnal' | 'time'} TreeTabKey
 */

/**
 * @typedef {{
 *   originTab?: TreeTabKey,
 *   originFocus?: string,
 *   anchor?: string | null,
 * }} StoryHrefOptions
 */

/**
 * Build a decision-tree URL from an explicit tab and optional focused node.
 * `num` is the default tab and therefore omitted from the query string.
 *
 * @param {TreeTabKey | undefined} tab
 * @param {string | undefined} focusedNodeId
 * @returns {string}
 */
export function buildDecisionTreeHrefFromTab(tab, focusedNodeId) {
  const params = new URLSearchParams();

  if (tab && tab !== 'num') {
    params.set('tab', tab);
  }

  if (focusedNodeId) {
    params.set('focus', focusedNodeId);
  }

  const query = params.toString();
  return query ? `/?${query}` : '/';
}

/**
 * Build a story URL and preserve the user's origin context.
 *
 * @param {string} storyPath
 * @param {StoryHrefOptions} [options]
 * @returns {string}
 */
export function buildStoryHrefWithOrigin(storyPath, options = {}) {
  const { originTab, originFocus, anchor } = options;
  const [pathAndQuery, hash] = storyPath.split('#');
  const [pathname, queryString] = pathAndQuery.split('?');
  const params = new URLSearchParams(queryString ?? '');

  if (originTab) {
    params.set('originTab', originTab);
  }

  if (originFocus) {
    params.set('originFocus', originFocus);
  }

  const query = params.toString();
  const fragment = anchor ?? hash ?? '';

  return `${pathname}${query ? `?${query}` : ''}${fragment ? `#${fragment}` : ''}`;
}

/**
 * Resolve the "return to decision tree" link from a story page.
 * Origin context wins over the story's owner tab.
 *
 * @param {{
 *   fallbackTab?: TreeTabKey,
 *   originTab?: TreeTabKey,
 *   originFocus?: string,
 * }} options
 * @returns {string}
 */
export function resolveStoryReturnHref(options = {}) {
  const { fallbackTab, originTab, originFocus } = options;

  if (originTab) {
    return buildDecisionTreeHrefFromTab(originTab, originFocus);
  }

  return buildDecisionTreeHrefFromTab(fallbackTab, undefined);
}

/**
 * Resolve the "locate in decision tree" action from a search result.
 * This must always use the story owner's tab and node id.
 *
 * @param {{ ownerTab: TreeTabKey, nodeId: string }} options
 * @returns {string}
 */
export function buildLocateHref(options) {
  return buildDecisionTreeHrefFromTab(options.ownerTab, options.nodeId);
}
