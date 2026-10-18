import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'

const root = 'kits/weezie-ui'
const catalog = JSON.parse(await readFile('src/data/componentCatalog.json', 'utf8'))
await mkdir(join(root,'src/components'),{recursive:true})
await mkdir(join(root,'examples'),{recursive:true})
for (const item of catalog) {
  await copyFile(`src/components/ui/${item.fileName}`,join(root,'src/components',item.fileName))
  await writeFile(join(root,'examples',`${item.id}.jsx`),`"use client";\nimport ${item.id} from '../src/components/${item.id}'\nexport default function Example() { return <${item.id} /> }\n`)
}
await writeFile(join(root,'src/catalog.json'),JSON.stringify(catalog,null,2))
const pkg=JSON.parse(await readFile('package.json','utf8'))
await writeFile(join(root,'package.json'),JSON.stringify({name:'weezie-ui-starter',private:true,version:'1.0.0',type:'module',scripts:{dev:'vite',build:'vite build',preview:'vite preview'},dependencies:{react:pkg.dependencies.react,'react-dom':pkg.dependencies['react-dom']},devDependencies:{vite:pkg.devDependencies.vite,'@vitejs/plugin-react':pkg.devDependencies['@vitejs/plugin-react'],tailwindcss:pkg.devDependencies.tailwindcss,'@tailwindcss/vite':pkg.devDependencies['@tailwindcss/vite']}},null,2))
await writeFile(join(root,'index.html'),'<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Weezie UI / Component Starter</title></head><body><div id="root"></div><script type="module" src="/src/main.jsx"></script></body></html>')
await writeFile(join(root,'vite.config.js'),`import { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\nimport tailwind from '@tailwindcss/vite'\nexport default defineConfig({plugins:[react(),tailwind()]})\n`)
await writeFile(join(root,'src/style.css'),`@import "tailwindcss";\n:root{font-family:ui-sans-serif,system-ui,sans-serif;color-scheme:dark;background:#09090b;color:#f4f4f5}button,input,select{font:inherit}button,a,input,select{outline-offset:4px}button{cursor:pointer}button:focus-visible,a:focus-visible{outline:2px solid #bef264}@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}}\n`)
await writeFile(join(root,'src/main.jsx'),`import React,{useState} from 'react'
import {createRoot} from 'react-dom/client'
import catalog from './catalog.json'
import './style.css'
const modules=import.meta.glob('./components/*.jsx',{eager:true})
function App(){
 const [category,setCategory]=useState('All'),[reference,setReference]=useState('All'),[search,setSearch]=useState(''),[id,setId]=useState(catalog[0].id),[reset,setReset]=useState(0),[closed,setClosed]=useState(false),[status,setStatus]=useState('')
 const list=catalog.filter(c=>(category==='All'||c.category===category)&&(reference==='All'||c.reference===reference)&&c.name.toLowerCase().includes(search.toLowerCase()))
 const item=list.find(c=>c.id===id)||list[0];const Demo=item?modules['./components/'+item.fileName].default:null
 return <main className="mx-auto max-w-6xl p-5 sm:p-10"><p className="text-xs uppercase tracking-[.3em] text-lime-300">Weezie UI / 35 original components</p><h1 className="my-5 text-5xl font-semibold tracking-tight">Start with something good.</h1><p className="mb-8 max-w-2xl text-zinc-400">Explore the examples. Make them your own. Backend actions and simulated content are documented in the integration guide.</p><div className="grid gap-4 sm:grid-cols-3"><label>Search<input className="mt-2 w-full rounded-xl border border-white/20 bg-zinc-900 p-3" value={search} onChange={e=>setSearch(e.target.value)}/></label><label>Category<select className="mt-2 w-full rounded-xl border border-white/20 bg-zinc-900 p-3" value={category} onChange={e=>setCategory(e.target.value)}>{['All',...new Set(catalog.map(c=>c.category))].map(c=><option key={c}>{c}</option>)}</select></label><label>Reference<select className="mt-2 w-full rounded-xl border border-white/20 bg-zinc-900 p-3" value={reference} onChange={e=>setReference(e.target.value)}>{['All',...new Set(catalog.map(c=>c.reference))].map(c=><option key={c}>{c}</option>)}</select></label></div><p role="status" className="my-4 text-sm text-zinc-400">{list.length} components</p><div className="my-5 flex flex-wrap gap-2">{list.map(c=><button key={c.id} aria-pressed={item?.id===c.id} className={'rounded-full border border-white/20 px-4 py-2 text-xs '+(item?.id===c.id?'bg-lime-300 text-black':'')} onClick={()=>{setId(c.id);setClosed(false);setStatus('')}}>{c.name}</button>)}</div>{item?<><h2 className="mt-10 text-2xl">{item.name}</h2><p className="my-3 text-zinc-400">{item.description}</p><div className="rounded-3xl border border-white/10 p-3 sm:p-8">{!closed&&<Demo key={item.id+reset} onClose={()=>setClosed(true)} onSelect={v=>setStatus(JSON.stringify(v))} onSubmit={v=>setStatus(JSON.stringify(v))}/>}<button className="mt-8 rounded-full border border-white/20 px-4 py-2 text-xs" onClick={()=>{setReset(n=>n+1);setClosed(false);setStatus('')}}>Reset example</button><p role="status" className="mt-3 text-xs text-zinc-400">{status}</p></div></>:<p>No matches. Change your filters.</p>}</main>
}
createRoot(document.getElementById('root')).render(<App/> )
`)
await writeFile(join(root,'README.md'),`# Weezie UI: 35 original React components

Five components inspired by each of VibePrompts, Minimal Gallery, Kage, Refero Styles, DESIGN.md and Mobbin, plus five Skillry-inspired motion experiments. These are original implementations, not official products of those websites. No reference website source code, branded screenshots or video assets are bundled.

## Start the included gallery

Use a current Node.js LTS release (Node 22.12+ recommended).

1. Extract the ZIP into a new folder.
2. Run \`npm install\` in that folder.
3. Run \`npm run dev\` and open the local URL printed by Vite.
4. Run \`npm run build\` to create the standalone gallery.

## Use one component

Copy the chosen JSX file from src/components into your project. Every component is self-contained and imports only React. Tailwind CSS v4 must scan the copied files. See examples/ for all 35 usage files. Hooks-based components include the Next.js use-client directive. This package does not include authentication servers, payment processors, multiplayer infrastructure or AI APIs.

Import example:

\`\`\`jsx
import ReferoTokenInspector from './components/ReferoTokenInspector'
export default function Page() { return <ReferoTokenInspector /> }
\`\`\`

## Contents

- src/components/: 35 complete implementations
- examples/: one import-and-render example per component
- src/catalog.json: categories, references and descriptions
- DESIGN.md and design-tokens.json: an original starter design system
- INTEGRATION.md: callbacks, demo boundaries and delivery checklist
- LICENSE.txt: commercial-use terms
- manifest.json: file inventory and checksums

The components use a deliberate dark demo palette. Customize their literal Tailwind classes and props for your brand; the portfolio's light-preview filter is not a separate light-theme implementation. Native dialog requires a modern browser. Clipboard requires localhost or HTTPS. Content, labels and example counts are demo data.

## Catalog

${catalog.map(c=>`- ${c.name} | ${c.category} | ${c.reference} | src/components/${c.fileName}`).join('\n')}

## Reference links

https://vibeprompts.dev/\nhttps://minimal.gallery/\nhttps://kage.design/\nhttps://styles.refero.design/\nhttps://designmd.ai/\nhttps://mobbin.com/\nhttps://skillry.dev/ai-videos/opus-5-5

Support: enang@weezie.site
`)
await writeFile(join(root,'INTEGRATION.md'),`# Integration and handover

## Backend boundaries

OTP and sign-in components demonstrate UI, not authentication. Connect callbacks to your own service, handle server errors and never keep secrets in browser code. Pricing sliders are estimators, not payment checkout. Presence cursors are a simulation. Submission previews are local UI, not website scraping. Motion scenes are interactive browser compositions, not downloadable video renders.

## Common callbacks

- ReferoPromptSearch: onSearch(query)
- ReferoSoftTabs: onChange(item)
- ReferoStyleCard / DesignMdTokenCard: onSave(boolean)
- DesignMdTagCloud: onChange(selectedTags)
- MobbinHeroSlots / MobbinAppIconGrid: onSelect(item)
- MobbinFlowStepper: onComplete()
- MinimalSubmitModal: onSubmit({url,title,category}), onClose(), isOpen
- KageFilterDrawer: onApply(selectedTags), onReset()
- KageCommandPalette: onSelect(item), onClose(), isOpen

For other props, read the destructured parameters at the top of each component. Full source is included. Default examples run without API keys.

## Before shipping your product

Replace demo text and numbers. Check narrow screens, long labels, empty states and your real content. Connect backend operations, loading and error states. Verify keyboard navigation, focus return and contrast with your brand colors. Include reduced-motion rules from src/style.css. Dynamic dialogs and global keyboard shortcuts should only be mounted when needed. If embedding multiple examples, unmount inactive ones to avoid competing shortcuts.

## Delivery checklist

- Working starter and all 35 source files included
- Example imports and category inventory included
- Commercial-use license and reference attribution included
- No customer data, environment secrets or site admin code included
- Automated rendering and representative DOM interactions checked
- Manual visual and assistive-technology review remains recommended before customer-specific integration
`)
await writeFile(join(root,'DESIGN.md'),`# Field / Weezie UI starter system

## Intent
Give independent products a clear, confident interface. Use calm surfaces, strong typography and one useful accent. Favor short labels and obvious next steps.

## Color
Canvas #09090b, surface #18181b, text #f4f4f5, muted #a1a1aa, accent #bef264. Decorative alternatives: lavender #d6ccf2, sage #cdd9c1, apricot #f5c595.

## Type and space
System sans-serif, with system serif for editorial demos. Body 16px/1.6, labels 12px, headings 32-56px. Base spacing 4px. Cards 24px padding; sections 64px separation. Mobile page gutter 20px. Use visible focus indicators and generous controls.

## Motion
Do not require animation to understand content. Provide play/pause for loops. Respect prefers-reduced-motion. Use transitions to explain state changes rather than decorate every action.
`)
await writeFile(join(root,'design-tokens.json'),JSON.stringify({color:{canvas:'#09090b',surface:'#18181b',text:'#f4f4f5',muted:'#a1a1aa',accent:'#bef264'},spacing:[4,8,12,16,24,32,48,64],radius:{control:12,card:24,pill:999}},null,2))
await writeFile(join(root,'LICENSE.txt'),`WEEZIE UI COMMERCIAL LICENSE v1.0
Copyright 2026 Enang Weezie.

The purchaser may use and modify these original component implementations in unlimited personal and client end products, including commercial websites and applications. The purchaser may share source with collaborators working on those end products and deliver the resulting end-product source to clients.

The purchaser may not redistribute or resell this collection, its substantially unmodified components, or its starter as a competing template, component library or download product. This restriction does not prevent commercial use in finished client websites or applications.

Reference website names identify inspiration only and do not imply affiliation, endorsement, or a license to their content or trademarks. React, Tailwind CSS, Vite and other installed dependencies retain their respective licenses. No third-party source code or branded reference assets are supplied by this license.

Software is provided as-is, without warranty. The purchaser is responsible for integration, testing, security and legal compliance of their end products. Enang Weezie retains ownership of the original component source.

Questions: enang@weezie.site
`)
await writeFile(join(root,'.gitignore'),'node_modules/\ndist/\n')
execFileSync('python',['scripts/zip-ui-library.py'],{stdio:'inherit'})
