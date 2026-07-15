import type { ClassifiedTokens, TokenSourceFile } from './types.js';

export function classifyTokens(files: TokenSourceFile[]): ClassifiedTokens {
  const result: ClassifiedTokens = {
    primitives: [],
    semanticBase: [],
    themes: {},
  };

  for (const file of files) {
    const primitiveIndex = file.segments.indexOf('primitives');
    const semanticIndex = file.segments.indexOf('semantic');

    if (primitiveIndex !== -1) {
      result.primitives.push(file);
      continue;
    }

    if (semanticIndex === -1) {
      continue;
    }

    if (file.segments.length === semanticIndex + 2) {
      result.semanticBase.push(file);
      continue;
    }

    const theme = file.segments[semanticIndex + 2];

    if (!result.themes[theme!]) {
      result.themes[theme!] = [];
    }

    result.themes[theme!]?.push(file);
  }

  return result;
}
