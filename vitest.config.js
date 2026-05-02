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
    testTimeout: 60000,
    hookTimeout: 30000,
    teardownTimeout: 30000,
    exclude: [
      'node_modules',
      'dist',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 60,
        functions: 55,
        branches: 45,
        statements: 60,
      },
      exclude: [
        'node_modules/',
        'src/tests/',
        '**/*.test.{js,jsx}',
        'src/main.jsx',
        '**/*.config.*',
        'src/hooks/index.js',
        'src/components/index.js',
        'src/utils/index.js',
        'src/locales/**',
        'src/i18n.js',
        'src/assets/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
