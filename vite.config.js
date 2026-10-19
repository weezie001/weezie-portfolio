import { existsSync, rmSync, cpSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import aiSearch from './seo/ai-search.js'

const root = dirname(fileURLToPath(import.meta.url))

function copyBrandKit() {
  const src = resolve(root, 'kits/brand-delivery-kit')
  const dest = resolve(root, 'public/kits/brand-delivery-kit')
  return {
    name: 'copy-brand-kit',
    async buildStart() {
      if (!existsSync(src)) return
      // Rebuild image cards and versioned editor assets before every release.
      await import('./scripts/build-brand-gallery.mjs')
      rmSync(dest, { recursive: true, force: true })
      cpSync(src, dest, { recursive: true })
    },
  }
}

export default defineConfig({
  plugins: [copyBrandKit(), react(), tailwindcss(), aiSearch()],
})
