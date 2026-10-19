import {sampleBrand,blankBrand,templates,templateSvg,normalizeBrand,logoSvg,signatureHtml,brandTokens,tokensCss} from './brand-engine.js'
import {brandBookHtml} from './brand-book.js'
import {zipEntries} from './zip.js'
import {galleryMarkup} from './gallery.js'

const $=id=>document.getElementById(id)
const defaultPhoto=window.KIT_PHOTO||'06-assets/photography/north-workshop.jpg'
let photo=defaultPhoto,brand={...sampleBrand},selected=templates[0].id,filter='All',galleryUrls=[],returnFocus=null
try{const saved=localStorage.getItem('weezie-brand-kit-v3');if(saved)brand=normalizeBrand(JSON.parse(saved))}catch{}
const slug=()=>brand.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'client'
function notice(message){$('status').textContent=message}
function syncForm(){for(const key of Object.keys(sampleBrand)){const input=$('field-'+key);if(input)input.value=brand[key]}render()}
function openModal(id){returnFocus=document.activeElement;$(id).hidden=false;document.body.classList.add('modal-open');$(id).querySelector('button').focus()}
function closeModal(id){$(id).hidden=true;document.body.classList.remove('modal-open');returnFocus?.focus()}
for(const [id,close] of [['preview-dialog','close-preview'],['settings-dialog','close-settings']]){
 $(close).onclick=()=>closeModal(id)
 $(id).addEventListener('click',e=>{if(e.target===$(id))closeModal(id)})
 $(id).addEventListener('keydown',e=>{
  if(e.key==='Escape'){e.preventDefault();closeModal(id)}
  if(e.key==='Tab'){
   const focusable=[...$(id).querySelectorAll('button,a[href],input,select,summary')].filter(el=>!el.disabled&&!el.closest('details:not([open])')&&el.type!=='file')
   // Summary itself must stay reachable while the details element is collapsed.
   $(id).querySelectorAll('details:not([open])>summary').forEach(el=>focusable.push(el))
   const ordered=[...new Set(focusable)].sort((a,b)=>a.compareDocumentPosition(b)&2?1:-1),first=ordered[0],last=ordered.at(-1)
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
  }
 })
}
$('open-settings').onclick=()=>openModal('settings-dialog')
$('done-settings').onclick=()=>closeModal('settings-dialog')
function render(){
 const template=templates.find(t=>t.id===selected)
 $('artwork').innerHTML=templateSvg(selected,brand,{photo})
 $('settings-artwork').innerHTML=templateSvg('ad-square',brand,{photo})
 $('template-title').textContent=template.name;$('template-size').textContent=template.size+' / '+template.category
 const visible=templates.filter(t=>filter==='All'||t.category===filter)
 $('gallery-count').textContent=visible.length+' editable design'+(visible.length===1?'':'s')
 const current=[...$('template-list').querySelectorAll('[data-template]')].map(card=>card.dataset.template)
 if(current.join(',')!==visible.map(t=>t.id).join(','))$('template-list').innerHTML=galleryMarkup(visible)
 const sampleUnchanged=photo===defaultPhoto&&JSON.stringify(brand)===JSON.stringify(sampleBrand)
 const oldUrls=galleryUrls;galleryUrls=[]
 for(const card of $('template-list').querySelectorAll('[data-template]')){
  const t=templates.find(t=>t.id===card.dataset.template),img=card.querySelector('img')
  if(!sampleUnchanged){
   const url=URL.createObjectURL(new Blob([templateSvg(t.id,brand,{photo})],{type:'image/svg+xml'}));galleryUrls.push(url);img.removeAttribute('srcset');img.src=url
  }else if(img.src.startsWith('blob:')){
   img.src=`sample/previews/${t.file}.png?v=3.1`
   const previewWidth=Math.round(Math.min(320,t.w,420*t.w/t.h))
   if(t.w>previewWidth)img.srcset=img.getAttribute('src')+' '+previewWidth+'w, '+card.getAttribute('href')+' '+t.w+'w'
  }
 }
 oldUrls.forEach(url=>URL.revokeObjectURL(url))
 try{localStorage.setItem('weezie-brand-kit-v3',JSON.stringify(brand))}catch{}
}
$('template-list').addEventListener('click',event=>{
 const card=event.target.closest('[data-template]');if(!card||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return
 event.preventDefault();const t=templates.find(t=>t.id===card.dataset.template);if(!t)return
 selected=t.id;$('artwork').innerHTML=templateSvg(selected,brand,{photo});$('template-title').textContent=t.name;$('template-size').textContent=t.size+' / '+t.category;openModal('preview-dialog')
})
function download(content,name,type){const url=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
for(const key of Object.keys(sampleBrand)){
 const input=$('field-'+key);if(!input)continue
 input.addEventListener('input',()=>{brand=normalizeBrand({...brand,[key]:input.value});render()})
}
$('category').onchange=e=>{filter=e.target.value;const first=templates.find(t=>filter==='All'||t.category===filter);selected=first.id;render()}
$('sample').onclick=()=>{brand={...sampleBrand};photo=defaultPhoto;syncForm();notice('Atelier North sample restored.')}
$('blank').onclick=()=>{brand={...blankBrand};photo='';syncForm();notice('Blank starting point loaded. Add client imagery and replace the sample mark in the SVGs.')}
$('client-photo').onchange=e=>{const file=e.target.files[0];if(!file)return;if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>10000000){notice('Choose a PNG, JPEG or WebP image smaller than 10 MB.');return}const reader=new FileReader();reader.onload=()=>{photo=String(reader.result);render();notice('Your image is loaded locally and embedded in exports. Add it again after reloading.')};reader.readAsDataURL(file)}
$('save-settings').onclick=()=>{download(JSON.stringify(brand,null,2),slug()+'-brand-settings.json','application/json');notice('Brand settings saved.')}
$('load-settings').onchange=async e=>{try{const file=e.target.files[0];if(!file)return;brand=normalizeBrand(JSON.parse(await file.text()));syncForm();notice('Brand settings loaded.')}catch{notice('That file could not be read. Use a brand-settings.json file from this editor.')}finally{e.target.value=''}}
$('download-svg').onclick=()=>{const t=templates.find(t=>t.id===selected);download(templateSvg(selected,brand,{photo}),slug()+'-'+t.file+'.svg','image/svg+xml');notice('Editable SVG exported with your current brand settings.')}
$('download-png').onclick=async()=>{
 const button=$('download-png');button.disabled=true;button.textContent='Exporting…'
 let url
 try{
  const t=templates.find(t=>t.id===selected),svg=templateSvg(selected,brand,{photo})
  url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}))
  const image=new Image();image.src=url;await image.decode()
  const canvas=document.createElement('canvas');canvas.width=t.w;canvas.height=t.h;canvas.getContext('2d').drawImage(image,0,0,t.w,t.h)
  const png=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!png)throw new Error('No PNG')
  download(png,slug()+'-'+t.file+'.png','image/png');notice('Full-size PNG exported. Use the SVG when you need editable text and shapes.')
 }catch{notice('PNG export could not finish in this browser. Export SVG and use your vector editor to create a PNG.')}
 finally{if(url)URL.revokeObjectURL(url);button.disabled=false;button.textContent='Export PNG ↓'}
}
$('download-book').onclick=()=>{download(brandBookHtml(brand,{photo}),slug()+'-brand-book.html','text/html');notice('Editable brand book exported. Open it to edit the strategy and print to PDF.')}
$('export-pack').onclick=()=>{
 const entries=templates.map(t=>['applications/'+t.file+'.svg',templateSvg(t.id,brand,{photo})])
 for(const orientation of ['horizontal','stacked','wordmark','mark'])for(const variant of ['color','reverse','mono'])entries.push(['logos/'+orientation+'-'+variant+'.svg',logoSvg(orientation,variant,brand)])
 const guide=`YOUR BRAND FILES\n\n1. Open brand-book.html, edit the sample strategy and print to PDF.\n2. The applications folder contains ${templates.length} editable SVG layouts. Open them in Inkscape, Illustrator or an SVG-capable editor. Replace the sample North mark, document copy, material descriptions, client names, invoice amounts and dates.\n3. PNG: open any layout in the kit editor and choose Export PNG. PNGs are flattened images; use SVG for editing.\n4. Ads are artwork only. Add the destination link and accessible text in your advertising platform. Platform sizes and policies may change.\n5. Billboard and signage files are ratio-based artwork, not full-size production files. Ask your supplier for final dimensions, bleed, safe areas, color profile and image requirements.\n6. Packaging files are flat artwork concepts, not cutting dielines. Apply artwork to the packaging supplier's approved dieline. The tote and T-shirt are flat print artwork, not garment patterns.\n7. Photographic mockups are static JPG examples in the purchased master kit, not customized in this export. They are not layered PSD files or 3D models.\n8. Email signature: host your approved PNG over HTTPS and update the logo URL before installation.\n9. Review contrast, spelling, contact details and image rights. Save a final PDF proof and get approval before production.\n\nGeorgia / Arial are system fonts. Font files are not included. The sample mark is a starting point, not an exclusive new client logo.\n`
 entries.push(['brand-settings.json',JSON.stringify(brand,null,2)],['design-tokens.json',JSON.stringify(brandTokens(brand),null,2)],['tokens.css',tokensCss(brand)],['brand-book.html',brandBookHtml(brand,{photo})],['email-signature.html',signatureHtml(brand,{markUrl:'https://'+brand.website.replace(/^https?:\/\//,'')+'/logo-mark.png'})],['READ-ME-FIRST.txt',guide])
 download(zipEntries(entries),slug()+'-editable-handover.zip','application/zip');notice(`${templates.length} editable designs and the matching brand files exported. Review the sample copy and logo before client delivery.`)
}
syncForm()
