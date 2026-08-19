// import StyleDictionary from 'style-dictionary';

import type { ClassifiedTokens } from '@types';
import { getClassifiedTokenFiles, getFiles } from './reader.js';
import { TokenRegistry } from './registry.js';
import { AliasResolver } from './resolver.js';
import {
  serializeCssFromClassified,
  serializeJavascript,
  serializeTypescript,
} from './serializer.js';
import { TreeBuilder } from './treeBuilder.js';
import { FileWritter } from './writter.js';

const fileWriter = new FileWritter();

function buildTypes(resolvedClassified: ClassifiedTokens) {
  const result = new TreeBuilder().buildFromClassified(resolvedClassified);
  const serializedTs = serializeTypescript(result);
  const serializedJs = serializeJavascript(result);

  fileWriter.write('./packages/types/theme.d.ts', serializedTs);
  fileWriter.write('./packages/types/theme.js', serializedJs);
}

function buildCss(classifiedTokens: ClassifiedTokens) {
  const result = serializeCssFromClassified(classifiedTokens);
  fileWriter.write('./packages/styles/rootStyle.css', result);
}

async function build(
  options = {
    outputReferences: false,
  },
) {
  const allFiles = await getFiles('packages/tokens');
  const classifiedFiles = await getClassifiedTokenFiles(allFiles);
  const resolver = new AliasResolver(TokenRegistry.from(classifiedFiles));
  const resolvedClassified = resolver.resolveClassified(classifiedFiles);

  buildCss(options.outputReferences ? classifiedFiles : resolvedClassified);
  buildTypes(resolvedClassified);
  console.log();
}

build({ outputReferences: true });
