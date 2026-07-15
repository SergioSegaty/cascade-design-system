# Token Generator

The Token Generator is the build-time engine of the design system. It reads raw design token JSON files, resolves them into a fully-typed, alias-free representation, and emits the artifacts consumed by the rest of the monorepo: a typed TypeScript object (shipped with the component packages) and, eventually, the CSS custom properties file (currently produced via Style Dictionary).

## Overview

The generator runs as a pipeline. Each stage takes the output of the previous one and hands off a slightly more resolved representation of the token set, until a final tree is serialized to disk.

```
JSON files
    │
    ▼
Parse ──────────────► TokenSourceFile[]
    │
    ▼
Classify ───────────► ClassifiedTokens (primitives / semanticBase / themes)
    │
    ▼
Register ───────────► TokenRegistry (flat, id-indexed lookup)
    │
    ▼
Resolve Aliases ────► ClassifiedTokens (alias-free)
    │
    ▼
Build Tree ─────────► Nested token tree
    │
    ▼
Serialize ──────────► .ts output (+ planned .css output)
```

## Pipeline Stages

### 1. Read & Parse

Every JSON token file on disk is read and parsed into a `TokenSourceFile`. This is the raw, file-level unit the rest of the pipeline operates on: it keeps a reference to where the file lives (`path`), how it's positioned in the folder structure (`segments`), and the flat list of tokens found inside it.

```typescript
export interface TokenSourceFile<T = Token> {
  path: string;
  segments: string[];
  tokens?: T[];
}

export interface Token {
  id: string;
  path: string[];
  value: TokenValue;
  source: string;
}
```

- `path` — the token's dot/segment path within its file (e.g. `['color', 'brand', '500']`), used later to rebuild the nested tree.
- `id` — the globally unique identifier for the token, used for alias resolution and duplicate detection.
- `source` — traceability back to the origin file, surfaced in error messages.

### 2. Classify

`classifyTokens` inspects each `TokenSourceFile`'s `segments` (its path segments) to bucket it into one of three groups:

- **`primitives`** — any file living under a `primitives` folder.
- **`semanticBase`** — files directly under `semantic`, with no further sub-segment (the base semantic layer, theme-agnostic).
- **`themes`** — files under `semantic/<theme>/...`, grouped by the theme name.

```typescript
export interface ClassifiedTokens {
  primitives: TokenSourceFile[];
  semanticBase: TokenSourceFile[];
  themes: Record<string, TokenSourceFile[]>;
}
```

This classification matters for two reasons: it defines the layering order used when building the registry and tree (primitives → semantic base → themes), and it lets themes be resolved independently of one another later on.

### 3. Register

`TokenRegistry.from(classifiedTokens)` walks the classified files — primitives first, then semantic base, then every theme — and inserts each token into a flat `Map<id, Token>`.

Registration happens **before** alias resolution on purpose: aliases need a complete, addressable index of every token (across primitives, semantics, and all themes) to resolve against, regardless of which file defines the alias or which file defines its target.

Key behaviors:

- **Duplicate protection** — `add()` throws immediately if a `token.id` already exists, reporting both the original and the offending source file, so collisions are caught at build time rather than silently overwriting.
- **`getOrThrow`** — used by the resolver so a broken/missing alias reference fails loudly instead of producing an `undefined` value downstream.
- Standard `Map`-like ergonomics (`get`, `has`, `values`, `entries`, iteration, `forEach`) so downstream stages can consume it however is convenient.

### 4. Resolve Aliases

Tokens can reference other tokens as their value (an "alias"). `AliasResolver` takes the populated `TokenRegistry` and walks every token's value:

- If the value isn't an alias (`isValueAlias` returns false), it's returned as-is.
- If it is an alias, the referenced token is looked up in the registry (`getOrThrow`) and its value is resolved **recursively** — so alias chains (an alias pointing to another alias) resolve all the way down to a concrete value.

This runs over the same `ClassifiedTokens` structure (`resolveClassified`), preserving the primitives/semanticBase/themes shape but replacing every value with its fully-dereferenced form. By the time this stage completes, no token value in the pipeline still points at another token — everything is a concrete value.

### 5. Build Tree

`TreeBuilder` converts the flat, alias-resolved token lists back into a nested object shape, using each token's `path` as the sequence of keys to descend/create.

```typescript
type TreeNode = {
  [key: string]: TreeNode | Token['value'];
};
```

`buildFromClassified` assembles the final shape in layering order:

1. Primitives are written into the root tree.
2. Semantic base tokens are merged into the same root (semantics can reference/override primitive-shaped paths).
3. Each theme is built into its own branch under `themes.<themeName>`, keeping themes isolated from one another and from the base tree.

The result is a single nested `TreeNode` that mirrors the final shape of the generated object: base design tokens at the root, with a `themes` branch containing one sub-tree per theme.

### 6. Serialize & Emit

The final tree is serialized into a generated TypeScript module — a typed constant object plus its derived type — which is exported and shipped alongside the component packages. Consumers import the generated object directly rather than parsing JSON at runtime.

A CSS output (custom properties) is also planned for this stage. Today that output is produced by Style Dictionary as a separate step; the goal is to fold it into this same tree-to-artifact stage so both the TypeScript and CSS outputs are generated from the exact same resolved tree, guaranteeing they never drift from each other.

## Design Decisions

- **Two-pass approach (register, then resolve)** — aliases can reference tokens defined anywhere in the source set (any primitive, the semantic base, or any theme), so a full registry must exist before any value can be safely resolved.
- **Fail fast, fail loud** — duplicate token IDs and unresolvable aliases both throw immediately with source-file context, rather than being silently coerced or dropped, since a broken token can silently break every consumer of the design system.
- **Classification by folder convention** — `primitives`, `semantic`, and `semantic/<theme>` are inferred from file path segments rather than requiring explicit config, keeping the source-of-truth in the folder structure itself.
- **Themes as isolated branches** — each theme is built into its own subtree under `themes.<name>` so theme-specific tokens never leak into the base tree or into other themes.

## Roadmap

- [ ] Move CSS custom property generation into the generator itself (replacing the current standalone Style Dictionary step) so TS and CSS outputs are generated from one resolved tree.
- [ ] Additional output targets (e.g. platform-specific formats) fed by the same resolved `TreeNode`.

## Directory Reference

| Module | Responsibility |
|---|---|
| `types.ts` | Shared types: `Token`, `TokenSourceFile`, `ClassifiedTokens`, `TokenValue`. |
| `parser.ts` | Reads JSON files and parses raw values (including alias parsing helpers, e.g. `parseAlias`). |
| `typeguards.ts` | Runtime type guards, e.g. `isValueAlias`. |
| `classify.ts` | `classifyTokens` — buckets `TokenSourceFile[]` into primitives/semanticBase/themes. |
| `registry.ts` | `TokenRegistry` — flat id-indexed store of all tokens. |
| `resolver.ts` | `AliasResolver` — recursively resolves alias values using the registry. |
| `tree-builder.ts` | `TreeBuilder` — converts flat token lists into a nested tree, per-file, per-classification. |
| `serializer.ts` *(planned/expand as needed)* | Emits the generated `.ts` (and future `.css`) output from the final tree. |