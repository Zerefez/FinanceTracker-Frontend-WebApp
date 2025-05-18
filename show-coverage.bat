@echo off
echo.
echo ==========================================
echo RUNNING SOURCE CODE COVERAGE REPORT
echo ==========================================
echo.

set NODE_OPTIONS=--max-old-space-size=4096

REM Simple command to match exactly what's shown in the terminal
call node node_modules/vitest/vitest.mjs run --coverage --reporter=verbose

echo.
echo ==========================================
echo COVERAGE REPORT COMPLETE
echo ========================================== 