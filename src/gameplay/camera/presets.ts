import type { CameraPreset } from "./types";

/**
 * v1 presets: conservative defaults that can be tuned per game.
 * These are applied via documented PlayerCamera methods.
 *
 * NOTE: Exact “feel” depends on your entity scale and world scale.
 * Expect to tune offsets/zoom per project.
 */
export const CAMERA_PRESETS: Record<CameraPreset["id"], CameraPreset> = {
  threeQuarter: {
    id: "threeQuarter",
    // Behind + above the player for an angled view
    offset: { x: 0, y: 2.5, z: -4.5 },
    zoom: 2.0,
    fov: 75,
    filmOffset: 0,
  },
  topDown: {
    id: "topDown",
    // High above looking down (orientation comes from camera tracking target)
    offset: { x: 0, y: 10, z: 0.1 },
    zoom: 2.4,
    fov: 75,
    filmOffset: 0,
  },
};
