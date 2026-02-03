import type { InputBindings, InputSnapshot, PlayerInputStateLike } from "./types";

const bool = (v: unknown): boolean => v === true;

const readKey = (input: PlayerInputStateLike, key?: string): boolean => {
  if (!key) return false;
  return bool(input[key]);
};

export const DEFAULT_BINDINGS: InputBindings = {
  // These defaults are placeholders. You should align them with HYTOPIA’s Available Inputs table
  // for the specific game and platform expectations.
  // Keep them configurable per game.
  up: "w",
  down: "s",
  left: "a",
  right: "d",
  jump: "space",
  interact: "e",
  primary: "mouse1",
  secondary: "mouse2",
  sprint: "shift",
  crouch: "ctrl",
};

/**
 * Convert HYTOPIA tick input state into a normalized snapshot.
 * Intended to be called from tickWithPlayerInput(input) or using player.input.
 */
export function buildInputSnapshot(
  input: PlayerInputStateLike,
  bindings: InputBindings = DEFAULT_BINDINGS
): InputSnapshot {
  return {
    up: readKey(input, bindings.up),
    down: readKey(input, bindings.down),
    left: readKey(input, bindings.left),
    right: readKey(input, bindings.right),
    jump: readKey(input, bindings.jump),
    interact: readKey(input, bindings.interact),
    primary: readKey(input, bindings.primary),
    secondary: readKey(input, bindings.secondary),
    sprint: readKey(input, bindings.sprint),
    crouch: readKey(input, bindings.crouch),
  };
}
