.PHONY: all install dev test test-ts test-rust build demo verify fmt clean

all: verify

install:
	bun install
	cargo build --release --manifest-path rust/Cargo.toml

dev:
	bun run dev

build:
	cargo build --release --manifest-path rust/Cargo.toml

test: test-ts test-rust

test-ts:
	bun test

test-rust:
	cargo test --manifest-path rust/Cargo.toml

verify:
	bunx tsc --noEmit
	bun test
	cargo test --manifest-path rust/Cargo.toml

fmt:
	cargo fmt --manifest-path rust/Cargo.toml
	cargo clippy --manifest-path rust/Cargo.toml -- -D warnings

demo:
	vhs demo.tape

clean:
	rm -rf node_modules rust/target
