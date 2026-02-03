import { BlockType } from "hytopia";
import { Entity, RigidBodyType, ColliderShape } from "hytopia";
import type { World } from "hytopia";
import { EntityEvent } from "hytopia";
import { Chess } from "chess.js";

export type Square = {
  file: number; // 0..7 a..h
  rank: number; // 0..7 1..8
};

export type PieceKey = string; // like "w_p_e2" or "b_k_e8"

export type Board3D = {
  origin: { x: number; y: number; z: number }; // a1 corner (lower-left from White)
  lightId: number;
  darkId: number;
  highlightId: number;
  pieces: Map<PieceKey, Entity>;
  squareSelectors: Map<string, Entity>; // "e2" -> entity
  selection?: { from?: string };
};

export function squareName(file: number, rank: number): string {
  return String.fromCharCode("a".charCodeAt(0) + file) + String(rank + 1);
}

export function squareToWorld(origin: Board3D["origin"], sq: string): { x: number; y: number; z: number } {
  const file = sq.charCodeAt(0) - "a".charCodeAt(0);
  const rank = Number(sq[1]) - 1;
  return { x: origin.x + file, y: origin.y, z: origin.z + rank };
}

function pieceKey(color: "w" | "b", type: string, sq: string): PieceKey {
  return `${color}_${type}_${sq}`;
}

export function registerChessBlockTypes(world: World): { lightId: number; darkId: number; highlightId: number } {
  const reg = world.blockTypeRegistry;

  // Choose stable IDs unlikely to collide.
  const lightId = 201;
  const darkId = 202;
  const highlightId = 203;

  // Register simple voxel blocks with our textures.
  reg.registerBlockType(
    new (class extends BlockType {
      constructor() {
        super({ id: lightId, textureUri: "blocks/chess_light.png", name: "Chess Light" });
      }
    })()
  );

  reg.registerBlockType(
    new (class extends BlockType {
      constructor() {
        super({ id: darkId, textureUri: "blocks/chess_dark.png", name: "Chess Dark" });
      }
    })()
  );

  reg.registerBlockType(
    new (class extends BlockType {
      constructor() {
        super({ id: highlightId, textureUri: "blocks/highlight.png", name: "Highlight" });
      }
    })()
  );

  return { lightId, darkId, highlightId };
}

export function buildBoard3D(params: {
  world: World;
  origin: { x: number; y: number; z: number };
}): Board3D {
  const { world, origin } = params;

  const { lightId, darkId, highlightId } = registerChessBlockTypes(world);

  // Build an 8x8 board at y=origin.y.
  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const id = (file + rank) % 2 === 0 ? lightId : darkId;
      world.chunkLattice.setBlock({ x: origin.x + file, y: origin.y, z: origin.z + rank }, id);
      // One layer underneath to make it feel thicker
      world.chunkLattice.setBlock({ x: origin.x + file, y: origin.y - 1, z: origin.z + rank }, id);
    }
  }

  // Add a simple surrounding floor
  for (let x = -6; x <= 14; x++) {
    for (let z = -6; z <= 14; z++) {
      const wx = origin.x + x;
      const wz = origin.z + z;
      const insideBoard = x >= 0 && x < 8 && z >= 0 && z < 8;
      if (insideBoard) continue;
      world.chunkLattice.setBlock({ x: wx, y: origin.y - 1, z: wz }, lightId);
    }
  }

  // Invisible (but interactable) square selectors: one sensor entity per square.
  const squareSelectors = new Map<string, Entity>();
  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const sq = squareName(file, rank);
      const pos = squareToWorld(origin, sq);
      const e = new Entity({
        name: `Square ${sq}`,
        tag: `chess.square.${sq}`,
        // HYTOPIA requires a blockTextureUri or modelUri for Entities.
        // We render these as invisible but keep a valid block entity.
        blockTextureUri: "blocks/highlight.png",
        blockHalfExtents: { x: 0.5, y: 0.1, z: 0.5 },
        opacity: 0.0,
        rigidBodyOptions: {
          type: RigidBodyType.FIXED,
          colliders: [
            {
              shape: ColliderShape.BLOCK,
              halfExtents: { x: 0.5, y: 0.1, z: 0.5 },
              isSensor: true,
              tag: "square",
            },
          ],
        },
      });
      e.spawn(world, { x: pos.x + 0.5, y: pos.y + 0.2, z: pos.z + 0.5 });
      squareSelectors.set(sq, e);
    }
  }

  return {
    origin,
    lightId,
    darkId,
    highlightId,
    pieces: new Map(),
    squareSelectors,
  };
}

export function spawnPiecesFromFen(params: {
  world: World;
  board: Board3D;
  fen: string;
}): void {
  const { world, board, fen } = params;

  // Clear existing
  for (const e of board.pieces.values()) e.despawn();
  board.pieces.clear();

  const chess = new Chess(fen);
  const b = chess.board(); // 8x8 with rank 8 first

  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const p = b[r][f];
      if (!p) continue;

      const file = f;
      const rank = 7 - r; // convert to 0..7 where 0 is rank1
      const sq = squareName(file, rank);

      const tex = p.color === "w" ? "blocks/piece_white.png" : "blocks/piece_black.png";
      const ent = new Entity({
        name: `Piece ${p.color}${p.type} ${sq}`,
        tag: `chess.piece.${p.color}.${p.type}.${sq}`,
        blockTextureUri: tex,
        blockHalfExtents: { x: 0.38, y: 0.45, z: 0.38 },
        emissiveIntensity: p.color === "w" ? 0.0 : 0.0,
        rigidBodyOptions: {
          type: RigidBodyType.FIXED,
          colliders: [
            {
              shape: ColliderShape.BLOCK,
              halfExtents: { x: 0.38, y: 0.45, z: 0.38 },
              isSensor: true,
              tag: "piece",
            },
          ],
        },
      });

      const pos = squareToWorld(board.origin, sq);
      ent.spawn(world, { x: pos.x + 0.5, y: pos.y + 0.6, z: pos.z + 0.5 });

      const key = pieceKey(p.color, p.type, sq);
      board.pieces.set(key, ent);
    }
  }
}

export function wire3DSelection(params: {
  world: World;
  board: Board3D;
  getFen: () => string;
  canPlayerMoveFrom: (playerId: string, square: string) => boolean;
  tryMove: (playerId: string, uci: string) => { ok: boolean; reason?: string };
  onAnyMoveApplied: () => void;
}): void {
  const { board } = params;

  // Listen for interactions on square selectors (tap/click in world).
  for (const [sq, ent] of board.squareSelectors.entries()) {
    ent.on(EntityEvent.INTERACT, ({ player }) => {
      const playerId = String(player.id);

      // First click selects a from-square.
      if (!board.selection?.from) {
        if (!params.canPlayerMoveFrom(playerId, sq)) return;
        board.selection = { from: sq };
        return;
      }

      const from = board.selection.from;
      const to = sq;
      board.selection = {};

      const uci = `${from}${to}`;
      const res = params.tryMove(playerId, uci);
      if (!res.ok) return;

      // Refresh pieces from new fen
      spawnPiecesFromFen({ world: params.world, board, fen: params.getFen() });
      params.onAnyMoveApplied();
    });
  }
}
