/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    testTimeout: 20000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        '**/node_modules/**', 
        '**/dist/**', 
        '**/coverage/**', 
        '**/*.d.ts',
        'src/test/setup.ts',
        'src/test/**/*',
        '**/*.config.ts',
        '**/types.ts',
      ],
    },
  },
}); 