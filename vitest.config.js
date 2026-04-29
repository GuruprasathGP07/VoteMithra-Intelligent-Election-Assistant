import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.js',

    // Vitest 4: pool and concurrency settings are top-level
    pool: 'forks',
    maxWorkers: 2,

    // Fresh environment per file (prevents state leakage between suites)
    isolate: true,

    // Hard timeout guards — prevents infinite hangs
    testTimeout: 15000,
    hookTimeout: 10000,

    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'json-summary'],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 60,
        statements: 70,
      },
      exclude: [
        'node_modules/',
        'src/tests/setup.js',
        '**/*.test.{js,jsx}',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
