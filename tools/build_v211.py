from pathlib import Path
import re,json
src=Path('Дизайн-проект кв. 109 — Шаумяна 14 (v210).html')
if not src.exists():src=Path('obmerka-v210.html')
s=src.read_text()
def sub(a,b):
 global s
 assert s.count(a)==1,(s.count(a),a[:90]);s=s.replace(a,b,1)
sub('const APP_VER="v210",','const APP_VER="v211",')
pth=Path('tmp/project-v211-github.json')
if not pth.exists():pth=Path('data/project_kv109_v211.json')
p=json.loads(pth.read_text());lit=json.dumps(json.dumps(p,ensure_ascii=False,separators=(',',':')),ensure_ascii=False).replace('</','<\\/')
s,n=re.subn(r'^const PRELOAD_JSON=.*$',lambda m:'const PRELOAD_JSON='+lit+';',s,flags=re.M);assert n==1
s,n=re.subn(r'^const SAVED_JSON=.*$',lambda m:'const SAVED_JSON='+lit+';',s,flags=re.M);assert n==1
sub('function flatPlanSVG(p,W,H,P,opt){','function flatPlanSVG(p,W,H,P,opt){\n  const hide211=exportHide211(p);p=exportProject211(p);opt={...(opt||{}),...(hide211?{apartment196:p.rooms}:{})};')
sub('const p=S.project, box=$("#print");','const p=exportProject211(S.project), box=$("#print");')
sub('section.innerHTML=bbSchedule195(S.project);','section.innerHTML=bbSchedule195(exportProject211(S.project));')
sub("plinthSheets208(S.project).join('')", "plinthSheets208(exportProject211(S.project)).join('')")
sub(" let x=left,body='';const yf=top+Hc*scale;"," let x=ids.length===1?left+Math.max(0,(width-left-right-L*scale)/2):left,body='';const yf=top+Hc*scale;")
# Replace the old small panels, retaining a separate table of all source wall ties.
a=s.index('    // развёртки — единый масштаб, чтобы стены были сопоставимы;');b=s.index('      <h3>Привязки по стенам</h3>',a)
s=s[:a]+'''    parts.push(reportElevations211(r,stamp,pal));
    parts.push(`<section class="sheetpg">
      <h1>Развёртки стен: привязки — ${esc(r.name)}</h1>${stamp}
'''+s[b:]
# Tile elevations have the same large sheet layout; quantities stay in a separate table.
a=s.index('      const es2=elevScale(r,560,300);');b=s.index('        <h3>Зоны облицовки</h3>',a)
s=s[:a]+'''      tw.forEach(i=>parts.push(reportWall211(r,i,stamp,pal,'Раскладка плитки')));
      parts.push(`<section class="sheetpg"><h1>Раскладка плитки: ведомость — ${esc(r.name)}</h1>${stamp}
'''+s[b:]
sub('Скрывает подъезд на плане и в 3D, а также участки трасс вне квартиры на плане. Полная длина трасс и чертежи сохраняются.','Скрывает подъезд на экране, в 3D, общем PNG, PDF и отчётах. Участки трасс за пределами квартиры скрываются на планах. Данные проекта и полная длина трасс сохраняются.')
a=s.index('function keyPlanSVG(');b=s.index('/* какую стену задели',a);block=s[a:b];old='    const m=[(a[0]+b[0])/2,(a[1]+b[1])/2];';assert old in block;block=block.replace(old,'    if(P===PRINT_PAL&&!live&&i!==wall)continue;\n'+old);s=s[:a]+block+s[b:]
# Each SVG needs its own clip id in a multi-page HTML report.
sub('const serviceDisplay196=serviceSVG;','let apartmentClip211=0;\nconst serviceDisplay196=serviceSVG;')
sub('return `<defs><clipPath id="apartmentRoutes196">${polygons}</clipPath></defs><g clip-path="url(#apartmentRoutes196)">${svg}</g>`;', 'const clip211="apartmentRoutes196-"+(++apartmentClip211);return `<defs><clipPath id="${clip211}">${polygons}</clipPath></defs><g clip-path="url(#${clip211})">${svg}</g>`;')
sub('/* ---- справка ---- */\n.hlp{','''#print .report-key211{display:flex;justify-content:flex-end;margin:0 0 2mm}
#print .report-key211 svg{width:30mm;height:auto;display:block}
#print .report-elevation211 svg{max-height:180mm;object-fit:contain}
/* ---- справка ---- */
.hlp{''')
anchor='document.addEventListener("keydown", e=>{ if(V3.open&&e.key==="Escape") close3D(); });'
sub(anchor,Path('tools/report_v211.js').read_text()+'\n'+anchor)
sub('<section id="h12">','<section id="h12"><h3>Отчёт и скрытие подъезда (v211)</h3><p>Галочка «Показывать подъезд» действует на экран, 3D, общий PNG, PDF и состав отчёта, включая экспликацию. Данные помещений и полные длины трасс не удаляются. Обычные развёртки печатаются по одной стене на лист, с отдельной мини-схемой: выделена нужная стена, показан только её номер. Таблица привязок сохранена отдельно.</p>')
Path('Дизайн-проект кв. 109 — Шаумяна 14 (v211).html').write_text(s)
Path('/private/tmp/v211-syntax.js').write_text(re.findall(r'<script[^>]*>([\s\S]*?)</script>',s)[-1])
print('v211 assembled with latest GitHub project',p['id'],p['updated'])
