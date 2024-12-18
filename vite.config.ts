import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {

    proxy: {
      '/host': {
        target: 'https://lukasjasiulionis.lt',
        changeOrigin: true 
      }
    }
  }
})
