/**
 * Minimal shape we need from HYTOPIA player input state.
 * HYTOPIA sends inputs each tick to tickWithPlayerInput(), and also exposes player.input.
 * We only rely on "is key pressed" access by key name.
 *
 * If HYTOPIA's exact input object shape differs, adapt in ONE place: input-snapshot.ts.
 */
export type InputKey = string;

export interface PlayerInputStateLike {
  // Many HYTOPIA examples treat input as key->boolean state.
  // Keep it flexible: record-based.
  [key: InputKey]: unknown;
}

export interface InputBindings {
  // Movement keys
  up: InputKey;
  down: InputKey;
  left: InputKey;
  right: InputKey;

  // Actions
  jump?: InputKey;
  interact?: InputKey;
  primary?: InputKey;
  secondary?: InputKey;
  sprint?: InputKey;
  crouch?: InputKey;
}

export interface InputSnapshot {
  // Movement
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;

  // Actions
  jump: boolean;
  interact: boolean;
  primary: boolean;
  secondary: boolean;
  sprint: boolean;
  crouch: boolean;
}

export interface InputIntent {
  move: { x: number; z: number };
  actions: Omit<InputSnapshot, "up" | "down" | "left" | "right">;
  meta: {
    isMoving: boolean;
    moveMagnitude: number; // 0..1
  };
}
