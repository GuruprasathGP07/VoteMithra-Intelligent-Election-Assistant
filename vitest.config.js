import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/tests/setup.js',
    globals: true,
    pool: 'forks',
    maxThreads: 1,
    minThreads: 1,
    testTimeout: 30000,
    hookTimeout: 30000,
    exclude: [
      'node_modules',
      'dist',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 55,
        functions: 50,
        branches: 35,
        statements: 55,
      },
      exclude: [
        'node_modules',
        'src/assets/**',
        '**/*.config.*',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
