from pathlib import Path
import re,json
src=Path('Дизайн-проект кв. 109 — Шаумяна 14 (v216).html');src=src if src.exists() else Path('obmerka-v216.html');s=src.read_text()
p=Path('tmp/project-v217-latest.json');p=p if p.exists() else Path('data/project_kv109_v217.json');data=json.loads(p.read_text())
s=s.replace('const APP_VER="v216",','const APP_VER="v217",',1)
lit=json.dumps(json.dumps(data,ensure_ascii=False,separators=(',',':')),ensure_ascii=False).replace('</','<\\/')
for key in ['PRELOAD_JSON','SAVED_JSON']:s,n=re.subn(r'^const '+key+r'=.*$',lambda m:'const '+key+'='+lit+';',s,flags=re.M);assert n==1
s=s.replace('return !!k&&k.split("+").includes(kind);','return !(it.type==="ac"&&kind==="sock"&&!acOut(it,"power").on)&&!!k&&k.split("+").includes(kind);',1)
s=s.replace('if(dk){ if(it.type==="kpenov"&&it.ovOn===false) return;','if(dk){ if(it.type==="ac"&&!acOut(it,"power").on)return; if(it.type==="kpenov"&&it.ovOn===false) return;',1)
s=s.replace('const base=planSVG(r,T,W,H,KIT_PAL,{labels:true, verts:false, live:false, zoom:false, ties:false, layer:new Set(["obmer","furn"])});','const base=planSVG(r,T,W,H,KIT_PAL,{labels:false,grid:false,routes:false,dims:false,area:false,verts:false,live:false,zoom:false,ties:false,layer:new Set(["obmer","furn"])});',1)
s=s.replace('base=planSVG(r,T,W,H,KIT_PAL,{labels:false,verts:false', 'base=planSVG(r,T,W,H,KIT_PAL,{acReference217:true,labels:false,verts:false',1)
s=s.replace('  // мебель у стены — силуэтом', '''  (W.items||[]).filter(it=>it.type==="ac"&&it.wall===k).forEach(it=>{const ip=itemPos(W,it),hh=+it.oh||290,base=+it.h||2200;o.push(`<rect data-ac-reference217="${it.id}" x="${X(ip.t)}" y="${Y(base+hh)}" width="${(+it.w||800)*s}" height="${hh*s}" fill="#ededeb" stroke="#899398" stroke-width="1"/>`);});
  // мебель у стены — силуэтом''',1)
anchor='document.addEventListener("keydown", e=>{ if(V3.open&&e.key==="Escape") close3D(); });';s=s.replace(anchor,Path('tools/circuits217.js').read_text()+'\n'+anchor,1)
Path('Дизайн-проект кв. 109 — Шаумяна 14 (v217).html').write_text(s);Path('/private/tmp/v217-check.js').write_text(re.findall(r'<script[^>]*>([\s\S]*?)</script>',s)[-1]);print('v217',data['updated'])
