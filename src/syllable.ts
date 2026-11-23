/**
 * Syllable counting, ported 1:1 from the Rust reference implementation.
 *
 * If you change one, change the other. `bun run verify` runs both test suites
 * against the same fixtures for exactly this reason.
 */

const VOWELS = new Set(["a", "e", "i", "o", "u", "y"]);

export function countSyllables(word: string): number {
  const chars = [...word.toLowerCase()].filter((c) => /[a-z]/.test(c));
  if (chars.length === 0) return 0;

  let count = 0;
  let prevVowel = false;

  for (const c of chars) {
    const isVowel = VOWELS.has(c);
    if (isVowel && !prevVowel) count++;
    prevVowel = isVowel;
  }

  // Silent terminal 'e' ("stone", "phrase") does not get its own beat.
  const last = chars[chars.length - 1];
  const secondLast = chars[chars.length - 2];
  if (chars.length > 2 && last === "e" && !VOWELS.has(secondLast!)) {
    count = Math.max(0, count - 1);
  }

  // "-le" after a consonant is its own syllable ("little", "candle").
  const thirdLast = chars[chars.length - 3];
  if (
    chars.length > 2 &&
    last === "e" &&
    secondLast === "l" &&
    !VOWELS.has(thirdLast!)
  ) {
    count++;
  }

  return Math.max(1, count);
}

export function countLine(line: string): number {
  return line
    .split(/[^a-zA-Z0-9']+/)
    .filter((w) => w.length > 0)
    .reduce((sum, word) => sum + countSyllables(word), 0);
}
