import type { TelemetryClient, TelemetryMeta } from "./types";

export function createConsoleTelemetry(params?: { prefix?: string }): TelemetryClient {
  const prefix = params?.prefix ?? "telemetry";
  return {
    track(event, payload, meta) {
      // eslint-disable-next-line no-console
      console.log(`[${prefix}] ${event}`, {
        payload: payload ?? null,
        meta: meta ?? null,
      });
    },
  };
}

export function nowMeta(extra?: Partial<TelemetryMeta>): TelemetryMeta {
  return {
    timestamp: Date.now(),
    ...(extra ?? {}),
  };
}
