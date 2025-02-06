import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    //port: 5173, When not running with docker compose, this is the port which will be used in docker
    allowedHosts: ["front-end"]
  }
})