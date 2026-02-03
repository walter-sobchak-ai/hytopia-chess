# yhg-hytopia-template: Architecture (v1)

## Purpose
A reusable HYTOPIA starter kit for building multiple original games quickly with consistent architecture, conventions, and documentation.

## Design goals
- Reusable across genres (combat, cozy, wave survival, social hub)
- Predictable file targets and module boundaries
- Minimal coupling between systems
- Easy to extend without rewrites
- “Learning loop” captured via docs and versioning

## Non-goals (v1)
- Full economy/inventory system
- Full combat framework
- Full matchmaking
- Heavy content pipeline tooling
- ECS framework (may be v2+)

## Core concepts
### Modules over frameworks
Each capability lives in a module with:
- clear responsibility
- typed interfaces
- minimal dependencies

### Game state machine
- Explicit states (e.g., boot → menu → lobby → gameplay → results)
- State transitions are centralized and logged

### Event bus
- Systems communicate through events rather than direct calls where possible
- Events are typed and documented

### Configuration and feature flags
- All tuning values live in config
- Feature flags allow safe incremental rollout

## Directory structure (v1)
```txt
/docs
  ARCHITECTURE.md
  CONVENTIONS.md
  QUICKSTART.md
  CHECKLIST_RELEASE.md
  PATTERNS_LIBRARY.md
  DECISION_LOG.md
  POSTMORTEMS/
/src
  core/
  config/
  events/
  state/
  logging/
  gameplay/
  input/
  camera/
  player/
  ui/
  systems/
  telemetry/
  save/
  content/
  placeholders/
/tools
/tests
```

## Key modules (v1)
- core/config: loads + validates config, typed accessors, feature flags
- core/events: typed event bus, naming conventions, subscription lifecycle
- core/state: state machine + transitions, entry/exit hooks
- core/logging: logger abstraction, debug levels
- gameplay/input: action map (move/interact/pause), normalization, rebind-ready structure
- gameplay/camera: presets (3/4, top-down), follow + smoothing, bounds/dead-zone optional
- gameplay/player: controller interface, movement tuning profiles, spawn handling
- gameplay/ui: minimal HUD slots, toasts/notifications, debug overlay toggle
- systems/save: save/profile interface scaffolding, local placeholder, future remote adapter
- systems/telemetry: telemetry interface scaffolding, standard events

## Extension strategy
New games extend via:
- new modules under `/src/gameplay` or `/src/systems`
- configuration changes
- content assets under `/src/content`

**Rule:** no copy-pasting entire systems across repos.

## Quality gates (v1)
- Consistent file naming
- Typed public interfaces for modules
- No cross-module imports that bypass interfaces
- Every module has:
  - README block comment at top (purpose + exports)
  - basic test or a “manual test checklist” entry in docs

## Learning loop
Template improvement is driven by:
- `docs/PATTERNS_LIBRARY.md`
- `docs/DECISION_LOG.md`
- `docs/POSTMORTEMS/`
- `CHANGELOG.md`

No changes without:
- a short reason (Decision Log)
- a version bump entry (Changelog)
