check: lint test

lint:
	./node_modules/.bin/biome ci

format:
	./node_modules/.bin/biome format --write

test:
	node --test $(TEST_OPTS)

test-cov: TEST_OPTS := --experimental-test-coverage
test-cov: test

.PHONY: check lint format test test-cov
