"""Read-only public search readiness audit. Does not assert Google indexing."""
import concurrent.futures, json, re, urllib.request, urllib.error
import urllib.robotparser, xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path

ROOT = 'https://weezie.site'
class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.meta={}; self.links=[]; self.canonical=''; self.title=''; self.h1=[]; self.jsonld=[]; self.active=''; self.buffer=''
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag=='meta': self.meta[a.get('name',a.get('property',''))]=a.get('content','')
        if tag=='link' and a.get('rel')=='canonical': self.canonical=a.get('href','')
        if tag=='a': self.links.append(a.get('href',''))
        if tag in ('title','h1') or (tag=='script' and a.get('type')=='application/ld+json'): self.active=tag; self.buffer=''
    def handle_data(self,data):
        if self.active: self.buffer+=data
    def handle_endtag(self,tag):
        if tag!=self.active:return
        if tag=='title':self.title=self.buffer
        if tag=='h1':self.h1.append(self.buffer)
        if tag=='script':
            try:self.jsonld.append(json.loads(self.buffer))
            except ValueError:self.jsonld.append({'error':'invalid JSON'})
        self.active=''

def fetch(url, agent='Mozilla/5.0'):
    try:
        with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':agent}),timeout=35) as r:
            return r.status,r.geturl(),dict(r.headers),r.read().decode('utf-8','replace')
    except urllib.error.HTTPError as e:return e.code,e.url,dict(e.headers),e.read().decode('utf-8','replace')

def audit(url):
    status,final,headers,body=fetch(url); p=Page();p.feed(body)
    return dict(url=url,status=status,final=final,title=p.title,canonical=p.canonical,robots=p.meta.get('robots',''),x_robots=headers.get('X-Robots-Tag',''),description=p.meta.get('description',''),h1=p.h1,jsonld_valid=bool(p.jsonld) and not any('error' in x for x in p.jsonld),links=p.links,bytes=len(body),linkedin='linkedin.com/in/enang-wisdom-344636237' in body,business_email='enang@weezie.site' in body)

if __name__=='__main__':
    robots=fetch(ROOT+'/robots.txt'); sitemap=fetch(ROOT+'/sitemap.xml')
    urls=[e.text for e in ET.fromstring(sitemap[3]).iter() if e.tag.endswith('}loc')]
    rp=urllib.robotparser.RobotFileParser();rp.parse(robots[3].splitlines())
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool: pages=list(pool.map(audit,urls))
    for p in pages:p['allowed']={a:rp.can_fetch(a,p['url']) for a in ['Googlebot','OAI-SearchBot','Claude-SearchBot','PerplexityBot']}
    probes={path:dict(zip(['status','final'],fetch(ROOT+path)[:2])) for path in ['/this-page-does-not-exist-search-audit/','/llms.txt']}
    result=dict(robots=robots[3],sitemap_status=sitemap[0],pages=pages,probes=probes)
    Path('docs').mkdir(exist_ok=True);Path('docs/search-audit-2026-10-18.json').write_text(json.dumps(result,indent=2),encoding='utf8')
    print(json.dumps(result,indent=2))
