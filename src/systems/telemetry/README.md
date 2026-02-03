# systems/telemetry

Telemetry scaffold that subscribes to template events (core/events) and forwards them to a TelemetryClient.

## Why
- Keep analytics decoupled from gameplay logic.
- Swap implementations later (console -> persisted -> external) without refactoring hooks.

## Enablement
Telemetry is gated by config feature flag:
- `features.flags["telemetry.enabled"]`

## Event source
We subscribe to template domain events emitted by GameEventHub.

## Next upgrades
- Add per-player counters using Persisted Player Data once metrics stabilize. (NEEDS_VERIFICATION)
- Add UI inbound telemetry by routing UI messages through a single handler.
