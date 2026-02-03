# yhg-hytopia-template Quickstart (v1)

## Node version
Use **Node 22 LTS** (see `.nvmrc`). Newer Node versions may crash the HYTOPIA runtime.

This template provides reusable modules for:
- core/events (HYTOPIA-native custom events hub)
- core/config (typed config + feature flags)
- core/state (state machine)
- gameplay/camera (presets)
- gameplay/input (intent normalization)
- gameplay/player (DefaultPlayerEntityController-based controller + spawn factory)
- gameplay/ui (Overlay UI shell)
- systems/telemetry (subscriber hooks + pluggable client)

## 1) Project entrypoint
This template provides a runnable game entrypoint at `index.ts`.

Under the hood it calls `startServer((world) => { ... })` (see `examples/bootstrap/index.ts`).

Inside the callback:
- Load the map
- Bind world events (player join/leave)
- Initialize systems

## 2) Assets
Put your map and assets under `assets/`.

This repo includes a placeholder `assets/map.json`, but **map loading is disabled by default** until you export a real map.

Typical map load:
- `import worldMap from './assets/map.json'`
- `world.loadMap(worldMap)`

## 3) Overlay UI
UI lives under `assets/ui/index.html` and is loaded per player:
- `player.ui.load('ui/index.html')`

Use server↔UI JSON messaging:
- Server: `player.ui.sendData(...)`
- UI: `hytopia.onData(...)` and `hytopia.sendData(...)`

## 4) Feature flags
Key v1 flags:
- `telemetry.enabled`
- `debug.overlay`

## 5) Recommended “hello world” wiring
Use PlayerManager + Player events:
- `PlayerManager.instance.on(PlayerManagerEvent.PLAYER_CONNECTED, ({ player }) => { ... })`
- `player.on(PlayerEvent.JOINED_WORLD, ({ world }) => { ... })`:
  - spawn player entity
  - load overlay UI
  - setup camera
  - toast “welcome”
  - track in a Map for cleanup on leave
- `player.on(PlayerEvent.LEFT_WORLD, ...)`:
  - despawn only that player's entity

See `examples/bootstrap/index.ts`.
