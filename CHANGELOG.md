# Changelog

All notable changes to Sileo v2 are documented here.

## Unreleased

### Added

- Global `limit`, `enqueue`, and `avoidDuplicates` controls on `<Toaster />`.
- Per-toast `skipQueue` support for urgent notifications.
- Queue-aware promise updates that preserve the latest state until promotion.

## [0.1.1] - 2026-07-28

### Added

- String shorthand for `sileo.show`, state helpers, and `sileo.update`.
- Configurable `--sileo-foreground` variable for toast description contrast.
- Interactive demo covering every toast state and lifecycle method.
- Light and dark themes, copy-ready examples, and a complete usage guide.

### Fixed

- Prevented a stale dismissal timer from removing a newer toast that reused the
  same public ID.
- Fixed low-contrast description text on pale toast backgrounds in dark pages.
- Made Vercel builds work from either the repository root or `demo` directory.

### Documentation

- Added the live playground at <https://sileo-v2-demo.vercel.app/>.
- Updated examples to use direct string messages where appropriate.

## [0.1.0] - 2026-07-22

### Fix toast persistence, make SVG filter IDs safe, and clean up pointer capture

Merged by `sahilbhardwaj1` into `main` from
`codex/find-and-fix-bugs-with-security-review`.

- 6 commits
- 5 files changed
- 191 additions
- 26 deletions

### Motivation

- Persistent toasts using `duration: null` were falling back to the default
  timeout and dismissing automatically.
- SVG filter IDs were derived from public toast IDs, allowing unsafe characters
  or collisions to break `url(#...)` references.
- Pointer capture was not always released after gesture cancellation or
  completion, which could leave interrupted swipes visually stuck.

### Changes

- Preserved `null` as the explicit persistent-toast duration while using the
  default duration only when the value is `undefined`.
- Updated the toast scheduler and `createToast` return data to preserve the
  corrected duration semantics.
- Generated internal SVG filter IDs from React `useId()`, sanitized through
  `SVG_ID_SAFE`, and memoized them to avoid collisions.
- Released pointer capture on pointer-up and pointer-cancel, reset swipe state,
  and added `pointercancel` handling.
- Added loading and update APIs.
- Simplified promise toast messages.
- Added and later removed the experimental manual promise controller.
- Refreshed README usage documentation.

### Commits

- `8c94815` Fix toast persistence and SVG ID safety
- `ab0f3c5` Add toast loading and update API
- `55ac29f` Simplify promise toast messages
- `a1ca9e2` Add manual promise toast controller
- `2adfd0c` Refresh README usage docs
- `d9a6f47` Remove push alias and manual promise controller
- `4cef924` Merge into main

### Validation

- `git diff --check` passed without whitespace issues.
- `bun run build` produced the package distribution artifacts.
- `bun pm ls --all` was used to inspect the dependency graph.
- Type checking was blocked in that environment by missing React declarations
  and a CSS import declaration.
- `npm audit --omit=dev` was blocked because no `package-lock.json` existed.
