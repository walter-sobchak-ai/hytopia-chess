import type { Player, World } from "hytopia";
import { PlayerUIEvent } from "hytopia";

import type { GameConfig } from "../../core/config";
import type { ServerToUiMessage, ToastTone, UiToServerMessage, HudSlot } from "./types";

/**
 * Load the Overlay UI for a player.
 * Docs show: player.ui.load('ui/index.html') and UI messaging via sendData/onData.
 */
export function loadOverlayUi(player: Player): void {
  player.ui.load("ui/index.html");
}

/**
 * Pointer lock control from server is supported.
 */
export function setPointerLocked(player: Player, locked: boolean): void {
  player.ui.lockPointer(locked);
}

export function sendUi(player: Player, message: ServerToUiMessage): void {
  player.ui.sendData(message);
}

export function toast(
  player: Player,
  message: string,
  tone: ToastTone = "info",
  ttlMs = 2200
): void {
  sendUi(player, { type: "ui.toast", payload: { message, tone, ttlMs } });
}

export function setHudText(player: Player, slot: HudSlot, text: string): void {
  sendUi(player, { type: "ui.hud", payload: { slot, text } });
}

export function setDebugOverlay(player: Player, visible: boolean, text?: string): void {
  sendUi(player, { type: "ui.debug", payload: { visible, text } });
}

/**
 * Wire server-side handler for data coming from the player's UI.
 * Docs show listening to PlayerUIEvent.DATA and reading `data`.
 */
export function bindUiInbound(params: {
  world: World;
  player: Player;
  config: GameConfig;
  onMessage?: (msg: UiToServerMessage, player: Player) => void;
}): void {
  const { player, config, onMessage } = params;

  // Default: show debug overlay based on config flag.
  if (config.debug.showDebugOverlay) {
    setDebugOverlay(player, true, "debug: enabled");
  }

  player.ui.on(PlayerUIEvent.DATA, ({ data }) => {
    // Defensive parse: UI can send any JSON-compatible object.
    if (!data || typeof data !== "object") return;

    const msg = data as UiToServerMessage;
    onMessage?.(msg, player);
  });
}
