<div align="center">
  <h1>Sileo v2</h1>
  <p>Animated, physics-based toast notifications for React and TypeScript.</p>
  <p>
    <a href="https://www.npmjs.com/package/sileo-v2"><img src="https://img.shields.io/npm/v/sileo-v2" alt="npm version"></a>
    <a href="https://www.npmjs.com/package/sileo-v2"><img src="https://img.shields.io/npm/dm/sileo-v2" alt="npm downloads"></a>
    <a href="https://github.com/GanpatJangra/sileo-v2/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/sileo-v2" alt="license"></a>
  </p>
  <p><a href="https://sileo-v2-demo.vercel.app/"><strong>Live demo and playground</strong></a> &nbsp; / &nbsp; <a href="https://sileo-v2-demo.vercel.app/#usage">How to use</a> &nbsp; / &nbsp; <a href="https://sileo-v2-demo.vercel.app/changelog">Changelog</a> &nbsp; / &nbsp; <a href="https://www.npmjs.com/package/sileo-v2">npm</a></p>
  <video src="https://github.com/user-attachments/assets/a292d310-9189-490a-9f9d-d0a1d09defce"></video>
</div>

Sileo v2 is a lightweight React toast notification library for success, error,
warning, information, loading, action, and promise-based states. It ships with
TypeScript declarations, smooth physics-inspired animations, six viewport
positions, and customizable content and styling.

## Features

- Physics-inspired animated toast transitions
- Promise-aware loading, success, error, and action states
- Six responsive toast positions
- Custom icons, descriptions, buttons, colors, and class names
- Automatic expand/collapse behavior and swipe-to-dismiss interaction
- TypeScript declarations and React 18+ support
- ESM and CommonJS package exports

## Installation

```bash
npm install sileo-v2
```

## Getting Started

Render one `Toaster` near the root of your app, then call `sileo` from anywhere
in your client-side code.

```tsx
import { sileo, Toaster } from "sileo-v2";
import "sileo-v2/styles.css";

export default function App() {
  return (
    <>
      <Toaster position="top-right" />
      <YourApp />
    </>
  );
}
```

```tsx
sileo.success("Saved");
```

Try every state and copy complete examples in the
[interactive playground](https://sileo-v2-demo.vercel.app/).

## Basic Toasts

```tsx
sileo.show("Default toast");
sileo.success("Saved");
sileo.error("Something went wrong");
sileo.warning("Check this first");
sileo.info("Heads up");
```

## Limit, Queue, and Duplicates

Configure stream behavior once on the root `Toaster`. These options are
framework-independent React props.

```tsx
<Toaster
  position="top-right"
  limit={3}
  enqueue={true}
  avoidDuplicates={true}
/>
```

The defaults preserve Sileo's existing behavior:

```tsx
<Toaster
  position="top-right"
  limit={Infinity}
  enqueue={false}
  avoidDuplicates={false}
/>
```

- `limit` controls the maximum number of active notifications.
- With `enqueue={false}`, a new toast dismisses the oldest visible toast after
  the limit is reached.
- With `enqueue={true}`, new toasts wait and are displayed in order as visible
  slots become available.
- `avoidDuplicates={true}` reuses an active toast when its state, title,
  description, and position match.
- Promise notifications remain queued while their state updates and render
  their latest state when promoted.

Use `skipQueue` when one notification must appear immediately:

```tsx
sileo.info({
  title: "This notification is displayed immediately",
  skipQueue: true,
});
```

When the visible limit is full, `skipQueue` dismisses the oldest visible toast
to make room.

## Loading Toasts

Use `sileo.loading` when an async action starts. It returns a toast id, so you can
update the same toast after the action finishes.

```tsx
const id = sileo.loading({ title: "Uploading" });

try {
  await uploadFile();

  sileo.update(id, {
    title: "Uploaded",
    description: "Your file is ready.",
    state: "success",
  });
} catch {
  sileo.update(id, {
    title: "Upload failed",
    description: "Please try again.",
    state: "error",
  });
}
```

Loading toasts are persistent by default. Pass a `duration` if you want the
loading toast to auto-dismiss.

```tsx
sileo.loading({
  title: "Syncing...",
  duration: 8000,
});
```

## Promise Toasts

If you prefer Sileo to watch a promise directly, use `sileo.promise`.

```tsx
sileo.promise(fetchData(), {
  loading: "Loading...",
  success: "Done!",
  error: "Failed",
});
```

You can return full toast options from callbacks for richer messages.

```tsx
sileo.promise(fetchUsers(), {
  loading: "Loading users...",
  success: (users) => ({
    title: "Users loaded",
    description: `${users.length} users are ready.`,
  }),
  error: (error) => ({
    title: "Could not load users",
    description: error instanceof Error ? error.message : "Please try again.",
  }),
});
```

## Options

Most APIs accept the same toast options.

```ts
type SileoOptions = {
  id?: string;
  state?: "success" | "loading" | "error" | "warning" | "info" | "action";
  title?: string;
  description?: React.ReactNode | string;
  position?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
  duration?: number | null;
  icon?: React.ReactNode | null;
  fill?: string;
  roundness?: number;
  autopilot?: boolean | { expand?: number; collapse?: number };
  button?: {
    title: string;
    onClick: () => void;
  };
  skipQueue?: boolean;
};
```

Set `duration: null` for a persistent toast. Omit `id` for a new toast, or pass a
stable `id` when you intentionally want future calls to update the same toast.
