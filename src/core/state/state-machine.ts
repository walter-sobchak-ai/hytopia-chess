import type { GameConfig } from "../config";
import { gameEvents } from "../events";
import type { GameState, GameStateId, LogFn, StateContext } from "./types";

type StateRegistry = Record<GameStateId, GameState>;

export interface StateMachine {
  getState: () => GameStateId;
  transition: (next: GameStateId) => void;
  update: (dt: number) => void;
}

function shouldLog(
  config: GameConfig,
  level: "error" | "warn" | "info" | "debug"
): boolean {
  const order = { silent: 0, error: 1, warn: 2, info: 3, debug: 4 } as const;
  const cfg = config.debug.logLevel;
  if (cfg === "silent") return false;
  return order[level] <= order[cfg as keyof typeof order];
}

export function createStateMachine(params: {
  config: GameConfig;
  states: GameState[];
  initial: GameStateId;
  log?: LogFn;
  now?: () => number;
}): StateMachine {
  const { config } = params;

  const registry = Object.fromEntries(
    params.states.map((s) => [s.id, s])
  ) as StateRegistry;

  const log: LogFn =
    params.log ??
    ((level, message, meta) => {
      if (!shouldLog(config, level)) return;
      // eslint-disable-next-line no-console
      console.log(`[state:${level}] ${message}`, meta ?? "");
    });

  const ctx: StateContext = {
    config,
    events: gameEvents,
    log,
    now: params.now ?? (() => Date.now()),
  };

  let current: GameStateId = params.initial;

  const get = (id: GameStateId): GameState => {
    const s = registry[id];
    if (!s) throw new Error(`State not registered: ${id}`);
    return s;
  };

  // Initialize by entering initial state
  get(current).enter?.(ctx);

  const transition = (next: GameStateId) => {
    if (next === current) return;
    const from = current;
    const fromState = get(from);
    const toState = get(next);

    fromState.exit?.(ctx);
    current = next;

    // Emit the custom template event (HYTOPIA-native EventRouter hub)
    gameEvents.emitGame("game.state.changed", { from, to: next });

    if (shouldLog(config, "info")) {
      log("info", `state transition`, { from, to: next });
    }

    toState.enter?.(ctx);
  };

  const update = (dt: number) => {
    const s = get(current);
    s.update?.(ctx, dt);
  };

  return { getState: () => current, transition, update };
}
