import { defineConfig, configDefaults } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    // vendor/*/frontend packages run their own test suite (own environment,
    // own CI): without this, Vitest's default file discovery sweeps their
    // tests into this run too, under this project's node-only environment
    // instead of the jsdom one they actually need.
    exclude: [...configDefaults.exclude, 'vendor/**'],
  },
})
