---
name: sileo-toast
description: Add consistent Sileo v2 toast notifications directly to React applications.
---

# Sileo Toast

Use this skill when adding, replacing, or reviewing toast notifications in a
React application that uses `sileo-v2`.

## Setup

1. Install `sileo-v2`.
2. Import `sileo-v2/styles.css` once in the application entry point.
3. Render one `<Toaster />` near the application root.
4. Import `sileo` directly where product feedback is triggered.

Configure stream-wide behavior on that single root toaster:

```tsx
<Toaster
  position="top-right"
  limit={3}
  enqueue={true}
  avoidDuplicates={true}
/>
```

Defaults are `limit={Infinity}`, `enqueue={false}`, and
`avoidDuplicates={false}`. Use `skipQueue: true` on an urgent toast that should
display immediately instead of waiting behind queued notifications.

## Preferred usage

Use compact notifications for short outcomes:

```js
import { sileo } from "sileo-v2";

sileo.success("Profile saved");
sileo.error("Could not save profile");
sileo.warning("Storage is almost full");
sileo.info("A new version is ready");
```

Use an expanded notification only when the description adds useful context:

```js
sileo.success({
  title: "Profile saved",
  description: "Your public details are now visible to your team.",
});
```

Pass native Sileo options through the final argument:

```js
sileo.success({
  title: "Draft saved",
  position: "bottom-right",
  duration: 4000,
});
```

## Benefits of direct usage

- Keeps the integration small with no application wrapper to maintain.
- Provides message-first shortcuts for common notifications.
- Preserves the complete Sileo options API for richer notifications.
- Makes package documentation map directly to application code.
- Supports loading, promise, update, dismiss, action, and clear flows from one
  imported object.

## Best approach

- Keep exactly one `<Toaster />` mounted.
- Keep notification messages short and action-oriented.
- Use descriptions only when they help the user recover or decide what to do.
- Use success for confirmed completion, error for failed work, warning for risk,
  and info for neutral updates.
- Do not show a toast for information already obvious in the current UI.
- Use `sileo.promise` directly for asynchronous lifecycle notifications, and
  `sileo.update` when one toast must change state without creating duplicates.
- Keep global defaults conservative; pass page-specific timing, position, and
  actions at the call site.
- Preserve accessibility by using meaningful text and avoiding color-only
  distinctions.

## Project references

- Package styles: `sileo-v2/styles.css`
- Package API: `sileo`
