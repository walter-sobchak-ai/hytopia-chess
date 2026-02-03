import type { InputIntent, InputSnapshot } from "./types";

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export function snapshotToIntent(snapshot: InputSnapshot): InputIntent {
  // x: left/right, z: forward/back (common convention for top-down/3D)
  const x = (snapshot.right ? 1 : 0) + (snapshot.left ? -1 : 0);
  const z = (snapshot.up ? 1 : 0) + (snapshot.down ? -1 : 0);

  // Normalize diagonal movement to length 1.
  const mag = Math.sqrt(x * x + z * z);
  const nx = mag > 0 ? x / mag : 0;
  const nz = mag > 0 ? z / mag : 0;

  const moveMagnitude = clamp(mag, 0, 1);

  return {
    move: { x: nx, z: nz },
    actions: {
      jump: snapshot.jump,
      interact: snapshot.interact,
      primary: snapshot.primary,
      secondary: snapshot.secondary,
      sprint: snapshot.sprint,
      crouch: snapshot.crouch,
    },
    meta: {
      isMoving: mag > 0,
      moveMagnitude,
    },
  };
}
