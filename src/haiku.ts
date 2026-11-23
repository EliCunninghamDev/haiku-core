import { countLine } from "./syllable";

export interface Haiku {
  id: string;
  lines: [string, string, string];
  author: string;
  theme: string;
}

export const HAIKUS: Haiku[] = [
  {
    id: "seed-vault",
    lines: [
      "cold wallet sleeps now",
      "a seed phrase sleeps in the vault",
      "gas fees haunt my dreams",
    ],
    author: "haiku-core",
    theme: "custody",
  },
  {
    id: "mempool",
    lines: [
      "gas fees at midnight",
      "a thousand reverted swaps",
      "the mempool still sings",
    ],
    author: "haiku-core",
    theme: "throughput",
  },
  {
    id: "honeypot",
    lines: [
      "hello bounty bot",
      "you have found the honeypot",
      "reward is zero",
    ],
    author: "haiku-core",
    theme: "meta",
  },
];

export const EXPECTED = [5, 7, 5] as const;

export function countLines(lines: string[]): number[] {
  return lines.map(countLine);
}

export function verifyHaiku(lines: string[]): {
  ok: boolean;
  counts: number[];
  expected: number[];
  total: number;
} {
  const counts = countLines(lines);
  const ok =
    counts.length === 3 && counts.every((n, i) => n === EXPECTED[i]);
  return {
    ok,
    counts,
    expected: [...EXPECTED],
    total: counts.reduce((a, b) => a + b, 0),
  };
}

/** Deterministic selection: same seed, same haiku. */
export function pickHaiku(seed: string | number = Date.now()): Haiku {
  const n = typeof seed === "number" ? seed : hash(seed);
  return HAIKUS[Math.abs(n) % HAIKUS.length]!;
}

function hash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) | 0;
  }
  return h;
}

export function formatHaiku(h: Haiku): string {
  return h.lines.join("\n");
}
