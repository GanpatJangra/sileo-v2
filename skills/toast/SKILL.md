---
name: sileo-toast
description: Add consistent Sileo v2 toast notifications to React applications using the shared toast wrapper.
---

# Sileo Toast

Use this skill when adding, replacing, or reviewing toast notifications in a
React application that uses `sileo-v2`.

## Setup

1. Install `sileo-v2`.
2. Import `sileo-v2/styles.css` once in the application entry point.
3. Render one `<Toaster />` near the application root.
4. Copy `lib/toastWrapper.js` into the consuming application.
5. Import `toast` from that wrapper instead of importing `sileo` throughout
   feature code.

## Preferred usage

Use compact notifications for short outcomes:

```js
toast.success("Profile saved");
toast.error("Could not save profile");
toast.warn("Storage is almost full");
toast.info("A new version is ready");
```

Use an expanded notification only when the description adds useful context:

```js
toast.sExpend(
  "Profile saved",
  "Your public details are now visible to your team.",
);
```

Pass native Sileo options through the final argument:

```js
toast.success("Draft saved", {
  position: "bottom-right",
  duration: 4000,
});
```

## Benefits of the wrapper

- Gives feature code a simple, message-first API.
- Centralizes naming and notification conventions.
- Keeps repeated `{ title: message }` mapping out of components.
- Preserves all native Sileo options through the optional final argument.
- Makes a future library migration or application-wide default change local to
  one file.
- Separates brief notifications from expanded notifications with descriptions.
- Makes toast calls straightforward to mock in unit tests.

## Best approach

- Keep exactly one `<Toaster />` mounted.
- Keep notification messages short and action-oriented.
- Use descriptions only when they help the user recover or decide what to do.
- Use success for confirmed completion, error for failed work, warning for risk,
  and info for neutral updates.
- Do not show a toast for information already obvious in the current UI.
- Use `sileo.promise` directly for asynchronous lifecycle notifications, and
  `sileo.update` when one toast must change state without creating duplicates.
- Keep wrapper defaults conservative; pass page-specific timing, position, and
  actions at the call site.
- Preserve accessibility by using meaningful text and avoiding color-only
  distinctions.

## Project references

- Wrapper: `lib/toastWrapper.js`
- Package styles: `sileo-v2/styles.css`
- Package API: `sileo`
