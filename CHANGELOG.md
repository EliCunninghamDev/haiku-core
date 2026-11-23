# Changelog

All notable changes to this project are documented here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning follows
[Semantic Versioning](https://semver.org/), with the caveat that pre-1.0 minor
bumps may break the CLI.

## [Unreleased]

### Added

- `printHaiku()` scaffolding and its test suite (see #1).

### Known issues

- `printHaiku()` throws `not implemented`, so its four tests fail. Tracked in
  [#1](https://github.com/EliCunninghamDev/haiku-core/issues/1).

## [0.4.2] — 2026-11-14

### Fixed

- `candle` was counted as one syllable. It is two. The `-le` rule now applies
  after a consonant, and only after a consonant.
- Trailing punctuation no longer contributes a phantom syllable to `count`.

### Changed

- The Bun server reports the active engine in `/api/health`.

## [0.4.1] — 2026-10-30

### Added

- `/api/haikus` returns the full bundled set.
- Deterministic `?seed=` selection for `/api/haiku`.

### Fixed

- `verify` accepted two-line input and reported `ok: false` with a confusing
  count array. It now validates length before syllables.

## [0.4.0] — 2026-10-11

### Added

- TypeScript port in `src/syllable.ts`, byte-for-byte equivalent to the Rust
  rules.
- Bun server, `/api/verify`, and the landing page.
- `count` mode for per-line JSON output.

### Changed

- CLI exit codes: `0` valid, `1` invalid poem, `2` usage error.

## [0.3.0] — 2026-09-19

### Added

- `verify` mode and the 5-7-5 exit-code contract.
- Unit tests for the silent-`e` and consonant-`le` rules.

## [0.2.0] — 2026-09-02

### Added

- Reference haiku, `print` mode.

### Removed

- The `--json` flag, which produced JSON that was not JSON.

## [0.1.0] — 2026-08-24

### Added

- Initial vowel-group counter. 140 lines. One file. No plan.
