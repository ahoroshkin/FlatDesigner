from pathlib import Path
import re,json
src=Path('Дизайн-проект кв. 109 — Шаумяна 14 (v219).html');src=src if src.exists() else Path('obmerka-v219.html');s=src.read_text().replace('const APP_VER="v219",','const APP_VER="v220",',1)
p=Path('tmp/project-v220-github.json');p=p if p.exists() else Path('data/project_kv109_v220.json');data=json.loads(p.read_text());lit=json.dumps(json.dumps(data,ensure_ascii=False,separators=(',',':')),ensure_ascii=False).replace('</','<\\/')
for key in ['PRELOAD_JSON','SAVED_JSON']:s,n=re.subn(r'^const '+key+r'=.*$',lambda m:'const '+key+'='+lit+';',s,flags=re.M);assert n==1
s=s.replace('T=fitBox(op,W,H,{l:280,r:280,t:80,b:80})','T=fitBox(op,W,H,{l:260,r:260,t:290,b:220})')
old="marks.push({x:q[0],y:q[1],tag:o.tag,col:o.col})"
new="marks.push({x:q[0],y:q[1],tag:o.tag,col:o.col,side220:o.wk!=null?(()=>{const n=outNormal(wallRoom(r).points,o.wk);return Math.abs(n[0])>Math.abs(n[1])?(n[0]<0?0:1):(n[1]<0?2:3)})():null})"
assert old in s;s=s.replace(old,new)
a='document.addEventListener("keydown", e=>{ if(V3.open&&e.key==="Escape") close3D(); });';s=s.replace(a,Path('tools/drawings220.js').read_text()+'\n'+a,1)
Path('Дизайн-проект кв. 109 — Шаумяна 14 (v220).html').write_text(s);Path('/private/tmp/v220-check.js').write_text(re.findall(r'<script[^>]*>([\s\S]*?)</script>',s)[-1])
