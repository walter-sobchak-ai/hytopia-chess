export type ToastTone = "info" | "success" | "warning" | "error";

export type HudSlot = "topLeft" | "topRight" | "bottomLeft" | "bottomRight";

export type UiToServerMessage =
  | { type: "ui.ready" }
  | { type: "ui.action"; action: string; payload?: any };

export type ServerToUiMessage =
  | { type: "ui.toast"; payload: { message: string; tone?: ToastTone; ttlMs?: number } }
  | { type: "ui.debug"; payload: { visible: boolean; text?: string } }
  | { type: "ui.hud"; payload: { slot: HudSlot; text: string } }
  | { type: "ui.state"; payload: any };
