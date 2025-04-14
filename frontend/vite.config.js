import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://dr-ritesh-healthcare-clinic.vercel.app',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'https://dr-ritesh-healthcare-clinic.vercel.app',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  define: {
    'process.env': process.env,
  },
}) 