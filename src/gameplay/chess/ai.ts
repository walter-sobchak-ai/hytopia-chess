import { Chess } from "chess.js";
import type { Difficulty, PlayerColor } from "./types";

const PIECE_VALUES: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 0,
};

function evaluate(chess: Chess, forColor: PlayerColor): number {
  // Simple material + mobility. Positive means good for forColor.
  const board = chess.board();
  let score = 0;
  for (const row of board) {
    for (const piece of row) {
      if (!piece) continue;
      const v = PIECE_VALUES[piece.type] ?? 0;
      score += piece.color === forColor ? v : -v;
    }
  }
  // mobility heuristic
  const moves = chess.moves().length;
  // If it's forColor's turn, reward mobility; otherwise penalize.
  score += chess.turn() === forColor ? moves : -moves;
  return score;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function minimax(chess: Chess, depth: number, alpha: number, beta: number, maximizingFor: PlayerColor): { score: number; move?: string } {
  if (depth === 0 || chess.isGameOver()) {
    // If game over, bias strongly for checkmate.
    if (chess.isCheckmate()) {
      const winner = chess.turn() === "w" ? "b" : "w";
      return { score: winner === maximizingFor ? 100000 : -100000 };
    }
    if (chess.isDraw() || chess.isStalemate() || chess.isThreefoldRepetition() || chess.isInsufficientMaterial()) {
      return { score: 0 };
    }
    return { score: evaluate(chess, maximizingFor) };
  }

  const moves = chess.moves({ verbose: true });
  // Small shuffle for variety on equal scores
  moves.sort(() => Math.random() - 0.5);

  const isMax = chess.turn() === maximizingFor;
  let bestScore = isMax ? -Infinity : Infinity;
  let bestMove: string | undefined;

  for (const m of moves) {
    chess.move(m);
    const { score } = minimax(chess, depth - 1, alpha, beta, maximizingFor);
    chess.undo();

    if (isMax) {
      if (score > bestScore) {
        bestScore = score;
        bestMove = m.from + m.to + (m.promotion ? m.promotion : "");
      }
      alpha = Math.max(alpha, bestScore);
      if (beta <= alpha) break;
    } else {
      if (score < bestScore) {
        bestScore = score;
        bestMove = m.from + m.to + (m.promotion ? m.promotion : "");
      }
      beta = Math.min(beta, bestScore);
      if (beta <= alpha) break;
    }
  }

  return { score: bestScore, move: bestMove };
}

export function chooseAiMove(fen: string, aiColor: PlayerColor, difficulty: Difficulty): string | null {
  const chess = new Chess(fen);
  if (chess.isGameOver()) return null;
  if (chess.turn() !== aiColor) return null;

  const depth = difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3;

  if (difficulty === "easy") {
    // Easy: prefer captures if available, else random.
    const moves = chess.moves({ verbose: true });
    const captures = moves.filter((m) => m.captured);
    const choice = (captures.length ? pickRandom(captures) : pickRandom(moves));
    return choice.from + choice.to + (choice.promotion ? choice.promotion : "");
  }

  const { move } = minimax(chess, depth, -Infinity, Infinity, aiColor);
  return move ?? null;
}
