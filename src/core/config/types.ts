export type FeatureFlag =
  | "debug.overlay"
  | "telemetry.enabled"
  | "save.enabled"
  | "camera.topDownEnabled"
  | "camera.threeQuarterEnabled";

export type LogLevel = "silent" | "error" | "warn" | "info" | "debug";

export interface DebugConfig {
  logLevel: LogLevel;
  logEventHandlerErrors: boolean;
  showDebugOverlay: boolean;
}

export interface FeatureFlagsConfig {
  flags: Partial<Record<FeatureFlag, boolean>>;
}

export interface MovementTuning {
  /**
   * HYTOPIA DefaultPlayerEntityController uses normalized horizontal velocities:
   * - walkVelocity
   * - runVelocity
   *
   * And an upward jumpVelocity.
   */
  walkVelocity: number;
  runVelocity: number;
  jumpVelocity: number;

  /** Keep these for future custom controllers (not required by default controller). */
  acceleration: number;
  deceleration: number;
  profile: "snappy" | "floaty";
}

export interface CameraTuning {
  preset: "threeQuarter" | "topDown";
  followSmoothing: number;
}

export interface TuningConfig {
  movement: MovementTuning;
  camera: CameraTuning;
}

export interface GameConfig {
  debug: DebugConfig;
  features: FeatureFlagsConfig;
  tuning: TuningConfig;
}
