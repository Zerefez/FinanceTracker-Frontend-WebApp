@echo off
echo Running coverage for src code only...

REM Set max memory
set NODE_OPTIONS=--max-old-space-size=4096

REM Clean coverage directory
rmdir /s /q coverage 2>nul
mkdir coverage 2>nul

REM Run the coverage command with specific include/exclude patterns
call node node_modules/vitest/vitest.mjs run --coverage.provider=istanbul --coverage.include="src/**/*.{ts,tsx}" --coverage.exclude="src/test/**/*" --coverage.reporter=text

echo Coverage completed. 