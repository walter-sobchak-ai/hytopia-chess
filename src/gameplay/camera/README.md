# gameplay/camera (HYTOPIA-dependent)

Camera presets implemented using HYTOPIA `player.camera` controls.

## HYTOPIA APIs used
- `player.camera.setMode(...)`
- `player.camera.setAttachedToEntity(entity)`
- `player.camera.setTrackedEntity(entity)`
- `player.camera.setOffset({x,y,z})`
- `player.camera.setFilmOffset(number)`
- `player.camera.setFov(number)`
- `player.camera.setZoom(number)`

## Usage
Call `setupPlayerCamera({ config, player, playerEntity })` when a player joins and you create/spawn their controlled entity.

Presets are defined in `presets.ts` and can be tuned per game.

## Notes
NEEDS_VERIFICATION:
- Exact enum/type names for `PlayerCameraMode` and camera methods for your installed HYTOPIA SDK version.
