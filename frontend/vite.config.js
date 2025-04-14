import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isProduction = mode === 'production'

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
      sourcemap: !isProduction,
      minify: isProduction ? 'terser' : false,
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
          format: 'es',
          dir: 'dist',
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash].[ext]'
        },
      },
      commonjsOptions: {
        include: [/node_modules/],
        extensions: ['.js', '.cjs'],
        strictRequires: true,
        transformMixedEsModules: true
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
    },
    define: {
      'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
      'process.env.VITE_UPLOADS_URL': JSON.stringify(env.VITE_UPLOADS_URL),
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.BASE_URL': JSON.stringify(env.BASE_URL || '/'),
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
      exclude: ['@babel/runtime'],
      esbuildOptions: {
        target: 'esnext'
      }
    },
    base: env.BASE_URL || '/',
    preview: {
      port: 5173,
      strictPort: true,
    },
  }
}) 