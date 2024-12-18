import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      proxy: mode === 'development' ? {
        '/host': {
          target: env.VITE_API_URL,
          changeOrigin: true
        }
      } : undefined
    }
  }
})
