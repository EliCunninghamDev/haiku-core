# Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                        rust/src/main.rs                            │
│  count_syllables()   count_line()   verify()                       │
│  CLI: print · count · verify · version                             │
│  dependencies: none                                                │
└───────────────▲────────────────────────────────────────────────────┘
                │ spawn + stdin/stdout pipe
┌───────────────┴────────────────────────────────────────────────────┐
│                        src/                                        │
│  index.ts     Bun.serve routing, JSON envelope                     │
│  engine.ts    picks Rust when built, TypeScript otherwise          │
│  syllable.ts  port of count_syllables / count_line                 │
│  haiku.ts     corpus, verification, deterministic selection        │
│  poetry.ts    printHaiku() — unimplemented (see #1)                │
└────────────────────────────────────────────────────────────────────┘
```

## Why two engines

The CLI has to run in CI containers where a 40 MB Bun runtime is unwelcome. The
browser demo and the HTTP surface have to run where a Rust toolchain is
unwelcome. Two implementations of thirty lines each, one shared fixture set, is
cheaper than any of the alternatives we tried:

| Option                          | Verdict |
| ------------------------------- | ------- |
| Rust compiled to WASM for both  | Rejected: 2.1 MB artifact for a toy |
| Call out to a hosted service    | Rejected: a haiku should not need the network |
| One implementation, one language| Rejected: see above, twice |
| Two implementations, one spec   | **Shipped** |

The cost is drift. The mitigation is that both suites run the same fixtures and
CI fails if either disagrees.

## Syllable rules

The counter operates on lowercase ASCII letters only. Four passes, in order:

1. Collapse runs of vowels into one group each: `beautiful` → `eau`, `i`, `u`.
2. Drop a silent final `e` when the preceding character is a consonant:
   `stone` → 1.
3. Add a syllable back for consonant + `le`: `little` → 2, `candle` → 2.
4. Floor at 1 for any word with at least one letter; floor at 0 for empty input.

`y` is a vowel. This is wrong for `yes`, `yacht`, and `YFI`, and right more often
than the alternative.

## Failure modes

| Failure                          | Behavior |
| -------------------------------- | -------- |
| Rust binary missing              | TypeScript engine answers; `/api/health` reports `typescript` |
| Rust binary crashes              | Falls back to TypeScript; the error is logged once |
| Rust binary emits invalid JSON   | Falls back; no exception reaches the request |
| Input longer than memory         | Linear scan, one allocation per line, no recursion |
| Non-ASCII input                  | Ignored by the filter; may undercount non-English words |

## Performance

Measured on a Ryzen 7 7840U, release build, one core, warm cache:

| Workload                      | Rust  | TypeScript |
| ----------------------------- | ----- | ---------- |
| `verify`, 3 lines             | 1.8ms | 2.4ms      |
| `count`, 1,000 lines          | 4.1ms | 11.7ms     |
| `/api/verify`, end to end     | 3.2ms | 3.9ms      |

The server adds about a millisecond of routing on top of whichever engine is
active. This is not a benchmark suite; it is four numbers we re-measured twice.
