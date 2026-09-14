# ADR-002: Styling library — Linaria over Styled-Components and Tailwind

## Status

Accepted

## Context

Components need a styling approach that consumes the design tokens produced
by the generator (see [ADR-001](./ADR-001-generator.md)) and works well in a
design system meant to be embedded in many different consuming apps.

Three options were evaluated:

- **Styled-Components** — the familiar CSS-in-JS API, but it ships a runtime
  that parses and injects styles in the browser on every render. For a design
  system consumed by potentially many apps, that runtime cost is paid
  repeatedly by every consumer, and adds to bundle size and hydration/render
  overhead.
- **Tailwind** — utility classes avoid a styling runtime entirely, but push
  styling into markup via class names rather than co-located, token-driven
  component styles, and don't map as directly onto the generated CSS
  variables/theme output the token pipeline already produces.
- **Linaria** — a CSS-in-JS syntax (similar ergonomics to Styled-Components)
  that compiles styles to static CSS at build time, so there is no CSS-in-JS
  runtime shipped to consumers.

## Decision

Use [Linaria](https://linaria.dev/) as the styling library for
`packages/components`.

Reasons:

- Zero runtime JS overhead: styles are extracted to plain `.css` files at
  build time, so consumers of the design system don't pay a CSS-in-JS runtime
  cost, unlike Styled-Components.
- Keeps component-scoped, token-driven styles co-located with components
  (closer to Styled-Components' authoring experience than Tailwind's
  utility-class approach), which fits how the generated design tokens
  (theme.js) are meant to be consumed.

## Consequences

- Styles must be statically analyzable (Linaria's build-time constraint) —
  fully dynamic runtime style construction isn't supported the way it is in
  Styled-Components.
- The build pipeline needs Linaria's bundler integration (e.g. the Rollup
  config in `packages/components/rollup.config.ts`) to extract CSS at build
  time.
- No utility-class layer (as Tailwind would provide) — component styles are
  authored per-component rather than composed from shared utility classes.
