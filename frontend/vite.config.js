import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          mui: ['@mui/material', '@mui/icons-material', '@mui/x-date-pickers', '@mui/x-data-grid', '@mui/lab'],
          toast: ['react-toastify'],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env': process.env,
  },
  optimizeDeps: {
    include: [
      '@mui/x-date-pickers',
      '@mui/x-data-grid',
      '@mui/lab',
      'date-fns',
      '@mui/material',
      '@mui/icons-material',
      'react',
      'react-dom',
      'react-router-dom',
      'react-toastify'
    ],
  },
}) 