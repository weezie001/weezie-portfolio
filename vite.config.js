import { existsSync, rmSync, cpSync, copyFileSync, mkdirSync, writeFileSync } from 'node:fs'
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

function spaCloudflarePages() {
  return {
    name: 'spa-cloudflare-pages',
    closeBundle() {
      const dist = resolve(root, 'dist')
      const indexHtml = resolve(dist, 'index.html')
      if (!existsSync(indexHtml)) return

      // Ensure /templates/ directory in dist has index.html so direct URL hits serve SPA
      const templatesDir = resolve(dist, 'templates')
      if (!existsSync(templatesDir)) mkdirSync(templatesDir, { recursive: true })
      copyFileSync(indexHtml, resolve(templatesDir, 'index.html'))

      // Write Cloudflare Pages _redirects file
      const redirectsContent = [
        '/templates /index.html 200',
        '/templates/ /index.html 200',
        '/components /index.html 200',
        '/components/ /index.html 200',
        '/store /index.html 200',
        '/store/ /index.html 200',
        '/about /index.html 200',
        '/about/ /index.html 200',
        '/work /index.html 200',
        '/work/ /index.html 200',
        '/ai-lab /index.html 200',
        '/ai-lab/ /index.html 200',
        '/* /index.html 200',
      ].join('\n')
      writeFileSync(resolve(dist, '_redirects'), redirectsContent)
    },
  }
}

export default defineConfig({
  plugins: [copyBrandKit(), react(), tailwindcss(), aiSearch(), spaCloudflarePages()],
})
