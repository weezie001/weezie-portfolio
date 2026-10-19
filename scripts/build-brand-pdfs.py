from pathlib import Path
import json, io
import fitz
from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, Color
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from xml.sax.saxutils import escape

ROOT=Path('kits/brand-delivery-kit')
OUT=ROOT/'sample'; OUT.mkdir(exist_ok=True)
TMP=Path('.tmp/brand-review');TMP.mkdir(parents=True,exist_ok=True)
b=json.loads((OUT/'brand-settings.json').read_text())
PAPER=b['paper'];PRIMARY=b['primary'];INK=b['ink'];ACCENT=b['accent'];MUTED='#56604f'
fonts={'Display':('georgia.ttf','Times-Roman'),'Italic':('georgiai.ttf','Times-Italic'),'Body':('arial.ttf','Helvetica'),'Bold':('arialbd.ttf','Helvetica-Bold')}
for key,(filename,fallback) in fonts.items():
 p=Path('C:/Windows/Fonts')/filename
 if p.exists():pdfmetrics.registerFont(TTFont('North'+key,str(p)));fonts[key]='North'+key
 else:fonts[key]=fallback

def raster_svg(path,width=1024):
 source=fitz.open(stream=path.read_bytes(),filetype='svg');pdf=fitz.open('pdf',source.convert_to_pdf());page=pdf[0]
 return page.get_pixmap(matrix=fitz.Matrix(width/page.rect.width,width/page.rect.width),alpha=True)

# Useful, transparent raster exports accompany every editable vector logo.
pngdir=ROOT/'06-assets/logos/png';pngdir.mkdir(parents=True,exist_ok=True)
for p in (ROOT/'06-assets/logos/svg').glob('north_*.svg'):
 if p.stem.split('_')[-1] not in ['color','reverse','mono']:continue
 for width in [512,1024]:raster_svg(p,width).save(str(pngdir/f'{p.stem}_{width}.png'))
favdir=ROOT/'06-assets/favicons';favdir.mkdir(parents=True,exist_ok=True)
for size in [16,32,48,180,192,512]:raster_svg(ROOT/'06-assets/logos/svg/north_mark_color.svg',size).save(str(favdir/f'favicon-{size}.png'))
Image.open(favdir/'favicon-512.png').save(favdir/'favicon.ico',sizes=[(16,16),(32,32),(48,48)])

W,H=595.276,841.89
c=canvas.Canvas(str(OUT/'atelier-north-brand-guidelines.pdf'),pagesize=(W,H))
c.setTitle('Atelier North / Sample Brand Guidelines');c.setAuthor('Enang Weezie');c.setSubject('Fictional sample identity included in the Brand Delivery Kit')
def rect(x,y,w,h,color):c.setFillColor(HexColor(color));c.rect(x,y,w,h,fill=1,stroke=0)
def line(y):rect(45,y,W-90,.5,'#b6bba9')
def text(value,x,y,size=10,font='Body',color=INK):c.setFillColor(HexColor(color));c.setFont(fonts[font],size);c.drawString(x,y,value)
def para(value,x,y,width=505,size=11,color=INK,leading=None,font='Body'):
 style=ParagraphStyle('p',fontName=fonts[font],fontSize=size,leading=leading or size*1.65,textColor=HexColor(color))
 p=Paragraph(escape(value),style);_,height=p.wrap(width,H)
 if y-height<65:raise ValueError(f'Text overflow: {value[:50]}')
 p.drawOn(c,x,y-height);return y-height
def start(num,label):
 rect(0,0,W,H,PAPER);text('ATELIER NORTH',45,H-43,8,'Body',PRIMARY);text(label,385,H-43,8,'Body',PRIMARY);line(H-59)
 text('BRAND GUIDELINES / FICTIONAL SAMPLE',45,33,7,'Body',MUTED);text(f'{num:02d}',530,33,8,'Body',PRIMARY)
def heading(kicker,a,d):text(kicker,45,735,8,'Body',PRIMARY);text(a,45,673,38,'Display',PRIMARY);text(d,45,628,38,'Italic',PRIMARY)
def column(title,body,x,y,width=232):text(title,x,y,11,'Bold',PRIMARY);return para(body,x,y-15,width,10.5,MUTED)
def photo(x,y,w,h):c.drawImage(str(ROOT/'06-assets/photography/north-workshop.jpg'),x,y,w,h,preserveAspectRatio=True,anchor='c',mask='auto')

