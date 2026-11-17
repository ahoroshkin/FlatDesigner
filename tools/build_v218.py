from pathlib import Path
import re,json
src=Path('Дизайн-проект кв. 109 — Шаумяна 14 (v217).html');src=src if src.exists() else Path('obmerka-v217.html');s=src.read_text();p=Path('tmp/project-v218-github.json');p=p if p.exists() else Path('data/project_kv109_v218.json');data=json.loads(p.read_text())
s=s.replace('const APP_VER="v217",','const APP_VER="v218",',1)
lit=json.dumps(json.dumps(data,ensure_ascii=False,separators=(',',':')),ensure_ascii=False).replace('</','<\\/')
for key in ['PRELOAD_JSON','SAVED_JSON']:s,n=re.subn(r'^const '+key+r'=.*$',lambda m:'const '+key+'='+lit+';',s,flags=re.M);assert n==1
s=s.replace("'Диаметр не задан'","''")
a="it.wall!=null&&(+it.t||0)>segLen(r.points,it.wall)?'ПРОВЕРИТЬ: исходная привязка '+mm(+it.t)+' мм превышает длину участка стены '+mm(segLen(r.points,it.wall))+' мм':''";assert a in s;s=s.replace(a,"''",1)
s=s.replace('    if(lowK){ o.push(', '    o.push(frontCraft218(F.it,F.t1,F.t2,F.b,F.top,X,Y));\n    if(lowK){ o.push(',1)
s=s.replace('${q.hid||q.opn?" ⚠":""}', '')
# Short functional captions on elevations; stored labels are untouched.
s=s.replace('const dsc="";', 'const dsc="";',1)
s=s.replace('${esc(dsc)}</text>', '${dsc?" · "+esc(dsc):""}</text>',1)
anchor='document.addEventListener("keydown", e=>{ if(V3.open&&e.key==="Escape") close3D(); });';s=s.replace(anchor,Path('tools/drawings218.js').read_text()+'\n'+anchor,1)
Path('Дизайн-проект кв. 109 — Шаумяна 14 (v218).html').write_text(s);Path('/private/tmp/v218-check.js').write_text(re.findall(r'<script[^>]*>([\s\S]*?)</script>',s)[-1]);print('v218',data['updated'])
