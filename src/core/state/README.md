# core/state

Typed state machine for menu/lobby/gameplay/results flows.

## Why
- Makes game lifecycle explicit.
- Keeps systems isolated by state.
- Emits `game.state.changed` via core/events so UI/telemetry can react without direct coupling.

## Usage (example)
```ts
import { createStateMachine } from "./index";
import { DEFAULT_CONFIG } from "../config";

const machine = createStateMachine({
  config: DEFAULT_CONFIG,
  initial: "boot",
  states: [
    { id: "boot", enter: ({ log }) => log("info", "booting") },
    { id: "menu" },
    { id: "gameplay" },
    { id: "results" },
    { id: "lobby" },
  ],
});

machine.transition("menu");
machine.update(1 / 60);
```
