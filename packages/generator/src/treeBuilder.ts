import type { ClassifiedTokens, Token, TokenSourceFile, TreeNode } from './types.js';

export class TreeBuilder {
  buildBranch(keys: string[]) {
    const root: TreeNode = {};
    let current = root;

    for (const key of keys) {
      current[key] ??= {};
      current = current[key] as TreeNode;
    }

    return root;
  }

  private applyToken(result: TreeNode, token: Token) {
    let current = result;
    const last = token.path.length - 1;

    for (let i = 0; i < last; i++) {
      const key = token.path[i]!;

      current[key] ??= {};
      current = current[key] as TreeNode;
    }

    current[token.path[last]!] = token.value;
  }

  buildTree(tokens: Token[], root: TreeNode = {}) {
    const result = root;

    for (const token of tokens) {
      this.applyToken(result, token);
    }

    return result;
  }

  buildFromFiles(files: TokenSourceFile[], root: TreeNode = {}) {
    const branch = root;

    for (const file of files) {
      if (!file.tokens) throw new Error(`No tokens found in file: ${file.path}.`);
      this.buildTree(file.tokens!, branch);
    }

    return branch;
  }

  buildFromClassified(classifiedTokens: ClassifiedTokens): TreeNode {
    const root: TreeNode = {};

    this.buildFromFiles(classifiedTokens.primitives, root);
    this.buildFromFiles(classifiedTokens.semanticBase, root);
    const themeRoot: TreeNode = { themes: {} };

    Object.entries(classifiedTokens.themes).forEach(([_key, files]) => {
      const current = themeRoot['themes'] as TreeNode;
      this.buildFromFiles(files, current);
    });

    return { ...root, ...themeRoot };
  }
}
