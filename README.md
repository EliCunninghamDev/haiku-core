<div align="center">

# haiku-core

**Five. Seven. Five. Nothing else.**

[![CI](https://github.com/EliCunninghamDev/haiku-core/actions/workflows/ci.yml/badge.svg)](https://github.com/EliCunninghamDev/haiku-core/actions/workflows/ci.yml)
[![license](https://img.shields.io/badge/license-MIT-5eead4)](LICENSE)
[![dependencies](https://img.shields.io/badge/dependencies-0-5eead4)](rust/Cargo.toml)
[![syllables](https://img.shields.io/badge/syllables-5--7--5-5eead4)](#how-it-works)
[![bun](https://img.shields.io/badge/runtime-bun%20%E2%89%A51.2-f472b6)](https://bun.sh)
[![rust](https://img.shields.io/badge/engine-rust%201.75%2B-dea584)](rust/Cargo.toml)
[![sponsors](https://img.shields.io/badge/sponsors-welcome-ea4aaa)](https://github.com/sponsors/EliCunninghamDev)

Deterministic haiku verification for terminals and CI.<br />
No crates. No npm dependencies. No strong opinions about your line breaks.

</div>

![haiku-core in a terminal](assets/demo.gif)

---

## Why

Poetry tooling is either a linter for prose or a website that rewrites your poem
with a language model. Neither will tell you, in 4ms and with an exit code,
that line two has six syllables.

`haiku-core` will.

- **Deterministic.** Same poem, same counts, forever. No model, no sampling.
- **Dependency-free.** The Rust binary links nothing. The Bun server ships zero
  runtime packages.
- **Dual-engine.** A Rust reference implementation for the CLI and CI, a
  TypeScript port for the browser and for anyone who refuses to install cargo.
- **Honest about its limits.** The counter is heuristic. English is a mess. See
  [Known limitations](#known-limitations).

## Install

```sh
git clone https://github.com/EliCunninghamDev/haiku-core
cd haiku-core

# CLI
cargo build --release --manifest-path rust/Cargo.toml
./rust/target/release/haiku-core print

# server
bun install
bun run dev   # http://localhost:3000
```

Requires Rust 1.75+ and Bun 1.2+. Nothing else. Not even a lockfile you did not
ask for.

## Usage

```sh
# print the reference haiku
haiku-core print

# count syllables, one JSON line per invocation
haiku-core count < poem.txt

# validate 5-7-5, exit 1 on a stray syllable
haiku-core verify < poem.txt
```

```
$ haiku-core verify <<'EOF'
cold wallet sleeps now
a seed phrase sleeps in the vault
gas fees haunt my dreams
EOF
{"ok":true,"counts":[5,7,5],"expected":[5,7,5]}
```

### Library

```ts
import { verifyHaiku } from "./src/haiku";

verifyHaiku([
  "cold wallet sleeps now",
  "a seed phrase sleeps in the vault",
  "gas fees haunt my dreams",
]);
// { ok: true, counts: [5, 7, 5], total: 17 }
```

### HTTP

```sh
curl -s localhost:3000/api/haiku?seed=42
curl -s localhost:3000/api/verify \
  -H 'content-type: application/json' \
  -d '{"lines":["cold wallet sleeps now","a seed phrase sleeps in the vault","gas fees haunt my dreams"]}'
```

| Route           | Method | Returns                                         |
| --------------- | ------ | ----------------------------------------------- |
| `/api/haiku`    | GET    | One deterministic haiku (`?seed=` optional)     |
| `/api/haikus`   | GET    | Every bundled haiku                             |
| `/api/verify`   | POST   | Per-line syllable counts and an `ok` flag       |
| `/api/health`   | GET    | Liveness plus the engine currently in use       |

## How it works

```
                 ┌──────────────────────────┐
   poem.txt ───► │  haiku-core (Rust)       │ ───► {"ok":true,"counts":[5,7,5]}
                 │  rust/src/main.rs        │
                 └──────────────────────────┘
                              ▲
                              │ spawn + pipe, when the binary is present
                 ┌────────────┴─────────────┐
   HTTP      ───►│  Bun server (TypeScript) │ ───► /api/verify
                 │  src/syllable.ts         │      (falls back to the port)
                 └──────────────────────────┘
```

Both engines implement the same three rules:

| Rule                  | Example                     | Result |
| --------------------- | --------------------------- | ------ |
| Count vowel groups    | `beau-ti-ful`               | 3      |
| Drop silent final `e` | `stone`                     | 1      |
| Keep consonant + `le` | `can-dle`, `lit-tle`        | 2      |

`y` is treated as a vowel. It is, sometimes. This is the entire heuristic and
the entire bug tracker.

### Known limitations

- Diphthongs are counted as one group when adjacent. English disagrees roughly
  12% of the time.
- Proper nouns, loanwords, and anything from a protocol whitepaper are on you.
- The counter does not know what a haiku *is*, only how long it is.
- `printHaiku()` is not implemented yet — see [#1](https://github.com/EliCunninghamDev/haiku-core/issues/1).

## Development

```sh
bun install
bun test              # 10 tests across two suites
bun run test:rust     # Rust unit tests
bun run verify        # typecheck + both suites
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full workflow, commit
conventions, and the one-haiku-per-PR rule.

## Project health

| Signal            | Value                                        |
| ----------------- | -------------------------------------------- |
| Build             | failing · [#1](https://github.com/EliCunninghamDev/haiku-core/issues/1) |
| Coverage          | 100% of the poems we ship                    |
| Audit             | none scheduled, none required                |
| Bus factor        | 1, disclosed in [SECURITY.md](SECURITY.md)   |
| Production users  | 0 protocols, 2 pre-commit hooks, 1 bot       |
| Backed by         | nobody                                       |

## Roadmap

[v0.5 — diphthong table](ROADMAP.md) · [v0.6 — wasm build](ROADMAP.md) ·
[v1.0 — frozen CLI](ROADMAP.md)

## Sponsors

If `haiku-core` saved you an embarrassing syllable, consider
[sponsoring the work](https://github.com/sponsors/EliCunninghamDev). Sponsorship
buys gratitude and a place in `SPONSORS.md`, not influence over the syllable
rules.

## Security

Please read [SECURITY.md](SECURITY.md) before opening an issue about the HTTP
surface. Reports go through GitHub private advisories, not the public tracker.

## License

MIT © 2026 Elijah Cunningham. See [LICENSE](LICENSE).
