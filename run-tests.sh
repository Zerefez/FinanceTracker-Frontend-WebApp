#!/bin/bash
echo "Running tests in sequence to avoid memory issues..."

echo
echo "=== Running App Tests ==="
npm run test:app

echo
echo "=== Running Services Tests ==="
npm run test:services

echo
echo "=== Running Hooks Tests ==="
npm run test:hooks

echo
echo "=== Running Components Tests ==="
npm run test:components

echo
echo "=== Running Pages Tests ==="
npm run test:pages

echo
echo "All tests completed!" 