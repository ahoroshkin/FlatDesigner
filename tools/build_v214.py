from pathlib import Path
import re,json
p=Path('tmp/project-v214-github.json');data=json.loads(p.read_text());s=Path('Дизайн-проект кв. 109 — Шаумяна 14 (v213).html').read_text()
s=s.replace('const APP_VER="v213",','const APP_VER="v214",',1)
lit=json.dumps(json.dumps(data,ensure_ascii=False,separators=(',',':')),ensure_ascii=False).replace('</','<\\/')
for key in ['PRELOAD_JSON','SAVED_JSON']:s,n=re.subn(r'^const '+key+r'=.*$',lambda m:'const '+key+'='+lit+';',s,flags=re.M);assert n==1
# Tables and plan share explicit installation points. Calculated furniture loads remain in circCalc.
a='  if(kind==="sock"&&L) L.pts.filter('
x=s.index(a);y=s.index('  return out; }',x);s=s[:x]+'  // v214: calculated appliance loads are not placed installation points.\n'+s[y:]
# Mirror power must be an explicit socket/cable object, not an invisible auto-generated socket.
s=s.replace('const sk=SOCK_T[it.type];','const sk=/^(mirrcab|mirrfull)$/.test(it.type)?null:SOCK_T[it.type];',1)
s=s.replace('const H=free?(it.type==="pendant"?', 'const H=free?(/^(mirrcab|mirrfull)$/.test(it.type)?"низ "+mm(+it.mount||0):it.type==="pendant"?',1)
a='document.addEventListener("keydown", e=>{ if(V3.open&&e.key==="Escape") close3D(); });';assert a in s;s=s.replace(a,Path('tools/drawings214.js').read_text()+'\n'+a,1)
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
</style>'''
s=s.replace(a, 'document.body.insertAdjacentHTML("beforeend",'+json.dumps(css)+');\n'+a,1)
Path('Дизайн-проект кв. 109 — Шаумяна 14 (v214).html').write_text(s)
Path('/private/tmp/v214-check.js').write_text(re.findall(r'<script[^>]*>([\s\S]*?)</script>',s)[-1]);print('v214 draft built')
