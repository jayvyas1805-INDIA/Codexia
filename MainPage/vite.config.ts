import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  root: path.resolve(__dirname, 'client'),
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,
    open: false,
  },
  build: {
    outDir: '../dist/spa',
    emptyOutDir: true,
    sourcemap: true,
  },
})
