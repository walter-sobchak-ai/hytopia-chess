export type TelemetryEventName = string;

export interface TelemetryMeta {
  timestamp: number;
  sessionId?: string;
  playerId?: string;
}

export interface TelemetryClient {
  track: (event: TelemetryEventName, payload?: unknown, meta?: TelemetryMeta) => void;
  identify?: (playerId: string, traits?: Record<string, unknown>) => void;
  flush?: () => void;
}