start(1,'A CONSIDERED IDENTITY')
text('Brand guidelines',45,724,12,'Body',MUTED);text('Atelier North',45,648,56,'Display',PRIMARY);text(b['tagline'],45,607,17,'Body',PRIMARY)
photo(45,182,W-90,365)
para('A fictional small-batch furniture and joinery identity. A complete example of how strategy, visual rules and useful applications belong together.',45,155,W-90,11,MUTED)
c.showPage()
start(2,'01 / THE IDEA');heading('THE BRAND PLATFORM','Objects for','considered living.')
column('Purpose','Make lasting objects for people who want fewer, better things in their everyday spaces.',45,543)
column('Audience','Thoughtful homeowners and interior specifiers who value honest materials, precise workmanship and a direct relationship with the maker.',317,543)
column('Position','A small-batch studio where material, method and everyday usefulness receive equal care.',45,390)
column('Personality','Exact, unhurried and workshop-plain. Confident about the details without dressing them up.',317,390)
line(250);para('Work honestly. Explain simply. Make the details useful. Leave room for the material to speak.',45,216,W-90,22,PRIMARY,font='Display');c.showPage()
start(3,'02 / THE SIGNATURE');heading('LOGO SYSTEM','A mark with','a place to belong.')
logo=ImageReader(io.BytesIO(raster_svg(ROOT/'06-assets/logos/svg/north_horizontal_color.svg',1500).tobytes('png')))
c.drawImage(logo,45,440,width=505,height=84,mask='auto')
c.setStrokeColor(HexColor('#aeb6a0'));c.setLineWidth(.5);c.rect(45,420,505,125,stroke=1,fill=0)
column('Use the right version','Horizontal for documents and headers; stacked for square formats; the mark for avatars and favicon sizes; wordmark when the symbol is already present.',45,365)
column('Leave it room','Clear space: at least one quarter of the mark height on every side. Minimum horizontal width: 160 px or 45 mm. Minimum mark width: 24 px or 8 mm.',317,365)
line(187);para('Use color on paper, reverse white on a solid dark surface, or the mono version. Keep proportions intact. Do not stretch, rotate, outline, shadow or place it on a busy image.',45,161,W-90,10.5,MUTED);c.showPage()
start(4,'03 / THE PALETTE');heading('COLOR SYSTEM','Grounded.','With one bright detail.')
colors=[('Forest',PRIMARY),('Birch',PAPER),('Soot',INK),('Brass',ACCENT)]
for i,(name,value) in enumerate(colors):
 x=45+i*130;rect(x,407,115,150,value);text(name,x,383,11,'Bold',PRIMARY);text(value.upper(),x,361,9,'Body',MUTED)
column('Start with balance','Paper 60%, forest 25%, ink 10%, brass 5%. Use the accent for a small rule or useful detail, not a dominant page background.',45,298)
column('Keep it readable','Use dark ink on paper or paper on forest. Avoid brass for body copy. Check contrast whenever the colors change.',317,298)
line(143);para('RGB values are supplied for screens. Confirm CMYK conversion, paper stock and a physical proof with the printer before production.',45,119,W-90,9,MUTED);c.showPage()
start(5,'04 / WORDS & RHYTHM');heading('TYPOGRAPHY','Type that leaves','room to think.')
text('Aa. A quieter everyday.',45,523,34,'Display',PRIMARY)
column('Georgia / Display','Regular serif for short headings, quotations and considered statements. Let scale and spacing do the work.',45,466)
column('Arial / Body','A practical sans-serif for documents, labels and readable paragraphs. Use short blocks and generous line spacing.',317,466)
line(316)
for i,(label,value) in enumerate([('HEADING','40 / 44'),('BODY','16 / 26'),('LABEL','11 / 16'),('BASE SPACE','4 px')]):
 x=45+i*130;text(label,x,284,8,'Body',MUTED);text(value,x,247,24,'Display',PRIMARY)
