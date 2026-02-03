import type { GameConfig } from "./types";

export const DEFAULT_CONFIG: GameConfig = {
  debug: {
    logLevel: "info",
    logEventHandlerErrors: false,
    showDebugOverlay: false,
  },
  features: {
    flags: {
      "debug.overlay": false,
      "telemetry.enabled": false,
      "save.enabled": false,
      "camera.topDownEnabled": true,
      "camera.threeQuarterEnabled": true,
    },
  },
  tuning: {
    movement: {
      walkVelocity: 4,
      runVelocity: 8,
      jumpVelocity: 10,
      acceleration: 24,
      deceleration: 18,
      profile: "floaty",
    },
    camera: {
      preset: "threeQuarter",
      followSmoothing: 0.12,
    },
  },
};
