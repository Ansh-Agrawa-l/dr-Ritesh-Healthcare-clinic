import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      react({
        jsxRuntime: 'automatic',
        jsxImportSource: 'react',
        babel: {
          plugins: [
            ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]
          ]
        }
      })
    ],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        },
        '/uploads': {
          target: 'http://localhost:5000',
          changeOrigin: true,
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
      'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
      'process.env.VITE_UPLOADS_URL': JSON.stringify(env.VITE_UPLOADS_URL),
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    optimizeDeps: {
      include: [
        '@mui/x-date-pickers',
        '@mui/x-data-grid',
        '@mui/lab',
        'dayjs',
        '@mui/material',
        '@mui/icons-material',
        'react',
        'react-dom',
        'react-router-dom',
        'react-toastify',
        'react-error-boundary'
      ],
    },
    base: '/',
    preview: {
      port: 5173,
      strictPort: true,
    },
  }
}) 