import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { skillsetuApiPlugin } from './src/server/viteApiPlugin.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), skillsetuApiPlugin()],
})

