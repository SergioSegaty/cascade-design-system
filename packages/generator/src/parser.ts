import type { Token, TreeNode } from '@types';
import { isToken } from './typeguards.js';

export function parseTokens(object: TreeNode, source: string) {
  const tokens: Token[] = [];
  visitNode(object, [], tokens, source);
  return tokens;
}

function visitNode(node: TreeNode, currentPath: string[], tokens: Token[], source: string) {
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
      visitNode(obj as TreeNode, nextPath, tokens, source);
    }
  }
}

export function parseAlias(alias: string) {
  return alias.slice(1, -1);
}
