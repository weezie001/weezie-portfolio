// Original campaign and real-world application layouts. Dimensions are design units.
export const extraTemplates = [
 ['ad-square','Campaign / square','Ads',1080,1080,'1080 × 1080 px'],
 ['ad-portrait','Campaign / portrait','Ads',1080,1350,'1080 × 1350 px'],
 ['ad-story','Campaign / story','Ads',1080,1920,'1080 × 1920 px'],
 ['ad-landscape','Campaign / landscape','Ads',1200,628,'1200 × 628 px'],
 ['ad-display','Display / rectangle','Ads',300,250,'300 × 250 px'],
 ['ad-leaderboard','Display / leaderboard','Ads',728,90,'728 × 90 px'],
 ['billboard-wide','Billboard / wide','Outdoor',3000,1000,'3:1 artwork ratio'],
 ['billboard-standard','Billboard / standard','Outdoor',2400,1200,'2:1 artwork ratio'],
 ['bus-shelter','Bus shelter poster','Outdoor',1200,1800,'2:3 artwork ratio'],
 ['rollup','Roll-up display','Outdoor',850,2000,'850:2000 artwork ratio'],
 ['product-label','Product label','Packaging',600,900,'60 × 90 mm concept'],
 ['hangtag','Hang tag','Packaging',600,1000,'60 × 100 mm concept'],
 ['box-sleeve','Box sleeve','Packaging',1600,700,'Flat artwork / supplier sizes'],
 ['tote-print','Tote / print artwork','Merchandise',1000,1100,'Flat print artwork'],
 ['tee-print','T-shirt / chest artwork','Merchandise',1000,1000,'Flat print artwork'],
 ['storefront-sign','Storefront sign','Signage',2400,800,'3:1 artwork ratio'],
 ['wayfinding','Wayfinding sign','Signage',1200,1600,'3:4 artwork ratio'],
 ['envelope','DL envelope / front','Stationery',2200,1100,'220 × 110 mm'],
 ['compliments','With compliments','Stationery',2100,990,'210 × 99 mm'],
 ['folder','Presentation folder / cover','Stationery',2300,3200,'230 × 320 mm cover concept'],
 ['proposal-cover','Proposal / cover','Proposals',794,1123,'A4'],
 ['proposal-inner','Proposal / scope','Proposals',794,1123,'A4'],
 ['id-badge','Team ID / front','People',856,540,'85.6 × 54 mm concept'],
 ['campaign-board','Campaign / overview','Presentations',1600,900,'16:9'],
].map(([id,name,category,w,h,size])=>({id,name,category,w,h,size,file:id}))

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]))
export function extraSvgBody(t,b,{photo='',blank=false}={}) {
 if(!extraTemplates.some(item=>item.id===t.id))return null
 const {id,w,h}=t,P=b.primary,B=b.paper,I=b.ink,A=b.accent
 const r=(x,y,width,height,fill)=>`<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}"/>`
 const tx=(str,x,y,size=20,color=I,serif=false,extra='')=>`<text x="${x}" y="${y}" fill="${color}" font-family="${esc(serif?b.display:b.body)},${serif?'serif':'sans-serif'}" font-size="${size}" ${extra}>${esc(str)}</text>`
 const fit=(str,width,max)=>Math.min(max,width/(Math.max(1,str.length)*.57))
 const txt=(str,x,y,width,max,color=P,serif=true,extra='')=>tx(str,x,y,fit(str,width,max),color,serif,extra)
 const mark=(x,y,s,color=P)=>`<g transform="translate(${x} ${y}) scale(${s/80})" fill="${color}"><path d="M8 68V27L40 8l32 19v41H58V35L40 24 22 35v33Z"/><path d="M34 43h12v25H34Z"/></g>`
 const logo=(x,y,s=60,color=P)=>mark(x,y,s,color)+txt(b.name,x+s*1.4,y+s*.65,w-x-s*1.4-45,s*.65,color)
 let clip=0
 const img=(x,y,iw,ih)=>{
  if(!photo||blank)return r(x,y,iw,ih,P)+`<path d="M${x} ${y+ih}L${x+iw} ${y}" stroke="${B}" opacity=".25"/>`+tx('YOUR IMAGE',x+iw*.1,y+ih*.55,Math.min(iw*.05,24),B)
  const key=`crop-${id}-${clip++}`
  return `<defs><clipPath id="${key}"><rect x="${x}" y="${y}" width="${iw}" height="${ih}"/></clipPath></defs><image href="${esc(photo)}" x="${x}" y="${y}" width="${iw}" height="${ih}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${key})"/>`
 }
 const lines=(str,maxChars=22)=>{
  const sentences=(str.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[str]).map(s=>s.trim()).filter(Boolean)
  if(sentences.length>=2&&sentences.length<=3)return sentences
  const words=str.split(/\s+/);let result=['']
  for(const word of words){let i=result.length-1;if(i<2&&result[i]&&(result[i]+' '+word).length>maxChars){result.push(word)}else result[i]+=(result[i]?' ':'')+word}
  return result
 }
 const headline=(str,x,y,width,max,leading,color=P)=>lines(str).map((s,i)=>txt(s,x,y+i*leading,width,max,color)).join('')
 const cta=(x,y,cw,ch,solid=true)=>r(x,y,cw,ch,solid?P:B)+txt(b.cta,x+cw*.12,y+ch*.64,cw*.73,ch*.34,solid?B:P,false)+tx('↗',x+cw*.86,y+ch*.65,ch*.32,solid?B:P)
 let out=r(0,0,w,h,B)
 if(id==='ad-square')out+=img(370,0,710,1080)+r(0,0,440,1080,B)+logo(48,50,42)+tx(b.campaign.toUpperCase(),48,250,13,P,false,'letter-spacing="2"')+headline(b.tagline,48,370,340,65,78)+r(48,592,50,3,A)+txt(b.offer,48,650,340,22,P,false)+cta(48,785,300,66)+tx(b.website,48,1015,15,P)
 if(id==='ad-portrait')out+=img(0,0,w,860)+r(0,860,w,490,P)+r(55,55,310,62,B)+txt(b.name,78,96,265,30)+tx(b.campaign.toUpperCase(),62,936,15,B,false,'letter-spacing="2"')+headline(b.tagline,62,1030,900,75,80,B)+txt(b.offer,62,1224,590,22,B,false)+cta(718,1226,300,65,false)
 if(id==='ad-story')out+=img(0,0,w,h)+r(0,0,w,500,B)+logo(90,125,60)+headline(b.tagline,90,300,900,100,112)+r(70,1370,940,270,P)+txt(b.offer,115,1453,850,32,B,false)+r(115,1490,850,1,B)+txt(b.cta+'  /  '+b.website,115,1575,840,30,B,false)
 if(id==='ad-landscape')out+=img(610,0,590,h)+logo(50,45,47)+tx(b.campaign.toUpperCase(),50,200,13,P,false,'letter-spacing="2"')+headline(b.tagline,50,295,510,65,74)+txt(b.offer,50,465,490,20,P,false)+cta(50,519,300,62)
 if(id==='ad-display')out+=img(159,0,141,250)+r(0,0,178,250,B)+tx(b.name,18,31,18,P,true)+tx('THE COLLECTION',18,70,7,P,false,'letter-spacing="1"')+headline(b.tagline,18,105,145,27,30)+r(18,193,136,28,P)+txt(b.cta,28,212,115,10,B,false)
 if(id==='ad-leaderboard')out=img(530,0,198,h)+r(0,0,530,h,B)+mark(12,18,52)+txt(b.name,76,40,170,23)+txt(b.tagline,76,63,260,12,P,false)+r(356,25,152,40,P)+txt(b.cta,368,51,125,12,B,false)
 if(id==='billboard-wide')out+=img(1680,0,1320,h)+logo(135,100,100)+headline(b.tagline,135,475,1450,185,205)+txt(b.website,135,910,1300,47,P,false)+r(135,775,110,7,A)
 if(id==='billboard-standard')out=r(0,0,w,h,P)+img(1250,0,1150,h)+logo(110,100,85,B)+headline(b.tagline,110,545,1060,158,172,B)+r(110,900,100,6,A)+txt(b.website,110,1080,1060,40,B,false)
 if(id==='bus-shelter')out+=img(0,620,w,1180)+logo(75,65,66)+headline(b.tagline,75,310,1050,120,135)+r(65,1500,1070,210,P)+txt(b.offer,105,1578,990,35,B,false)+txt(b.website,105,1652,990,30,B,false)
 if(id==='rollup')out+=logo(70,80,65)+tx(b.campaign.toUpperCase(),70,330,16,P,false,'letter-spacing="2"')+headline(b.tagline,70,455,710,95,108)+img(0,795,w,850)+r(0,1645,w,355,P)+txt(b.offer,70,1730,710,26,B,false)+txt(b.website,70,1830,710,30,B,false)
 if(id==='product-label')out+=`<rect x="26" y="26" width="548" height="848" fill="none" stroke="${P}" stroke-width="2"/>`+mark(250,78,100)+txt(b.name,300,267,470,48,P,true,'text-anchor="middle"')+tx('THE EVERYDAY COLLECTION',300,331,14,P,false,'text-anchor="middle" letter-spacing="2"')+r(80,391,440,1,P)+tx('Solid oak / Natural finish',300,479,21,P,false,'text-anchor="middle"')+tx('Made in small batches.',300,527,20,P,false,'text-anchor="middle"')+tx('Care for it. Keep it.',300,565,20,P,false,'text-anchor="middle"')+r(80,640,440,1,P)+txt(b.website,300,760,440,21,P,false,'text-anchor="middle"')+tx('SAMPLE / MATERIAL DETAILS TO REPLACE',300,817,11,P,false,'text-anchor="middle"')
 if(id==='hangtag')out=r(0,0,w,h,P)+`<circle cx="300" cy="70" r="12" fill="${B}"/>`+mark(230,156,140,B)+txt(b.name,300,409,500,54,B,true,'text-anchor="middle"')+lines(b.tagline,20).map((s,i)=>txt(s,300,570+i*75,470,52,B,true,'text-anchor="middle"')).join('')+r(270,790,60,2,A)+txt(b.website,300,903,480,21,B,false,'text-anchor="middle"')
 if(id==='box-sleeve')out=r(0,0,w,h,P)+mark(90,240,190,B)+txt(b.name,390,309,1100,118,B)+txt(b.descriptor,395,380,1050,28,B,false)+r(395,430,1050,1,B)+txt(b.tagline,395,505,1050,36,B)+txt(b.website,395,610,1050,23,B,false)
 if(id==='tote-print')out+=mark(330,160,340)+txt(b.name,500,665,820,100,P,true,'text-anchor="middle"')+txt(b.tagline,500,770,780,33,P,false,'text-anchor="middle"')+r(440,860,120,3,A)+txt(b.website,500,960,760,22,P,false,'text-anchor="middle"')
 if(id==='tee-print')out+=`<circle cx="500" cy="448" r="285" fill="none" stroke="${P}" stroke-width="3"/>`+mark(390,250,220)+txt(b.name,500,570,520,67,P,true,'text-anchor="middle"')+tx('MADE WITH CARE',500,638,20,P,false,'text-anchor="middle" letter-spacing="4"')+txt(b.tagline,500,846,780,34,P,true,'text-anchor="middle"')
 if(id==='storefront-sign')out=r(0,0,w,h,P)+mark(200,210,310,B)+txt(b.name,650,420,1580,180,B)+txt(b.descriptor.toUpperCase(),657,539,1550,33,B,false,'letter-spacing="5"')
 if(id==='wayfinding')out=r(0,0,w,h,P)+logo(85,100,80,B)+r(85,355,1030,2,B)+tx('The studio',85,560,122,B,true)+tx('Visits by appointment',85,650,34,B)+`<path d="M170 1010h810m-220-220 220 220-220 220" stroke="${B}" stroke-width="23" fill="none"/>`+r(85,1360,1030,2,B)+txt(b.website,85,1460,1030,32,B,false)
 if(id==='envelope')out+=logo(115,110,80)+txt(b.email,115,325,750,27,P,false)+tx('DELIVER TO',1110,475,20,P,false,'letter-spacing="3"')+tx('Client Name',1110,568,56,P,true)+tx('Company / Studio',1110,632,34,I)+tx('Street address',1110,691,34,I)+tx('City / State / Postal code',1110,750,34,I)+r(115,965,1970,2,P)+txt(b.website,115,1020,1700,26,P,false)+`<rect x="1925" y="105" width="150" height="180" fill="none" stroke="${P}" stroke-width="2" stroke-dasharray="8 8"/>`
 if(id==='compliments')out+=logo(110,100,80)+tx('With compliments.',110,545,148,P,true)+txt(b.person+' / '+b.role,115,668,1800,33,P,false)+r(115,825,1870,2,P)+txt(b.website,115,900,1750,28,P,false)
 if(id==='folder')out=r(0,0,w,h,P)+logo(180,185,180,B)+tx('Good things',180,1530,270,B,true)+tx('take care.',180,1845,270,B,true)+r(180,2160,220,8,A)+txt(b.tagline,180,2380,1900,72,B,false)+txt(b.website,180,2930,1900,48,B,false)
 if(id==='proposal-cover')out+=img(0,0,w,530)+r(50,47,300,65,B)+txt(b.name,72,90,255,30)+tx('PROJECT PROPOSAL / 001',55,601,12,P,false,'letter-spacing="2"')+tx('A considered',55,709,68,P,true)+tx('next chapter.',55,792,68,P,true)+r(55,855,684,1,P)+tx('Prepared for Client Name',55,909,18,P)+txt('Prepared by '+b.person,55,945,680,18,P,false)+txt(b.website,55,1060,680,13,P,false)
 if(id==='proposal-inner')out+=logo(55,45,42)+tx('THE SCOPE / 02',55,181,11,P,false,'letter-spacing="2"')+tx('What we will make.',55,245,47,P,true)+r(55,283,684,1,P)+[['01','Direction','A shared creative direction, audience and message.'],['02','Identity','An approved logo system, palette and type rules.'],['03','Applications','The agreed print, campaign and digital artwork.'],['04','Handover','Organized files, exports and a client walkthrough.']].map(([n,title,copy],i)=>{const y=358+i*136;return tx(n,55,y,13,P)+tx(title,125,y,29,P,true)+txt(copy,125,y+41,608,15,I,false)+r(125,y+73,614,1,'#c0c7b8')}).join('')+r(55,969,684,1,P)+tx('Sample scope only. Agree fees, dates and terms separately.',55,1009,12,P)+txt(b.website,55,1060,684,12,P,false)
 if(id==='id-badge')out+=r(0,0,245,h,P)+mark(66,105,114,B)+txt(b.name,122.5,330,200,25,B,true,'text-anchor="middle"')+tx('STUDIO / TEAM',122.5,385,12,B,false,'text-anchor="middle" letter-spacing="2"')+txt(b.person,292,220,510,48)+txt(b.role,292,274,510,22,P,false)+r(292,340,510,1,P)+tx('SAMPLE ID / 001',292,389,14,P,false,'letter-spacing="2"')+txt(b.website,292,467,510,16,P,false)
 if(id==='campaign-board')out+=logo(60,45,45)+tx('CAMPAIGN / THE CONSIDERED COLLECTION',60,182,14,P,false,'letter-spacing="2"')+headline(b.tagline,60,286,650,82,93)+txt(b.offer,60,521,650,25,P,false)+r(60,610,650,1,P)+txt('A consistent story, across every touchpoint.',60,663,650,22,I,false)+txt(b.website,60,819,650,17,P,false)+img(790,60,750,780)+r(840,625,650,165,P)+txt(b.campaign,875,694,580,39,B)+txt(b.cta,875,746,580,22,B,false)
 return out
}
