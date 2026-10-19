from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from pypdf import PdfReader

root=Path(__file__).resolve().parent
source=(root/'enang-wisdom-fal-cover-letter.md').read_text(encoding='utf-8')
out=root.parent/'pdf'/'enang-wisdom-fal-cover-letter.pdf'
body=ParagraphStyle('body',fontName='Helvetica',fontSize=10.2,leading=14.4,spaceAfter=10,textColor=HexColor('#26333D'))
name=ParagraphStyle('name',parent=body,fontName='Helvetica-Bold',fontSize=21,leading=25,spaceAfter=4,textColor=HexColor('#142A3B'))
role=ParagraphStyle('role',parent=body,fontName='Helvetica-Bold',fontSize=11,leading=15,spaceAfter=9)
story=[]
for i,block in enumerate(source.strip().split('\n\n')):
    if i==0:
        a,b=block.split('\n',1)
        story.extend([Paragraph(escape(a[2:]),name),Paragraph(escape(b),role)])
    else:
        story.append(Paragraph(escape(block).replace('\n','<br/>'),body))
SimpleDocTemplate(str(out),pagesize=(612,792),leftMargin=47,rightMargin=47,topMargin=39,bottomMargin=35,title='Enang Wisdom - Cover Letter - fal',author='Enang Wisdom').build(story)
pdf=PdfReader(str(out))
print(str(out), 'pages:',len(pdf.pages))
assert len(pdf.pages)==1
