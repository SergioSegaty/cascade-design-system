export type TokenValue = string | number | boolean;

export interface Token {
  id: string;
  path: string[];
  value: TokenValue;
  source: string;
}

export type TokenValueAlias = `{${string}}`;

export interface TokenNode {
  value: TokenValue;
  type?: string;
  description?: string;
  extensions?: Record<string, unknown>;
}

export interface TokenSourceFile<T = Token> {
  path: string;
  segments: string[];
  tokens?: T[];
}

export interface ClassifiedTokens<T = TokenSourceFile> {
  primitives: T[];
  semanticBase: T[];
  themes: Record<string, T[]>;
}
