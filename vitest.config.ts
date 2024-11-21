import { coverageConfigDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      exclude: ['**/*.tsx', '**/enums/*', '**/Play/Replay/*', '**/Profile/*', '**/Leaderboard/GetLeaderboard.ts', ...coverageConfigDefaults.exclude]
    },
  },
})