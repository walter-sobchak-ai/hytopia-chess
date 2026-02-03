import { Chess } from "chess.js";
import type { Difficulty, LobbySelection, Mode, PlayerColor, UiState } from "./types";
import { chooseAiMove } from "./ai";

export type Seat = {
  playerId: string;
  color: PlayerColor;
};

export type ChessRoom = {
  id: string;
  selection: LobbySelection;
  seats: Partial<Record<PlayerColor, Seat>>;
  chess: Chess;
  status: "lobby" | "playing" | "ended";
  winner?: PlayerColor;
  endReason?: string;
  lastMove?: string;
};

export function defaultSelection(): LobbySelection {
  return { mode: "solo", difficulty: "easy" };
}

export function createRoom(id: string): ChessRoom {
  return {
    id,
    selection: defaultSelection(),
    seats: {},
    chess: new Chess(),
    status: "lobby",
  };
}

export function assignSeat(room: ChessRoom, playerId: string): { ok: boolean; color?: PlayerColor; reason?: string } {
  // If already seated, return existing.
  for (const c of ["w", "b"] as PlayerColor[]) {
    if (room.seats[c]?.playerId === playerId) return { ok: true, color: c };
  }

  if (room.selection.mode === "solo") {
    // Player is always white
    if (room.seats.w && room.seats.w.playerId !== playerId) return { ok: false, reason: "Room already has a solo player." };
    room.seats.w = { playerId, color: "w" };
    room.seats.b = { playerId: "AI", color: "b" };
    return { ok: true, color: "w" };
  }

  // Duo: first is white, second is black.
  if (!room.seats.w) {
    room.seats.w = { playerId, color: "w" };
    return { ok: true, color: "w" };
  }
  if (!room.seats.b) {
    room.seats.b = { playerId, color: "b" };
    return { ok: true, color: "b" };
  }

  return { ok: false, reason: "Room full" };
}

export function setLobbySelection(room: ChessRoom, selection: Partial<{ mode: Mode; difficulty: Difficulty }>) {
  if (room.status !== "lobby") return;
  if (selection.mode) room.selection.mode = selection.mode;
  if (selection.difficulty) room.selection.difficulty = selection.difficulty;

  // If switching mode, clear seats
  room.seats = {};
}

export function canStart(room: ChessRoom): boolean {
  if (room.status !== "lobby") return false;
  if (room.selection.mode === "solo") return !!room.seats.w;
  return !!room.seats.w && !!room.seats.b;
}

export function startGame(room: ChessRoom) {
  room.chess = new Chess();
  room.status = "playing";
  room.winner = undefined;
  room.endReason = undefined;
  room.lastMove = undefined;
}

export type GameStatus = "playing" | "check" | "checkmate" | "stalemate" | "draw";

export function getStatus(room: ChessRoom): GameStatus {
  const c = room.chess;
  if (c.isCheckmate()) return "checkmate";
  if (c.isStalemate()) return "stalemate";
  if (c.isDraw() || c.isThreefoldRepetition() || c.isInsufficientMaterial()) return "draw";
  if (c.isCheck()) return "check";
  return "playing";
}

export function maybeFinalize(room: ChessRoom) {
  const c = room.chess;
  if (!c.isGameOver()) return;

  room.status = "ended";

  if (c.isCheckmate()) {
    const winner = c.turn() === "w" ? "b" : "w";
    room.winner = winner;
    room.endReason = "checkmate";
    return;
  }

  if (c.isStalemate()) {
    room.endReason = "stalemate";
    return;
  }

  if (c.isInsufficientMaterial()) {
    room.endReason = "insufficient material";
    return;
  }

  if (c.isThreefoldRepetition()) {
    room.endReason = "threefold repetition";
    return;
  }

  if (c.isDraw()) {
    room.endReason = "draw";
  }
}

export function applyMove(room: ChessRoom, playerId: string, uci: string): { ok: boolean; reason?: string } {
  if (room.status !== "playing") return { ok: false, reason: "Not playing" };
  const from = uci.slice(0, 2);
  const to = uci.slice(2, 4);
  const promotion = uci.slice(4, 5) || undefined;

  const turn: PlayerColor = room.chess.turn();
  const seat = room.seats[turn];
  if (!seat || seat.playerId !== playerId) return { ok: false, reason: "Not your turn" };

  const move = room.chess.move({ from, to, promotion } as any);
  if (!move) return { ok: false, reason: "Illegal move" };

  room.lastMove = move.from + move.to + (move.promotion ? move.promotion : "");
  maybeFinalize(room);

  // If solo mode and game not over, let AI respond.
  if (room.selection.mode === "solo" && room.status === "playing") {
    const aiMove = chooseAiMove(room.chess.fen(), "b", room.selection.difficulty);
    if (aiMove) {
      const aFrom = aiMove.slice(0, 2);
      const aTo = aiMove.slice(2, 4);
      const aPromo = aiMove.slice(4, 5) || undefined;
      const moved = room.chess.move({ from: aFrom, to: aTo, promotion: aPromo } as any);
      if (moved) {
        room.lastMove = moved.from + moved.to + (moved.promotion ? moved.promotion : "");
        maybeFinalize(room);
      }
    }
  }

  return { ok: true };
}

export function buildUiStateFor(room: ChessRoom, yourColor: PlayerColor): UiState {
  if (room.status === "lobby") {
    const waitingForOpponent = room.selection.mode === "duo" && !(room.seats.w && room.seats.b);
    return {
      screen: "lobby",
      lobby: {
        mode: room.selection.mode,
        difficulty: room.selection.difficulty,
        waitingForOpponent,
      },
    };
  }

  if (room.status === "ended") {
    let result: "white" | "black" | "draw" = "draw";
    if (room.winner === "w") result = "white";
    if (room.winner === "b") result = "black";
    return {
      screen: "end",
      end: {
        result,
        reason: room.endReason ?? "game over",
      },
    };
  }

  const status = getStatus(room);
  return {
    screen: "game",
    game: {
      fen: room.chess.fen(),
      turn: room.chess.turn(),
      yourColor,
      status,
      winner: room.winner,
      lastMove: room.lastMove,
    },
  };
}
