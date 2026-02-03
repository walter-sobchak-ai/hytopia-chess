import {
  PlayerCameraMode,
  type Player,
  type Entity,
} from "hytopia";

import type { GameConfig } from "../../core/config";
import { gameEvents } from "../../core/events";
import type { CameraPresetId } from "./types";
import { CAMERA_PRESETS } from "./presets";

export interface ApplyCameraPresetParams {
  player: Player;
  /**
   * Entity to attach camera to. Commonly the player's controlled entity.
   * Documented: player.camera can attach to an entity.
   */
  attachTo?: Entity;
  /**
   * Entity to track/look at. Commonly the player's controlled entity.
   * Documented: setTrackedEntity(entity)
   */
  track?: Entity;
  preset: CameraPresetId;
}

/**
 * Apply a camera preset using only documented PlayerCamera methods.
 * Docs: PlayerCamera supports mode, attachment, tracking, offset, film offset, FOV, zoom.
 */
export function applyCameraPreset(params: ApplyCameraPresetParams): void {
  const { player, preset, attachTo, track } = params;
  const p = CAMERA_PRESETS[preset];

  // Ensure third-person mode as a stable baseline for these presets.
  player.camera.setMode(PlayerCameraMode.THIRD_PERSON);

  if (attachTo) player.camera.setAttachedToEntity(attachTo);
  if (track) player.camera.setTrackedEntity(track);

  player.camera.setOffset(p.offset);

  if (typeof p.filmOffset === "number") {
    player.camera.setFilmOffset(p.filmOffset);
  }

  player.camera.setFov(p.fov);
  player.camera.setZoom(p.zoom);

  gameEvents.emitGame("camera.preset.changed", { preset });
}

/**
 * Config-driven camera setup.
 * v1 chooses preset from config.tuning.camera.preset.
 */
export function setupPlayerCamera(params: {
  config: GameConfig;
  player: Player;
  playerEntity?: Entity;
}): void {
  const { config, player, playerEntity } = params;

  // Choose preset from config.
  const preset = config.tuning.camera.preset;

  // Attach & track the player entity if provided (recommended default behavior).
  applyCameraPreset({ player, preset, attachTo: playerEntity, track: playerEntity });

  // followSmoothing is stored in config but not applied here because
  // the docs do not show a direct smoothing setter. (Needs verification)
}
