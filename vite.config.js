import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    strictPort: true, // Ensures the server uses the specified port
  },
  build: {
    outDir: 'dist', // Output directory for production builds
    assetsDir: 'assets', // Directory for static assets
  },
})
