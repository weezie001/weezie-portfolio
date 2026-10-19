from pathlib import Path
import json
import xml.etree.ElementTree as ET
import fitz
from PIL import Image, ImageDraw, ImageFont, ImageOps

root=Path('kits/brand-delivery-kit')
catalog=json.loads((root/'template-catalog.json').read_text(encoding='utf8'))
thumbs=root/'sample/previews';thumbs.mkdir(exist_ok=True)
exports=root/'sample/png-exports';exports.mkdir(exist_ok=True)
review=Path('.tmp/brand-review');review.mkdir(parents=True,exist_ok=True)
font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',17)
small=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',13)
sheet=Image.new('RGB',(1800,420*6),'#f7f7f2');draw=ImageDraw.Draw(sheet)
for index,t in enumerate(catalog):
 path=root/'sample/ready-to-use'/(t['file']+'.svg')
 ET.fromstring(path.read_bytes())
 source=fitz.open(stream=path.read_bytes(),filetype='svg')
 pdf=fitz.open('pdf',source.convert_to_pdf());page=pdf[0]
 pix=page.get_pixmap(matrix=fitz.Matrix(t['w']/page.rect.width,t['h']/page.rect.height),alpha=False)
 full=Image.frombytes('RGB',[pix.width,pix.height],pix.samples)
 full.save(exports/(t['file']+'.png'),optimize=True,compress_level=9)
 assert full.size==(t['w'],t['h']),(t['id'],full.size)
 thumb=full.copy();thumb.thumbnail((320,420),Image.Resampling.LANCZOS);thumb.save(thumbs/(t['file']+'.png'),optimize=True)
 col=index%6;row=index//6;x=col*300;y=row*420
 draw.rectangle((x+10,y+10,x+290,y+350),fill='#e9ece2')
 art=ImageOps.contain(full,(244,308),Image.Resampling.LANCZOS)
 sheet.paste(art,(x+150-art.width//2,y+180-art.height//2))
 draw.text((x+14,y+363),t['name'],font=small,fill='#273626')
 draw.text((x+14,y+387),t['category']+' / '+t['size'],font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',10),fill='#707764')
sheet.save(review/'applications-v3-contact-sheet.jpg',quality=94)
for group in ['Ads','Outdoor','Packaging','Stationery']:
 group_templates=[t for t in catalog if t['category']==group]
 out=Image.new('RGB',(1400,520*((len(group_templates)+2)//3)),'#f7f7f2');d=ImageDraw.Draw(out)
 for i,t in enumerate(group_templates):
  x=(i%3)*466;y=(i//3)*520
  art=ImageOps.contain(Image.open(exports/(t['file']+'.png')),(420,440),Image.Resampling.LANCZOS)
  out.paste(art,(x+233-art.width//2,y+225-art.height//2));d.text((x+20,y+475),t['name'],font=font,fill='#273626')
 out.save(review/(group.lower()+'-v3.jpg'),quality=95)
print(f'Rendered {len(catalog)} full-size PNG exports and gallery previews. Contact sheets in {review}.')
