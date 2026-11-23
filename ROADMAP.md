# Roadmap

This is a want-list with dates attached to nothing. Scope changes are announced
in issues, not here.

## v0.5 — the diphthong release

- [ ] Fixture file (`tests/fixtures/syllables.json`) shared by both engines
- [ ] Explicit diphthong table: `ea`, `ei`, `ie`, `oa`, `ou`, `au`
- [ ] `--strict` mode that fails on ambiguous words instead of guessing
- [ ] `haiku-core verify --file`, because heredocs are not for everyone

## v0.6 — the browser release

- [ ] Rust → WASM build, replacing the TypeScript port at runtime
- [ ] `<haiku-check>` custom element, 4 KB gzipped
- [ ] Benchmark page that anyone can run

## v0.7 — the editor release

- [ ] LSP server: diagnostics on save, syllable counts in the gutter
- [ ] Neovim and VS Code configs in `editors/`
- [ ] Pre-commit hook and GitHub Action

## v1.0 — the frozen release

- [ ] CLI arguments and exit codes frozen under semver
- [ ] `haiku-core` published to crates.io and the AUR
- [ ] A second maintainer, so the bus factor table stops being funny

## Non-goals

Not now, not later, not if the issue gets 400 upvotes:

- tokens, points, airdrops, or any on-chain integration,
- an LLM that writes the haiku for you,
- a paid tier,
- a mobile app.

## Explicitly not planned

`printHaiku()` is tracked in [#1](https://github.com/EliCunninghamDev/haiku-core/issues/1).
It is a small function. It is not on this roadmap because it is not a release.
