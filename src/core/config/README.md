# core/config

Typed configuration and feature flags for the HYTOPIA template.

## Why
- Centralizes tuning (movement, camera)
- Centralizes debug behavior (logging, overlays)
- Enables safe incremental rollout via feature flags

## Usage
```ts
import { loadConfig, isEnabled, DEFAULT_CONFIG } from "./index";

const config = loadConfig({
  debug: { logEventHandlerErrors: true },
  tuning: { camera: { preset: "topDown" } },
});

if (isEnabled(config, "debug.overlay")) {
  // show debug UI
}
```
