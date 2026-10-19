#!/usr/bin/env python3
"""Build one standalone editable presentation from project data and fixed editor assets."""
import argparse,base64,gzip,json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parent
LOCALES=['en','zh','zh-tw','ja','ko','es','pt-br','de','fr','ar','ru','it','hi','id','tr','vi','th','nl','pl','he']
TYPES={'stack','columns','column','smart','item','heading','subheading','text','label','number','callout','code','group','image','rule','table','tablerow','cell'}
def validate(project,config):
 if not isinstance(project,dict) or not isinstance(config,dict):raise ValueError('Project and editor config must be objects')
 if config.get('schemaVersion')!=1:raise ValueError('Unsupported editor schema version')
 if not project.get('id') or not isinstance(project.get('slides'),list) or not 1<=len(project['slides'])<=100:raise ValueError('Project requires an id and 1-100 slides')
 for key in ['uiLocale','conversationLocale','contentLocale']:
  if config.get(key) not in [None,'auto',*LOCALES]:raise ValueError('Unsupported '+key)
 if project.get('contentLocale') not in [None,*LOCALES]:raise ValueError('Unsupported project content locale')
 for d in [config.get('contentDirection'),project.get('contentDirection')]:
  if d not in [None,'auto','ltr','rtl']:raise ValueError('Invalid content direction')
 ids=set()
 def walk(n,depth=0):
  if not isinstance(n,dict):raise ValueError('Presentation nodes must be objects')
  if depth>20 or n.get('type') not in TYPES or not n.get('id') or n['id'] in ids:raise ValueError('Invalid or duplicate presentation node')
  ids.add(n['id'])
  if not isinstance(n['id'],str) or re.search(r'[\"<>\s]',n['id']):raise ValueError('Invalid presentation node id')
  if 'text' in n and not isinstance(n['text'],str):raise ValueError('Node text must be a string')
  if n.get('locale') not in [None,*LOCALES]:raise ValueError('Unsupported node locale')
  if n.get('direction') not in [None,'auto','ltr','rtl']:raise ValueError('Invalid node direction')
  for c in n.get('children',[]):walk(c,depth+1)
 for slide in project['slides']:
  if slide.get('locale') not in [None,*LOCALES] or slide.get('direction') not in [None,'auto','ltr','rtl']:raise ValueError('Invalid slide language or direction')
  if slide.get('root',{}).get('type')!='stack':raise ValueError('Slide root must be a stack')
  walk(slide['root'])
 for owner in [project,*project['slides']]:
  if owner.get('background') is not None and not re.fullmatch(r'#[a-fA-F0-9]{6}',str(owner['background'])):raise ValueError('Invalid background')
  palette=owner.get('palette')
  if palette is not None and any(not re.fullmatch(r'#[a-fA-F0-9]{6}',str(palette.get(k,''))) for k in ['theme','tint','paper','ink']):raise ValueError('Invalid palette')
  fonts=owner.get('typography',{})
  if any(not isinstance(v,str) or len(v)>120 or re.search(r'[;{}<>]',v) for v in fonts.values()):raise ValueError('Invalid typography token')
 if 'palette' not in project:raise ValueError('Project palette required')
def encoded(value):return json.dumps(value,ensure_ascii=False,separators=(',',':')).replace('<','\\u003c')
def packed_runtime():
 # Export code is unpacked on first PPTX export; mtime 0 keeps builds byte-identical.
 return base64.b64encode(gzip.compress((ROOT/'vendor/pptx-runtime.js').read_bytes(),compresslevel=9,mtime=0)).decode('ascii')
def assemble(project,config):
 validate(project,config)
 catalogs={locale:json.loads((ROOT/'locales'/f'{locale}.json').read_text()) for locale in LOCALES}
 base=catalogs['en']
 for locale,values in catalogs.items():
  if set(values)!=set(base):raise ValueError('Locale key mismatch: '+locale)
  for key,value in values.items():
   if not value or sorted(re.findall(r'\{\w+\}',value))!=sorted(re.findall(r'\{\w+\}',base[key])):raise ValueError('Locale placeholder mismatch: '+locale+' / '+key)
 runtime=(ROOT/'editor.js').read_text().replace('__I18N_RUNTIME__',(ROOT/'i18n.js').read_text()).replace('__PRESENTATION_FORMAT__',(ROOT/'presentation-format.js').read_text()).replace('__PERSISTENCE_RUNTIME__',(ROOT/'persistence.js').read_text())
 replacements={'__EDITOR_CSS__':(ROOT/'editor.css').read_text()+'\n'+(ROOT/'rtl.css').read_text(),'__DECK_DATA__':encoded(project),'__EDITOR_CONFIG__':encoded(config),'__LOCALES__':encoded(catalogs),'__PPTX_RUNTIME__':packed_runtime(),'__EDITOR_RUNTIME__':runtime}
 output=(ROOT/'shell.template.html').read_text()
 if any(token not in replacements for token in re.findall(r'__(?:EDITOR|DECK|LOCALES|PPTX|I18N)_\w+__',output)):raise ValueError('Unresolved template placeholder')
 output=re.sub('|'.join(map(re.escape,replacements)),lambda match:replacements[match.group(0)],output)
 return output
if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--project',type=Path,default=ROOT/'example-project.json');parser.add_argument('--config',type=Path,default=ROOT/'example-config.json');parser.add_argument('--output',type=Path,required=True);args=parser.parse_args();project=json.loads(args.project.read_text());config=json.loads(args.config.read_text());output=assemble(project,config);args.output.parent.mkdir(parents=True,exist_ok=True);args.output.write_text(output);print(f'Built {len(project["slides"])} slides; {len(LOCALES)} locales; {len(output.encode())} bytes: {args.output}')
