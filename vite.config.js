import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Generar archivos en una carpeta específica
    outDir: 'dist',
    // Generar manifesto para integrarlo con PHP
    manifest: true,
    rollupOptions: {
      // Punto de entrada de tu aplicación React
      input: {
        main: './src/main.jsx'
      }
    }
  },
  server: {
    // Puerto para desarrollo
    port: 3000,
    // Habilitar CORS para desarrollo con PHP
    cors: true
  }
})

