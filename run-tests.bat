@echo off
echo Running tests in sequence to avoid memory issues...

echo.
echo === Running App Tests ===
call npm run test:app

echo.
echo === Running Services Tests ===
call npm run test:services

echo.
echo === Running Hooks Tests ===
call npm run test:hooks

echo.
echo === Running Components Tests ===
call npm run test:components

echo.
echo === Running Pages Tests ===
call npm run test:pages

echo.
echo All tests completed! 