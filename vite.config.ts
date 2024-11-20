import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {

    proxy: {
      '/host': {
        target: 'http://localhost:5050/api/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/host/, '')
      }
    }
  }
})
