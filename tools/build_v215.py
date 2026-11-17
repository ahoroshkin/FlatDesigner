from pathlib import Path
import re,json
p=Path('tmp/project-v215-github.json');p=p if p.exists() else Path('data/project_kv109_v215.json');data=json.loads(p.read_text());src=Path('Дизайн-проект кв. 109 — Шаумяна 14 (v213).html');src=src if src.exists() else Path('obmerka-v213.html');s=src.read_text()
s=s.replace('const APP_VER="v213",','const APP_VER="v215",',1)
lit=json.dumps(json.dumps(data,ensure_ascii=False,separators=(',',':')),ensure_ascii=False).replace('</','<\\/')
for key in ['PRELOAD_JSON','SAVED_JSON']:s,n=re.subn(r'^const '+key+r'=.*$',lambda m:'const '+key+'='+lit+';',s,flags=re.M);assert n==1
# Tables and plan share explicit installation points. Calculated furniture loads remain in circCalc.
a='  if(kind==="sock"&&L) L.pts.filter('
x=s.index(a);y=s.index('  return out; }',x);s=s[:x]+'  // v214: calculated appliance loads are not placed installation points.\n'+s[y:]
s=s.replace('serviceRoutes(S.project).map(x=>`<div class="btnrow"', 'serviceRoutes(S.project).filter(x=>!S.serviceFilter215||S.serviceFilter215.includes(x.type)).map(x=>`<div class="btnrow"',1)
# General slope editing also applies to sewer routes.
s=s.replace("r.type==='drain'","/^(drain|sewer)$/.test(r.type)")
s=s.replace('keyPlanSVG(W,k,0,0,100,Object.assign({},PRINT_PAL,{accent:KIT_RED}),false)','miniWall215(W,k)',1)
s=s.replace('translate(10 ${oy}) scale(${(kpS/100).toFixed(3)})','translate(${Wd-kpS-10} ${oy}) scale(${(kpS/100).toFixed(3)})',1)
s=s.replace('try{ wk=furnWall(W,it); }catch(e){} if(wk!==k) return;', 'try{ wk=furnWall(W,it); }catch(e){} if(wk!==k&&!furnTouches(W,it,k)) return;',1)
# Focus each elevation on the discipline being printed.
s=s.replace('["sock","light","plumb"].forEach(kind=>(TG[kind]||[]).forEach(o=>{ if(o.wk!==k) return;', '["sock","light","plumb"].filter(kind=>!S.kitKind215||(S.kitKind215==="plumb"?kind==="plumb":kind!=="plumb")).forEach(kind=>(TG[kind]||[]).forEach(o=>{ if(o.wk!==k) return;',1)
s=s.replace('if(!P.length) return "";\n  const kpS=', 'if(!P.length&&!(S.kitKind215==="plumb"&&(W.items||[]).some(it=>/^(basin|bath|inst|washcol|flowh)$/.test(it.type)&&(furnWall(W,it)===k||furnTouches(W,it,k))))) return "";\n  const kpS=',1)
# Mirror power must be an explicit socket/cable object, not an invisible auto-generated socket.
s=s.replace('const sk=SOCK_T[it.type];','const sk=/^(mirrcab|mirrfull)$/.test(it.type)?null:SOCK_T[it.type];',1)
s=s.replace('const H=free?(it.type==="pendant"?', 'const H=free?(/^(mirrcab|mirrfull)$/.test(it.type)?"низ "+mm(+it.mount||0):it.type==="pendant"?',1)
a='document.addEventListener("keydown", e=>{ if(V3.open&&e.key==="Escape") close3D(); });';assert a in s;s=s.replace(a,Path('tools/drawings215.js').read_text()+'\n'+Path('tools/workspaces215.js').read_text()+'\n'+a,1)
css='''<style>
@media print{#tour{display:none!important}}
@page plan214{size:A3 portrait;margin:10mm}@page schedule214{size:A4 portrait;margin:12mm}
#print .draft214{font-family:"Golos Text",Arial,sans-serif;color:#263c49;box-sizing:border-box}
#print .plan214{page:plan214}#print .schedule214{page:schedule214}
:root.pv-on #print .plan214{max-width:297mm}:root.pv-on #print .schedule214{max-width:210mm}
#print .dh214{display:flex;justify-content:space-between;border-bottom:2px solid #186b7e;padding:0 0 4mm;margin-bottom:3mm}
#print .dh214 h1{font-size:17pt;margin:2mm 0;line-height:1.15;color:#173948}
#print .dh214 small{font-size:8pt;letter-spacing:1px}#print .dh214 p{font-size:11pt;margin:0}#print .dh214>b{font-size:17pt;color:#186b7e}
#print .meta214{display:flex;justify-content:space-between;font-size:8pt;color:#69757c;gap:8mm}
#print .drawing214 svg{display:block;width:100%;height:auto;max-height:334mm;margin:3mm auto}
#print .draft214 footer{border-top:1px solid #b7c8cf;margin-top:3mm;padding-top:3mm;font-size:8pt;line-height:1.45;color:#56656e}
#print .draft214 footer p{margin:2mm 0}#print .draft214 table{width:100%;border-collapse:collapse;font-size:9pt;margin-top:6mm;table-layout:fixed}
#print .draft214 th{background:#eaf1f2;text-align:left;padding:2.5mm 2mm;border-bottom:1px solid #a0b6bd}
#print .draft214 td{padding:2.5mm 2mm;vertical-align:top;border-bottom:1px solid #d8e2e5;overflow-wrap:anywhere;line-height:1.35}
#print .draft214 th:nth-child(1){width:10%}#print .draft214 th:nth-child(2){width:22%}#print .draft214 th:nth-child(3){width:13%}#print .draft214 th:nth-child(4){width:23%}#print .tag214{font-weight:bold;color:#bd1833}
#print .draft214 tr{break-inside:avoid}
@page elevwide215{size:A4 landscape;margin:10mm}
#print .elev215{page:schedule214}#print .elevwide215{page:elevwide215}
#print .elev215 svg{display:block;width:100%;height:auto;max-height:215mm;margin:5mm auto}
#print .elevwide215 svg{max-height:115mm}
#print .route215 .drawing214 svg{max-height:285mm}
:root.pv-on #print .elevwide215{max-width:297mm}
</style>'''
s=s.replace(a, 'document.body.insertAdjacentHTML("beforeend",'+json.dumps(css)+');\n'+a,1)
Path('Дизайн-проект кв. 109 — Шаумяна 14 (v215).html').write_text(s)
Path('/private/tmp/v215-check.js').write_text(re.findall(r'<script[^>]*>([\s\S]*?)</script>',s)[-1]);print('v215 built')
