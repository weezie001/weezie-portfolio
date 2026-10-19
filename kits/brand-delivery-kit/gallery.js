import {esc} from './brand-engine.js'

// The initial gallery is written into the HTML at build time. Images and native
// preview links remain usable even when the editor is blocked or unavailable.
export function galleryMarkup(templates) {
 return templates.map((t,index)=>{
  const source=`sample/ready-to-use/${t.file}.svg`
  const preview=`sample/previews/${t.file}.png?v=3.1`
  const previewWidth=Math.round(Math.min(320,t.w,420*t.w/t.h))
  const responsive=t.w>previewWidth?` srcset="${preview} ${previewWidth}w, ${source} ${t.w}w" sizes="(max-width: 720px) 42vw, 30vw"`:''
  return `<a class="template-card" data-template="${t.id}" data-category="${t.category}" href="${source}" aria-label="Preview ${esc(t.name)}"><span class="template-picture" data-shape="${t.w>t.h*1.8?'wide':t.h>t.w*1.6?'tall':'standard'}"><img src="${preview}"${responsive} width="${t.w}" height="${t.h}" alt="${esc(t.name)} design preview" loading="${index<6?'eager':'lazy'}" decoding="async"><span class="preview-hint" aria-hidden="true">View design ↗</span></span><span class="template-caption"><b>${esc(t.name)}</b><span>${esc(t.category)}</span></span><small>${esc(t.size)}<span aria-hidden="true"> / </span>Editable SVG</small></a>`
 }).join('\n')
}
