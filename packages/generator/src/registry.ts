import type { ClassifiedTokens, Token, TokenSourceFile } from './types.js';

export class TokenRegistry {
  private readonly tokens = new Map<string, Token>();

  private constructor() {}

  static from(classifiedTokens: ClassifiedTokens): TokenRegistry {
    const registry = new TokenRegistry();

    registry.addTokenFiles(classifiedTokens.primitives);
    registry.addTokenFiles(classifiedTokens.semanticBase);
    Object.values(classifiedTokens.themes).forEach((value) => {
      registry.addTokenFiles(value);
    });

    return registry;
  }

  add(token: Token): void {
    const duplicate = this.tokens.get(token.id);

    if (duplicate) {
      throw new Error(
        `Duplicate Token found: In List - ${duplicate?.id} in ${duplicate?.source} and ${token.id} in ${token.source}`,
      );
    }

    this.tokens.set(token.id, token);
  }

  private addTokenFiles(sourceFiles: TokenSourceFile[]) {
    for (const file of sourceFiles) {
      if (!file.tokens) continue;
      file.tokens.forEach((token) => this.add(token));
    }
  }

  get(id: string): Token | undefined {
    return this.tokens.get(id);
  }

  getOrThrow(id: string): Token {
    const token = this.get(id);
    if (!token) throw new Error(`Key ${id} is missing.`);
    return token;
  }

  has(id: string): boolean {
    return this.tokens.has(id);
  }

  entries(): IterableIterator<[string, Token]> {
    return this.tokens.entries();
  }

  values(): IterableIterator<Token> {
    return this.tokens.values();
  }

  *[Symbol.iterator](): IterableIterator<Token> {
    yield* this.tokens.values();
  }

  get size(): number {
    return this.tokens.size;
  }

  forEach(callback: (token: Token) => void): void {
    this.tokens.forEach(callback);
  }
}
