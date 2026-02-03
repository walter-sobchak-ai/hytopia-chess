export type CameraPresetId = "threeQuarter" | "topDown";

export interface CameraPreset {
  id: CameraPresetId;

  /**
   * Offset relative to what the camera is attached to.
   * Documented API: player.camera.setOffset({x,y,z})
   */
  offset: { x: number; y: number; z: number };

  /** Documented API: player.camera.setZoom(number) */
  zoom: number;

  /**
   * Documented API: player.camera.setFov(number)
   * HYTOPIA docs: default FOV is 75 (example shows changes).
   */
  fov: number;

  /**
   * Optional film offset for over-the-shoulder style.
   * Documented API: player.camera.setFilmOffset(number)
   */
  filmOffset?: number;
}
