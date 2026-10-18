from pathlib import Path
import json, hashlib, zipfile
root=Path('kits/weezie-ui')
files=[p for p in root.rglob('*') if p.is_file() and not any(v in ['node_modules','dist'] for v in p.relative_to(root).parts) and p.name!='manifest.json']
manifest={'version':'1.0.0','components':35,'files':{str(p.relative_to(root)).replace('\\','/'):hashlib.sha256(p.read_bytes()).hexdigest() for p in files}}
(root/'manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf8')
files.append(root/'manifest.json')
target=Path('public/downloads/weezie-ui-components.zip');target.parent.mkdir(parents=True,exist_ok=True)
with zipfile.ZipFile(target,'w',zipfile.ZIP_DEFLATED) as z:
 for p in files:z.write(p,str(p.relative_to(root)))
with zipfile.ZipFile(target) as z:
 assert z.testzip() is None
 assert len([n for n in z.namelist() if n.startswith('src/components/') and n.endswith('.jsx')])==35
 assert len([n for n in z.namelist() if n.startswith('examples/') and n.endswith('.jsx')])==35
print(f'Packaged {len(files)} files; {target.stat().st_size:,} bytes')
