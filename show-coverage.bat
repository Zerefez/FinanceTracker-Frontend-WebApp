@echo off
echo.
echo ==========================================
echo RUNNING SOURCE CODE COVERAGE REPORT
echo ==========================================
echo.

set NODE_OPTIONS=--max-old-space-size=4096

call node node_modules/vitest/vitest.mjs run --coverage.provider=istanbul --coverage.include="src/**/*.{ts,tsx}" --coverage.exclude="src/test/**/*" --coverage.reporter=text

echo.
echo ==========================================
echo COVERAGE REPORT COMPLETE
echo ========================================== 