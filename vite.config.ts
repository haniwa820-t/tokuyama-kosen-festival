import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/tokuyama-kosen-festival/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    env: { BASE_URL: '/tokuyama-kosen-festival/' },
    setupFiles: ['./tests/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/App.tsx', 'src/components/**/*.{ts,tsx}', 'src/lib/**/*.ts'],
      exclude: ['**/*.test.*'],
      thresholds: { statements: 80, branches: 80, functions: 80, lines: 80 },
      reporter: ['text', 'html'],
    },
  },
})
