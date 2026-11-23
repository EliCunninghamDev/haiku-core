import { describe, expect, test } from "bun:test";
import { printHaiku } from "../src/poetry";
import { countLine } from "../src/syllable";

function capture(fn: () => void): string[] {
  const out: string[] = [];
  const original = console.log;
  console.log = (...args: unknown[]) => {
    out.push(args.map(String).join(" "));
  };
  try {
    fn();
  } finally {
    console.log = original;
  }
  return out;
}

describe("prints a proper haiku", () => {
  test("writes exactly three lines", () => {
    const lines = capture(printHaiku);
    expect(lines).toHaveLength(3);
  });

  test("each line is 5-7-5 syllables", () => {
    const counts = capture(printHaiku).map(countLine);
    expect(counts).toEqual([5, 7, 5]);
  });

  test("prints the same haiku on every call", () => {
    expect(capture(printHaiku)).toEqual(capture(printHaiku));
  });

  test("uses no trailing whitespace", () => {
    for (const line of capture(printHaiku)) {
      expect(line).toBe(line.trimEnd());
    }
  });
});
