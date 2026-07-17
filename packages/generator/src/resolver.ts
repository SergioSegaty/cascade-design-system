import { parseAlias } from './parser.js';
import type { TokenRegistry } from './registry.js';
import { isValueAlias } from './typeguards.js';
import type { ClassifiedTokens, Token, TokenSourceFile, TokenValue } from './types.js';

export class AliasResolver {
  constructor(private readonly registry: TokenRegistry) {}

  private cache = new Map<string, TokenValue>();
  private resolving = new Set<string>();
  private stack: string[] = [];

  private throwCycleError(alias: string) {
    const start = this.stack.indexOf(alias)!;

    const cycle = [...this.stack.slice(start), alias].join(' -> ');

    throw new Error(`Circular alias detected: ${cycle}`);
  }

  private getTokenOrThrow(alias: string): Token {
    try {
      return this.registry.getOrThrow(alias);
    } catch (cause) {
      const chain = [...this.stack].join(' -> ');
      throw new Error(`Unresolved alias "${alias}" (chain: ${chain})`, { cause });
    }
  }

  private resolveValue(value: TokenValue): TokenValue {
    if (!isValueAlias(value)) {
      return value;
    }

    value = parseAlias(value);

    const cached = this.cache.get(value);

    if (cached) return cached;

    if (this.resolving.has(value)) this.throwCycleError(value);

    this.resolving.add(value);
    this.stack.push(value);
    try {
      const token = this.getTokenOrThrow(value);
      const resolved = this.resolveValue(token.value);
      this.cache.set(value, resolved);

      return resolved;
    } finally {
      this.stack.pop();
      this.resolving.delete(value);
    }
  }

  resolve(token: Token): Token {
    return { ...token, value: this.resolveValue(token.value) };
  }

  resolveList(tokens: Token[] | undefined): Token[] {
    if (!tokens) return [];

    const result: Token[] = [];
    for (const token of tokens) {
      result.push({ ...token, value: this.resolveValue(token.value) });
    }

    return result;
  }

  resolveFile(file: TokenSourceFile): TokenSourceFile {
    return { ...file, tokens: this.resolveList(file.tokens) };
  }

  resolveClassified(tokens: ClassifiedTokens): ClassifiedTokens {
    const themes = Object.fromEntries(
      Object.entries(tokens.themes).map(([themeName, files]) => [
        themeName,
        files.map((file) => this.resolveFile(file)),
      ]),
    );

    return {
      primitives: tokens.primitives.map((prim) => this.resolveFile(prim)),
      semanticBase: tokens.semanticBase.map((base) => this.resolveFile(base)),
      themes,
    };
  }
}
