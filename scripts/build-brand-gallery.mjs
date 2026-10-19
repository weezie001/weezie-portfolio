import {readFile,writeFile,mkdir,readdir,unlink} from 'node:fs/promises'
import {join} from 'node:path'
import {createHash} from 'node:crypto'
import {build} from 'esbuild'
import {templates} from '../kits/brand-delivery-kit/brand-engine.js'
import {galleryMarkup} from '../kits/brand-delivery-kit/gallery.js'

const root='kits/brand-delivery-kit',assets=join(root,'assets')
await mkdir(assets,{recursive:true})
await build({entryPoints:[join(root,'editor.js')],outfile:join(root,'editor.bundle.js'),bundle:true,format:'iife',platform:'browser',minify:true})
const bundle=await readFile(join(root,'editor.bundle.js'))
const hash=value=>createHash('sha256').update(value).digest('hex').slice(0,12)
const name=`editor-${hash(bundle)}.js`
await writeFile(join(assets,name),bundle)
// Only generated, obsolete editor bundles in this exact workspace directory.
for(const file of await readdir(assets))if(/^editor-[a-f0-9]{12}\.js$/.test(file)&&file!==name)await unlink(join(assets,file))
const cssVersion=hash(await readFile(join(root,'kit.css'))),photoVersion=hash(await readFile(join(root,'photo-data.js')))
let html=await readFile(join(root,'index.html'),'utf8')
html=html.replace(/(<div id="template-list"[^>]*>)[\s\S]*?(<\/div><div class="collection-footer">)/,(_,start,end)=>start+'\n'+galleryMarkup(templates)+'\n'+end)
html=html.replace(/href="kit\.css(?:\?[^" ]*)?"/,`href="kit.css?v=${cssVersion}"`)
html=html.replace(/src="photo-data\.js(?:\?[^" ]*)?"/,`src="photo-data.js?v=${photoVersion}"`)
html=html.replace(/src="(?:editor\.bundle\.js|assets\/editor-[a-f0-9]{12}\.js)(?:\?[^" ]*)?"/,`src="assets/${name}"`)
await writeFile(join(root,'index.html'),html)
console.log(`Built ${templates.length} static image cards and fingerprinted editor ${name}.`)
