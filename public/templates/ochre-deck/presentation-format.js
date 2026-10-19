// Optional presentation formatting preserves imported content without styling editor UI.
const presentationTags=new Set('div section main article header footer figure figcaption p h1 h2 h3 h4 h5 h6 span strong em small ul ol li table thead tbody tr td th blockquote pre code aside b i u s mark sub sup kbd dl dt dd img'.split(' '));
function inlineURLsOnly(value){
 const source=value.replace(/\/\*[\s\S]*?\*\//g,'');
 const pattern=/url\(\s*(?:"((?:\\.|[^"\\])*)"|'((?:\\.|[^'\\])*)'|([^)]*))\s*\)/gi;let match;
 while(match=pattern.exec(source)){const url=(match[1]??match[2]??match[3]??'').trim();if(!/^(?:data:(?:image|font|application)\/|#[-a-zA-Z0-9_:.]+$)/i.test(url))return false}
 return true;
}
function cssProperties(values={}){
 if(!values||typeof values!=='object'||Array.isArray(values))throw Error(tr('invalid_style'));
 return Object.entries(values).map(([property,value])=>{
  if(!/^(--[a-zA-Z0-9-]+|[a-z][a-z-]*)$/.test(property)||typeof value!=='string'||/[{}<>]/.test(value)||/(?:javascript:|expression\s*\(|@import)/i.test(value)||!inlineURLsOnly(value))throw Error(tr('invalid_style'));
  return property+':'+value;
 }).join(';');
}
function contentClassNames(values=[]){
 if(!Array.isArray(values)||values.some(v=>typeof v!=='string'||!/^content-[a-zA-Z0-9_-]+$/.test(v)))throw Error(tr('invalid_style'));
 return values.join(' ');
}
function contentAttributes(values={}){
 if(!values||typeof values!=='object'||Array.isArray(values))throw Error(tr('invalid_style'));
 return Object.entries(values).map(([key,value])=>{
  if(!/^data-[a-z][a-z0-9-]*$/.test(key)||['data-node','data-type','data-drag','data-act','data-slide','data-card-index'].includes(key)||typeof value!=='string')throw Error(tr('invalid_style'));
  return key+'="'+esc(value)+'"';
 }).join(' ');
}
function sanitizeInlineHTML(value){
 const template=document.createElement('template');template.innerHTML=value;
 const allowed=new Set('span br strong em b i u s small mark sub sup code'.split(' '));
 function clean(parent){for(const child of [...parent.children]){
  if(!allowed.has(child.tagName.toLowerCase())){child.replaceWith(document.createTextNode(child.textContent));continue}
  for(const attribute of [...child.attributes]){
   const key=attribute.name;if(key==='class'){child.className=contentClassNames(child.className.split(/\s+/).filter(Boolean));continue}
   if(key==='style'){const properties={};for(const prop of child.style)properties[prop]=child.style.getPropertyValue(prop);child.setAttribute('style',cssProperties(properties));continue}
   if(['data-act','data-node','data-type','data-drag','data-slide','data-card-index','data-resize'].includes(key))child.removeAttribute(key);else if(!['dir','lang'].includes(key)&&!/^data-[a-z][a-z0-9-]*$/.test(key))child.removeAttribute(key);
  }clean(child);
 }}clean(template.content);return template.innerHTML;
}
function sanitizeSVG(value){
 const doc=new DOMParser().parseFromString(value,'image/svg+xml');
 if(doc.querySelector('parsererror')||doc.documentElement.localName!=='svg')throw Error(tr('invalid_content_format'));
 const allowed=new Set('svg g path rect circle ellipse line polyline polygon text tspan defs clipPath mask linearGradient radialGradient stop pattern title desc filter feTurbulence feDisplacementMap feGaussianBlur feOffset feColorMatrix feBlend feMerge feMergeNode feComposite feFlood feDropShadow feComponentTransfer feFuncR feFuncG feFuncB feFuncA use marker'.split(' '));
 for(const el of [...doc.querySelectorAll('*')]){
  if(!allowed.has(el.localName)){el.remove();continue}
  for(const attr of [...el.attributes]){
   if(/^on/i.test(attr.name)||/href$/i.test(attr.name)&&!/^#[-a-zA-Z0-9_:.]+$/.test(attr.value)||/(?:url\((?!\s*['"]?#)|javascript:|expression\s*\()/i.test(attr.value))el.removeAttribute(attr.name);
  }
 }
 return new XMLSerializer().serializeToString(doc.documentElement);
}
function validateContentCSS(value){
 if(typeof value!=='string'||value.length>2000000||/@(?:import|namespace)|javascript:|expression\s*\(/i.test(value)||!inlineURLsOnly(value))throw Error(tr('invalid_style'));
 const sheet=new CSSStyleSheet();sheet.replaceSync(value);
 function selectors(selector){let parts=[],depth=0,previous=0;for(let i=0;i<selector.length;i++){if(selector[i]==='('||selector[i]==='[')depth++;if(selector[i]===')'||selector[i]===']')depth--;if(selector[i]===','&&depth===0){parts.push(selector.slice(previous,i));previous=i+1}}parts.push(selector.slice(previous));return parts}
 function check(rules){for(const rule of rules){if(rule.selectorText){if(selectors(rule.selectorText).some(selector=>{selector=selector.trim();if(selector===':is()')return false;if(selector.startsWith(':is(')){let depth=1,index=4;for(;index<selector.length&&depth;index++){if(selector[index]==='(')depth++;if(selector[index]===')')depth--}return selectors(selector.slice(4,index-1)).some(branch=>!/^\.slide\[data-imported\](?:[\s.:#[>+~]|$)/.test(branch.trim()))}return!/^\.slide\[data-imported\](?:[\s.:#[>+~]|$)/.test(selector)}))throw Error(tr('invalid_style'))}else if(rule.type===7){if(!rule.name.startsWith('Imported-'))throw Error(tr('invalid_style'))}else if(rule.type===5){const family=rule.style.getPropertyValue('font-family').replace(/["']/g,'').trim();if(!family.startsWith('Imported-')||!/^url\(\s*["']?data:(?:font|application)\//i.test(rule.style.getPropertyValue('src')))throw Error(tr('invalid_style'))}else if(rule.cssRules&&/^(?:@media|@supports)/i.test(rule.cssText))check(rule.cssRules);else throw Error(tr('invalid_style'))}}
 check(sheet.cssRules);return value;
}
// Style fonts are Latin-only: CJK text otherwise falls back to whatever the OS picks (SimSun on Windows).
const CJK_FONTS={
 zh:{sans:'"PingFang SC","Hiragino Sans GB","Microsoft YaHei","Noto Sans CJK SC","Source Han Sans SC"',serif:'"Songti SC","STSong","SimSun","Noto Serif CJK SC","Source Han Serif SC"',office:'Microsoft YaHei'},
 'zh-tw':{sans:'"PingFang TC","Microsoft JhengHei","Noto Sans CJK TC","Source Han Sans TC"',serif:'"Songti TC","PMingLiU","Noto Serif CJK TC","Source Han Serif TC"',office:'Microsoft JhengHei'},
 ja:{sans:'"Hiragino Sans","Hiragino Kaku Gothic ProN","Yu Gothic","Meiryo","Noto Sans CJK JP"',serif:'"Hiragino Mincho ProN","Yu Mincho","Noto Serif CJK JP"',office:'Yu Gothic'},
 ko:{sans:'"Apple SD Gothic Neo","Malgun Gothic","Noto Sans CJK KR"',serif:'"AppleMyungjo","Batang","Noto Serif CJK KR"',office:'Malgun Gothic'}};
function cjkFonts(locale){const code=String(locale||'').toLowerCase();return CJK_FONTS[/^zh-(tw|hk|mo|hant)/.test(code)?'zh-tw':code.slice(0,2)]||CJK_FONTS.zh}
function withCjkFallback(css,locale){
 const fonts=cjkFonts(locale);
 const extend=list=>{
  list=list.trim();
  if(!list||/^(?:var\(|inherit|initial|unset|revert)/i.test(list)||/PingFang|Microsoft (?:YaHei|JhengHei)|Hiragino|Noto (?:Sans|Serif) CJK|Malgun|Yu Gothic|Songti/i.test(list)||!/^[\w\s"',.-]+(?:!important)?$/.test(list))return null;
  const important=/!important$/i.test(list)?' !important':'',families=list.replace(/\s*!important$/i,'');
  const generic=families.match(/,\s*(serif|sans-serif|monospace|cursive|fantasy|system-ui|ui-[\w-]+)\s*$/i);
  const extra=generic&&/^serif$/i.test(generic[1])?fonts.serif:fonts.sans;
  return (generic?families.slice(0,generic.index)+','+extra+generic[0]:families+','+extra)+important};
 // @font-face descriptors name a single family and must stay untouched.
 return css.split(/(@font-face\s*\{[^}]*\})/i).map((part,index)=>index%2?part:part
  .replace(/((?:^|[;{\s])(?:font-family|--[\w-]*font[\w-]*)\s*:)([^;{}]+)/gi,(all,prop,value)=>{const next=extend(value);return next?prop+next:all})
  .replace(/((?:^|[;{\s])font\s*:\s*)([^;{}]+)/gi,(all,prop,value)=>{
   const match=value.match(/^(.*?(?:\d[\d.]*(?:px|r?em|%|pt|vw|vh)|[a-z-]+\([^()]*\)))(\s*\/\s*[\w.%-]+)?\s+(.+)$/i);
   const next=match&&extend(match[3]);return next?prop+match[1]+(match[2]||'')+' '+next:all})).join('');
}
let lastContentCSS=null;
function syncContentCSS(project){const css=project.contentCSS||'',key=css+'\n'+(project.contentLocale||'');if(key===lastContentCSS)return;let style=document.querySelector('#presentation-content-style');if(!style){style=document.createElement('style');style.id='presentation-content-style';document.head.append(style)}style.textContent=css?withCjkFallback(validateContentCSS(css),project.contentLocale):'';lastContentCSS=key}
function setNodeStyle(node,property,value){
 node.style??={};node.style[property]=value;
 if(node.html){const template=document.createElement('template');template.innerHTML=sanitizeInlineHTML(node.html);const css={color:'color',fontSize:'font-size',bold:'font-weight',italic:'font-style',underline:'text-decoration'}[property];if(css)for(const child of template.content.querySelectorAll('*'))child.style.setProperty(css,'inherit','important');node.html=template.innerHTML}
}
async function svgImageData(svg){
 const copy=svg.cloneNode(true),originals=[svg,...svg.querySelectorAll('*')],copies=[copy,...copy.querySelectorAll('*')];
 const properties=['fill','fill-opacity','fill-rule','stroke','stroke-width','stroke-opacity','stroke-linecap','stroke-linejoin','stroke-dasharray','stroke-dashoffset','opacity','font-family','font-size','font-weight','font-style','text-anchor','dominant-baseline','paint-order','visibility','clip-path','mask','filter','mix-blend-mode','transform','transform-origin'];
 originals.forEach((source,index)=>{const computed=getComputedStyle(source);for(const property of properties){let value=computed.getPropertyValue(property);value=value.replace(/url\(["']?[^)"']*#([^)'"\s]+)["']?\)/g,'url(#$1)');if(value)copies[index].style.setProperty(property,value)}});
 if(svg.querySelector('text')){const fonts=new Set([...svg.querySelectorAll('text,tspan')].map(el=>getComputedStyle(el).fontFamily.split(',')[0].replace(/["']/g,'').trim()));const rules=[...(document.querySelector('#presentation-content-style')?.sheet?.cssRules||[])].filter(rule=>rule.type===5&&fonts.has(rule.style.getPropertyValue('font-family').replace(/["']/g,'').trim()));if(rules.length){const style=document.createElementNS('http://www.w3.org/2000/svg','style');style.textContent=rules.map(rule=>rule.cssText).join('\n');copy.prepend(style)}}
 copy.style.setProperty('opacity','1','important');copy.setAttribute('xmlns','http://www.w3.org/2000/svg');const rect=svg.getBoundingClientRect();copy.setAttribute('width',Math.max(1,Math.round(rect.width)));copy.setAttribute('height',Math.max(1,Math.round(rect.height)));
 const source='data:image/svg+xml;base64,'+btoa(unescape(encodeURIComponent(new XMLSerializer().serializeToString(copy))));const image=new Image();image.src=source;await image.decode();const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;canvas.getContext('2d').drawImage(image,0,0);return canvas.toDataURL('image/png');
}
function importedPlacement(node){
 const element=document.querySelector('#canvas [data-node="'+node.id+'"]');if(!element)return null;
 const computed=getComputedStyle(element);if(!(node.imported||node['x-positioned'])||!['absolute','fixed'].includes(computed.position))return null;
 const edges=['paddingLeft','paddingRight','borderLeftWidth','borderRightWidth'].reduce((sum,key)=>sum+(parseFloat(computed[key])||0),0),cssWidth=parseFloat(computed.width),marginLeft=parseFloat(computed.marginLeft)||0,marginTop=parseFloat(computed.marginTop)||0,left=parseFloat(computed.left),top=parseFloat(computed.top);return {left:Number.isFinite(left)?left+marginLeft:element.offsetLeft,top:Number.isFinite(top)?top+marginTop:element.offsetTop,width:Number.isFinite(cssWidth)?cssWidth+(computed.boxSizing==='border-box'?0:edges):element.offsetWidth,height:element.offsetHeight,marginLeft,marginTop,cssWidth:Number.isFinite(cssWidth)?cssWidth:computed.boxSizing==='border-box'?element.offsetWidth:Math.max(1,element.offsetWidth-edges)};
}
function setImportedPlacement(node,position){
 if(!position)return;node.style??={};node.style.css??={};Object.assign(node.style.css,{position:'absolute!important',left:(position.left-(position.marginLeft||0))+'px!important',top:(position.top-(position.marginTop||0))+'px!important',right:'auto!important',bottom:'auto!important',width:(position.cssWidth??position.width)+'px!important'});
 const card=state.slides[find(node.id)?.slideIndex??current];if(card?.imported){card.growToFit=true;card.contentHeight=Math.max(card.contentHeight||720,position.top+position.height+32)}
}
function exchangeImportedPositions(first,second){const a=importedPlacement(first),b=importedPlacement(second);if(a&&b){setImportedPlacement(first,{...a,left:b.left,top:b.top});setImportedPlacement(second,{...b,left:a.left,top:a.top})}}
function nativeTextRuns(node,element,unit,project){
 if(!node.html)return node.text;
 const walker=document.createTreeWalker(element,NodeFilter.SHOW_TEXT),source=[];let text;
 const fontName=value=>{const family=value.split(',')[0].replace(/["']/g,'').trim();return project['x-source']?.fontAliases?.[family]||project['x-fontAliases']?.[family]||family};
 while(text=walker.nextNode()){
  if(text.parentElement.closest('.drag-handle,.inline-add'))continue;
  const css=getComputedStyle(text.parentElement),options={fontFace:node.type==='code'?'Courier New':fontName(css.fontFamily),fontSize:parseFloat(css.fontSize)*unit*72,color:colorHex(css.color),bold:+css.fontWeight>=600,italic:css.fontStyle==='italic',underline:css.textDecorationLine.includes('underline')};
  for(const char of text.nodeValue)if(!/\s/.test(char))source.push({char,options});
 }
 const chars=[...node.text].filter(char=>!/\s/.test(char));if(chars.length!==source.length||chars.some((char,index)=>char!==source[index].char))return node.text;
 const runs=[];let index=0,previous=source[0]?.options;
 for(const char of node.text){const options=/\s/.test(char)?previous:source[index++]?.options;previous=options;const signature=JSON.stringify(options);if(runs.length&&runs[runs.length-1].signature===signature)runs[runs.length-1].text+=char;else runs.push({text:char,options,signature})}
 return runs.map(({text,options})=>({text,options}));
}

function normalizeImportedFlow(node){
 if(!node.imported)return;const el=document.querySelector('#canvas [data-node="'+node.id+'"]');node.style??={};node.style.css??={};Object.assign(node.style.css,{position:'relative!important',top:'auto!important',left:'auto!important',right:'auto!important',bottom:'auto!important',width:'100%!important','max-width':'none!important','grid-row':'auto!important','grid-column':'auto!important'});
 if(node.type==='image'){node.height=Math.min(720,Math.max(80,el?.offsetHeight||310));node.style.css.height=node.height+'px!important'}else node.style.css.height='auto!important';
 for(const child of node.children||[])normalizeImportedFlow(child);
}

function positionInsertedContent(target,node){
 if(!target.imported||['columns','smart','table','tablerow'].includes(target.type))return;
 const containerElement=document.querySelector('#canvas [data-node="'+target.id+'"]');
 if(!containerElement||['grid','inline-grid','flex','inline-flex'].includes(getComputedStyle(containerElement).display))return;
 const placements=(target.children||[]).map(importedPlacement).filter(Boolean);
 if(!placements.length||placements.length<(target.children||[]).length/2)return;
 const left=Math.max(0,Math.min(...placements.map(p=>p.left))),top=Math.max(...placements.map(p=>p.top+p.height))+24;
 const width=Math.max(120,Math.min(1280-left*2,Math.max(...placements.map(p=>p.width))));
 node['x-positioned']=true;node.style??={};node.style.css??={};Object.assign(node.style.css,{position:'absolute!important',left:left+'px!important',top:top+'px!important',width:width+'px!important',right:'auto!important',bottom:'auto!important'});
 const owner=state.slides[find(target.id).slideIndex];owner.growToFit=true;owner.contentHeight=Math.max(owner.contentHeight||720,top+120);
}

function paintTransparency(color,element,root){
 const match=String(color).match(/^rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\)$/);let opacity=match?Math.max(0,Math.min(1,+match[1])):1;
 for(let current=element;current;current=current.parentElement){opacity*=Math.max(0,Math.min(1,parseFloat(getComputedStyle(current).opacity)||0));if(current===root)break}
 return Math.max(0,Math.min(100,Math.round((1-opacity)*10000)/100));
}
