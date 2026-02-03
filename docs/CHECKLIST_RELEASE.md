# Release Checklist (Template)

Use this checklist before tagging a template release (e.g., v0.1.1).

## 1) Versioning
- [ ] Decide version bump: patch/minor/major
- [ ] Update CHANGELOG.md with version + date + summary

## 2) Sanity checks
- [ ] TypeScript compiles
- [ ] No unresolved imports
- [ ] No TODOs in public interfaces unless explicitly documented

## 3) Manual integration test (bootstrap)
- [ ] `examples/bootstrap/index.ts` runs
- [ ] Map loads successfully (or intentionally skipped with docs note)
- [ ] Player joins and spawns entity
- [ ] Camera preset applies without errors
- [ ] Overlay UI loads; toast renders
- [ ] Telemetry logs appear when `telemetry.enabled` is true
- [ ] Player leave despawns only their entity (no global despawn)

## 4) Documentation
- [ ] docs/ARCHITECTURE.md reflects new modules or changes
- [ ] docs/CONVENTIONS.md updated if rules changed
- [ ] docs/PATTERNS_LIBRARY.md updated for any new pattern
- [ ] docs/DECISION_LOG.md updated for any new trade-off

## 5) Guardrails
- [ ] No invented or undocumented HYTOPIA SDK APIs were introduced
- [ ] Any “Needs verification” items are either resolved or tracked in docs

## 6) Release tag
- [ ] Tag created
- [ ] Short release notes copied from CHANGELOG.md
