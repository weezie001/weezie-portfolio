import { readFile, mkdir } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'
import { build } from 'esbuild'
import { Window } from 'happy-dom'

const window = new Window({url:'https://localhost/'})
for(const name of ['window','document','navigator','HTMLElement','HTMLInputElement','Event','MouseEvent','KeyboardEvent','Node']) Object.defineProperty(globalThis,name,{value:window[name]||window,writable:true,configurable:true})
globalThis.IS_REACT_ACT_ENVIRONMENT = true
const {default:React,act}=await import('react')
const {createRoot}=await import('react-dom/client')
const {renderToString}=await import('react-dom/server')
const catalog=JSON.parse(await readFile('src/data/componentCatalog.json','utf8'))
assert.equal(catalog.length,35)
for(const reference of new Set(catalog.map(c=>c.reference))) assert.equal(catalog.filter(c=>c.reference===reference).length,5)
await mkdir('.tmp/ui-checks',{recursive:true})
await build({stdin:{contents:catalog.map(c=>`export {default as ${c.id}} from './src/components/ui/${c.fileName}'`).join('\n'),resolveDir:process.cwd(),loader:'jsx'},outfile:'.tmp/ui-checks/components.mjs',bundle:true,platform:'node',format:'esm',jsx:'automatic',loader:{'.png':'file'},external:['react','react-dom']})
const modules=await import(pathToFileURL(resolve('.tmp/ui-checks/components.mjs')))
const node=document.createElement('div');document.body.append(node)
let root
async function mount(name,props={}){if(root)await act(()=>root.unmount());root=createRoot(node);await act(()=>root.render(React.createElement(modules[name],props)))}
async function click(label){const b=[...node.querySelectorAll('button')].find(el=>(el.getAttribute('aria-label')||el.textContent.trim())===label);assert.ok(b,`Missing button: ${label}`);await act(()=>b.click())}
for(const item of catalog){assert.ok(renderToString(React.createElement(modules[item.id])).length>100,item.id);await mount(item.id);assert.ok(node.childNodes.length,item.id)}
await mount('ReferoSoftTabs');await click('Popular');assert.equal(node.querySelector('[role=tab][aria-selected=true]').textContent,'Popular')
const selected=node.querySelector('[role=tab][aria-selected=true]');await act(()=>selected.dispatchEvent(new window.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true})));assert.equal(node.querySelector('[role=tab][aria-selected=true]').textContent,'Newest')
let tags;await mount('DesignMdTagCloud',{onChange:v=>tags=v});await click('Editorial');assert.deepEqual(tags,['Editorial']);await click('Reset');assert.deepEqual(tags,[])
let saved;await mount('ReferoStyleCard',{onSave:v=>saved=v});await click('Save');assert.equal(saved,true);await click('Saved');assert.equal(saved,false)
let done=false;await mount('MobbinFlowStepper',{onComplete:()=>done=true});await click('Get started');await click('Save preferences');await click('Start exploring');assert.equal(done,true)
await mount('BentoFeatures');await act(()=>node.querySelectorAll('input[type=checkbox]')[1].click());assert.ok(node.textContent.includes('2 / 3'));await click('Month');assert.equal([...node.querySelectorAll('button')].find(b=>b.textContent==='Month').getAttribute('aria-pressed'),'true')
await mount('MobbinDeviceFrame');assert.ok(node.textContent.includes('$64,820.50'));await act(()=>node.querySelector('button[title="Toggle balance visibility"]').click());assert.ok(node.textContent.includes('••••••••'))
let plan;await mount('UsagePricingSlider',{onSelectPlan:p=>plan=p});await click('Choose this plan');assert.equal(plan.isAnnual,true);const annual=plan.monthlyPrice;await click('Monthly');await click('Choose this plan');assert.ok(plan.monthlyPrice>annual)
await mount('MotionExplodedStack');await click('Explode layers');assert.equal(node.querySelector('button').getAttribute('aria-pressed'),'true')
await mount('MotionSignalGrid');await click('Play');assert.ok(node.textContent.includes('Pause'));await click('Pause')
await mount('ReferoRotatingHeadline');await click('Next phrase');assert.ok(node.textContent.includes('a better first impression'))
await act(()=>root.unmount());await window.happyDOM.abort()
console.log('PASS: 35 source modules SSR-render and DOM-mount; seven collections contain five each; tabs, keyboard navigation, tags/reset, save state, onboarding completion, checklist, layer toggle, motion pause and headline next verified.')
