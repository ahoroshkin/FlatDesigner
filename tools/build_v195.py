from pathlib import Path
import re
source=Path('Дизайн-проект кв. 109 — Шаумяна 14 (v194).html')
if not source.exists(): source=Path('obmerka-v194.html')
s=source.read_text()
def sub(a,b):
 global s
 assert a in s,a[:120]
 s=s.replace(a,b,1)
sub('const APP_VER="v194", APP_DATE="22.10.2026";','const APP_VER="v195", APP_DATE="23.10.2026";')
sub('<div id="app">','<style>'+Path('tools/ui_finish_v195.css').read_text()+'</style>\n<div id="app">')
sub('const layerOn=c=>!S.layers||!layerFilterOn()||S.layers[layerOf(c)]!==false;','const layerOn=c=>S.printing195?S.outputLayers195?.[layerOf(c)]!==false:(!S.layers||!layerFilterOn()||S.layers[layerOf(c)]!==false);')
sub('const layerOnIt=(r,it)=>!S.layers||!layerFilterOn()||S.layers[layerOfIt(r,it)]!==false;','const layerOnIt=(r,it)=>S.printing195?S.outputLayers195?.[layerOfIt(r,it)]!==false:(!S.layers||!layerFilterOn()||S.layers[layerOfIt(r,it)]!==false);')
sub('function planSVG0(r,T,W,H,P,o){ return planSVGBase0(r,T,W,H,P,o)+((o&&o.routes===false)?"":serviceSVG(S.project,T,o,r)); }','function planSVG0(r,T,W,H,P,o){ return planSVGBase0(r,T,W,H,P,o)+((o&&o.only===\'ceiling\')||stageActive()?\'\':bbPlan195(r,T,P))+((o&&o.routes===false)?"":serviceSVG(S.project,T,o,r)); }')
# floor sheets use their own transform, so add along with pattern overlay.
sub('    ${over}\n    <text x="${W/2}" y="14"','    ${over}${bbPlan195(r,T,P)}\n    <text x="${W/2}" y="14"')
sub('const pw=Math.min(440,innerWidth*0.42);','const pw=Math.min(380,innerWidth*0.40);')
# Merge work groups into task-based categories while preserving every work action.
a=s.index('const WORK_GROUPS=[');b=s.index('const wgOf=',a)
s=s[:a]+'''const WORK_GROUPS=[
 {k:'plan',n:'Планировка',items:[['src','Исходный план'],['dem','Демонтаж'],['part','Перегородки'],['rooms','Помещения']]},
 {k:'engineer',n:'Инженерия',items:[['sock','Розетки'],['sw','Выключатели'],['panel','Щиток'],['wire','Провода'],['lite','Свет'],['plumb','Сантехника'],['water','Водоснабжение'],['rad','Радиаторы и климат']]},
 {k:'finish',n:'Отделка',items:[['screed','Пол · стяжка'],['hf','Пол · тёплый пол'],['cover','Пол · покрытия'],['baseboard','Пол · плинтус'],['plast','Стены · штукатурка'],['wallfin','Стены · чистовая отделка'],['obj','Обои и площади'],['ceilw','Потолки']]},
 {k:'furn',n:'Мебель',items:[['furn','Мебель']]},
 {k:'sum',n:'Итоги',items:[['ecost','Смета по этапам'],['ready','Готовность']]}
];
''' +s[b:]
sub('const short=sub?sub.replace','const short=curW==="baseboard"?"Плинтус":sub?sub.replace')
# Block assignment via placement and group actions too.
sub('function placeItem(w){\n  const r=useRoomAt(w); const c=byType[S.pending]; if(!c||!r) return;','function placeItem(w){\n  const r=useRoomAt(w); const c=byType[S.pending]; if(!c||!r) return; if(S.editLayers195?.[layerOf(c)]===false){hint("Правка слоя отключена");return;}')
sub('  const r=room(), c=byType[S.pending]; if(!c||!r||r.points.length<3) return;','  const r=room(), c=byType[S.pending]; if(!c||!r||r.points.length<3) return; if(S.editLayers195?.[layerOf(c)]===false){hint("Правка слоя отключена");return;}')
# Service routes obey the same view/print policy while retaining live editing handles.
sub("r.visible!==false&&types[r.type]&&Array.isArray(r.points)","r.visible!==false&&(S.printing195?S.outputLayers195:S.layers)?.[routeLayer195(r)]!==false&&types[r.type]&&Array.isArray(r.points)")
# shared src openings go through source hit; filter disabled layer before even starting drag
sub('function srcOpenHit(sp){','function srcOpenHitBase195(sp){')
# 3D reuse original wall assembly, omit legacy profile when new model is configured.
sub('PG=new Set(typeof pgWalls==="function"?pgWalls(src):[]), PGD=new Set(typeof pgDark==="function"?pgDark(src):[]);','PG=new Set(!src.baseboard&&typeof pgWalls==="function"?pgWalls(src):[]), PGD=new Set(!src.baseboard&&typeof pgDark==="function"?pgDark(src):[]);')
sub('    const stub=v3Mesh(v3Prism([inner(0),inner(L),oE,oS]','    bb3D195(grp,src,i,inner,nI,L);\n    const stub=v3Mesh(v3Prism([inner(0),inner(L),oE,oS]')
sub('function pgapSVG(r,T,P){','function pgapSVG(r,T,P){ if(r.baseboard) return "";')
# New model length is already accounted as generic skirting; avoid charging legacy shadow profile twice.
sub('const pgl=pgapLen(r), pgt=pgl+pgDarkLen(r);','const pgl=r.baseboard?0:pgapLen(r), pgt=r.baseboard?0:pgl+pgDarkLen(r);')
sub('w:9.6*pgapLen(r)/1000','w:(r.baseboard?.wpm??9.6)*pgapLen(r)/1000')
sub('    <p class="note" style="margin:-4px 0 8px;font-size:11.5px">Объект — телефон, крупно, карточки снизу. Офис — компьютер: карточка справа, план не закрывается, горячие клавиши.</p>','    <p class="note" style="margin:-4px 0 8px;font-size:11.5px">Объект — компактные замеры, проёмы, фото и заметки. Офис — проектирование, отделка, мебель и чертежи.</p>')
# Async autosave errors must not leave a false successful status.
sub('saveT=setTimeout(()=>{ putProject(JSON.parse(JSON.stringify(S.project))); setMeta("last",S.project.id); try{ syncSoon(); }catch(e){} },250);','saveT=setTimeout(async()=>{const p=JSON.parse(JSON.stringify(S.project));try{await putProject(p);await setMeta("last",p.id);syncSoon();}catch(e){S.localSaving195=false;S.localError195=true;saveStatus195();hint("Не удалось сохранить план. Скачайте копию в файл.",5000);} },250);')
extra=Path('tools/ui_finish_v195.js').read_text()+'''
function srcOpenHit(sp){if(S.editLayers195?.obmer===false)return null;return srcOpenHitBase195(sp);}
'''
anchor='document.addEventListener("keydown", e=>{ if(V3.open&&e.key==="Escape") close3D(); });'
sub(anchor,extra+'\n'+anchor)
sub('<h3>Сохранность помещений и правка трасс (v194)</h3>','<h3>Плинтусы и компактный интерфейс (v195)</h3><p>«Отделка → Пол · плинтус»: категории ПВХ, МДФ, полимер и скрытый монтаж; модели с размерами, свой каталог, участки, вычет дверей, подсветка и ведомость. «Объект» оставляет замеры, проёмы, фото и заметки. В «Слоях» видимость, правка и печать независимы. Статусы устройства, файла и GitHub различаются. Габарит сложного профиля в 3D условный.</p><h3>Сохранность помещений и правка трасс (v194)</h3>')
Path('Дизайн-проект кв. 109 — Шаумяна 14 (v195).html').write_text(s)
Path('/private/tmp/obm195check.js').write_text(re.findall(r'<script(?:\s[^>]*)?>([\s\S]*?)</script>',s)[-1])
print('v195 assembled')
