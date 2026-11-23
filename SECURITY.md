# Security Policy

## Supported versions

| Version | Supported |
| ------- | --------- |
| 0.4.x   | ✅        |
| 0.3.x   | ⚠️ critical fixes only |
| < 0.3   | ❌        |

`haiku-core` is pre-1.0. The HTTP surface is small, but small is not the same as
safe.

## Reporting a vulnerability

**Do not open a public issue.**

Use GitHub's private vulnerability reporting on this repository:
<https://github.com/EliCunninghamDev/haiku-core/security/advisories/new>

Include, where possible:

- affected version or commit,
- a minimal reproduction (a `curl` line, a poem, a seed),
- the impact you believe it has,
- whether you intend to publish, and on what timeline.

If GitHub private reporting is unavailable to you, email
`security@elijahcunningham.dev` with the subject `haiku-core: <short summary>`.

## What to expect

| Stage                    | Target      |
| ------------------------ | ----------- |
| Acknowledgement          | 72 hours    |
| Triage and severity call | 7 days      |
| Fix or mitigation plan   | 30 days     |
| Coordinated disclosure   | 90 days     |

We will credit you in the advisory and in `CHANGELOG.md` unless you ask us not
to. We will not ask you to sign anything.

## Scope

In scope:

- `rust/src/main.rs` — the reference syllable counter and CLI argument parsing,
- `src/` — the Bun server, its routing, and the TypeScript port,
- the published Docker image, if one exists at the time you read this.

Out of scope:

- denial of service by very long input (the counter is linear; it is fine),
- syllable counts you disagree with (that is a correctness bug — open a normal
  issue with the word and your count),
- anything requiring a compromised host, browser, or dependency chain,
- the accuracy of any poem included in the repository.

## Safe harbor

We will not pursue legal action against researchers who act in good faith,
stay within the scope above, avoid privacy violations and data destruction, and
give us reasonable time to respond before disclosure.

## No bounty program

This project does not operate a paid bug bounty program. There is no escrow, no
reward pool, and no payout schedule. Security reports are handled as above and
credited publicly. If you are looking for a paid program, this is not one.
