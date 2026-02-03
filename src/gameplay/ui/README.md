# gameplay/ui (HYTOPIA Overlay UI)

UI is built with standard HTML/CSS/JS and loaded per-player via `player.ui.load('ui/index.html')`.

## Messaging
Server -> UI:
- `player.ui.sendData({ ... })`

UI -> Server:
- UI uses `hytopia.sendData({ ... })`
- Server listens with `player.ui.on(PlayerUIEvent.DATA, ({ data }) => ...)`

## Pointer lock
Server can lock/unlock pointer:
- `player.ui.lockPointer(false)` to unlock
- `player.ui.lockPointer(true)` to lock

## Assets in UI
If you reference assets from the assets folder in HTML, prefix with `{{CDN_ASSETS_URL}}` as documented.

## Notes
NEEDS_VERIFICATION:
- `PlayerUIEvent` export path/name in your installed HYTOPIA SDK.
