import { countLines, verifyHaiku } from "./haiku";

const RUST_BIN = new URL(
  "../rust/target/release/haiku-core",
  import.meta.url,
).pathname;

let rustAvailable: boolean | null = null;

/** True when the Rust reference binary has been built locally. */
export function hasRustEngine(): boolean {
  if (rustAvailable !== null) return rustAvailable;
  try {
    rustAvailable = Bun.file(RUST_BIN).size > 0;
  } catch {
    rustAvailable = false;
  }
  return rustAvailable;
}

export function engineName(): "rust" | "typescript" {
  return hasRustEngine() ? "rust" : "typescript";
}

/**
 * Verify with the Rust reference implementation when it exists, otherwise
 * fall back to the TypeScript port. Both are tested against the same fixtures.
 */
export function verify(lines: string[]): {
  ok: boolean;
  counts: number[];
  expected: number[];
  engine: "rust" | "typescript";
} {
  if (hasRustEngine()) {
    const proc = Bun.spawnSync([RUST_BIN, "verify"], {
      stdin: new TextEncoder().encode(lines.join("\n")),
      stdout: "pipe",
      stderr: "pipe",
    });
    if (proc.exitCode === 0 || proc.exitCode === 1) {
      try {
        const parsed = JSON.parse(proc.stdout.toString().trim()) as {
          ok: boolean;
          counts: number[];
        };
        return {
          ok: parsed.ok,
          counts: parsed.counts,
          expected: [5, 7, 5],
          engine: "rust",
        };
      } catch {
        // fall through to the TypeScript engine
      }
    }
  }

  const result = verifyHaiku(lines);
  return { ...result, engine: "typescript" };
}

export function count(lines: string[]): { counts: number[]; engine: string } {
  if (hasRustEngine()) {
    const proc = Bun.spawnSync([RUST_BIN, "count"], {
      stdin: new TextEncoder().encode(lines.join("\n")),
      stdout: "pipe",
      stderr: "pipe",
    });
    if (proc.exitCode === 0) {
      try {
        const parsed = JSON.parse(proc.stdout.toString().trim()) as {
          syllables: number[];
        };
        return { counts: parsed.syllables, engine: "rust" };
      } catch {
        // fall through
      }
    }
  }
  return { counts: countLines(lines), engine: "typescript" };
}
