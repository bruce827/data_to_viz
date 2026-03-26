import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const graphDir = path.join(rootDir, 'src', 'app', 'graph');
const outputDir = path.join(rootDir, 'src', 'generated');
const outputFile = path.join(outputDir, 'search-docs.json');

const TREE_SOURCES = [
  { tab: 'num', file: path.join(rootDir, 'src', 'data', 'tree-numeric.json') },
  { tab: 'cat', file: path.join(rootDir, 'src', 'data', 'tree-categoric.json') },
  { tab: 'catnum', file: path.join(rootDir, 'src', 'data', 'tree-catnum.json') },
  { tab: 'geo', file: path.join(rootDir, 'src', 'data', 'tree-maps.json') },
  { tab: 'relationnal', file: path.join(rootDir, 'src', 'data', 'tree-network.json') },
  { tab: 'time', file: path.join(rootDir, 'src', 'data', 'tree-time.json') },
];

function decodeEntities(text) {
  return text
    .replaceAll('&gt;', '>')
    .replaceAll('&lt;', '<')
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'");
}

function cleanText(text) {
  return decodeEntities(text)
    .replace(/[`*_#]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanSnippet(text, maxLength = 140) {
  const normalized = cleanText(text);
  if (normalized.length <= maxLength) return normalized;

  return `${normalized.slice(0, maxLength).trimEnd()}...`;
}

function getTagName(node) {
  if (ts.isIdentifier(node.tagName)) return node.tagName.text;
  if (ts.isPropertyAccessExpression(node.tagName)) return node.tagName.name.text;
  return node.tagName.getText();
}

function getJsxAttribute(node, name) {
  const attributes = node.attributes?.properties ?? [];
  return attributes.find(
    (attribute) => ts.isJsxAttribute(attribute) && attribute.name.text === name,
  );
}

function getLiteralText(node, constants) {
  if (!node) return undefined;

  if (ts.isStringLiteralLike(node)) {
    return cleanText(node.text);
  }

  if (ts.isNoSubstitutionTemplateLiteral(node)) {
    return cleanText(node.text);
  }

  if (ts.isIdentifier(node)) {
    return constants.get(node.text);
  }

  if (ts.isJsxExpression(node)) {
    return getLiteralText(node.expression, constants);
  }

  if (ts.isTemplateExpression(node)) {
    const fragments = [node.head.text, ...node.templateSpans.map((span) => span.literal.text)];
    return cleanText(fragments.join(' '));
  }

  return undefined;
}

function getJsxAttributeText(node, name, constants) {
  const attribute = getJsxAttribute(node, name);
  if (!attribute?.initializer) return undefined;

  if (ts.isStringLiteralLike(attribute.initializer)) {
    return cleanText(attribute.initializer.text);
  }

  if (ts.isJsxExpression(attribute.initializer)) {
    return getLiteralText(attribute.initializer.expression, constants);
  }

  return undefined;
}

function collectStringArray(node, constants) {
  if (!node) return [];

  if (ts.isArrayLiteralExpression(node)) {
    return node.elements.flatMap((element) => collectStringArray(element, constants));
  }

  const literalText = getLiteralText(node, constants);
  return literalText ? [literalText] : [];
}

function collectTextFromExpression(node, constants) {
  if (!node) return [];

  const literalText = getLiteralText(node, constants);
  if (literalText) return [literalText];

  if (ts.isParenthesizedExpression(node)) {
    return collectTextFromExpression(node.expression, constants);
  }

  if (ts.isArrayLiteralExpression(node)) {
    return node.elements.flatMap((element) => collectTextFromExpression(element, constants));
  }

  if (ts.isConditionalExpression(node)) {
    return [
      ...collectTextFromExpression(node.whenTrue, constants),
      ...collectTextFromExpression(node.whenFalse, constants),
    ];
  }

  if (ts.isBinaryExpression(node)) {
    return [
      ...collectTextFromExpression(node.left, constants),
      ...collectTextFromExpression(node.right, constants),
    ];
  }

  if (ts.isCallExpression(node)) {
    return node.arguments.flatMap((argument) => {
      if (ts.isArrowFunction(argument) || ts.isFunctionExpression(argument)) {
        if (ts.isBlock(argument.body)) {
          return argument.body.statements.flatMap((statement) => {
            if (ts.isReturnStatement(statement)) {
              return collectTextFromExpression(statement.expression, constants);
            }

            return [];
          });
        }

        return collectTextFromExpression(argument.body, constants);
      }

      return [];
    });
  }

  if (ts.isJsxElement(node)) {
    return collectTextFromJsxChildren(node.children, constants);
  }

  if (ts.isJsxFragment(node)) {
    return collectTextFromJsxChildren(node.children, constants);
  }

  if (ts.isObjectLiteralExpression(node)) {
    return node.properties.flatMap((property) => {
      if (!ts.isPropertyAssignment(property)) return [];
      return collectTextFromExpression(property.initializer, constants);
    });
  }

  return [];
}

function collectTextFromJsxChildren(children, constants) {
  const fragments = [];

  for (const child of children) {
    if (ts.isJsxText(child)) {
      const text = cleanText(child.getFullText());
      if (text) fragments.push(text);
      continue;
    }

    if (ts.isJsxExpression(child)) {
      fragments.push(...collectTextFromExpression(child.expression, constants));
      continue;
    }

    if (ts.isJsxElement(child)) {
      const tagName = getTagName(child.openingElement);
      const title = getJsxAttributeText(child.openingElement, 'title', constants);
      const alt = getJsxAttributeText(child.openingElement, 'alt', constants);

      if (tagName === 'ChartWrapper' && title) {
        fragments.push(title);
      } else if (alt) {
        fragments.push(alt);
      }

      fragments.push(...collectTextFromJsxChildren(child.children, constants));
      continue;
    }

    if (ts.isJsxSelfClosingElement(child)) {
      const title = getJsxAttributeText(child, 'title', constants);
      const alt = getJsxAttributeText(child, 'alt', constants);

      if (title) fragments.push(title);
      if (alt) fragments.push(alt);
    }
  }

  return fragments.filter(Boolean);
}

function findFirstDescendant(node, predicate) {
  let match;

  function visit(current) {
    if (match) return;
    if (predicate(current)) {
      match = current;
      return;
    }

    ts.forEachChild(current, visit);
  }

  visit(node);
  return match;
}

function extractEnglishAliases(text) {
  if (!text) return [];

  const match = text.match(/英文名[:：]\s*([^。]+)/);
  if (!match) return [];

  return match[1]
    .split('/')
    .map((part) => cleanText(part))
    .filter(Boolean);
}

function extractFirstHeadingText(children, constants) {
  for (const child of children) {
    if (!ts.isJsxElement(child)) continue;

    const tagName = getTagName(child.openingElement);
    if (/^h[1-6]$/.test(tagName)) {
      const text = cleanText(collectTextFromJsxChildren(child.children, constants).join(' '));
      if (text) return text;
    }

    const nestedText = extractFirstHeadingText(child.children, constants);
    if (nestedText) return nestedText;
  }

  return '';
}

async function extractManualStoryContent(filePath) {
  const sourceText = await fs.readFile(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const constants = new Map();

  ts.forEachChild(sourceFile, (node) => {
    if (!ts.isVariableStatement(node)) return;

    for (const declaration of node.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name) || !declaration.initializer) continue;
      const literalText = getLiteralText(declaration.initializer, constants);
      if (literalText) constants.set(declaration.name.text, literalText);
    }
  });

  const storyLayout = findFirstDescendant(
    sourceFile,
    (node) => ts.isJsxElement(node) && getTagName(node.openingElement) === 'StoryLayout',
  );

  if (!storyLayout) return null;

  const title = getJsxAttributeText(storyLayout.openingElement, 'title', constants);
  const subtitle = getJsxAttributeText(storyLayout.openingElement, 'subtitle', constants);

  if (!title) return null;

  const sections = [];
  let scenarioName = '';

  for (const child of storyLayout.children) {
    if (!ts.isJsxElement(child) || getTagName(child.openingElement) !== 'StorySection') continue;

    const sectionTitle = getJsxAttributeText(child.openingElement, 'title', constants);
    const sectionId = getJsxAttributeText(child.openingElement, 'id', constants);
    const content = cleanText(collectTextFromJsxChildren(child.children, constants).join(' '));

    if (!sectionTitle || !sectionId || !content) continue;

    const nextSection = {
      id: sectionId,
      title: sectionTitle,
      content,
      snippet: cleanSnippet(content),
    };

    if (!scenarioName && sectionTitle.includes('应用场景')) {
      const headingText = extractFirstHeadingText(child.children, constants);
      const fallbackName = cleanText(content.split('对应节点 ID')[0] ?? '');
      scenarioName = headingText || fallbackName;
    }

    sections.push(nextSection);
  }

  if (sections.length === 0) return null;

  const englishAliases = sections.flatMap((section) => extractEnglishAliases(section.content));

  return {
    title,
    subtitle,
    scenarioName,
    aliases: englishAliases,
    sections,
  };
}

function extractStringConstants(sourceFile) {
  const constants = new Map();

  ts.forEachChild(sourceFile, (node) => {
    if (!ts.isVariableStatement(node)) return;

    for (const declaration of node.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name) || !declaration.initializer) continue;
      const literalText = getLiteralText(declaration.initializer, constants);
      if (literalText) constants.set(declaration.name.text, literalText);
    }
  });

  return constants;
}

function getObjectProperty(objectLiteral, name) {
  return objectLiteral.properties.find((property) => {
    if (!ts.isPropertyAssignment(property) || !ts.isIdentifier(property.name)) return false;
    return property.name.text === name;
  });
}

function getObjectString(objectLiteral, name, constants) {
  const property = getObjectProperty(objectLiteral, name);
  if (!property || !ts.isPropertyAssignment(property)) return undefined;
  return getLiteralText(property.initializer, constants);
}

function getObjectStringArray(objectLiteral, name, constants) {
  const property = getObjectProperty(objectLiteral, name);
  if (!property || !ts.isPropertyAssignment(property)) return [];
  return collectStringArray(property.initializer, constants);
}

function getMistakeDescriptions(objectLiteral, constants) {
  const property = getObjectProperty(objectLiteral, 'mistakes');
  if (!property || !ts.isPropertyAssignment(property) || !ts.isArrayLiteralExpression(property.initializer)) {
    return [];
  }

  return property.initializer.elements.flatMap((element) => {
    if (!ts.isObjectLiteralExpression(element)) return [];
    const title = getObjectString(element, 'title', constants);
    const description = getObjectString(element, 'description', constants);

    return title && description ? [`${title} ${description}`] : [];
  });
}

function extractConfigStoryContent(filePath, configName, kindPrefix) {
  return fs.readFile(filePath, 'utf8').then((sourceText) => {
    const sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const constants = extractStringConstants(sourceFile);
    const variableDeclaration = findFirstDescendant(
      sourceFile,
      (node) => ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === configName,
    );

    if (!variableDeclaration || !variableDeclaration.initializer || !ts.isObjectLiteralExpression(variableDeclaration.initializer)) {
      return [];
    }

    const stories = [];

    for (const property of variableDeclaration.initializer.properties) {
      if (!ts.isPropertyAssignment(property) || !ts.isIdentifier(property.name)) continue;
      if (!ts.isObjectLiteralExpression(property.initializer)) continue;

      const route = getObjectString(property.initializer, 'route', constants);
      const title = getObjectString(property.initializer, 'title', constants);
      const subtitle = getObjectString(property.initializer, 'subtitle', constants);
      const scenarioName = getObjectString(property.initializer, 'scenarioName', constants);
      const scenarioDescription = getObjectString(property.initializer, 'scenarioDescription', constants);
      const businessLine = getObjectString(property.initializer, 'businessLine', constants);
      const nodePath = getObjectString(property.initializer, 'nodePath', constants);
      const leafId =
        getObjectString(property.initializer, 'reportNodeId', constants) ??
        getObjectString(property.initializer, 'leafId', constants);
      const dataNote = getObjectString(property.initializer, 'dataNote', constants);
      const whatIs = getObjectStringArray(property.initializer, 'whatIs', constants);
      const whenToUse = getObjectStringArray(property.initializer, 'whenToUse', constants);
      const insights = getObjectStringArray(property.initializer, 'insights', constants);
      const mistakes = getMistakeDescriptions(property.initializer, constants);

      if (!route || !title) continue;

      const sections = [
        {
          id: `${kindPrefix}-what-is`,
          title: `什么是${title}`,
          content: cleanText(whatIs.join(' ')),
        },
        {
          id: `${kindPrefix}-when-to-use`,
          title: '何时使用',
          content: cleanText(whenToUse.join(' ')),
        },
        {
          id: `${kindPrefix}-common-mistakes`,
          title: '常见误区',
          content: cleanText(mistakes.join(' ')),
        },
        {
          id: `${kindPrefix}-use-case`,
          title: '应用场景',
          content: cleanText(
            [
              scenarioName,
              businessLine,
              nodePath,
              leafId,
              scenarioDescription,
              dataNote,
              ...insights,
            ]
              .filter(Boolean)
              .join(' '),
          ),
        },
      ]
        .filter((section) => section.content)
        .map((section) => ({
          ...section,
          snippet: cleanSnippet(section.content),
        }));

      stories.push({
        route,
        title,
        subtitle,
        scenarioName,
        aliases: [],
        sections,
      });
    }

    return stories;
  });
}

async function collectRouteContents() {
  const routeContents = new Map();

  const manualEntries = await fs.readdir(graphDir, { withFileTypes: true });

  for (const entry of manualEntries) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith('[')) continue;

    const pageFile = path.join(graphDir, entry.name, 'page.tsx');
    try {
      await fs.access(pageFile);
    } catch {
      continue;
    }

    const content = await extractManualStoryContent(pageFile);
    if (!content) continue;

    routeContents.set(`/graph/${entry.name}`, content);
  }

  const configStories = [
    ...(await extractConfigStoryContent(
      path.join(rootDir, 'src', 'lib', 'network-story-configs.tsx'),
      'NETWORK_STORY_CONFIGS',
      'network',
    )),
    ...(await extractConfigStoryContent(
      path.join(rootDir, 'src', 'lib', 'time-story-configs.tsx'),
      'TIME_STORY_CONFIGS',
      'time',
    )),
  ];

  for (const story of configStories) {
    routeContents.set(story.route, story);
  }

  return routeContents;
}

async function loadTreeLeafNodes() {
  const leafNodes = [];

  for (const source of TREE_SOURCES) {
    const tree = JSON.parse(await fs.readFile(source.file, 'utf8'));
    const nodeMap = new Map(tree.nodes.map((node) => [node.id, node]));
    const parentMap = new Map(tree.edges.map((edge) => [edge.target, edge.source]));

    for (const node of tree.nodes) {
      if (node.type !== 'decision-chart') continue;
      if (!node.data?.storyPath) continue;

      const idPath = [];
      const labelPath = [];
      let currentNode = node;

      while (currentNode) {
        idPath.unshift(currentNode.id);
        labelPath.unshift(currentNode.data?.['label-cn'] ?? currentNode.data?.label ?? currentNode.id);
        const parentId = parentMap.get(currentNode.id);
        currentNode = parentId ? nodeMap.get(parentId) : null;
      }

      leafNodes.push({
        tab: source.tab,
        nodeId: node.id,
        route: node.data.storyPath,
        title: cleanText(node.data['label-cn'] ?? node.data.label ?? node.id),
        englishTitle: cleanText(node.data.label ?? ''),
        description: cleanText(node.data['description-cn'] ?? node.data.description ?? ''),
        nodePath: idPath.join('/'),
        labelPath: labelPath.join(' / '),
      });
    }
  }

  return leafNodes;
}

function uniqueList(values) {
  return [...new Set(values.map((value) => cleanText(value)).filter(Boolean))];
}

async function buildSearchDocs() {
  const [routeContents, leafNodes] = await Promise.all([collectRouteContents(), loadTreeLeafNodes()]);
  const docs = [];

  for (const leafNode of leafNodes) {
    const routeContent = routeContents.get(leafNode.route);
    const title = routeContent?.title ?? leafNode.title;
    const subtitle = routeContent?.subtitle ?? leafNode.description;
    const storyContent = cleanText(
      [
        subtitle,
        routeContent?.scenarioName,
        ...((routeContent?.sections ?? []).map((section) => `${section.title} ${section.content}`)),
      ]
        .filter(Boolean)
        .join(' '),
    );
    const aliases = uniqueList([leafNode.englishTitle, leafNode.title, ...(routeContent?.aliases ?? [])]);
    const keywords = uniqueList([leafNode.nodeId, leafNode.nodePath, leafNode.labelPath, leafNode.route]);

    docs.push({
      id: `story:${leafNode.tab}:${leafNode.nodeId}`,
      kind: 'story',
      href: leafNode.route,
      route: leafNode.route,
      anchor: null,
      tab: leafNode.tab,
      nodeId: leafNode.nodeId,
      nodePath: leafNode.nodePath,
      title,
      subtitle,
      scenarioName: routeContent?.scenarioName ?? '',
      sectionTitle: '',
      aliases,
      keywords,
      content: storyContent,
      snippet: cleanSnippet(routeContent?.scenarioName || subtitle || storyContent),
      priority: 100,
    });

    for (const section of routeContent?.sections ?? []) {
      docs.push({
        id: `section:${leafNode.tab}:${leafNode.nodeId}:${section.id}`,
        kind: 'section',
        href: `${leafNode.route}#${section.id}`,
        route: leafNode.route,
        anchor: section.id,
        tab: leafNode.tab,
        nodeId: leafNode.nodeId,
        nodePath: leafNode.nodePath,
        title,
        subtitle,
        scenarioName: routeContent?.scenarioName ?? '',
        sectionTitle: section.title,
        aliases,
        keywords,
        content: section.content,
        snippet: section.snippet,
        priority: 60,
      });
    }
  }

  return docs;
}

async function main() {
  const docs = await buildSearchDocs();
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(outputFile, `${JSON.stringify(docs, null, 2)}\n`, 'utf8');
  console.log(`Generated ${docs.length} search docs -> ${path.relative(rootDir, outputFile)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
