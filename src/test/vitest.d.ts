/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />

// Declare global test functions provided by Vitest globals
declare global {
  // Vitest globals
  const describe: typeof import('vitest')['describe'];
  const it: typeof import('vitest')['it'];
  const test: typeof import('vitest')['test'];
  const expect: typeof import('vitest')['expect'];
  const vi: typeof import('vitest')['vi'];
  const beforeEach: typeof import('vitest')['beforeEach'];
  const afterEach: typeof import('vitest')['afterEach'];
  const beforeAll: typeof import('vitest')['beforeAll'];
  const afterAll: typeof import('vitest')['afterAll'];
}

export { };
