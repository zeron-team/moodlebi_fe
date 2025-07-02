import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Opcional: permite que el servidor sea accesible desde tu red
    allowedHosts: [
          'ifes.zerondata.ovh',
          'www.zerondata.ovh'
    ]
  }
})