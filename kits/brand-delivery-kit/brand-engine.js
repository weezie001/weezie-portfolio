import {extraTemplates,extraSvgBody} from './campaign-templates.js'
// Original editable vector applications. All artwork is generated from one brand object.
export const sampleBrand = {
  name:'Atelier North', descriptor:'Objects for considered living', tagline:'Made slowly. Kept for years.',
  person:'Alex Morgan', role:'Founder / Maker', email:'hello@ateliernorth.example', website:'ateliernorth.example',
  phone:'+1 202 555 0146', location:'By appointment / Working worldwide',
  primary:'#3d5a45', paper:'#e7e3d6', ink:'#0e1114', accent:'#c9a227',
  display:'Georgia', body:'Arial', heading:'A quieter kind of everyday.',
  cta:'Explore the collection', campaign:'The considered collection', offer:'Small batches. Lasting pieces.',
}
export const blankBrand = {...sampleBrand,name:'Your Studio',descriptor:'What your business does',tagline:'Your short brand promise.',person:'Your Name',role:'Your Role',email:'hello@yourstudio.example',website:'yourstudio.example',phone:'Your phone number',location:'Your contact details',heading:'Your story starts here.',cta:'Your call to action',campaign:'Your campaign',offer:'Your supporting message'}
export const templates = [
  {id:'card-front',name:'Business card / front',category:'Stationery',w:850,h:550,size:'85 × 55 mm',file:'business-card-front'},
  {id:'card-back',name:'Business card / back',category:'Stationery',w:850,h:550,size:'85 × 55 mm',file:'business-card-back'},
  {id:'letterhead',name:'Letterhead',category:'Stationery',w:794,h:1123,size:'A4',file:'letterhead-a4'},
  {id:'invoice',name:'Invoice',category:'Stationery',w:794,h:1123,size:'A4',file:'invoice-a4'},
  {id:'social-square',name:'Social / square',category:'Social',w:1080,h:1080,size:'1080 × 1080',file:'social-square'},
  {id:'social-portrait',name:'Social / portrait',category:'Social',w:1080,h:1350,size:'1080 × 1350',file:'social-portrait'},
  {id:'story',name:'Social / story',category:'Social',w:1080,h:1920,size:'1080 × 1920',file:'social-story'},
  {id:'banner',name:'Profile banner',category:'Social',w:1500,h:500,size:'1500 × 500',file:'profile-banner'},
  {id:'avatar',name:'Social avatar',category:'Social',w:1080,h:1080,size:'1080 × 1080',file:'social-avatar'},
  {id:'slide-cover',name:'Presentation / cover',category:'Presentations',w:1600,h:900,size:'16:9',file:'presentation-cover'},
  {id:'slide-content',name:'Presentation / content',category:'Presentations',w:1600,h:900,size:'16:9',file:'presentation-content'},
  {id:'og',name:'Website / share image',category:'Digital',w:1200,h:630,size:'1200 × 630',file:'website-share-image'},
  ...extraTemplates,
]
export const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]))
export function normalizeBrand(data={}) {
  const b=Object.fromEntries(Object.entries(sampleBrand).map(([k,v])=>[k,data[k]??v]))
  for(const k of Object.keys(b)) b[k]=String(b[k]).slice(0,k==='name'?36:k==='descriptor'?48:['heading','tagline'].includes(k)?80:70)
  for(const k of ['primary','paper','ink','accent']) if(!/^#[0-9a-f]{6}$/i.test(b[k]))b[k]=sampleBrand[k]
  if(!['Georgia','Times New Roman','Arial'].includes(b.display))b.display='Georgia'
  if(!['Arial','Verdana','Trebuchet MS'].includes(b.body))b.body='Arial'
  return b
}
export function mark(x,y,size,color) {
  return `<g transform="translate(${x} ${y}) scale(${size/80})" fill="${color}"><path d="M8 68V27L40 8l32 19v41H58V35L40 24 22 35v33Z"/><path d="M34 43h12v25H34Z"/></g>`
}
export function logoSvg(orientation='horizontal',variant='color',input=sampleBrand) {
  const b=normalizeBrand(input),color=variant==='reverse'?'#ffffff':variant==='mono'?'#0e1114':b.primary
  const dim={horizontal:[720,120],stacked:[420,300],wordmark:[640,100],mark:[100,100]}[orientation]
  let body=''
  if(orientation==='mark')body=mark(10,10,80,color)
  if(orientation==='horizontal')body=mark(10,20,80,color)+`<text x="118" y="66" fill="${color}" font-family="${esc(b.display)},serif" font-size="${Math.min(42,520/(b.name.length*.58))}" letter-spacing="1">${esc(b.name)}</text><text x="120" y="91" fill="${color}" font-family="${b.body},sans-serif" font-size="11" letter-spacing="2">${esc(b.descriptor.toUpperCase())}</text>`
  if(orientation==='stacked')body=mark(170,26,80,color)+`<text x="210" y="175" text-anchor="middle" fill="${color}" font-family="${esc(b.display)},serif" font-size="${Math.min(38,360/(b.name.length*.58))}">${esc(b.name)}</text><text x="210" y="208" text-anchor="middle" fill="${color}" font-family="${b.body},sans-serif" font-size="9" letter-spacing="1.5">${esc(b.descriptor.toUpperCase())}</text>`
  if(orientation==='wordmark')body=`<text x="16" y="62" fill="${color}" font-family="${esc(b.display)},serif" font-size="${Math.min(54,600/(b.name.length*.58))}" letter-spacing="1">${esc(b.name)}</text>`
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${dim[0]}" height="${dim[1]}" viewBox="0 0 ${dim[0]} ${dim[1]}" role="img"><title>${esc(b.name)} / ${orientation} / ${variant}</title>${body}</svg>`
}
export function templateSvg(id,input=sampleBrand,{photo='',blank=false}={}) {
  const b=normalizeBrand(input),t=templates.find(t=>t.id===id);if(!t)throw new Error('Unknown template')
  const {w,h}=t
  const split=value=>{const words=value.split(/\s+/),lines=['',''];let i=0;for(const word of words){if(i===0&&(lines[0]+' '+word).length>Math.max(16,value.length/2))i=1;lines[i]+=(lines[i]?' ':'')+word}return lines}
  const heading=split(b.heading),promise=split(b.tagline)
  const rect=(x,y,width,height,fill)=>`<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}"/>`
  const text=(str,x,y,size=20,color=b.ink,serif=false,extra='')=>`<text x="${x}" y="${y}" fill="${color}" font-family="${esc(serif?b.display:b.body)},${serif?'serif':'sans-serif'}" font-size="${size}" ${extra}>${esc(str)}</text>`
  const rule=(y,x=50,width=w-100,color=b.primary)=>rect(x,y,width,1,color)
  const label=(str,x,y,color=b.primary)=>text(str,x,y,11,color,false,'letter-spacing="2"')
  const name=(x,y,color=b.primary,size=30)=>text(b.name,x,y,Math.min(size,(w-x-40)/(b.name.length*.58)),color,true)
  const image=(x,y,width,height)=>photo&&!blank?`<defs><clipPath id="photo-frame"><rect x="${x}" y="${y}" width="${width}" height="${height}"/></clipPath></defs><image x="${x}" y="${y}" width="${width}" height="${height}" href="${esc(photo)}" preserveAspectRatio="xMidYMid slice" clip-path="url(#photo-frame)"/>`:rect(x,y,width,height,b.primary)+`<path d="M${x} ${y+height}L${x+width} ${y}" stroke="${b.paper}" stroke-width="1" opacity=".3"/>`+label('YOUR IMAGE / REPLACE IN SVG',x+35,y+height/2,b.paper)
  let body=rect(0,0,w,h,b.paper)
  if(id==='card-front')body=rect(0,0,w,h,b.primary)+mark(370,100,110,b.paper)+text(b.name,425,325,Math.min(55,700/(b.name.length*.58)),b.paper,true,'text-anchor="middle"')+text(b.descriptor.toUpperCase(),425,375,24,b.paper,false,'text-anchor="middle" letter-spacing="3"')+rect(400,450,50,2,b.accent)
  if(id==='card-back')body+=mark(64,57,80,b.primary)+name(64,215,b.ink,48)+text(b.person,64,280,24)+text(b.role,64,313,27,b.primary)+rule(350,64,722)+text(b.email,64,404,25)+text(b.website,64,443,25)+text(b.phone,480,404,25)+text(b.location,64,490,24,b.primary)
  if(id==='letterhead'||id==='invoice') {
    body=rect(0,0,w,h,'#fcfbf7')+mark(55,50,52,b.primary)+name(125,87,b.ink,33)+label(b.descriptor.toUpperCase(),55,147)+rule(180,55,w-110)
    if(id==='letterhead')body+=label('CORRESPONDENCE / 001',55,250)+text('To the people who make a place their own.',55,318,29,b.primary,true)+text('Dear Client,',55,390,17)+text('Good work begins with a clear understanding.',55,438,16)+text('Use this space for a personal note, project update or formal letter.',55,470,16)+text('Replace this sample copy with your own message before delivery.',55,502,16)+text('Keep body text on the grid and leave the margins clear.',55,534,16)+text('With care,',55,710,17)+text(b.person,55,750,25,b.primary,true)+text(b.role,55,778,13,b.primary)
    else {
      body+=label('INVOICE / SAMPLE 001',55,247)+text('A considered piece of work.',55,310,35,b.primary,true)+label('BILL TO',55,376)+text('Client Name',55,405,17)+text('Client company / Address',55,432,13)+label('DATE / DUE',510,376)+text('19 Oct 2026 / 02 Nov 2026',510,405,12)+rule(478,55,w-110)+label('DESCRIPTION',55,510)+label('QTY',490,510)+label('RATE',560,510)+label('AMOUNT',655,510)
      const rows=[['Identity direction','1','$600','$600'],['Application design','1','$300','$300'],['Handover & setup','1','$100','$100']]
      rows.forEach((r,i)=>{const y=555+i*62;body+=text(r[0],55,y,14)+text(r[1],495,y,14)+text(r[2],560,y,14)+text(r[3],655,y,14)+rule(y+25,55,w-110,'#d8dace')})
      body+=label('TOTAL / USD',490,798)+text('$1,000',640,800,28,b.primary,true)+text('Sample amounts only. Update taxes, terms and payment details.',55,875,12,b.primary)
    }
    body+=rule(1005,55,w-110)+text(b.email,55,1038,12,b.primary)+text(b.website,55,1061,12,b.primary)+text(b.location,460,1038,11,b.primary)
  }
  if(id==='social-square')body=rect(0,0,w,h,b.primary)+mark(70,65,65,b.paper)+text(b.name,70,310,56,b.paper,true)+text(promise[0],70,470,Math.min(112,940/(Math.max(1,promise[0].length)*.56)),b.paper,true)+text(promise[1],70,598,Math.min(112,940/(Math.max(1,promise[1].length)*.56)),b.paper,true)+rect(70,690,64,3,b.accent)+text(b.descriptor,70,758,24,b.paper)+rule(935,70,940,b.paper)+text(b.website,70,990,17,b.paper)
  if(id==='social-portrait')body+=mark(65,50,58,b.primary)+name(150,92,b.ink,40)+label('A NOTE FROM THE STUDIO',65,190)+text(heading[0],65,295,Math.min(105,940/(Math.max(1,heading[0].length)*.56)),b.primary,true)+text(heading[1],65,412,Math.min(105,940/(Math.max(1,heading[1].length)*.56)),b.primary,true)+text(b.tagline,65,490,24,b.primary)+image(0,565,w,700)+text(b.website,65,1312,18,b.primary)
  if(id==='story')body=image(0,0,w,h)+rect(0,0,w,450,b.paper)+label('THE CONSIDERED COLLECTION / 01',85,155)+text(heading[0],85,280,Math.min(110,900/(Math.max(1,heading[0].length)*.56)),b.primary,true)+text(heading[1],85,410,Math.min(104,900/(Math.max(1,heading[1].length)*.56)),b.primary,true)+rect(65,1380,950,260,b.primary)+text(b.name,105,1470,60,b.paper,true)+text(b.tagline,105,1535,26,b.paper)+text(b.website,105,1591,20,b.paper)
  if(id==='banner')body+=mark(70,65,70,b.primary)+name(70,255,b.primary,76)+text(b.tagline,70,320,25,b.primary)+label(b.website.toUpperCase(),70,421)+image(1000,0,500,500)
  if(id==='avatar')body=rect(0,0,w,h,b.primary)+mark(310,245,460,b.paper)+text(b.name,540,855,68,b.paper,true,'text-anchor="middle"')
  if(id==='slide-cover')body+=image(900,0,700,h)+mark(70,65,70,b.primary)+label('STUDIO PRESENTATION / 01',70,235)+text(heading[0],70,390,Math.min(100,760/(Math.max(1,heading[0].length)*.56)),b.primary,true)+text(heading[1],70,505,Math.min(100,760/(Math.max(1,heading[1].length)*.56)),b.primary,true)+text(b.tagline,70,595,24,b.primary)+name(70,775,b.primary,45)+label(b.website.toUpperCase(),70,837)
  if(id==='slide-content') {
    body+=label('THE APPROACH / 02',70,85)+name(70,205,b.primary,68)+text('Care is in the details.',70,290,68,b.primary,true)+rule(365,70,w-140)
    ;[['01','Material','Choose honest materials.','Let their character show.'],['02','Method','Be precise about the work.','Make every detail earn its place.'],['03','Meaning','Build for the everyday.','Make something worth keeping.']].forEach((c,i)=>{const x=70+i*510;body+=text(c[0],x,445,18,b.primary)+text(c[1],x,555,45,b.primary,true)+text(c[2],x,620,21)+text(c[3],x,658,21)})
    body+=rule(805,70,w-140)+label(b.website.toUpperCase(),70,850)
  }
  if(id==='og')body+=image(660,0,540,h)+mark(55,50,62,b.primary)+text(b.name,55,282,Math.min(67,550/(b.name.length*.58)),b.primary,true)+text('Objects for',55,365,66,b.primary,true)+text('considered living.',55,442,66,b.primary,true)+label(b.website.toUpperCase(),55,560)
  body=extraSvgBody(t,b,{photo,blank})??body
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img"><title>${esc(b.name)} / ${esc(t.name)}</title>${body}</svg>`
}
export function signatureHtml(input=sampleBrand,{markUrl='../../../06-assets/logos/png/north_mark_color_512.png'}={}) {
  const b=normalizeBrand(input)
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(b.name)} email signature</title></head><body><table role="presentation" cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;color:${b.ink}"><tr><td style="padding-right:18px"><img src="${esc(markUrl)}" width="55" height="55" alt="${esc(b.name)}" style="display:block"></td><td style="padding-left:18px;border-left:1px solid ${b.accent}"><p style="margin:0;font-size:16px">${esc(b.person)}</p><p style="margin:5px 0 12px;font-size:11px;color:${b.primary}">${esc(b.role)} / ${esc(b.name)}</p><p style="margin:0;font-size:11px;line-height:1.8"><a href="mailto:${esc(b.email)}" style="color:${b.ink};text-decoration:none">${esc(b.email)}</a><br><a href="https://${esc(b.website.replace(/^https?:\/\//,''))}" style="color:${b.primary};text-decoration:none">${esc(b.website)}</a><br>${esc(b.phone)}</p></td></tr></table></body></html>`
}
export function brandTokens(input=sampleBrand){const b=normalizeBrand(input);return {brand:b.name,version:'2.0.0',color:{primary:b.primary,paper:b.paper,ink:b.ink,accent:b.accent},typography:{display:b.display,body:b.body},spacing:[4,8,12,16,24,32,48,64]}}
export function tokensCss(input=sampleBrand){const b=normalizeBrand(input);return `:root {\n  --color-brand-500: ${b.primary};\n  --color-paper-50: ${b.paper};\n  --color-ink-900: ${b.ink};\n  --color-accent: ${b.accent};\n  --font-display: "${b.display}", serif;\n  --font-body: "${b.body}", sans-serif;\n  --bg-page: var(--color-paper-50);\n  --text-primary: var(--color-ink-900);\n  --action-default: var(--color-brand-500);\n}\n`}
