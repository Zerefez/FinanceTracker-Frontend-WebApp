@echo off
echo.
echo ==========================================
echo DISPLAYING SOURCE CODE COVERAGE REPORT
echo ==========================================
echo.

set NODE_OPTIONS=--max-old-space-size=4096

REM Display coverage report in detailed table format
call node node_modules/vitest/vitest.mjs --coverage.provider=istanbul --coverage.include="src/**/*.{ts,tsx}" --coverage.exclude="src/test/**/*" --coverage.reporter=text --coverage.perFile=true --coverage.showFiles=true --coverage.reportClassesPerFile=true --coverage.lines=true --coverage.functions=true --coverage.branches=true --coverage.statements=true

echo.
echo ==========================================
echo COVERAGE REPORT DISPLAY COMPLETE
echo ========================================== 