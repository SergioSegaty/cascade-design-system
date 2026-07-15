import type { TokenValueAlias, TokenNode } from './types.js';

export function isToken(node: unknown): node is TokenNode {
  return typeof node === 'object' && node !== null && Object.hasOwn(node, 'value');
}

export function isValueAlias(value: unknown): value is TokenValueAlias {
  if (typeof value !== 'string') return false;
  return value.startsWith('{') && value.endsWith('}');
}
