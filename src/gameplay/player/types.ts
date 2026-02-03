import type { GameConfig } from "../../core/config";

export interface PlayerSpawnOptions {
  name?: string;
  modelUri?: string;
  modelScale?: number;
  spawn: { x: number; y: number; z: number };
}

export interface PlayerControllerDeps {
  config: GameConfig;
}
