# Contributing to haiku-core

Thanks for reading this before opening a PR. It is longer than the codebase and
that is on purpose.

## Ground rules

1. **One haiku per pull request.** A haiku fix and a refactor are two PRs.
2. **Both engines or neither.** A syllable rule change lands in `rust/src/main.rs`
   and `src/syllable.ts` in the same commit, with fixtures in `tests/`.
3. **No new dependencies.** The zero-dependency claim is the product. If you
   truly need one, open an issue first and expect a conversation.
4. **Be honest in the changelog.** "Fixed" means it was broken.

## Getting set up

```sh
git clone https://github.com/EliCunninghamDev/haiku-core
cd haiku-core
bun install
cargo build --release --manifest-path rust/Cargo.toml
```

## Running things

```sh
bun test                              # TypeScript suite
bun run test:rust                     # Rust suite
bun run verify                        # typecheck + both suites
cargo fmt --manifest-path rust/Cargo.toml
cargo clippy --manifest-path rust/Cargo.toml -- -D warnings
bun run dev                           # server on :3000
```

CI runs exactly these. `bun run verify` locally is the same failure you will see
in the badge.

## Commit messages

[Conventional Commits](https://www.conventionalcommits.org/), scoped:

```
feat(engine): count "fire" as one syllable
fix(cli): exit 2 on unknown mode
test(poetry): cover trailing whitespace
docs(readme): correct the bus factor
```

## Fixtures

Syllable disagreements are settled with fixtures, not opinions. Add the word,
your count, and a one-line justification to `tests/fixtures/syllables.json`
(coming in v0.5). Until then, add a `test(...)` case next to the existing ones
and say why in the PR description.

## Reviews

One maintainer reviews. Reviews are about correctness and taste, in that order.
"Taste" means the haiku should not be about the price of anything.

## Code of conduct

Participation is governed by [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). Short
version: be decent, and do not make the syllable counter about you.
