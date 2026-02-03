import {
  DefaultPlayerEntityController,
  type DefaultPlayerEntityControllerOptions,
  type PlayerEntity,
  type PlayerInput,
  type PlayerCameraOrientation,
} from "hytopia";

import type { PlayerControllerDeps } from "./types";
import { gameEvents } from "../../core/events";

/**
 * Template controller:
 * - Uses HYTOPIA's DefaultPlayerEntityController (SDK-native movement).
 * - Reads tuning values from core/config.
 * - Emits template events for downstream UI/telemetry hooks.
 */
export class TemplatePlayerController extends DefaultPlayerEntityController {
  private playerId: string;
  private lastMode: "walk" | "run" | "idle" = "idle";

  constructor(params: {
    deps: PlayerControllerDeps;
    playerId: string;
    options?: DefaultPlayerEntityControllerOptions;
  }) {
    const { deps, options } = params;

    super({
      ...options,
      walkVelocity: deps.config.tuning.movement.walkVelocity,
      runVelocity: deps.config.tuning.movement.runVelocity,
      jumpVelocity: deps.config.tuning.movement.jumpVelocity,
    });

    this.playerId = params.playerId;
  }

  /**
   * We let the parent class handle all actual movement math.
   * We add lightweight mode detection + event emission only.
   */
  override tickWithPlayerInput(
    entity: PlayerEntity,
    input: PlayerInput,
    cameraOrientation: PlayerCameraOrientation,
    deltaTimeMs: number
  ) {
    super.tickWithPlayerInput(entity, input, cameraOrientation, deltaTimeMs);

    // Default controller destructures: w/a/s/d and sh (shift) for running.
    const { w, a, s, d, sh } = input as unknown as {
      w?: boolean;
      a?: boolean;
      s?: boolean;
      d?: boolean;
      sh?: boolean;
    };

    const isMoving = Boolean(w || a || s || d);
    const mode: "walk" | "run" | "idle" = !isMoving ? "idle" : sh ? "run" : "walk";

    if (mode !== this.lastMode) {
      this.lastMode = mode;
      gameEvents.emitGame("player.movement.mode.changed", {
        playerId: this.playerId,
        mode,
      });
    }
  }
}
