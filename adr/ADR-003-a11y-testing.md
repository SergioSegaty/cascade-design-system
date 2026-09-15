# ADR-003: Accessibility testing — Storybook addons over vitest-axe

## Status

Accepted

## Context

Accessibility testing was first set up with `vitest-axe`, asserting directly
inside `packages/components` unit tests (e.g. `Button.test.tsx`) that a
component's rendered output had no axe violations.

Storybook is already part of the design system to document components, and
it will also need to own visual regression testing next, once Playwright is
wired up for it. If accessibility checks stay in `vitest-axe` at the
component-test layer while visual regression lives in Storybook, the same
underlying question — "does this rendered component look and behave
correctly?" — ends up split across two different tools/pipelines instead of
one.

## Decision

Drop `vitest-axe` from `packages/components` and run accessibility checks
through Storybook's `@storybook/addon-a11y`, executed via
`@storybook/addon-vitest` (which runs every story as a Vitest browser test
through Playwright/Chromium).

Reasons:

- `addon-a11y` checks more than isolated a11y assertions — contrast and
  visibility issues are caught as part of the same pass, which `vitest-axe`
  run against a one-off test render doesn't give us.
- Storybook stories already enumerate a component's documented states, so
  a11y checks run against those real, rendered states instead of needing
  separate assertions maintained in test files.
- Consolidates responsibility onto a single component: Storybook (via
  `addon-vitest` + Playwright) becomes the one place responsible for
  rendered-output checks — a11y today, visual regression next — rather than
  splitting that concern between a component-level unit test tool and
  Storybook.

## Consequences

- `vitest-axe` and its a11y assertions are removed from
  `packages/components` (`Button.test.tsx` keeps only functional/unit
  assertions).
- `packages/storybook` now owns a real test runtime: `vitest.config.ts` runs
  a `storybook` project through `@storybook/addon-vitest` +
  `@vitest/browser-playwright` (Chromium), and `vitest.setup.ts` wires
  project annotations from both `.storybook/preview.ts` and the a11y addon.
- `.storybook/preview.ts` sets `a11y.test = 'error'`, so accessibility
  violations fail the Storybook test run rather than a component unit test.
- A11y coverage is now tied to story coverage: a component only gets
  a11y-checked for the states that have a corresponding story.
- The same pipeline (`addon-vitest` + Playwright/Chromium) is already in
  place to add visual regression testing next, without introducing a second
  test runner or a second component to own it.
