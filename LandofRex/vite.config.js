import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // host: 'local.p.ssafy.io',
    port: 5173,
    proxy: {
      '/api': {
        // target: 'http://localhost:8080',
        target: 'https://k11e102.p.ssafy.io',
        changeOrigin: true,
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
