import { coverageConfigDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      exclude: ['**/*.tsx', '**/enums/*', '**/Play/Replay/*', ...coverageConfigDefaults.exclude]
    },
  },
})