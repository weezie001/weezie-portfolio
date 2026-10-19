from pathlib import Path
import re
from xml.sax.saxutils import escape
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, KeepTogether, PageBreak
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT

ROOT = Path(__file__).resolve().parent
OUT = ROOT.parent / 'pdf'
OUT.mkdir(exist_ok=True)

def inline(s):
    s = escape(s)
    s = re.sub(r'\[([^\]]+)\]\((https?://[^)]+)\)', r'<link href="\2" color="#234F70">\1</link>', s)
    return re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', s)

styles = {
    'name': ParagraphStyle('name', fontName='Helvetica-Bold', fontSize=22, leading=25, textColor=HexColor('#142A3B'), spaceAfter=5),
    'title': ParagraphStyle('title', fontName='Helvetica-Bold', fontSize=11, leading=14, spaceAfter=5),
    'body': ParagraphStyle('body', fontName='Helvetica', fontSize=9.3, leading=12.1, spaceAfter=3.8),
    'section': ParagraphStyle('section', fontName='Helvetica-Bold', fontSize=9.5, leading=12, textColor=HexColor('#234F70'), spaceBefore=9, spaceAfter=4, keepWithNext=True),
    'bullet': ParagraphStyle('bullet', fontName='Helvetica', fontSize=9.3, leading=12.1, leftIndent=9, firstLineIndent=-8, spaceAfter=3.4),
    'project': ParagraphStyle('project', fontName='Helvetica', fontSize=9.3, leading=12.1, spaceBefore=3, spaceAfter=3, keepWithNext=True),
}

lines = (ROOT / 'enang-wisdom-fal-expanded-resume.md').read_text(encoding='utf-8').splitlines()
story=[]
i=0
while i<len(lines):
    line=lines[i].strip()
    if not line:
        i+=1; continue
    if line == '---':
        story.append(PageBreak())
        i+=1; continue
    if line.startswith('# '): key='name'; text=line[2:]
    elif line.startswith('## '): key='section'; text=line[3:]
    elif line.startswith('- '): key='bullet'; text='- '+line[2:]
    elif line.startswith('**'):
        key='project'; text=line
        if i+1<len(lines) and lines[i+1].strip():
            i+=1; text+='\n'+lines[i].strip()
    elif i==1: key='title'; text=line
    else: key='body'; text=line
    story.append(Paragraph(inline(text).replace('\n','<br/>'), styles[key]))
    i+=1

path=OUT/'enang-wisdom-fal-expanded-resume.pdf'
doc=SimpleDocTemplate(str(path),pagesize=(612,792),leftMargin=39,rightMargin=39,topMargin=32,bottomMargin=30,
    title='Enang Wisdom - Product Designer - fal',author='Enang Wisdom')
def page_footer(c, doc):
    c.saveState()
    c.setStrokeColor(HexColor('#D7E0E7'))
    c.line(39,27,573,27)
    c.setFont('Helvetica',8)
    c.setFillColor(HexColor('#506374'))
    c.drawString(39,16,'ENANG WISDOM  |  PRODUCT DESIGN & PRODUCT LEADERSHIP')
    c.drawRightString(573,16,str(doc.page))
    c.restoreState()
doc.build(story,onFirstPage=page_footer,onLaterPages=page_footer)
from pypdf import PdfReader
pdf=PdfReader(str(path))
print(f'Created {path}; pages={len(pdf.pages)}')
print('Extracted words:',len(' '.join(p.extract_text() for p in pdf.pages).split()))
