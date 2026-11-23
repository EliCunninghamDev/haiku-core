# Threat model

Scope: the `haiku-core` HTTP server and CLI as shipped at v0.4.x. Nothing here
is exotic. The point of writing it down is that a small surface is still a
surface.

## Assets

| Asset                | Why it matters                                      |
| -------------------- | --------------------------------------------------- |
| Process integrity    | The server shells out to a local binary             |
| Availability         | It is a service; people expect it to answer         |
| Repository integrity | The corpus and the counter are the product          |
| User trust           | A wrong count is a wrong count, and it is visible   |

There is no user data, no database, no authentication, and no secrets. The
server holds no state beyond a cached boolean.

## Trust boundaries

1. **HTTP client → server.** Untrusted input: query strings, JSON bodies,
   headers. Parsed with `JSON.parse` and `URL`, both of which throw rather than
   execute.
2. **Server → Rust binary.** The binary path is a compile-time constant derived
   from `import.meta.url`. It is never influenced by request input.
3. **Server → filesystem.** Exactly one read: the static HTML file. No path is
   constructed from user input.
4. **Contributor → repository.** Untrusted code arrives as a pull request and is
   reviewed before merge.

## Threats and mitigations

| # | Threat                                  | Mitigation |
|---| --------------------------------------- | ---------- |
| 1 | Command injection via the spawn call    | No shell. Fixed argv. Input only on stdin. |
| 2 | Path traversal on static routes         | One hard-coded file, no interpolation |
| 3 | JSON body with a huge array             | Input is linearly scanned, no recursion; bounded by the platform's request limit |
| 4 | ReDoS in the line splitter              | Character class only, no nested quantifiers |
| 5 | Prototype pollution via `JSON.parse`    | Parsed object is read through two whitelisted keys |
| 6 | XSS on the landing page                 | Static HTML, no server-side interpolation |
| 7 | Dependency compromise                   | Zero runtime dependencies; one dev dependency for types |
| 8 | Malicious PR in the Rust binary path    | Branch protection, review, CI on both engines |
| 9 | Timing side channel on `verify`         | Nothing secret is compared |
| 10| DoS via absurdly long lines             | Linear scan; memory grows with input by design |

## Explicitly out of scope

- A compromised host, browser, or container runtime.
- Supply-chain attacks against `bun` or `rustc` themselves.
- Availability of the demo deployment. There is no SLA and no pager.
- Syllable correctness. That is a bug class, not a security class, and it is
  tracked in issues.

## Residual risk

The spawn boundary is the only interesting one. If an attacker can replace the
binary at `rust/target/release/haiku-core`, they already have write access to
the deployment and the game is over. There is no privilege boundary being
crossed; there is only a process being started.

## Review cadence

Reviewed when the HTTP surface changes, when a new route is added, or when
someone asks. Last reviewed: 2026-11-14.
