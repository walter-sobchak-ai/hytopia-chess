export type Difficulty = "easy" | "medium" | "hard";
export type Mode = "solo" | "duo";

export type PlayerColor = "w" | "b";

export type LobbySelection = {
  mode: Mode;
  difficulty: Difficulty; // used in solo
};

export type UiState =
  | {
      screen: "lobby";
      lobby: {
        mode: Mode;
        difficulty: Difficulty;
        waitingForOpponent: boolean;
      };
    }
  | {
      screen: "game";
      game: {
        fen: string;
        turn: PlayerColor;
        yourColor: PlayerColor;
        legalMoves?: string[]; // UCI like e2e4 (optional helper)
        status: "playing" | "check" | "checkmate" | "stalemate" | "draw";
        winner?: PlayerColor;
        lastMove?: string;
      };
    }
  | {
      screen: "end";
      end: {
        result: "white" | "black" | "draw";
        reason: string;
      };
    };

export type UiToServer =
  | { type: "ui.ready" }
  | { type: "ui.action"; action: string; payload?: any };

export type ServerToUi =
  | { type: "ui.toast"; payload: { message: string; tone?: "info" | "success" | "warning" | "error"; ttlMs?: number } }
  | { type: "ui.hud"; payload: { slot: "topLeft" | "topRight" | "bottomLeft" | "bottomRight"; text: string } }
  | { type: "ui.debug"; payload: { visible: boolean; text?: string } }
  | { type: "ui.state"; payload: UiState };
