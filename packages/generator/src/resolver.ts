import { parseAlias } from './parser.js';
import type { TokenRegistry } from './registry.js';
import { isValueAlias } from './typeguards.js';
import type { ClassifiedTokens, Token, TokenSourceFile, TokenValue } from './types.js';

export class AliasResolver {
  constructor(private readonly registry: TokenRegistry) {}

  private resolveValue(value: TokenValue): TokenValue {
    if (!isValueAlias(value)) return value;

    const token = this.registry.getOrThrow(parseAlias(value));

    return this.resolveValue(token.value);
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
