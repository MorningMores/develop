import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        '.nuxt/',
        'coverage/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        'test/',
        'tests/',
        'cypress/',
        '**/__tests__/**',
      ],
      all: true,
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80,
      include: [
        'app/**/*.{js,ts,vue}',
        'components/**/*.{js,ts,vue}',
        'composables/**/*.{js,ts}',
        'server/**/*.{js,ts}',
      ],
    },
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    testTimeout: 10000,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url)),
      '~': fileURLToPath(new URL('./', import.meta.url)),
      '~~': fileURLToPath(new URL('./', import.meta.url)),
      '@@': fileURLToPath(new URL('./', import.meta.url)),
      'assets': fileURLToPath(new URL('./app/assets', import.meta.url)),
      'public': fileURLToPath(new URL('./public', import.meta.url)),
    },
  },
})