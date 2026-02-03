import type { GameConfig } from "../config";
import type { GameEventHub } from "../events";

export type GameStateId = "boot" | "menu" | "lobby" | "gameplay" | "results";

export type LogFn = (
  level: "error" | "warn" | "info" | "debug",
  message: string,
  meta?: unknown
) => void;

export interface StateContext {
  config: GameConfig;
  events: GameEventHub;
  log: LogFn;
  now: () => number;
}

export interface GameState {
  id: GameStateId;
  enter?: (ctx: StateContext) => void;
  exit?: (ctx: StateContext) => void;
  update?: (ctx: StateContext, dt: number) => void;
}
