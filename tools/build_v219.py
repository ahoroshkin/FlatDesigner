from pathlib import Path
import re,json
src=Path('Дизайн-проект кв. 109 — Шаумяна 14 (v218).html');src=src if src.exists() else Path('obmerka-v218.html');s=src.read_text().replace('const APP_VER="v218",','const APP_VER="v219",',1)
p=Path('tmp/project-v219-github.json');p=p if p.exists() else Path('data/project_kv109_v219.json');data=json.loads(p.read_text());lit=json.dumps(json.dumps(data,ensure_ascii=False,separators=(',',':')),ensure_ascii=False).replace('</','<\\/')
for key in ['PRELOAD_JSON','SAVED_JSON']:s,n=re.subn(r'^const '+key+r'=.*$',lambda m:'const '+key+'='+lit+';',s,flags=re.M);assert n==1
old='T=fitBox(op,W,H,{l:105,r:105,t:80,b:80})';assert old in s;s=s.replace(old,'T=fitBox(op,W,H,{l:280,r:280,t:80,b:80})')
old='kitLabels214(marks,W,H)';assert old in s;s=s.replace(old,'kitLabels214(marks,W,H,(()=>{const q=op.map(v=>W2S(T,v));return {l:Math.min(...q.map(v=>v[0])),r:Math.max(...q.map(v=>v[0])),t:Math.min(...q.map(v=>v[1])),b:Math.max(...q.map(v=>v[1]))};})())')
a='document.addEventListener("keydown", e=>{ if(V3.open&&e.key==="Escape") close3D(); });';s=s.replace(a,Path('tools/drawings219.js').read_text()+'\n'+a,1)
Path('Дизайн-проект кв. 109 — Шаумяна 14 (v219).html').write_text(s);Path('/private/tmp/v219-check.js').write_text(re.findall(r'<script[^>]*>([\s\S]*?)</script>',s)[-1])
