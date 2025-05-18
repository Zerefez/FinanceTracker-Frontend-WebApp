@echo off
echo.
echo ==========================================
echo RUNNING SOURCE CODE COVERAGE REPORT
echo ==========================================
echo.

set NODE_OPTIONS=--max-old-space-size=4096

REM Run tests with coverage and format output as a detailed table
call node node_modules/vitest/vitest.mjs run --coverage.provider=istanbul --coverage.include="src/**/*.{ts,tsx}" --coverage.exclude="src/test/**/*" --coverage.reporter=text --coverage.perFile=true --coverage.reportClassesPerFile=true

echo.
echo ==========================================
echo COVERAGE REPORT COMPLETE
echo ========================================== 