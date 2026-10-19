// Production gallery regression check, using Firefox rather than Chrome.
import {pathToFileURL} from 'node:url'
import {resolve} from 'node:path'
import {mkdir,readFile} from 'node:fs/promises'
import assert from 'node:assert/strict'
const {firefox}=await import(pathToFileURL(resolve(process.argv[2])).href)
const browser=await firefox.launch({headless:true})
const url=process.argv[3]||'https://weezie.site/kits/brand-delivery-kit/?v=3.1#collection'
const expected=(await readFile('kits/brand-delivery-kit/index.html','utf8')).match(/src="(assets\/editor-[a-f0-9]{12}\.js)"/)[1]
const errors=[],legacy=[]
await mkdir('.tmp/brand-review',{recursive:true})
try{
 for(const [name,width,height] of [['desktop',1440,1050],['mobile',390,844]]){
  const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'})
  // A cached old bundle would rebuild twelve plain buttons. Neither legacy URL
  // may be used by the new page, even if an old response were still available.
  await context.route(/\/editor\.bundle\.js(?:\?.*)?$/,route=>{legacy.push(route.request().url());return route.fulfill({contentType:'text/javascript',body:'throw new Error("legacy editor loaded")'})})
  await context.route(/\/kit\.css$/,route=>{legacy.push(route.request().url());return route.fulfill({contentType:'text/css',body:'.template-picture{display:none}'})})
  const page=await context.newPage();page.setDefaultTimeout(25000);page.on('pageerror',e=>errors.push(e.message))
  await page.goto(url)
  await page.waitForFunction(()=>document.querySelectorAll('[data-template]').length===36)
  assert.equal(await page.locator('#template-list button').count(),0)
  assert.equal(await page.locator('script[src*="assets/editor-"]').getAttribute('src'),expected)
  await page.locator('.template-card img').evaluateAll(images=>images.forEach(img=>img.loading='eager'))
  await page.waitForFunction(()=>[...document.querySelectorAll('.template-card img')].every(i=>i.complete&&i.naturalWidth>0))
  assert.equal(await page.locator('.template-card img').count(),36)
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)
  const picture=await page.locator('.template-picture').first().boundingBox();assert.ok(picture.height>150&&picture.width>100)
  await page.evaluate(()=>scrollTo(0,document.getElementById('collection').offsetTop+30))
  await page.screenshot({path:resolve(`.tmp/brand-review/live-gallery-${name}-v3.1.png`),timeout:25000})
  await page.locator('.template-card').last().click()
  assert.equal(await page.locator('#preview-dialog').isVisible(),true)
  assert.ok((await page.locator('#template-title').textContent()).includes('Campaign'))
  await page.keyboard.press('Escape')
  assert.equal(await page.locator('#preview-dialog').isHidden(),true)
  await context.close()
  console.log(`PASS live ${name}: 36 loaded image cards, full preview, responsive layout, correct versioned editor.`)
 }
 assert.deepEqual(legacy,[]);assert.deepEqual(errors,[])
 console.log('PASS: legacy script/style URLs never requested; no JavaScript page errors.')
}finally{await browser.close()}
