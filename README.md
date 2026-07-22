<div align="center">
  <h1>Sileo</h1>
  <p>An opinionated, physics-based toast component for React.</p>
  <p><a href="https://sileo.aaryan.design">Try Out</a> &nbsp; / &nbsp; <a href="https://sileo.aaryan.design/docs">Docs</a></p>
  <video src="https://github.com/user-attachments/assets/a292d310-9189-490a-9f9d-d0a1d09defce"></video>
</div>

## Installation

```bash
npm i sileo-v2
```

## Getting Started

Render one `Toaster` near the root of your app, then call `sileo` from anywhere
in your client-side code.

```tsx
import { sileo, Toaster } from "sileo-v2";

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
sileo.success({ title: "Saved" });
```

For detailed docs, visit https://sileo.aaryan.design.

## Basic Toasts

```tsx
sileo.show({ title: "Default toast" });
sileo.success({ title: "Saved" });
sileo.error({ title: "Something went wrong" });
sileo.warning({ title: "Check this first" });
sileo.info({ title: "Heads up" });
```

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
};
```

Set `duration: null` for a persistent toast. Omit `id` for a new toast, or pass a
stable `id` when you intentionally want future calls to update the same toast.
