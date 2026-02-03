# core/events (HYTOPIA-native)

This module standardizes events in the template.

## SDK events (HYTOPIA)
HYTOPIA SDK classes are event emitters (EventRouter pattern). You can listen at the instance level (e.g., entity) or at the world level.

Examples (conceptual — NEEDS_VERIFICATION for exact types/event enums):
- `entity.on(EntityEvent.TICK, ...)`
- `world.on(EntityEvent.SPAWN, ...)`

World-level routing lets you listen for events from all instances in a world.

## Custom game events (template-defined)
Use `gameEvents` for domain events not covered by SDK enums.

Example:
```ts
import { gameEvents } from "./index";

const unsub = gameEvents.onGame("game.state.changed", ({ from, to }) => {
  console.log(`state: ${from} -> ${to}`);
});

gameEvents.emitGame("game.state.changed", { from: "menu", to: "gameplay" });

unsub();
```

## Notes
NEEDS_VERIFICATION:
- Correct import path/name for `EventRouter` from the HYTOPIA SDK.
- Exact method signatures for `on` / `once` / `off` / `emit`.
- The actual SDK event enums/names (e.g., `EntityEvent.TICK`).
