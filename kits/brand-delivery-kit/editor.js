import {sampleBrand,blankBrand,templates,templateSvg,normalizeBrand,logoSvg,signatureHtml,brandTokens,tokensCss} from './brand-engine.js'
import {brandBookHtml} from './brand-book.js'
import {zipEntries} from './zip.js'

const $=id=>document.getElementById(id)
let photo=window.KIT_PHOTO||'06-assets/photography/north-workshop.png',brand={...sampleBrand},selected=templates[0].id,filter='All'
try{const saved=localStorage.getItem('weezie-brand-kit-v2');if(saved)brand=normalizeBrand(JSON.parse(saved))}catch{}
const slug=()=>brand.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'client'
function notice(message){$('status').textContent=message}
function syncForm(){for(const key of Object.keys(sampleBrand)){const input=$('field-'+key);if(input)input.value=brand[key]}render()}
function render(){
 const template=templates.find(t=>t.id===selected)
 $('artwork').innerHTML=templateSvg(selected,brand,{photo})
 $('template-title').textContent=template.name;$('template-size').textContent=template.size
 $('template-list').replaceChildren()
 for(const t of templates.filter(t=>filter==='All'||t.category===filter)){
  const button=document.createElement('button');button.type='button';button.textContent=t.name;button.setAttribute('aria-pressed',String(t.id===selected));button.onclick=()=>{selected=t.id;render()};$('template-list').append(button)
 }
 try{localStorage.setItem('weezie-brand-kit-v2',JSON.stringify(brand))}catch{}
}
function download(content,name,type){const url=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
for(const key of Object.keys(sampleBrand)){
 const input=$('field-'+key);if(!input)continue
 input.addEventListener('input',()=>{brand=normalizeBrand({...brand,[key]:input.value});render()})
}
$('category').onchange=e=>{filter=e.target.value;const first=templates.find(t=>filter==='All'||t.category===filter);selected=first.id;render()}
$('sample').onclick=()=>{brand={...sampleBrand};photo=window.KIT_PHOTO||'06-assets/photography/north-workshop.png';syncForm();notice('Atelier North sample restored.')}
$('blank').onclick=()=>{brand={...blankBrand};photo='';syncForm();notice('Blank starting point loaded. Add client imagery and replace the sample mark.')}
$('client-photo').onchange=e=>{const file=e.target.files[0];if(!file)return;if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>10000000){notice('Choose a PNG, JPEG or WebP image smaller than 10 MB.');return}const reader=new FileReader();reader.onload=()=>{photo=String(reader.result);render();notice('Client image loaded locally. It is included in exports and stays in this browser session.')};reader.readAsDataURL(file)}
$('save-settings').onclick=()=>{download(JSON.stringify(brand,null,2),slug()+'-brand-settings.json','application/json');notice('Brand settings saved.')}
$('load-settings').onchange=async e=>{try{const file=e.target.files[0];if(!file)return;brand=normalizeBrand(JSON.parse(await file.text()));syncForm();notice('Brand settings loaded.')}catch{notice('That file could not be read. Use a brand-settings.json file from this editor.')}finally{e.target.value=''}}
$('download-svg').onclick=()=>{const t=templates.find(t=>t.id===selected);download(templateSvg(selected,brand,{photo}),slug()+'-'+t.file+'.svg','image/svg+xml');notice('Editable SVG exported with the current brand settings.')}
$('download-book').onclick=()=>{download(brandBookHtml(brand,{photo}),slug()+'-brand-book.html','text/html');notice('Editable brand book exported. Open it to edit the strategy copy and print to PDF.')}
$('export-pack').onclick=()=>{
 const entries=templates.map(t=>['applications/'+t.file+'.svg',templateSvg(t.id,brand,{photo})])
 for(const orientation of ['horizontal','stacked','wordmark','mark'])for(const variant of ['color','reverse','mono'])entries.push(['logos/'+orientation+'-'+variant+'.svg',logoSvg(orientation,variant,brand)])
 entries.push(['brand-settings.json',JSON.stringify(brand,null,2)],['design-tokens.json',JSON.stringify(brandTokens(brand),null,2)],['tokens.css',tokensCss(brand)],['brand-book.html',brandBookHtml(brand,{photo})],['email-signature.html',signatureHtml(brand,{markUrl:'https://'+brand.website.replace(/^https?:\/\//,'')+'/logo-mark.png'})],['READ-ME-FIRST.txt','This export contains editable applications and logo variants using your settings. The mark is a starting point: replace it for your client. Edit the sample brand strategy, imagery, document copy, dates, invoice amounts and contact details. Host the signature logo and update its URL before installing the signature. Open brand-book.html to edit and print to PDF. PNG exports and the complete studio documents are included in the purchased master kit.'])
 download(zipEntries(entries),slug()+'-editable-handover.zip','application/zip');notice('Branded SVG handover exported. Review sample copy and identity assets before client delivery.')
}
syncForm()
