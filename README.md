# HYTOPIA Chess

A full-rules chess game built with the HYTOPIA SDK.

## Features

- **Solo mode:** 1 player vs computer (player is always **White**)
- **Duo mode:** 2 player lobby (first join = White, second = Black)
- **Difficulty:** Easy / Medium / Hard (selected in lobby before starting)
- **Rules:** enforced via `chess.js` (castling, en passant, promotion, draw rules, check/checkmate)
- **End game lobby:** shows result and lets you play again

## Run

```bash
cd projects/hytopia-chess
nvm use 22
npm install
npm run dev
```

## Repo workflow (what we’re doing)

- I’ll create a GitHub repo under `walter-sobchak-ai` and push this project.
- You’ll open it in Cursor and iterate/test.

## Notes

- This is a UI-first chessboard (overlay UI). Pieces are rendered in the HUD overlay.
- Next iterations could add 3D board/pieces, timers, matchmaking rooms, spectators.
