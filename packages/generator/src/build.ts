// import StyleDictionary from 'style-dictionary';

import { getClassifiedTokenFiles, getFiles } from './reader.js';
import { TokenRegistry } from './registry.js';
import { AliasResolver } from './resolver.js';
import { TreeBuilder } from './treeBuilder.js';

// const themes = ['light', 'dark'];

// for (const theme of themes) {
//   const sd = new StyleDictionary({
//     source: [
//       'packages/tokens/primitives/**/*.json',
//       `packages/tokens/semantic/Themes/${theme}/**/*.json`,
//       `packages/tokens/semantic/*.json`,
//     ],

//     platforms: {
//       css: {
//         transformGroup: 'css',
//         buildPath: 'packages/styles/',
//         files: [
//           {
//             destination: `${theme}.css`,
//             format: 'css/variables',
//             options: {
//               selector: `[data-theme="${theme}"]`,
//               outputReferences: true,
//             },
//           },
//         ],
//       },
//     },
//   });
//   await sd.buildAllPlatforms();
// }

async function build() {
  const allFiles = await getFiles('packages/tokens');
  const classifiedFiles = await getClassifiedTokenFiles(allFiles);
  const resolver = new AliasResolver(TokenRegistry.from(classifiedFiles));
  const resolvedClassified = resolver.resolveClassified(classifiedFiles);
  const result = new TreeBuilder().buildFromClassified(resolvedClassified);

  console.log();
}

build();
