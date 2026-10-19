import {readFile,writeFile,mkdir} from 'node:fs/promises'
import assert from 'node:assert/strict'
import {Window} from 'happy-dom'
import {sampleBrand,templates,templateSvg,logoSvg,brandTokens,normalizeBrand} from '../kits/brand-delivery-kit/brand-engine.js'
import {brandBookHtml} from '../kits/brand-delivery-kit/brand-book.js'
import {zipEntries} from '../kits/brand-delivery-kit/zip.js'

const root='kits/brand-delivery-kit/',html=await readFile(root+'index.html','utf8')
assert.equal(templates.length,12)
const brand={...sampleBrand,name:'Cedar & Clay',primary:'#265544',person:'Sam Maker',email:'sam@example.com'}
const window=new Window({url:'https://example.com/brand-kit/',settings:{disableCSSFileLoading:true,disableJavaScriptFileLoading:true,disableJavaScriptEvaluation:true,enableFileSystemHttpRequests:false}})
window.document.write(html)
for(const t of templates){
 const svg=templateSvg(t.id,brand,{photo:'data:image/png;base64,AA'})
 assert.ok(svg.startsWith('<svg'));assert.ok(svg.includes('Cedar &amp; Clay'))
 assert.ok(!svg.includes('undefined'));assert.ok(!svg.includes('NaN'))
}
for(const orientation of ['horizontal','stacked','wordmark','mark'])for(const variant of ['color','reverse','mono'])assert.ok(logoSvg(orientation,variant,brand).includes('<svg'))
assert.ok(!templateSvg('card-front',{...brand,name:'<script>alert(1)</script>'}).includes('<script>'))
assert.equal(normalizeBrand({primary:'red; background:url(x)'}).primary,sampleBrand.primary)
assert.ok(brandBookHtml(brand,{photo:''}).includes('Cedar &amp; Clay'))
const downloads=[]
window.KIT_PHOTO=''
window.URL.createObjectURL=blob=>{downloads.push(blob);return 'blob:test'}
window.URL.revokeObjectURL=()=>{}
window.HTMLAnchorElement.prototype.click=function(){}
for(const name of ['window','document','localStorage','Blob','URL','FileReader'])Object.defineProperty(globalThis,name,{value:window[name],configurable:true,writable:true})
await import('../kits/brand-delivery-kit/editor.js?test='+Date.now())
assert.equal(document.querySelectorAll('#template-list button').length,12)
const input=document.getElementById('field-name');input.value='Cedar & Clay';input.dispatchEvent(new window.Event('input',{bubbles:true}))
assert.ok(document.getElementById('artwork').textContent.includes('Cedar & Clay'))
const category=document.getElementById('category');category.value='Social';category.dispatchEvent(new window.Event('change',{bubbles:true}));assert.equal(document.querySelectorAll('#template-list button').length,5)
document.getElementById('blank').click();assert.equal(document.getElementById('field-name').value,'Your Studio')
document.getElementById('sample').click();assert.equal(document.getElementById('field-name').value,'Atelier North')
input.value='Cedar & Clay';input.dispatchEvent(new window.Event('input',{bubbles:true}));const color=document.getElementById('field-primary');color.value='#123456';color.dispatchEvent(new window.Event('input',{bubbles:true}));assert.ok(document.getElementById('artwork').innerHTML.includes('#123456'))
document.getElementById('download-svg').click();document.getElementById('download-book').click();document.getElementById('export-pack').click();assert.equal(downloads.length,3)
await mkdir('.tmp/brand-review',{recursive:true})
await writeFile('.tmp/brand-review/custom-export.zip',Buffer.from(await downloads[2].arrayBuffer()))
await writeFile('.tmp/brand-review/zip-test.zip',zipEntries([['hello.txt','Hello identity'],['brand.json',JSON.stringify(brandTokens(brand))]]))
await window.happyDOM.abort()
console.log('PASS: 12 layouts, 12 logo variants, safe text/color substitution, editor rebranding, category filters, reset actions, SVG/book downloads and client ZIP export.')
