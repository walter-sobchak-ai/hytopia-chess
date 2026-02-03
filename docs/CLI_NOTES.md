# HYTOPIA CLI Notes

This template assumes the HYTOPIA CLI commands:
- `hytopia start [FILE]` (watch mode, default: index.ts)
- `hytopia run [FILE]`
- `hytopia build [FILE]`
- `hytopia build-dev [FILE]`

Some installs do **not** provide `hytopia dev`.

Repo scripts (recommended):
- `npm run dev` → `hytopia start index.ts`
- `npm run run` → `hytopia run index.ts`
- `npm run build` → `hytopia build index.ts`
- `npm run build:dev` → `hytopia build-dev index.ts`
