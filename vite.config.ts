import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {

    proxy: {
      '/host': {
        target: 'https://localhost:5050',
        changeOrigin: true 
      }
    }
  }
})
