# Cursor Instruction Packet: Event Bus Module v1

**TARGET REPO:** `yhg-hytopia-template`

**TARGET BRANCH:** `feat/event-bus`

## Goal
Create a HYTOPIA-native events module using the SDK’s *EventRouter-like* pattern for custom game events, and document how we consume SDK events (World/Entity/etc.).

## Constraints
- Language: TypeScript
- Architecture: simple modules
- Depend on HYTOPIA SDK events model (`.on` / `.once` / `.off`) **only where verified**
- Do not invent SDK event enums or payload types
- Only demonstrate with placeholder **custom events** that we define ourselves

## Files in scope
Create:
- `src/core/events/game-events.ts`
- `src/core/events/index.ts`
- `src/core/events/README.md`

Update:
- `docs/PATTERNS_LIBRARY.md`
- `docs/DECISION_LOG.md`

## Implementation spec
### What we’re building
- **GameEventHub**: a custom-event hub for your game, implemented using an event-router style approach.
- **Docs**: how to listen to:
  - SDK events at instance level (e.g., `entity.on(...)`) **NEEDS_VERIFICATION**
  - SDK events at world level (e.g., `world.on(...)`) **NEEDS_VERIFICATION**
  - Custom game events (e.g., `gameEvents.on(...)`)

### Why we still need a “hub”
HYTOPIA gives you SDK events everywhere, but you still want a single place for your domain events (round start, score changed, objective completed) that aren’t tied to a specific SDK class.

## Acceptance criteria
- `GameEventHub` supports `on`, `once`, `off`, `emit` for typed custom events
- Module has a small public surface exported via `src/core/events/index.ts`
- `src/core/events/README.md` documents the patterns and explicitly labels SDK-specific parts as **NEEDS_VERIFICATION** until confirmed
- Pattern and decision are recorded (minimal entries)

## Test checklist
- Compile/typecheck (if project has TS config) **NEEDS_VERIFICATION**
- Manual: create a small local snippet that subscribes to an event and receives payload

## Risks / assumptions
- Known: HYTOPIA SDK specifics are not confirmed in this packet.
- Assumed: Custom events can be implemented independent of SDK types.
- Needs verification: Actual HYTOPIA event subscription API and event names.
