import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host:'0.0.0.0',
    port:8080,
    strictPort: true,
    allowedHosts: ['ina.plovput.hr', 'localhost:3000', '127.0.0.1'] // Ensures the server uses the specified port
    //allowedHosts:true
  },
  build: {
    outDir: 'dist', // Output directory for production builds
    assetsDir: 'assets', // Directory for static assets
  },
})
