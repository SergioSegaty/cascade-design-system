import { isToken } from './typeguards.js';
import type { Token } from './types.js';

export function parseTokens(object: Record<string, unknown> | string, source: string) {
  const tokens: Token[] = [];
  visitNode(object, [], tokens, source);
  return tokens;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function visitNode(node: any, currentPath: string[], tokens: Token[], source: string) {
  for (const [key, obj] of Object.entries(node)) {
    const nextPath = [...currentPath, key];
    const isTheme = source.includes('Theme');

    if (isToken(obj)) {
      const newToken: Token = { id: nextPath.join('.'), path: nextPath, value: obj.value, source };
      if (isTheme) {
        const theme = source.split('/').at(4)!;
        const newTokenPath = `${theme}.${newToken.id}`;
        newToken.id = newTokenPath;
        newToken.path = newTokenPath.split('.');
      }
      tokens.push(newToken);
    } else {
      visitNode(obj, nextPath, tokens, source);
    }
  }
}

export function parseAlias(alias: string) {
  return alias.slice(1, -1);
}
