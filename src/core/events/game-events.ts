import { EventRouter } from "hytopia";

/**
 * Custom (game-defined) events.
 * Keep these separate from HYTOPIA SDK enums/events.
 *
 * Add to this map as your template grows.
 */
export type GameEventMap = {
  "game.booted": { timestamp: number };
  "game.state.changed": { from: string; to: string };
  "camera.preset.changed": { preset: "threeQuarter" | "topDown" };
  "player.spawned": { playerId: string };
  "player.movement.mode.changed": { playerId: string; mode: "walk" | "run" | "idle" };
  "ui.toast.show": {
    message: string;
    tone?: "info" | "success" | "warning" | "error";
  };
};

/**
 * A HYTOPIA-native event hub for custom game events.
 *
 * Depends on the SDK EventRouter pattern (.on/.once/.off).
 * This keeps your template consistent with how World/Entity events work.
 */
export class GameEventHub extends EventRouter {
  emitGame<K extends keyof GameEventMap>(event: K, payload: GameEventMap[K]): void {
    // HYTOPIA SDK `EventRouter` supports a string overload for custom events.
    // Keep usage narrow and typed here: if the SDK signature changes, only this adapter should need updates.
    this.emit(event as string, payload as any);
  }

  onGame<K extends keyof GameEventMap>(
    event: K,
    handler: (payload: GameEventMap[K]) => void
  ): () => void {
    // Use the string overload (custom game-defined events).
    this.on(event as string, handler as unknown as (payload: any) => void);
    return () => {
      this.off(event as string, handler as unknown as (payload: any) => void);
    };
  }

  onceGame<K extends keyof GameEventMap>(
    event: K,
    handler: (payload: GameEventMap[K]) => void
  ): () => void {
    this.once(event as string, handler as unknown as (payload: any) => void);
    return () => {
      // Cancel safety: if handler is still registered, remove it.
      this.off(event as string, handler as unknown as (payload: any) => void);
    };
  }
}

/** Singleton for v1 template simplicity. Can be injected later if desired. */
export const gameEvents = new GameEventHub();
