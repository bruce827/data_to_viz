import assert from 'node:assert/strict';
import {
  buildDecisionTreeHrefFromTab,
  buildLocateHref,
  buildStoryHrefWithOrigin,
  resolveStoryReturnHref,
} from '../src/lib/navigation-flow.mjs';

function runCase(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

runCase('default num tab collapses to home root', () => {
  assert.equal(buildDecisionTreeHrefFromTab('num', undefined), '/');
});

runCase('non-default tab keeps explicit query', () => {
  assert.equal(buildDecisionTreeHrefFromTab('geo', undefined), '/?tab=geo');
});

runCase('focused node is preserved on decision tree href', () => {
  assert.equal(
    buildDecisionTreeHrefFromTab('cat', 'chart-parallel'),
    '/?tab=cat&focus=chart-parallel',
  );
});

runCase('searching from num tab into geo story preserves origin tab on story href', () => {
  assert.equal(
    buildStoryHrefWithOrigin('/graph/pointmap', { originTab: 'num' }),
    '/graph/pointmap?originTab=num',
  );
});

runCase('story href keeps existing query and adds anchor/origin context', () => {
  assert.equal(
    buildStoryHrefWithOrigin('/graph/network_force?mode=demo', {
      originTab: 'relationnal',
      originFocus: 'chart-net-force',
      anchor: 'network-use-case',
    }),
    '/graph/network_force?mode=demo&originTab=relationnal&originFocus=chart-net-force#network-use-case',
  );
});

runCase('story return prefers origin tab over story owner tab', () => {
  assert.equal(
    resolveStoryReturnHref({
      fallbackTab: 'geo',
      originTab: 'num',
      originFocus: undefined,
    }),
    '/',
  );
});

runCase('story return preserves focused origin node when available', () => {
  assert.equal(
    resolveStoryReturnHref({
      fallbackTab: 'geo',
      originTab: 'catnum',
      originFocus: 'chart-combo-mcat-mnum-heatmap',
    }),
    '/?tab=catnum&focus=chart-combo-mcat-mnum-heatmap',
  );
});

runCase('story return falls back to story owner tab when there is no origin context', () => {
  assert.equal(
    resolveStoryReturnHref({
      fallbackTab: 'time',
      originTab: undefined,
      originFocus: undefined,
    }),
    '/?tab=time',
  );
});

runCase('locate action always uses owner tab and node id', () => {
  assert.equal(
    buildLocateHref({
      ownerTab: 'geo',
      nodeId: 'chart-map-point',
    }),
    '/?tab=geo&focus=chart-map-point',
  );
});

runCase('locate action does not leak previous origin tab', () => {
  const originStoryHref = buildStoryHrefWithOrigin('/graph/pointmap', {
    originTab: 'num',
    originFocus: 'chart-hist',
  });
  assert.equal(originStoryHref, '/graph/pointmap?originTab=num&originFocus=chart-hist');
  assert.equal(
    buildLocateHref({
      ownerTab: 'geo',
      nodeId: 'chart-map-point',
    }),
    '/?tab=geo&focus=chart-map-point',
  );
});

console.log('White-box navigation checks completed.');
