import type { GameConfig } from "../../core/config";
import { isEnabled } from "../../core/config";
import { gameEvents } from "../../core/events";

import type { TelemetryClient } from "./types";
import { nowMeta } from "./console-telemetry";

type Unsub = () => void;

function shouldLogTelemetry(config: GameConfig): boolean {
  // Keep simple: only track when telemetry flag enabled.
  return isEnabled(config, "telemetry.enabled");
}

export function bindTelemetry(params: {
  config: GameConfig;
  client: TelemetryClient;
  sessionId?: string;
}): { unbind: () => void } {
  const { config, client, sessionId } = params;

  if (!shouldLogTelemetry(config)) {
    return { unbind: () => {} };
  }

  const unsubs: Unsub[] = [];

  // Core lifecycle
  unsubs.push(
    gameEvents.onGame("game.booted", (p) => {
      client.track("game.booted", p, nowMeta({ sessionId }));
    })
  );

  unsubs.push(
    gameEvents.onGame("game.state.changed", (p) => {
      client.track("game.state.changed", p, nowMeta({ sessionId }));
    })
  );

  // Camera
  unsubs.push(
    gameEvents.onGame("camera.preset.changed", (p) => {
      client.track("camera.preset.changed", p, nowMeta({ sessionId }));
    })
  );

  // Player
  unsubs.push(
    gameEvents.onGame("player.spawned", (p) => {
      client.track("player.spawned", p, nowMeta({ sessionId, playerId: p.playerId }));
    })
  );

  unsubs.push(
    gameEvents.onGame("player.movement.mode.changed", (p) => {
      client.track(
        "player.movement.mode.changed",
        p,
        nowMeta({ sessionId, playerId: p.playerId })
      );
    })
  );

  return {
    unbind: () => {
      for (const u of unsubs) u();
    },
  };
}
