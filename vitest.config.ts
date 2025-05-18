/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    testTimeout: 60000,
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json'],
      include: [
        'src/**/*.{ts,tsx}'
      ],
      exclude: [
        'src/test/**/*',
        'src/**/*.d.ts',
        'src/**/*.test.{ts,tsx}'
      ],
      all: false,
      reportsDirectory: './coverage',
      clean: true
    },
    typecheck: {
      enabled: true,
      ignoreSourceErrors: false,
    }
  },
  resolve: {
    conditions: ['development', 'browser'],
  },
  build: {
    sourcemap: false
  }
}); 