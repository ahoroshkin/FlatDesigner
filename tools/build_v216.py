from pathlib import Path
import re,json
src=Path('Дизайн-проект кв. 109 — Шаумяна 14 (v215).html');src=src if src.exists() else Path('obmerka-v215.html');s=src.read_text()
p=Path('tmp/project-v216-github.json');p=p if p.exists() else Path('data/project_kv109_v216.json');data=json.loads(p.read_text())
s=s.replace('const APP_VER="v215",','const APP_VER="v216",',1)
lit=json.dumps(json.dumps(data,ensure_ascii=False,separators=(',',':')),ensure_ascii=False).replace('</','<\\/')
for key in ['PRELOAD_JSON','SAVED_JSON']:s,n=re.subn(r'^const '+key+r'=.*$',lambda m:'const '+key+'='+lit+';',s,flags=re.M);assert n==1
s=s.replace('const objRooms=p=>(p.rooms||[]).filter(r=>r.points&&r.points.length>2);','const objRooms=p=>orderedRooms216((p.rooms||[]).filter(r=>r.points&&r.points.length>2),p);',1)
s=s.replace('const visibleRooms196=(p=S.project)=>hideCommon196(p)?p.rooms.filter(r=>!commonRoom196(r)):p.rooms;','const visibleRooms196=(p=S.project)=>orderedRooms216(hideCommon196(p)?p.rooms.filter(r=>!commonRoom196(r)):p.rooms,p);',1)
s=s.replace(':root:not([data-theme="light"])',':root:not([data-theme="light"]):not([data-theme="white"])')
s=s.replace('const idx=S.project.rooms.findIndex(x=>x.id===S.roomId)+1;', 'const idx=orderedRooms216(S.project.rooms).findIndex(x=>x.id===S.roomId)+1;',1)
s=s.replace('const next=cur==="dark"?"light":(cur==="light"?null:"dark");','const next=cur==="light"?"white":cur==="white"?"dark":"light";',1)
a=s.index('  { const ccy=Math.max(oy+eh/2, oy+kpS+34)');b=s.index('  // таблица',a);s=s[:a]+s[b:]
needle="${v.svg}<footer><p>Вид из помещения."
assert needle in s
s=s.replace(needle,'<div class="elevKey216"><svg viewBox="0 0 100 100">${miniWall215(W,k)}</svg><span>Стена ${m.n}<br>Выделена красным на схеме помещения</span></div>${v.svg}<footer><p>Вид из помещения.',1)
anchor='document.addEventListener("keydown", e=>{ if(V3.open&&e.key==="Escape") close3D(); });'
s=s.replace(anchor,Path('tools/layout216.js').read_text()+'\n'+anchor,1)
Path('Дизайн-проект кв. 109 — Шаумяна 14 (v216).html').write_text(s);Path('/private/tmp/v216-check.js').write_text(re.findall(r'<script[^>]*>([\s\S]*?)</script>',s)[-1]);print('v216',data['updated'])
