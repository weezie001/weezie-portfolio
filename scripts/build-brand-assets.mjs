import {readFile,writeFile,mkdir} from 'node:fs/promises'
import {join} from 'node:path'
import {sampleBrand,blankBrand,templates,templateSvg,logoSvg,signatureHtml} from '../kits/brand-delivery-kit/brand-engine.js'
import {brandBookHtml} from '../kits/brand-delivery-kit/brand-book.js'
import {build} from 'esbuild'

const root='kits/brand-delivery-kit'
const photo='data:image/png;base64,'+(await readFile(join(root,'06-assets/photography/north-workshop.png'))).toString('base64')
for(const [folder,brand,blank] of [['sample/ready-to-use',sampleBrand,false],['editable-templates',blankBrand,true]]) {
 await mkdir(join(root,folder),{recursive:true})
 for(const template of templates)await writeFile(join(root,folder,template.file+'.svg'),templateSvg(template.id,brand,{photo,blank}))
 await writeFile(join(root,folder,'brand-settings.json'),JSON.stringify(brand,null,2))
 await writeFile(join(root,folder,'email-signature.html'),signatureHtml(brand,{markUrl:blank?'https://yourstudio.example/logo-mark.png':'../../06-assets/logos/png/north_mark_color_512.png'}))
}
await mkdir(join(root,'06-assets/logos/svg'),{recursive:true})
for(const orientation of ['horizontal','stacked','wordmark','mark'])for(const variant of ['color','reverse','mono'])await writeFile(join(root,'06-assets/logos/svg',`north_${orientation}_${variant}.svg`),logoSvg(orientation,variant,sampleBrand))
await writeFile(join(root,'sample/brand-settings.json'),JSON.stringify(sampleBrand,null,2))
await writeFile(join(root,'07-applications/digital/email-signature.html'),signatureHtml(sampleBrand,{markUrl:'../../06-assets/logos/png/north_mark_color_512.png'}))
await writeFile(join(root,'template-catalog.json'),JSON.stringify(templates,null,2))
await writeFile(join(root,'photo-data.js'),'window.KIT_PHOTO='+JSON.stringify(photo)+';\n')
await writeFile(join(root,'sample/brand-book.html'),brandBookHtml(sampleBrand))
await writeFile(join(root,'editable-templates/brand-book.html'),brandBookHtml(blankBrand))
await build({entryPoints:[join(root,'editor.js')],outfile:join(root,'editor.bundle.js'),bundle:true,format:'iife',platform:'browser',minify:true})
const aliases=[['north_logo_horizontal_color_on-light.svg','horizontal','color'],['north_logo_horizontal_white_on-dark.svg','horizontal','reverse'],['north_mark_color_on-clear.svg','mark','color']]
for(const [file,orientation,variant] of aliases)await writeFile(join(root,'06-assets/logos/svg',file),logoSvg(orientation,variant,sampleBrand))
console.log('Built 12 sample SVG applications, 12 editable starting templates, 12 logo variants and email signatures.')
