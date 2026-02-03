# Patterns Library

## HYTOPIA-native Events Pattern
Use SDK events:
- Listen on instances for specific object events (e.g., one entity).
- Listen on World for world-routed events (e.g., all entity spawns).

Use template custom events:
- Use `gameEvents` (GameEventHub) for domain events like state changes, UI triggers, round lifecycle.
- Keep SDK enums/events and custom string events separate.

Acceptance Criteria
- GameEventHub compiles and is importable from src/core/events
- gameEvents.onGame / onceGame / emitGame works for custom events
- Docs clearly explain SDK events vs custom events, and world-level routing concept

Test Checklist (manual)
1. Create a small script/module that imports gameEvents.
2. Subscribe to "game.state.changed".
3. Emit "game.state.changed" and confirm handler runs.
4. Unsubscribe and confirm handler stops.

---

## Config + Feature Flags Pattern (core/config)
Use when:
- You need consistent tuning and debug controls across games.
- You want to introduce new systems safely behind flags.

Rules:
- All gameplay tuning lives in config, not magic numbers.
- Flags default to false unless explicitly enabled.
- Overrides use loadConfig(...) and preserve defaults.

Acceptance Criteria
- loadConfig() returns a complete GameConfig even with partial overrides
- DEFAULT_CONFIG compiles and is importable
- Feature flags can be checked via isEnabled
- Docs updated with decision and pattern entries

Test Checklist (manual)
1. Import DEFAULT_CONFIG and ensure TS types resolve.
2. Call loadConfig({ tuning: { camera: { preset: "topDown" }}}) and confirm:
   - camera preset changes
   - other defaults remain intact
3. Toggle "telemetry.enabled" and confirm isEnabled returns true.

---

## State Machine Pattern (core/state)
Use when:
- You need clear lifecycle stages (boot/menu/lobby/gameplay/results).
- You want to isolate logic and reduce cross-system coupling.

Rules:
- All transitions go through the state machine (no ad-hoc state vars).
- Emit `game.state.changed` on every transition.
- UI and telemetry subscribe to state change events instead of direct imports.

Acceptance Criteria
- State machine compiles and supports enter/exit/update
- transition() triggers:
  - exit on old state
  - emits game.state.changed
  - enter on new state
- Logging respects config.debug.logLevel
- Module exports are clean via src/core/state/index.ts

Test Checklist (manual)
1. Create a small state list with enter/exit logs.
2. Transition boot → menu → gameplay.
3. Subscribe to gameEvents.onGame("game.state.changed", ...) and confirm it fires each time.
4. Set logLevel to silent and confirm no logs appear.

---

## Camera Presets Pattern (gameplay/camera)
Use when:
- You want consistent camera behavior across games (3/4 vs top-down).
- You want config-driven camera selection.

Rules:
- Apply presets via documented `player.camera` methods only.
- Attach and track the player's controlled entity by default.
- Emit `camera.preset.changed` for UI/telemetry hooks.

Acceptance Criteria
- Module compiles with HYTOPIA imports
- Preset application uses only documented methods
- setupPlayerCamera() selects preset from config.tuning.camera.preset
- Emits camera.preset.changed

---

## Tick-based Input → Intent Pattern (gameplay/input)
Use when:
- You want consistent movement/action logic across keyboard/mouse/controller/mobile.

Rules:
- Read input only from tickWithPlayerInput(input) or player.input.
- Convert to InputSnapshot, then InputIntent.
- Gameplay systems consume intent (move vector + actions), not raw keys.

Acceptance Criteria
- Module compiles
- buildInputSnapshot() works with record-like input state
- snapshotToIntent() produces normalized movement (diagonals normalized)
- Docs make it clear: input is tick-driven

Test Checklist (manual)
1. Create a fake input object { w:true, d:true } and confirm intent move is normalized diagonal.
2. Toggle actions (jump/interact) and confirm booleans flow through.
3. Wire into a PlayerEntity controller tick later (Step 6) and validate with real input.

---

## Player Controller Pattern (gameplay/player)
Use when:
- You want stable, SDK-native player movement with template-level tuning.

Rules:
- Use DefaultPlayerEntityController options for walkVelocity/runVelocity/jumpVelocity.
- Keep additional behavior minimal and event-driven.
- Emit player lifecycle + movement mode events for UI/telemetry.

Acceptance Criteria
- Config includes walkVelocity/runVelocity/jumpVelocity and template compiles.
- TemplatePlayerController extends HYTOPIA default controller and overrides tickWithPlayerInput safely.
- spawnDefaultPlayer() spawns a player and emits player.spawned.

---

## Overlay UI Shell Pattern (gameplay/ui)
Use when:
- You need a HUD, toasts, menus, or debug overlay that sits on top of the game scene.

Rules:
- UI loads per player via player.ui.load('ui/index.html').
- Server -> UI uses player.ui.sendData({ type, payload }).
- UI -> Server uses hytopia.sendData({ type, ... }).
- Server listens for PlayerUIEvent.DATA and routes messages through a single handler.
- Unlock pointer when presenting interactive UI; relock afterward.

Acceptance Criteria
- assets/ui/index.html loads without <html>/<head>/<body> tags.
- Server can:
  - load UI (player.ui.load)
  - send toasts/HUD/debug updates (player.ui.sendData)
- UI receives messages using hytopia.onData(...).
- Pointer lock can be controlled using player.ui.lockPointer(true/false).

---

## Telemetry Subscriber Pattern (systems/telemetry)
Use when:
- You want consistent event instrumentation across games without polluting gameplay code.

Rules:
- Telemetry listens to domain events; gameplay emits domain events.
- Gate telemetry by feature flag: "telemetry.enabled".
- Use a TelemetryClient interface to keep sinks swappable (console/persisted/external).

Acceptance Criteria
- Telemetry can be enabled/disabled via features.flags["telemetry.enabled"]
- bindTelemetry() subscribes and returns unbind() that cleanly detaches handlers
- Console telemetry produces structured logs for the subscribed events
- No dependence on undocumented HYTOPIA telemetry features
