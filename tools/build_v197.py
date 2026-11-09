from pathlib import Path
import re
from size_display_v197 import patch_dimensions

local=Path('Дизайн-проект кв. 109 — Шаумяна 14 (v196).html')
source=local if local.exists() else Path('obmerka-v196.html')
s=source.read_text()

def sub(a,b):
    global s
    assert s.count(a)==1, a[:100]
    s=s.replace(a,b,1)

sub('const APP_VER="v196", APP_DATE="08.11.2026";','const APP_VER="v197", APP_DATE="09.11.2026";')
sub('<div id="app">','''<style>
#fileMark,[data-storage197]{display:flex;gap:4px 10px;flex-wrap:wrap}
#fileMark .filemark,[data-storage197] .filemark{white-space:nowrap}
.filemark.stale{color:#985100;font-weight:600}
:root[data-theme="dark"] .filemark.stale{color:#ffcf82}
@media(max-width:560px){#fileMark{display:none}}
</style>
<div id="app">''')

# Keep other live overlays off on the common plan, but render the selected light handles.
sub('apartment196:vp!==S.project?vp.rooms:null','apartment196:vp!==S.project?vp.rooms:null, arrayEdit197:lightPlan196()')
sub('live:false, routes:false, labels:o.labels, ties:false, layer:o.layer,','live:false, arrayEdit197:cur&&o.arrayEdit197, routes:false, labels:o.labels, ties:false, layer:o.layer,')
sub('if(c.array && isArr(it) && isSel && o.live!==false){','if(c.array && isArr(it) && isSel && (o.live!==false||o.arrayEdit197&&LIGHT_T.has(it.type)) && !S.ro && !window.OBM_RO && layerEditable195(r,it)){')
sub('const knob=(q,d)=>q?`<circle cx="${q[0].toFixed(1)}"','const knob=(q,d,key)=>q?`<circle data-array-handle="${key}" cx="${q[0].toFixed(1)}"')
sub('knob(H.rot,"⟳")+knob(H.sx,"↔")+knob(H.sy,"↕")+knob(H.mv,"+")','knob(H.rot,"⟳","rot")+knob(H.sx,"↔","sx")+knob(H.sy,"↕","sy")+knob(H.mv,"+","mv")')
sub('const r=room(); if(!r) return null;\n  const only=planeMode();','const r=room(); if(!r) return null;\n  const handle=arrayHandleHit197(r,sp); if(handle)return handle;\n  const only=planeMode();')

# Keep the selected grid visible during and after rotation or changing its step.
sub('S.sel=hit; drag={hit, start:downPt}; render();\n    }\n    else if(S.vmode==="floor"', 'S.sel=/^arr(rot|sx|sy)$/.test(hit.kind)?{kind:"item",i:hit.i}:hit; drag={hit, start:downPt}; render();\n    }\n    else if(S.vmode==="floor"')
sub('if(c.array && isArr(it)){\n      if(isCur', 'if(c.array && isArr(it)){\n      if(!layerEditable195(r,it))continue;\n      if(isCur')

# Save a version captured before asynchronous writing, not the later live value.
sub('S.project.updated=Date.now(); S.project.ver=', 'S.project.updated=Math.max(Date.now(),(+S.project.updated||0)+1); S.project.ver=')
sub('save();\n  const html=buildSavedHTML(p), name=fileName(p);\n  const done=async(msg)=>{ FS_AT[p.id]=+p.updated||Date.now(); await setMeta("fs:"+p.id,FS_AT[p.id]); updateSavedMark(); hint(msg,3500); };',
'''const version=+p.updated, html=buildSavedHTML(p), name=fileName(p);
  const done=async(msg,kind)=>{ await recordFile197(p.id,version,kind); updateSavedMark(); hint(msg,3500); };''')
sub('await done(`Сохранено в файл «${fh.name}»`);','await done(`Сохранено в файл «${fh.name}»`,"written");')
sub('await done(`Файл скачан в «Загрузки»: ${name}`);','await done(`Начато скачивание HTML-копии: ${name}`,"download");')
sub('await setMeta("fs:"+sv.id, +sv.updated||0);','await recordFile197(sv.id,+sv.updated||0,"written");')
a=s.index('function updateSavedMark(){')
b=s.index('async function saveToFile(){',a)
s=s[:a]+'''function updateSavedMark(){ if(S.project)loadFile197(S.project.id); }
'''+s[b:]
a=s.index('function saveStatus195(){')
b=s.index('const updateSavedMarkBase195=',a)
s=s[:a]+'''function saveStatus195(){saveStatus197();}
'''+s[b:]
sub('<b>Обмерка ${APP_VER}</b><p>Обновление','<b>Обмерка ${APP_VER}</b><div data-storage197></div><p>Обновление')
sub('sheetBase196();compact196();','sheetBase196();compact196();saveStatus195();')
# A browser save only succeeds after its IndexedDB transaction commits.
sub('async function idb(store,mode,fn){','async function idb(store,mode,fn,strict=false){')
sub('if(rq) rq.onsuccess=()=>res(rq.result); else tx.oncomplete=()=>res(true);','''if(strict){ tx.onabort=()=>rej(tx.error||Error("Запись в браузер отменена"));tx.oncomplete=()=>res(rq?rq.result:true); }
    else if(rq) rq.onsuccess=()=>res(rq.result); else tx.oncomplete=()=>res(true);''')
sub('}).catch(e=>{console.warn(e);return null;});','}).catch(e=>{if(strict)throw e;console.warn(e);return null;});')
sub('await idb("projects","readwrite",s=>s.put(p));','await idb("projects","readwrite",s=>s.put(p),true);')
anchor='document.addEventListener("keydown", e=>{ if(V3.open&&e.key==="Escape") close3D(); });'
sub(anchor,Path('tools/ui_finish_v197.js').read_text()+'\n'+anchor)
patch_dimensions(sub)
sub('function itemUI(r){\n  const it=r.items[S.sel.i], c=byType[it.type];\n  const ip=itemPos(r,it);\n  let f="";', 'function itemUI(r){\n  const it=r.items[S.sel.i], c=byType[it.type];\n  const ip=itemPos(r,it);\n  let f=lightControlCard197(r);')
sub('  el.innerHTML = cmFix(body);','  if(vp)body+=lightControlOverlay197(vp,S.view,P);\n  el.innerHTML = cmFix(body);')
sub('<div id="app">','<style>.light-control197{border:1px solid var(--accent);border-radius:9px;padding:9px 12px;margin:0 0 10px;font-size:13px}.light-control197 b{color:var(--accent)}.light-control197 ul{margin:5px 0 0;padding-left:18px}</style>\n<div id="app">')
sub(anchor,Path('tools/light_switch_v197.js').read_text()+'\n'+anchor)
Path('Дизайн-проект кв. 109 — Шаумяна 14 (v197).html').write_text(s)
Path('/private/tmp/obm197check.js').write_text(re.findall(r'<script(?:\s[^>]*)?>([\s\S]*?)</script>',s)[-1])
print('v197 assembled')
