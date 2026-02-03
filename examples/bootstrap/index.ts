import {
  startServer,
  PlayerEvent,
  PlayerManagerEvent,
  EventRouter,
  type DefaultPlayerEntity,
} from "hytopia";

// Map load pattern (place map.json in /assets).
// NOTE: The included placeholder map may not be a valid HYTOPIA WorldMap.
// Leave map loading disabled until you have a real exported map.
// import worldMap from "../../assets/map.json";

import { loadConfig } from "../../src/core/config";
import { gameEvents } from "../../src/core/events";
import { createConsoleTelemetry, bindTelemetry } from "../../src/systems/telemetry";
import { spawnDefaultPlayer } from "../../src/gameplay/player";
import { setupPlayerCamera } from "../../src/gameplay/camera";
import {
  loadOverlayUi,
  toast,
  setHudText,
  bindUiInbound,
  setDebugOverlay,
} from "../../src/gameplay/ui";

/**
 * Minimal bootstrap showing how to wire the template modules together.
 * Intended to be copied into a real game's root `index.ts`.
 */
startServer((world) => {
  // 1) Config (override defaults here per game/environment)
  const config = loadConfig({
    features: { flags: { "telemetry.enabled": true } },
    debug: { logLevel: "info", showDebugOverlay: false, logEventHandlerErrors: false },
  });

  // 2) Load map (recommended default)
  // world.loadMap(worldMap as any);

  // 3) Telemetry (subscribes to template events)
  const telemetryClient = createConsoleTelemetry({ prefix: "yhg" });
  const telemetry = bindTelemetry({ config, client: telemetryClient, sessionId: "dev" });

  // Optional: emit a boot event once your init wiring is done
  gameEvents.emitGame("game.booted", { timestamp: Date.now() });

  // 4) Track player entities for cleanup (avoid despawning everyone on leave)
  const playerEntities = new Map<string, DefaultPlayerEntity>();

  // 5) Player lifecycle
  // NOTE: PlayerEvent is emitted by Player instances. Connected/disconnected is emitted by PlayerManager.
  // PlayerManager emits global events on the global EventRouter instance.
  const globalEvents = EventRouter.globalInstance;

  globalEvents.on(PlayerManagerEvent.PLAYER_CONNECTED, ({ player }) => {
    // When a player joins a world, we do our per-world bootstrapping.
    player.on(PlayerEvent.JOINED_WORLD, ({ world }) => {
      const playerId = String(player.id);

      // UI
      loadOverlayUi(player);
      bindUiInbound({
        world,
        player,
        config,
        onMessage: (msg) => {
          // Keep v1 minimal. You can route UI -> server actions here later.
          if (msg.type === "ui.ready") {
            toast(player, "UI ready", "success");
          }
        },
      });

      // Spawn player entity (DefaultPlayerEntity-based factory)
      const entity = spawnDefaultPlayer({
        world,
        player,
        config,
        spawnOptions: {
          name: "Player",
          spawn: { x: 0, y: 10, z: 0 },
        },
      });

      playerEntities.set(playerId, entity);

      // Camera (preset selected by config.tuning.camera.preset)
      setupPlayerCamera({ config, player, playerEntity: entity });

      // HUD + toast
      setHudText(player, "topRight", `@${player.username}`);
      toast(player, "Welcome!", "info");

      // Debug overlay, gated by config
      if (config.debug.showDebugOverlay) {
        setDebugOverlay(player, true, `debug: playerId=${playerId}`);
      }
    });

    player.on(PlayerEvent.LEFT_WORLD, () => {
      const playerId = String(player.id);
      const entity = playerEntities.get(playerId);

      // Despawn only what we spawned for this player.
      entity?.despawn();

      playerEntities.delete(playerId);
    });
  });

  // If you need to fully detach telemetry on shutdown later:
  // telemetry.unbind();
  void telemetry;
});