para('Editable SVGs use system-font stacks. The original strategy templates also list Newsreader and IBM Plex as optional licensed alternatives. Font files are not included. Record licenses and fallback choices when adapting the kit.',45,178,W-90,10,MUTED);c.showPage()
start(6,'05 / THE VOICE');heading('MESSAGING','Say what matters.','Leave the rest.')
text('Exact. Unhurried. Human.',45,553,20,'Display',PRIMARY)
column('Say','Solid oak. Cut, joined and finished in small batches. Tell us about the room it will live in. Made slowly. Kept for years.',45,479)
column('Avoid','The ultimate luxury lifestyle solution. Vague superlatives, invented heritage, or urgency without a real reason.',317,479)
line(303);text('Core message',45,272,11,'Bold',PRIMARY)
para('Good objects earn their place through material honesty, everyday usefulness and careful construction. Show the detail that makes the promise believable.',45,245,W-90,18,PRIMARY,font='Display');c.showPage()
start(7,'06 / ART DIRECTION');heading('IMAGERY & LAYOUT','Let the material','tell its story.')
photo(45,330,505,255)
column('Photographic direction','Natural light. Honest texture. Quiet architectural space. Show joints, grain and edges. Leave space for the type.',45,286)
column('Layout direction','Simple grids, generous margins and a small number of elements. Consistent logo position, restrained rules and clear hierarchy.',317,286)
para('The supplied workshop image was created with OpenAI image generation for this fictional identity. Replace it with approved client imagery for a real job.',45,125,W-90,9,MUTED);c.showPage()
start(8,'07 / THE HANDOVER');heading('USE IT WELL','A useful system.','Ready for real work.')
column('For the client','Approved logo exports, brand guidelines, agreed application designs, an email signature and a file guide. Keep one master set.',45,545)
column('For the developer','Use tokens.css and design-tokens.json as a shared source for colors, typography and spacing. Update them with the identity.',317,545)
column('Before printing','Confirm stock, trim, bleed, color conversion and final proof. The sample stationery PDF is a design proof, not a certified PDF/X file.',45,386)
column('Before publishing','Replace example contacts, dates, prices and placeholder copy. Check permissions, font licensing, readability and every link.',317,386)
line(229);text(b['person']+' / '+b['role'],45,200,11,'Bold',PRIMARY);text(b['email'],45,175,11,'Body',MUTED);text(b['website'],45,153,11,'Body',MUTED);c.save()

# Exact-size vector stationery proofs, including a 3 mm bleed on the two cards.
proof=fitz.open()
for name,size,bg,bleed in [('business-card-front',(85,55),PRIMARY,3),('business-card-back',(85,55),PAPER,3),('letterhead-a4',(210,297),'#fcfbf7',0),('invoice-a4',(210,297),'#fcfbf7',0)]:
 source=fitz.open(stream=(ROOT/'sample/ready-to-use'/f'{name}.svg').read_bytes(),filetype='svg');sourcepdf=fitz.open('pdf',source.convert_to_pdf())
 mm=72/25.4;w,h=[n*mm for n in size];edge=bleed*mm
 p=proof.new_page(width=w+edge*2,height=h+edge*2)
 rgb=tuple(int(bg[i:i+2],16)/255 for i in [1,3,5]);p.draw_rect(p.rect,color=None,fill=rgb)
 p.show_pdf_page(fitz.Rect(edge,edge,edge+w,edge+h),sourcepdf,0)
 if bleed:
  p.set_trimbox(fitz.Rect(edge,edge,edge+w,edge+h))
  for x in [edge,edge+w]:
   for a,z in [(1,edge-1),(edge+h+1,edge*2+h-1)]:p.draw_line(fitz.Point(x,a),fitz.Point(x,z),width=.3,color=(0,0,0))
  for y in [edge,edge+h]:
   for a,z in [(1,edge-1),(edge+w+1,edge*2+w-1)]:p.draw_line(fitz.Point(a,y),fitz.Point(z,y),width=.3,color=(0,0,0))
proof.set_metadata({'title':'Atelier North / Stationery proofs','author':'Enang Weezie','subject':'Fictional sample. Cards include 3 mm bleed. RGB design proofs.'})
proof.save(OUT/'atelier-north-stationery-proofs.pdf',garbage=4,deflate=True)

thumbs=ROOT/'sample/previews';thumbs.mkdir(exist_ok=True)
for p in (ROOT/'sample/ready-to-use').glob('*.svg'):
 pix=raster_svg(p,320);im=Image.open(io.BytesIO(pix.tobytes('png'))).convert('RGB');im.thumbnail((320,420));im.save(thumbs/(p.stem+'.png'),optimize=True)
for filename in ['atelier-north-brand-guidelines.pdf','atelier-north-stationery-proofs.pdf']:
 doc=fitz.open(OUT/filename)
 for i,page in enumerate(doc):
  page.get_pixmap(matrix=fitz.Matrix(.9,.9),alpha=False).save(str(TMP/f'{Path(filename).stem}-{i+1}.png'))
 print(filename,len(doc),'pages')
print('Rendered both PDFs and all application previews for visual review.')
