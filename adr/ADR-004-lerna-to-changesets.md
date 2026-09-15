# ADR-004: Monorepo release tooling — Changesets over Lerna

## Status

Accepted

## Context

The design system used Lerna for monorepo package management, versioning,
and publishing. pnpm workspaces (`pnpm-workspace.yaml`) already resolve
cross-package dependencies (`workspace:*`) across the monorepo, so Lerna's
workspace/graph responsibilities overlap with what pnpm already does. Keeping
both means two tools sharing the same "how do these packages relate to each
other" responsibility.

Separately, releases need a way to (a) decide what version bump each changed
package gets, and (b) publish those packages, ideally driven from CI rather
than a manual step.

## Decision

Replace Lerna with [Changesets](https://github.com/changesets/changesets)
(`@changesets/cli`), and let pnpm workspaces be the single source of truth
for monorepo package linking.

Reasons:

- Changesets handles both versioning **and** publishing from one place,
  driven by changeset files authored alongside a PR, instead of Lerna
  inferring bumps from commit history/conventions.
- pnpm workspaces already manage cross-package linking, so Lerna's
  workspace-graph role is redundant once Changesets covers versioning and
  publishing — one tool per responsibility: pnpm for workspace linking,
  Changesets for versioning + publishing.
- Changesets is meant to run in CI to consume accumulated changeset files
  and cut version bumps automatically — including bumping
  `@cascade-ds/storybook` — instead of needing a separate release step wired
  to Lerna.

## Consequences

- `lerna.json` is removed; `.changeset/config.json` and `.changeset/README.md`
  are added.
- CI needs a Changesets step (e.g. `changeset version` + `changeset publish`,
  or the equivalent GitHub Action) to consume changeset files and cut
  releases automatically.
- Contributors add a changeset (`pnpm changeset`) alongside PRs that touch a
  publishable package, instead of relying on Lerna's commit-based bumping.
- **Follow-up needed:** `.changeset/config.json` currently lists
  `@cascade-ds/storybook` under `ignore`, which excludes it from version
  bumps. That conflicts with the intent of having CI auto-bump Storybook's
  version via Changesets — it should be removed from `ignore` before CI is
  wired to rely on Changesets for that.
