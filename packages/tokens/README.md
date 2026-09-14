# @cascade-ds/tokens

Design token *source of truth*: [DTCG](https://www.designtokens.org/)-format
JSON files, composed through a resolver and consumed by
[`@cascade-ds/generator`](../generator/README.md) (Terrazzo) to produce the CSS and
TypeScript output in [`@cascade-ds/styles`](../styles/README.md). See
[ADR-001](../../adr/ADR-001-generator.md) for why this shape was chosen.

## Folder structure

```
packages/tokens/
├── design-system.resolver.json   # composes the sets/modifiers below
├── foundation/
│   ├── primitive.tokens.json     # Layer 1 — raw values (palette, size scale, font stacks…)
│   ├── semantic.tokens.json      # Layer 2 — purpose-driven aliases over primitives
│   └── component.tokens.json     # Layer 3 — component-scoped aliases over semantics
└── themes/
    ├── color-light.tokens.json   # light overrides for semantic.color.*
    └── color-dark.tokens.json    # dark overrides for semantic.color.*
```

`foundation/` is unconditional — it's always part of the output.
`themes/` is conditional — which file applies depends on the `theme`
modifier described below.

## The DTCG token format

Each `*.tokens.json` file follows the
[DTCG format schema](https://www.designtokens.org/schemas/2025.10/format.json)
(`$schema` at the top of every file). The format is a nested JSON tree where
groups namespace tokens, and a handful of reserved, `$`-prefixed keys carry
the actual token data:

- **`$value`** — the token's value. It's either a literal (a string, a
  structured object like `{ "value": 1, "unit": "rem" }` for a dimension, or
  an array for a font stack), or an **alias**: a string like
  `"{primitive.color.gray.900}"` that points at another token's path instead
  of duplicating its value. Aliases are how `semantic.tokens.json` reuses
  `primitive.tokens.json` values, and how `component.tokens.json` reuses
  `semantic.tokens.json` values — each layer only ever references the one
  below it.
- **`$type`** — the token's type (`color`, `dimension`, `fontFamily`,
  `typography`, …), which tells the generator how to serialize the value.
  Set on a group, it's inherited by every token nested under it unless a
  token overrides it — e.g. in `themes/color-light.tokens.json`,
  `semantic.color.background` declares `$type: "color"` once, and its
  `default` / `subtle` / `muted` / `inverse` / `brand` children each carry
  only `$value`, inheriting the type from the group.
- **`$description`** — free-text documentation, kept next to the value it
  describes instead of in a separate doc. Several tokens use it to record
  intent that isn't obvious from the value alone, e.g. primitive font sizes
  are marked "Never reference directly in components" to steer usage toward
  the semantic layer.

A token is any node that has `$value`; anything else (a node with only
nested objects, `$description`, and/or `$type`) is a group.

## The resolver

`design-system.resolver.json` follows the separate
[DTCG resolver schema](https://www.designtokens.org/schemas/2025.10/resolver.json).
Where the format schema describes a single token file, the resolver schema
describes how *multiple* token files combine into one design system. It has
three parts:

- **`sets`** — named, ordered lists of token file sources. This repo defines
  one set, `foundation`, listing the three `foundation/*.tokens.json` files.
  A set applies unconditionally whenever it's used.
- **`modifiers`** — named axes of variation. This repo defines one,
  `theme`, with two **contexts** — `light` and `dark` — each pointing at the
  matching `themes/color-*.tokens.json` file, plus a `default` (`light`)
  used when no context is requested.
- **`resolutionOrder`** — the sequence the sets and modifiers are applied
  in to produce one resolved token tree: `foundation` first, then `theme`.

Resolving through this file rather than pointing the generator straight at
the token files buys two things: the sets/modifiers structure is validated
up front (an unknown `$ref`, a missing context, a circular alias all fail
generation instead of silently producing bad CSS), and the file itself is a
readable spec of how the layers compose — no need to read generator source
to know that `themes/color-dark.tokens.json` only overrides color, on top
of everything `foundation` already defines.

## How Terrazzo resolves themes

Terrazzo walks `resolutionOrder` and builds the token tree by *layering*
each step on top of the previous one, keyed by path — later entries
overwrite earlier ones only where they define the same token path, and the
rest of the tree carries forward unchanged.

For the `theme` modifier specifically, this means Terrazzo doesn't treat
`light`/`dark` as two independent, standalone token sets — it resolves the
`foundation` set once, then, per context, re-runs resolution with that
context's source file **injected into the merge after `foundation`**. So
the dark resolution is effectively:

```
resolve(foundation) → merge themes/color-dark.tokens.json on top
```

Since `color-dark.tokens.json` only contains `semantic.color.*` paths,
everything else foundation defined (typography, spacing, component sizing,
radii…) passes through untouched, and only the color aliases get
re-pointed at the dark palette.

`terrazzo.config.ts` drives this per-context resolution for the CSS output
via `@terrazzo/plugin-css`'s `permutations` option — one permutation per
`theme` context, wrapped in the selector each should live under
(`:root` for `light`, `@media (prefers-color-scheme: dark) { :root { … } }`
for `dark`). Both permutations land in the same `index.css`, so the browser
picks the right one at runtime via the media query — no theme-switching
logic is needed in JS.

`@terrazzo/plugin-css-in-js`, by contrast, resolves only once, against the
modifier's `default` context (`light`), to produce `theme.js`/`theme.d.ts`.
That's safe because its emitted values are always CSS custom-property
references (e.g. `"var(--semantic-color-text-primary)"`), never resolved
colors — so which context it resolves against doesn't affect the output;
the actual light/dark swap happens entirely in the CSS layer described
above.
