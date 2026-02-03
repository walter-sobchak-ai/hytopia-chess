import type { GameConfig } from "./types";
import { DEFAULT_CONFIG } from "./defaults";

/**
 * Load config by merging overrides on top of DEFAULT_CONFIG.
 * v1 uses explicit nested merges to avoid deep-merge dependencies.
 */
export function loadConfig(overrides?: Partial<GameConfig>): GameConfig {
  if (!overrides) return DEFAULT_CONFIG;
  return {
    ...DEFAULT_CONFIG,
    ...overrides,
    debug: {
      ...DEFAULT_CONFIG.debug,
      ...(overrides.debug ?? {}),
    },
    features: {
      ...DEFAULT_CONFIG.features,
      ...(overrides.features ?? {}),
      flags: {
        ...DEFAULT_CONFIG.features.flags,
        ...(overrides.features?.flags ?? {}),
      },
    },
    tuning: {
      ...DEFAULT_CONFIG.tuning,
      ...(overrides.tuning ?? {}),
      movement: {
        ...DEFAULT_CONFIG.tuning.movement,
        ...(overrides.tuning?.movement ?? {}),
      },
      camera: {
        ...DEFAULT_CONFIG.tuning.camera,
        ...(overrides.tuning?.camera ?? {}),
      },
    },
  };
}

/**
 * Feature flag helper. Unknown flags default to false.
 */
export function isEnabled(
  config: GameConfig,
  flag: keyof GameConfig["features"]["flags"]
): boolean {
  return Boolean(config.features.flags[flag as never]);
}
