# Decision Log

Purpose: record decisions that involve trade-offs so future you (and agents) can move fast without re-debating.

## Rules
- Write a decision when:
  - you chose between two viable options
  - you accepted a trade-off intentionally
  - you are locking a convention that affects multiple modules
- Keep entries short.
- Link to files/modules involved.

---

## Template Decisions

### 2026-02-01: HYTOPIA-native event approach
Decision:
- Use HYTOPIA-style EventRouter patterns for custom game events (GameEventHub).

Why:
- Aligns template with HYTOPIA’s event model and reduces duplicate patterns.

Trade-offs:
- Typed adapter required to keep custom event payloads safe.

---

### 2026-02-01: Typed config + feature flags (core/config)
Decision:
- Add a typed config module with defaults, override loading, and feature flags.

Why:
- Tuning values will change frequently during game iteration.
- Flags allow us to ship template improvements safely without breaking games.

Trade-offs:
- v1 uses explicit nested merges instead of a deep-merge dependency.
- Env-based overrides are deferred until we know the runtime model we want.

---

### 2026-02-01: State machine skeleton (core/state)
Decision:
- Add a typed state machine with enter/exit/update hooks.
- Emit `game.state.changed` via the HYTOPIA-native custom event hub (`gameEvents`).

Why:
- Explicit lifecycle prevents logic sprawl and improves reusability across game genres.
- Events keep UI/telemetry decoupled from gameplay modules.

Trade-offs:
- v1 uses a simple registry and does not include hierarchical states.
- Update loop is optional per state; heavy systems will be added later.

---

### 2026-02-01: HYTOPIA-dependent camera presets (gameplay/camera)
Decision:
- Implement camera presets using documented `player.camera` APIs (mode, attachment, tracking, offset, film offset, FOV, zoom).

Why:
- Keeps the template aligned with HYTOPIA's camera model.
- Presets are reusable and tunable per game without rewriting camera logic.

Trade-offs:
- followSmoothing is stored in config but not applied in v1 because docs do not show a direct smoothing setter (needs verification via API reference).

---

### 2026-02-01: HYTOPIA tick-based input normalization (gameplay/input)
Decision:
- Normalize HYTOPIA per-tick input state into a reusable InputSnapshot and InputIntent.

Why:
- HYTOPIA inputs arrive each tick (tickWithPlayerInput / player.input), which is the intended control flow.
- Downstream systems should not care about raw key names; they should consume intent.

Trade-offs:
- Default bindings are placeholders and must be aligned with HYTOPIA “Available Inputs” per project.
- We keep the input shape flexible and adapt in one place if the SDK shape changes.

---

### 2026-02-01: Player module uses DefaultPlayerEntityController (gameplay/player)
Decision:
- Implement TemplatePlayerController by extending HYTOPIA DefaultPlayerEntityController.
- Drive walk/run/jump tuning via core/config.

Why:
- Keeps player movement SDK-native and aligned with HYTOPIA’s evolving default controller.
- Avoids reinventing physics and input edge cases early.

Trade-offs:
- Acceleration/deceleration fields in config are reserved for a future fully custom controller.
- Mode detection is lightweight (walk/run/idle) and is used for event hooks only.

---

### 2026-02-01: UI shell via Overlay UI (gameplay/ui)
Decision:
- Implement UI using HYTOPIA Overlay UI loaded per-player via player.ui.load('ui/index.html').
- Standardize server↔UI communication via JSON messages (player.ui.sendData + hytopia.onData/sendData).

Why:
- Overlay UI is designed for HUD, menus, timers, leaderboards, etc.
- Messaging is intentionally simple and supports arbitrary JSON-compatible objects.
- We can control pointer lock from server for better UX.

Trade-offs:
- v1 UI is framework-free and minimal; richer UIs can be added later (React/Svelte) as long as they bundle to an entry .html file.

---

### 2026-02-01: Telemetry hooks subscribe to template events (systems/telemetry)
Decision:
- Implement telemetry as a subscriber to template domain events (GameEventHub) with a pluggable TelemetryClient.

Why:
- HYTOPIA development is event-centric; a subscriber model avoids coupling.
- A client interface lets us swap console logging for persisted or external analytics later.

Trade-offs:
- v1 does not assume a HYTOPIA “telemetry API.”
- v1 captures only lifecycle and a few core signals; expand once a game loop is validated.
