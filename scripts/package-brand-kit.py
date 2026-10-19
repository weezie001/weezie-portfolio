from pathlib import Path
import hashlib,json,zipfile,time

root=Path('kits/brand-delivery-kit')
files=sorted(p for p in root.rglob('*') if p.is_file() and p.name!='manifest.json' and not p.name.startswith('.') and not any(part in ['node_modules','.DS_Store'] for part in p.parts))
count=len(json.loads((root/'template-catalog.json').read_text(encoding='utf8')))
manifest={'version':'3.1.0','identity':'Atelier North (fictional sample)','applications':count,'logo_variants':12,'photographic_mockups':3,'files':{str(p.relative_to(root)).replace('\\','/'):hashlib.sha256(p.read_bytes()).hexdigest() for p in files}}
(root/'manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf8')
files.append(root/'manifest.json')
target=Path('public/downloads/weezie-brand-delivery-kit.zip')
temporary=Path('.tmp/brand-review/weezie-brand-delivery-kit.building.zip')
temporary.parent.mkdir(parents=True,exist_ok=True)
with zipfile.ZipFile(temporary,'w',zipfile.ZIP_DEFLATED,compresslevel=8) as z:
 for p in files:z.write(p,str(p.relative_to(root)))
with zipfile.ZipFile(temporary) as z:
 assert z.testzip() is None
 assert len([n for n in z.namelist() if n.startswith('sample/ready-to-use/') and n.endswith('.svg')])==count
 assert len([n for n in z.namelist() if n.startswith('editable-templates/') and n.endswith('.svg')])==count
 assert len([n for n in z.namelist() if n.startswith('sample/png-exports/') and n.endswith('.png')])==count
 assert len([n for n in z.namelist() if n.startswith('09-mockups/') and n.endswith('.jpg')])==3
 assert len([n for n in z.namelist() if n.startswith('06-assets/logos/png/') and n.endswith('.png')])==24
 for name,sha in manifest['files'].items():assert hashlib.sha256(z.read(name)).hexdigest()==sha,name
assert temporary.stat().st_size<25*1024*1024,'Archive exceeds hosting per-file limit'
for attempt in range(5):
 try:
  temporary.replace(target)
  break
 except OSError:
  if attempt==4:raise
  time.sleep(.25)
print(f'Packaged {len(files)} files; {target.stat().st_size:,} bytes; all checksums and counts verified.')
