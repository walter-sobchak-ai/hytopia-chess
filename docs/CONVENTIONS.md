# Conventions (v1)

## Naming
- Folders: lowercase, hyphen-free (e.g., `player`, `telemetry`)
- Files:
  - kebab-case for utilities (e.g., `event-bus.ts`)
  - PascalCase for classes if used (e.g., `PlayerController.ts`)
- Types/interfaces: PascalCase
- Functions: camelCase
- Constants: UPPER_SNAKE_CASE

## Module rules
- Each module exposes a small public surface:
  - `index.ts` re-exports public items
- Modules must not import deep internals from other modules:
  - ✅ Allowed: `import { X } from "../events"` (module index)
  - ❌ Not allowed: `import { X } from "../events/internal/..."`

## Event naming
- Use namespace-style strings:
  - `game.state.changed`
  - `player.spawned`
  - `ui.toast.show`
- Events must have typed payloads.

## Config rules
- No magic numbers in gameplay logic
- Tuning values live in config (movement speed, acceleration, camera smoothing, etc.)
- Feature flags default to OFF unless required.

## Logging rules
- Log state transitions and major lifecycle events
- Debug logs must be toggleable
- No noisy per-frame logs unless explicitly gated

## Testing rules (v1)
- Prefer manual test checklists per system at first
- Add automated tests where stable and valuable
- Every PR/change should include:
  - what to test
  - expected result

## Git conventions
- Commit messages:
  - `feat(template): add typed event bus`
  - `fix(camera): clamp follow bounds`
  - `docs: update architecture notes`
- Branch naming:
  - `feat/event-bus`
  - `fix/player-spawn`
  - `docs/quickstart`

## Documentation rules
- Update docs when behavior changes
- Patterns must be captured in `docs/PATTERNS_LIBRARY.md`
- Decisions must be recorded in `docs/DECISION_LOG.md`
- Postmortems are required after each game build sprint
