# ADR-005: Fitness functions — automated architectural governance

## Status

Accepted

## Context

As more collaborators ship components into the design system, architectural
rules that only live in documentation or in a reviewer's head (e.g. "styles
must go through the themed layer, never import `primitive` directly") are easy
to miss. Enforcement today depends on someone noticing the violation during
code review, which doesn't scale as the number of contributors and packages
grows, and gives no signal at all if it slips through review.

A [fitness function](https://www.thoughtworks.com/en-us/insights/articles/fitness-function-driven-development)
(term from *Building Evolutionary Architectures*, Ford/Parsons/Kua) is an
executable check that objectively verifies an architectural characteristic
holds — the same way a unit test verifies a behavioral characteristic.
Instead of a rule living as prose ("don't import X from Y"), it lives as a
test that fails the moment the rule is broken, and can run locally, in a
pre-commit hook, or in CI.

## Decision

Adopt fitness functions as a standing mechanism for encoding and enforcing
architectural rules in this repo, rather than relying on documentation and
manual review alone.

- Rules live as executable tests under `fitness/`, run as their own Vitest
  project (`pnpm test:fitness`, `vitest run --project fitness`), separate
  from component unit tests.
- Rules are expressed as static analysis over the actual source, using
  `ts-morph` to walk the AST (imports, named/namespace usages, etc.) rather
  than regex/string matching, so they survive refactors like import
  reordering or aliasing.
- The first rule, `no-primitive-import.test.ts`, encodes that
  `packages/components/src/{ComponentFolder}/**/*.style.ts` must never import the
  `primitive` tokens from `packages/styles` — directly or via namespace
  import — since primitives are meant to be consumed only through the
  themed layer.
- A violation doesn't just fail a build silently: it relays a message to a
  designated owner/channel (e.g. a Slack channel for the design system).
  This is the governance piece — the goal isn't only to block the change,
  but to make an out-of-pattern attempt visible to a human who owns the
  rule, the same way a failing check on a PR is visible to a reviewer, but
  without depending on someone reading the diff closely enough to catch it.
- New architectural rules are added as new fitness function test files
  under `fitness/`, not as prose added to a README or CONTRIBUTING doc.

## Consequences

- `fitness/` is a new Vitest project (`fitness/tsconfig.json`,
  `test:fitness` script in the root `package.json`), independent of
  `packages/components`'s own test project.
- `ts-morph` is a new devDependency, used only for this static-analysis
  layer — not for runtime code.
- Each new rule is written as a fitness function, not documentation. If a
  rule can't be expressed as an executable check (too subjective, too
  costly to statically analyze), it stays a documented convention instead —
  fitness functions are for rules that are cheap and unambiguous to check
  mechanically.
- **Follow-up needed:** the notification path (relaying a message to the
  responsible person/channel on violation) is not wired up yet — there is
  no CI workflow in this repo today. `test:fitness` currently only fails
  the local/CI run; the notification step (e.g. a Slack webhook called from
  a GitHub Actions step on failure) needs to be added once CI exists, or
  this ADR's governance goal is only half-implemented.
- Fitness functions need to run on every relevant change (ideally CI on
  every PR), not just on demand, or violations can still land unnoticed
  between runs.
