import {
  startServer,
  PlayerEvent,
  PlayerManagerEvent,
  EventRouter,
} from "hytopia";

import { loadConfig } from "./src/core/config";
import { gameEvents } from "./src/core/events";
import { createConsoleTelemetry, bindTelemetry } from "./src/systems/telemetry";

import {
  loadOverlayUi,
  toast,
  setHudText,
  bindUiInbound,
  sendUi,
} from "./src/gameplay/ui";

import {
  createRoom,
  assignSeat,
  setLobbySelection,
  canStart,
  startGame,
  applyMove,
  buildUiStateFor,
} from "./src/gameplay/chess/game";

import type { Difficulty, Mode, PlayerColor } from "./src/gameplay/chess/types";

/**
 * HYTOPIA Chess (v0)
 *
 * - Solo (you are White) vs AI with 3 difficulty levels
 * - Duo (2 players) with full rule enforcement
 * - End screen on checkmate/draw, rematch
 */
startServer((world) => {
  const config = loadConfig({
    features: { flags: { "telemetry.enabled": true } },
    debug: { logLevel: "info", showDebugOverlay: false, logEventHandlerErrors: false },
  });

  const telemetryClient = createConsoleTelemetry({ prefix: "hytopia-chess" });
  const telemetry = bindTelemetry({ config, client: telemetryClient, sessionId: "dev" });
  gameEvents.emitGame("game.booted", { timestamp: Date.now() });

  const room = createRoom("main");

  const players = new Map<string, any>(); // Player
  const colors = new Map<string, PlayerColor>();

  function broadcastState() {
    for (const [playerId, player] of players.entries()) {
      const color = colors.get(playerId) ?? "w";
      sendUi(player, { type: "ui.state", payload: buildUiStateFor(room, color) });

      if (room.status === "playing") {
        const turn = room.chess.turn();
        const status = room.chess.isCheck() ? "CHECK" : "";
        setHudText(player, "topLeft", `Chess (${room.selection.mode})`);
        setHudText(player, "bottomRight", `You: ${color === "w" ? "White" : "Black"}\nTurn: ${turn === "w" ? "White" : "Black"} ${status}`);
      }
    }
  }

  function resetToLobby() {
    room.status = "lobby";
    room.winner = undefined;
    room.endReason = undefined;
    room.lastMove = undefined;
    room.chess.reset();
    // keep selection but clear seats for duo; for solo keep white seat
    room.seats = {};
    colors.clear();
  }

  const globalEvents = EventRouter.globalInstance;

  globalEvents.on(PlayerManagerEvent.PLAYER_CONNECTED, ({ player }) => {
    player.on(PlayerEvent.JOINED_WORLD, () => {
      const playerId = String(player.id);
      players.set(playerId, player);

      loadOverlayUi(player);
      toast(player, "Welcome to HYTOPIA Chess", "info");

      // Seat assignment on join (lobby only)
      if (room.status === "lobby") {
        const seat = assignSeat(room, playerId);
        if (seat.ok && seat.color) {
          colors.set(playerId, seat.color);
          toast(player, `Seated as ${seat.color === "w" ? "White" : "Black"}`, "success");
        } else {
          toast(player, seat.reason ?? "Room full", "warning");
        }
      }

      bindUiInbound({
        world,
        player,
        config,
        onMessage: (msg) => {
          if (msg.type === "ui.ready") {
            broadcastState();
            return;
          }

          if (msg.type !== "ui.action") return;

          if (msg.action === "lobby.set" && room.status === "lobby") {
            const mode = (msg.payload as any)?.mode as Mode | undefined;
            const difficulty = (msg.payload as any)?.difficulty as Difficulty | undefined;
            setLobbySelection(room, { mode, difficulty });

            // Re-seat everyone based on new selection
            room.seats = {};
            colors.clear();
            for (const [pid] of players.entries()) {
              const seat = assignSeat(room, pid);
              if (seat.ok && seat.color) colors.set(pid, seat.color);
            }

            broadcastState();
            return;
          }

          if (msg.action === "lobby.start" && room.status === "lobby") {
            const pid = String(player.id);

            // In duo mode, only allow white to start (keeps simple)
            const yourColor = colors.get(pid);
            if (room.selection.mode === "duo" && yourColor !== "w") {
              toast(player, "Only White can start the match.", "warning");
              return;
            }

            if (!canStart(room)) {
              toast(player, room.selection.mode === "duo" ? "Waiting for opponent" : "Ready when you are", "warning");
              broadcastState();
              return;
            }

            startGame(room);
            toast(player, "Game start", "success");
            broadcastState();
            return;
          }

          if (msg.action === "game.move" && room.status === "playing") {
            const pid = String(player.id);
            const uci = String((msg.payload as any)?.uci || "");
            if (!uci || uci.length < 4) return;

            const res = applyMove(room, pid, uci);
            if (!res.ok) {
              toast(player, res.reason ?? "Illegal move", "warning");
              return;
            }

            // If game ended, announce
            if ((room as any).status === "ended") {
              const winner = room.winner;
              const msgText = winner
                ? `${winner === "w" ? "White" : "Black"} wins by ${room.endReason}`
                : `Draw (${room.endReason})`;
              for (const p of players.values()) toast(p, msgText, winner ? "success" : "info", 4000);
            }

            broadcastState();
            return;
          }

          if (msg.action === "end.rematch") {
            // Keep selection, reseat (solo: player is white)
            room.status = "lobby";
            room.chess.reset();
            room.winner = undefined;
            room.endReason = undefined;
            room.lastMove = undefined;
            room.seats = {};
            colors.clear();

            for (const [pid] of players.entries()) {
              const seat = assignSeat(room, pid);
              if (seat.ok && seat.color) colors.set(pid, seat.color);
            }

            if (canStart(room)) {
              startGame(room);
            }

            broadcastState();
            return;
          }

          if (msg.action === "end.backToLobby") {
            resetToLobby();
            broadcastState();
            return;
          }
        },
      });

      broadcastState();
    });

    player.on(PlayerEvent.LEFT_WORLD, () => {
      const playerId = String(player.id);
      players.delete(playerId);
      colors.delete(playerId);

      // If duo and someone leaves during a game, end and return to lobby.
      if (room.selection.mode === "duo" && room.status === "playing") {
        room.status = "ended";
        room.winner = undefined;
        room.endReason = "opponent disconnected";
      }

      // If solo player leaves, reset.
      if (room.selection.mode === "solo" && players.size === 0) {
        resetToLobby();
      }

      broadcastState();
    });
  });

  void telemetry;
});
