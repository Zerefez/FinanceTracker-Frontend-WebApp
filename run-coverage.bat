@echo off
echo Running coverage with temporary symlink for path safety...

REM Create temp directory in C:\ without spaces in path if it doesn't exist
mkdir C:\temp_coverage 2>nul

REM Clean up any previous symlink
rmdir C:\temp_coverage\project 2>nul

REM Create a symlink to the current directory in the temp folder
mklink /J C:\temp_coverage\project "%CD%"

REM Go to the temp directory
cd /d C:\temp_coverage\project

REM Run the coverage command
call node --max-old-space-size=4096 node_modules/vitest/vitest.mjs run --coverage

REM Go back to the original directory
cd /d "%~dp0"

REM Clean up the symlink
rmdir C:\temp_coverage\project

echo Coverage completed. 