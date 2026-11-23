//! haiku-core — deterministic 5-7-5 verification.
//!
//! This binary is the reference implementation for HaikuSec's syllable
//! counting. It has no dependencies on purpose: everything in here must be
//! auditable in one sitting, by one person, with one coffee.

use std::env;
use std::io::{self, BufRead, Read};
use std::process::ExitCode;

const VOWELS: &[char] = &['a', 'e', 'i', 'o', 'u', 'y'];

/// Heuristic syllable counter. Deliberately conservative: we would rather
/// under-count a diphthong than inflate a poet's ego.
pub fn count_syllables(word: &str) -> usize {
    let chars: Vec<char> = word
        .chars()
        .filter(|c| c.is_ascii_alphabetic())
        .map(|c| c.to_ascii_lowercase())
        .collect();

    if chars.is_empty() {
        return 0;
    }

    let mut count = 0usize;
    let mut prev_vowel = false;

    for &c in &chars {
        let is_vowel = VOWELS.contains(&c);
        if is_vowel && !prev_vowel {
            count += 1;
        }
        prev_vowel = is_vowel;
    }

    // Silent terminal 'e' ("stone", "phrase") does not get its own beat.
    if chars.len() > 2 && chars.last() == Some(&'e') && !VOWELS.contains(&chars[chars.len() - 2]) {
        count = count.saturating_sub(1);
    }

    // "-le" after a consonant is its own syllable ("little", "candle").
    if chars.len() > 2
        && chars.last() == Some(&'e')
        && chars[chars.len() - 2] == 'l'
        && !VOWELS.contains(&chars[chars.len() - 3])
    {
        count += 1;
    }

    count.max(1)
}

pub fn count_line(line: &str) -> usize {
    line.split(|c: char| !c.is_alphanumeric() && c != '\'')
        .filter(|w| !w.is_empty())
        .map(count_syllables)
        .sum()
}

fn verify(lines: &[String]) -> (bool, Vec<usize>) {
    let counts: Vec<usize> = lines.iter().map(|l| count_line(l)).collect();
    let ok = counts == [5, 7, 5];
    (ok, counts)
}

fn print_default() {
    println!("cold wallet sleeps now");
    println!("a seed phrase sleeps in the vault");
    println!("gas fees haunt my dreams");
}

fn main() -> ExitCode {
    let args: Vec<String> = env::args().skip(1).collect();
    let mode = args.first().map(String::as_str).unwrap_or("print");

    match mode {
        "print" => {
            print_default();
            ExitCode::SUCCESS
        }
        "count" => {
            let mut input = String::new();
            if io::stdin().read_to_string(&mut input).is_err() {
                return ExitCode::FAILURE;
            }
            let lines: Vec<String> = input.lines().map(str::to_string).collect();
            let counts: Vec<usize> = lines.iter().map(|l| count_line(l)).collect();
            let json = counts
                .iter()
                .map(|c| c.to_string())
                .collect::<Vec<_>>()
                .join(",");
            println!("{{\"syllables\":[{}],\"total\":{}}}", json, counts.iter().sum::<usize>());
            ExitCode::SUCCESS
        }
        "verify" => {
            let stdin = io::stdin();
            let lines: Vec<String> = stdin
                .lock()
                .lines()
                .map_while(Result::ok)
                .filter(|l| !l.trim().is_empty())
                .collect();
            let (ok, counts) = verify(&lines);
            println!(
                "{{\"ok\":{},\"counts\":[{}],\"expected\":[5,7,5]}}",
                ok,
                counts.iter().map(|c| c.to_string()).collect::<Vec<_>>().join(",")
            );
            if ok {
                ExitCode::SUCCESS
            } else {
                ExitCode::from(1)
            }
        }
        "version" | "--version" | "-V" => {
            println!("haiku-core {}", env!("CARGO_PKG_VERSION"));
            ExitCode::SUCCESS
        }
        "help" | "--help" | "-h" => {
            println!("haiku-core {}", env!("CARGO_PKG_VERSION"));
            println!();
            println!("USAGE:");
            println!("  haiku-core print     print the reference haiku");
            println!("  haiku-core count     read lines on stdin, emit syllable counts");
            println!("  haiku-core verify    read a 3-line haiku on stdin, validate 5-7-5");
            println!("  haiku-core version   print version");
            ExitCode::SUCCESS
        }
        other => {
            eprintln!("haiku-core: unknown mode '{other}' (try `haiku-core help`)");
            ExitCode::from(2)
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn counts_simple_words() {
        assert_eq!(count_syllables("cold"), 1);
        assert_eq!(count_syllables("wallet"), 2);
        assert_eq!(count_syllables("vault"), 1);
        assert_eq!(count_syllables("beautiful"), 3);
    }

    #[test]
    fn silent_e_and_le() {
        assert_eq!(count_syllables("stone"), 1);
        assert_eq!(count_syllables("little"), 2);
        assert_eq!(count_syllables("candle"), 2);
    }

    #[test]
    fn reference_haiku_is_valid() {
        let lines = vec![
            "cold wallet sleeps now".to_string(),
            "a seed phrase sleeps in the vault".to_string(),
            "gas fees haunt my dreams".to_string(),
        ];
        let (ok, counts) = verify(&lines);
        assert_eq!(counts, vec![5, 7, 5]);
        assert!(ok);
    }

    #[test]
    fn ignores_punctuation() {
        assert_eq!(count_line("cold, wallet -- sleeps."), 4);
    }
}
