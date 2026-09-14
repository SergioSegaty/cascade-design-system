# ADR-001: Token generator — Terrazzo over Style Dictionary and a custom generator

## Status

Accepted

## Context

The design system needs a generator that turns design tokens into consumable
output: CSS custom properties for runtime theming, and a typed TS object for
referencing tokens from component styles.

We started with Style Dictionary. It fell short on theming: producing
light/dark (and future) theme variants cleanly was awkward to model with it.

To work around that, we wrote our own generator (`packages/generator`, the
`build` / `classifier` / `parser` / `reader` / `registry` / `resolver` /
`serializer` / `treeBuilder` / `writer` pipeline). It worked, but as a
hand-rolled tool it meant owning parsing, resolution, and serialization
ourselves indefinitely.

## Decision

Use [Terrazzo](https://terrazzo.app/) (`@terrazzo/cli` with
`@terrazzo/plugin-css` and `@terrazzo/plugin-css-in-js`) as the token
generator, replacing both Style Dictionary and the custom generator.

Reasons:

- Terrazzo is a more refined, actively maintained tool than what we could
  justify building and maintaining ourselves.
- It solves the theming problem we hit with Style Dictionary — the CSS plugin
  supports per-theme permutations (light `:root`, dark under
  `prefers-color-scheme`) directly.
- Generating TypeScript output is easier and more configurable via
  `plugin-css-in-js` than it was with our own serializer.
- Token *resolvers* (`packages/tokens/design-system.resolver.json`) add a
  protection layer on top of raw token sets/modes — invalid references or
  mode combinations are caught at generation time — and the resolver file
  itself doubles as in-code documentation of how the token sets compose.

## Consequences

- The custom generator source under `packages/generator/src` is removed in
  favor of `packages/generator/terrazzo.config.ts`.
- Generated output (`theme.js`, `theme.d.ts`, `index.css`) now lands in
  `packages/styles`, which replaces the old `packages/types` package as the
  consumable output of the token pipeline.
- Tokens are organized under `packages/tokens/foundation` and
  `packages/tokens/themes`, composed through
  `packages/tokens/design-system.resolver.json`, instead of the previous
  `primitives` / `semantic` layout consumed directly by the custom generator.
