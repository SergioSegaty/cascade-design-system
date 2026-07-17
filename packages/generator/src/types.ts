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
  name: string;
  path: string;
  segments: string[];
  tokens?: T[];
}

export interface ClassifiedTokens<T = TokenSourceFile> {
  primitives: T[];
  semanticBase: T[];
  themes: Record<string, T[]>;
}

export type TreeNode = {
  [key: string]: TreeNode | Token['value'];
};

export interface Writter {
  write(path: string, content: string): Promise<void>;
}
