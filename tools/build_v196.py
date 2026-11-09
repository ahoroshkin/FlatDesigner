from pathlib import Path
import re
source=Path('Дизайн-проект кв. 109 — Шаумяна 14 (v195).html')
if not source.exists(): source=Path('obmerka-v195.html')
s=source.read_text()
def sub(a,b):
 global s
 assert a in s,a[:100]
 s=s.replace(a,b,1)
sub('const APP_VER="v195", APP_DATE="23.10.2026";','const APP_VER="v196", APP_DATE="08.11.2026";')
sub('<div id="app">','<style>'+Path('tools/ui_ux_v196.css').read_text()+'</style>\n<div id="app">')
# Use the filtered model only in the live 2D renderer and view fitting.
sub('pts=netOf(S.project).nodes.map(nd=>[nd.x,nd.y]);','const vp=visiblePlan196(S.project); const fitNet=S.stage==="src"&&vp!==S.project&&srcOf(vp)?srcOf(vp).net:netOf(vp); pts=fitNet.nodes.map(nd=>[nd.x,nd.y]);')
sub('const o={labels:S.labels, roomDims:!!(S.dimAll||roomsAllOn())};','const vp=visiblePlan196(S.project), o={labels:S.labels, roomDims:!!(S.dimAll||roomsAllOn()), apartment196:vp!==S.project?vp.rooms:null};')
sub('stageSVG(S.project,S.view,w,h,P,S.stage,o):netPlanSVG(S.project,S.view,w,h,P,o)','stageSVG(vp,S.view,w,h,P,S.stage,o):netPlanSVG(vp,S.view,w,h,P,o)')
sub('const sg=segsOf(srcOf(S.project).net), TT=S.view;','const sg=segsOf(srcOf(vp).net), TT=S.view;')
sub('netPlanSVGBase0(p,T,W,H,P,o)+serviceSVG(p,T,o)','netPlanSVGBase0(p,T,W,H,P,o)+serviceSVG(o?.apartment196?S.project:p,T,o)')
sub('+ S.project.rooms.map(r=>{','+ visibleRooms196().map(r=>{')
sub('const list=p.rooms.filter(r=>r.points.length>2);','const list=visibleRooms196(p).filter(r=>r.points.length>2);')
sub('for(const rr of S.project.rooms){\n      if(rr===r','for(const rr of visibleRooms196()){\n      if(rr===r')
sub('const p=S.project, rooms=(p.rooms||[]).filter(x=>x.points&&x.points.length>2);','const p=S.project, rooms=visibleRooms196(p).filter(x=>x.points&&x.points.length>2);')
# Keep structural hit tests consistent with the live drawing.
sub('const p=S.project, T=S.view, R=20, w=S2W(T,sp);','const p=visiblePlan196(S.project), T=S.view, R=20, w=S2W(T,sp);')
sub('function stageHit(sp){ const p=S.project,', 'function stageHit(sp){ const p=visiblePlan196(S.project),')
sub('function srcHit(sp){ const p=S.project, src=srcOf(p);','function srcHit(sp){ const p=visiblePlan196(S.project), src=srcOf(p);')
sub('function srcOpenHitBase195(sp){ const p=S.project,','function srcOpenHitBase195(sp){ const p=visiblePlan196(S.project),')
# Apply the same visibility choice to the 3D scene, its bounds and room picker.
sub('? (S.project.rooms||[]).filter(r=>r.points&&r.points.length>2).map(r=>{ const b=bakeRoom', '? visibleRooms196().filter(r=>r.points&&r.points.length>2).map(r=>{ const b=bakeRoom')
sub(': flatRooms(S.project);\n  return V3.scope', ': flatRooms(S.project).filter(b=>!hideCommon196()||!commonRoom196(b.__src));\n  return V3.scope')
sub('const rs=(S.project.rooms||[]).filter(r=>r.points&&r.points.length>2);\n  sel.innerHTML=', 'const rs=visibleRooms196().filter(r=>r.points&&r.points.length>2);\n  sel.innerHTML=')
sub('if(T.scope==null||(T.scope!=="all"&&!(S.project.rooms||[]).some(x=>x.id===T.scope)))', 'if(!v3ScopeVisible196(T.scope))')
sub('const x=V.find(q=>q.id===v); if(!x) return; const T=V3;', 'const x=V.find(q=>q.id===v); if(!x) return; if(!v3ScopeVisible196(x.scope)){hint("Этот ракурс относится к скрытому помещению. Включите «Показывать подъезд».");return;} const T=V3;')
anchor='document.addEventListener("keydown", e=>{ if(V3.open&&e.key==="Escape") close3D(); });'
sub(anchor,Path('tools/entry_view_v196.js').read_text()+'\n'+Path('tools/ui_ux_v196.js').read_text()+'\n'+anchor)
Path('Дизайн-проект кв. 109 — Шаумяна 14 (v196).html').write_text(s)
Path('/private/tmp/obm196check.js').write_text(re.findall(r'<script(?:\s[^>]*)?>([\s\S]*?)</script>',s)[-1])
print('v196 assembled')
