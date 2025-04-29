import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host:'0.0.0.0',
    port:3001,
    strictPort: true,
    allowedHosts: ['ina.plovput.hr', 'localhost:3000', '127.0.0.1','localhost:8080'], // Ensures the server uses the specified port
    hmr:{
      port: 3001, //prevent reloading behind nginx reverse proxy
    }
    //allowedHosts:true
  },
  build: {
    outDir: 'dist', // Output directory for production builds
    assetsDir: 'assets', // Directory for static assets
  },
})
