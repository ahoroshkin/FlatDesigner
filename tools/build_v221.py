from pathlib import Path
import re,json
src=Path('Дизайн-проект кв. 109 — Шаумяна 14 (v220).html');src=src if src.exists() else Path('obmerka-v220.html');s=src.read_text().replace('const APP_VER="v220",','const APP_VER="v221",',1)
p=Path('tmp/project-v221-github.json');p=p if p.exists() else Path('data/project_kv109_v221.json');data=json.loads(p.read_text());lit=json.dumps(json.dumps(data,ensure_ascii=False,separators=(',',':')),ensure_ascii=False).replace('</','<\\/')
for key in ['PRELOAD_JSON','SAVED_JSON']:s,n=re.subn(r'^const '+key+r'=.*$',lambda m:'const '+key+'='+lit+';',s,flags=re.M);assert n==1
old=Path('tools/drawings220.js').read_text();new=Path('tools/drawings221.js').read_text();assert old in s;s=s.replace(old,new,1)
s=s.replace('T=fitBox(op,W,H,{l:260,r:260,t:290,b:220})','T=fitBox(op,W,H,{l:240,r:240,t:200,b:150})')
s=s.replace('factor=Math.min(1,depth*T.s/24);','factor=1.15;')
s=s.replace('${kitSym(o,0,0,PRINT_PAL)}</g>','<circle data-halo221="1" r="11" fill="white"/>${kitSym(o,0,0,PRINT_PAL)}</g>')
s=s.replace("layer:new Set(['obmer','furn'])","objectDims197:false,layer:new Set(['obmer','furn'])")
s=s.replace('const marks=[],symbols=[];','const marks=[],symbols=[],glyphs221=[];')
old='const q=W2S(T,pos);symbols.push('
new="const q=W2S(T,pos),anchor221=[...q];let found221=false;for(const [dx,dy]of [[0,0],[0,24],[0,-24],[24,0],[-24,0],[24,24],[-24,24],[24,-24],[-24,-24],[0,48]]){const x=anchor221[0]+dx,y=anchor221[1]+dy;if(glyphs221.some(g=>Math.hypot(g[0]-x,g[1]-y)<23))continue;q[0]=x;q[1]=y;found221=true;break;}glyphs221.push([...q]);if(q[0]!==anchor221[0]||q[1]!==anchor221[1])symbols.push(`<path data-offset221=\"1\" d=\"M${anchor221} L${q}\" stroke=\"${o.col}\" stroke-width=\"1\"/><circle cx=\"${anchor221[0]}\" cy=\"${anchor221[1]}\" r=\"2.5\" fill=\"${o.col}\"/>`);symbols.push("
assert old in s;s=s.replace(old,new)
a='document.addEventListener("keydown", e=>{ if(V3.open&&e.key==="Escape") close3D(); });';s=s.replace(a,'''// Keep furniture dimensions independent of the editor settings in trade exports.
const sheetBase221=kitRoomSheet0;kitRoomSheet0=function(...args){const keep=S.furnDims;S.furnDims=false;try{return sheetBase221(...args);}finally{S.furnDims=keep;}};
'''+a,1)
Path('Дизайн-проект кв. 109 — Шаумяна 14 (v221).html').write_text(s);Path('/private/tmp/v221-check.js').write_text(re.findall(r'<script[^>]*>([\s\S]*?)</script>',s)[-1])
