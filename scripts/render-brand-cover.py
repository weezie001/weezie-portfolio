from pathlib import Path
from PIL import Image,ImageDraw,ImageFont,ImageFilter
import fitz

root=Path('kits/brand-delivery-kit')
def svg_image(name,width):
 doc=fitz.open(stream=(root/'sample/ready-to-use'/name).read_bytes(),filetype='svg');pdf=fitz.open('pdf',doc.convert_to_pdf());p=pdf[0];pix=p.get_pixmap(matrix=fitz.Matrix(width/p.rect.width,width/p.rect.width),alpha=False)
 return Image.frombytes('RGB',[pix.width,pix.height],pix.samples)
def font(name,size):
 p=Path('C:/Windows/Fonts')/name
 return ImageFont.truetype(str(p),size) if p.exists() else ImageFont.load_default()
canvas=Image.new('RGB',(1400,1000),'#eeeae0');draw=ImageDraw.Draw(canvas)
draw.text((60,47),'WEEZIE / STUDIO GOODS',font=font('arial.ttf',16),fill='#586351')
draw.text((60,105),'The brand, beautifully handed over.',font=font('georgia.ttf',48),fill='#314b38')
draw.text((63,180),'Editable identity system + applications + client handover',font=font('arial.ttf',19),fill='#78806d')
def paste(im,x,y):
 shadow=Image.new('RGBA',canvas.size,(0,0,0,0));sd=ImageDraw.Draw(shadow);sd.rectangle((x+8,y+12,x+im.width+8,y+im.height+12),fill=(35,50,34,35));shadow=shadow.filter(ImageFilter.GaussianBlur(13));canvas.paste(Image.alpha_composite(canvas.convert('RGBA'),shadow).convert('RGB'));canvas.paste(im,(x,y))
doc=fitz.open(root/'sample/atelier-north-brand-guidelines.pdf');p=doc[0];pix=p.get_pixmap(matrix=fitz.Matrix(430/p.rect.width,430/p.rect.width),alpha=False);book=Image.frombytes('RGB',[pix.width,pix.height],pix.samples);paste(book,65,275)
paste(svg_image('business-card-front.svg',400),560,275)
paste(svg_image('business-card-back.svg',400),870,470)
paste(svg_image('social-square.svg',280),560,615)
draw=ImageDraw.Draw(canvas);draw.line((65,940,1335,940),fill='#c7cebe',width=1);draw.text((65,960),'12 APPLICATIONS / 12 LOGO VARIANTS / PRINTABLE GUIDES',font=font('arial.ttf',13),fill='#64725c')
Path('public/store').mkdir(exist_ok=True);canvas.save('public/store/brand-kit-v2.png',optimize=True)
print('Rendered product cover from actual kit artwork.')
