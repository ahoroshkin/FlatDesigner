from pathlib import Path
import re,json
src=Path('Дизайн-проект кв. 109 — Шаумяна 14 (v221).html');src=src if src.exists() else Path('obmerka-v221.html');s=src.read_text().replace('const APP_VER="v221",','const APP_VER="v222",',1)
p=Path('tmp/project-v222-github.json');p=p if p.exists() else Path('data/project_kv109_v222.json');data=json.loads(p.read_text());lit=json.dumps(json.dumps(data,ensure_ascii=False,separators=(',',':')),ensure_ascii=False).replace('</','<\\/')
for key in ['PRELOAD_JSON','SAVED_JSON']:s,n=re.subn(r'^const '+key+r'=.*$',lambda m:'const '+key+'='+lit+';',s,flags=re.M);assert n==1
old='const short=curW==="baseboard"?"Плинтус":sub?';assert old in s;s=s.replace(old,'const short=on&&curW==="baseboard"?"Плинтус":sub?',1)
s=s.replace('if(i!=null&&bbCfg195(r).on){','if(r.id===S.roomId&&i!=null&&i<r.points.length&&bbCfg195(r).on){',1)
a='document.addEventListener("keydown", e=>{ if(V3.open&&e.key==="Escape") close3D(); });';assert a in s;s=s.replace(a,Path('tools/editors222.js').read_text()+'\n'+a,1)
Path('Дизайн-проект кв. 109 — Шаумяна 14 (v222).html').write_text(s);Path('/private/tmp/v222-check.js').write_text(re.findall(r'<script[^>]*>([\s\S]*?)</script>',s)[-1]);print('updated',data['updated'])
