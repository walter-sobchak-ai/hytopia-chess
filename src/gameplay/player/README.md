# gameplay/player (HYTOPIA-dependent)

Spawns player entities and assigns a config-driven controller built on HYTOPIA’s DefaultPlayerEntityController.

## Why
- Keeps movement SDK-native and stable.
- Allows template-wide tuning via core/config.
- Emits template events for UI/telemetry hooks.

## Notes
NEEDS_VERIFICATION:
- Exact import names/types for DefaultPlayerEntity/Controller for your installed HYTOPIA SDK.
- Exact `player.id` / `player.username` fields.
