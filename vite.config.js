import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import aiSearch from './seo/ai-search.js'

export default defineConfig({
  plugins: [react(), tailwindcss(), aiSearch()],
})
