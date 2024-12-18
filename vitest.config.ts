import { coverageConfigDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        '**/*.tsx',
        '**/enums/*',
        '**/Play/Replay/*',
        '**/Profile/*',
        '**/Leaderboard/GetLeaderboard.ts',
        '**/Leaderboard/RandomName.ts',
        '**/Login/api/Login.ts',
        '**/Play/PostScore.ts',
        ...coverageConfigDefaults.exclude
      ]
    },
  },
})