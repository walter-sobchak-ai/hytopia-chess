# gameplay/input (HYTOPIA-native)

HYTOPIA sends player input state to the server each tick. Entity controllers can consume it via `tickWithPlayerInput()` for PlayerEntity-controlled entities.

This module converts raw input state into:
- InputSnapshot (booleans)
- InputIntent (normalized move vector + actions)

## Intended usage
In your PlayerEntity controller:
1) `snapshot = buildInputSnapshot(input, bindings)`
2) `intent = snapshotToIntent(snapshot)`
3) pass `intent` to movement/combat logic

## Mobile support
Mobile UIs can press input state keys into the same system, so downstream logic remains unchanged.

## Notes
NEEDS_VERIFICATION:
- Exact HYTOPIA input key names for your target platform(s).
