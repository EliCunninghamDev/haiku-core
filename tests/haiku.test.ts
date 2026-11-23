import { describe, expect, test } from "bun:test";
import { countSyllables, countLine } from "../src/syllable";
import { HAIKUS, pickHaiku, verifyHaiku } from "../src/haiku";

describe("countSyllables", () => {
  test("counts simple words", () => {
    expect(countSyllables("cold")).toBe(1);
    expect(countSyllables("wallet")).toBe(2);
    expect(countSyllables("vault")).toBe(1);
    expect(countSyllables("beautiful")).toBe(3);
  });

  test("handles silent e and consonant-le", () => {
    expect(countSyllables("stone")).toBe(1);
    expect(countSyllables("little")).toBe(2);
    expect(countSyllables("candle")).toBe(2);
  });

  test("returns 0 for unpronounceable input", () => {
    expect(countSyllables("")).toBe(0);
    expect(countSyllables("!!!")).toBe(0);
    expect(countSyllables("x")).toBe(1);
  });
});

describe("countLine", () => {
  test("ignores punctuation", () => {
    expect(countLine("cold, wallet -- sleeps.")).toBe(4);
  });
});

describe("bundled haikus", () => {
  test("every shipped haiku is 5-7-5", () => {
    for (const haiku of HAIKUS) {
      const result = verifyHaiku([...haiku.lines]);
      expect(result.counts).toEqual([5, 7, 5]);
      expect(result.ok).toBe(true);
    }
  });

  test("pickHaiku is deterministic for a seed", () => {
    expect(pickHaiku("bounty").id).toBe(pickHaiku("bounty").id);
    expect(pickHaiku(7).id).toBe(pickHaiku(7).id);
  });
});
