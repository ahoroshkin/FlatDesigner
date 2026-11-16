from pathlib import Path
import json,re
s=Path('Дизайн-проект кв. 109 — Шаумяна 14 (v207).html').read_text()
def sub(a,b):
 global s
 assert s.count(a)==1,(s.count(a),a[:100])
 s=s.replace(a,b,1)
sub('const APP_VER="v207",','const APP_VER="v208",')
pth=Path('tmp/project-v208-ready.json')
if not pth.exists():pth=Path('data/project_kv109_v208.json')
p=json.loads(pth.read_text());lit=json.dumps(json.dumps(p,ensure_ascii=False,separators=(',',':')),ensure_ascii=False).replace('</','<\\/')
s,n=re.subn(r'^const PRELOAD_JSON=.*$',lambda m:'const PRELOAD_JSON='+lit+';',s,flags=re.M);assert n==1
sub('const pl=o.plinth?100:0,','const pl=o.plinth?toeHeight208():0,')
sub('if(pl) v3B(g,-hw+10,hw-10,0,pl,-hd,hd-60,"section");','if(pl) toeBoard208(g,w,d,pl);')
sub('rows.forEach(([a,b],ri)=>{','rows.forEach(([a,b],ri)=>{ a=Math.max(a,pl);if(b<=a)return;')
sub('x.it.wall===i && !archFilled(r,x.it)','x.it.wall===i && mountMode208(x.it)!=="furniture-plinth" && !archFilled(r,x.it)')
sub('o.wi=o.wk!=null&&W?W.items[idx.get(it)]:null;','o.wi=o.wk!=null&&W?W.items[idx.get(it)]:null;if(mountMode208(it)==="furniture-plinth"){o.wk=null;o.wi=null;o.wt=0;}')
sub('if(!c||isFree(c)||c.opening||it.wall!==i) return;','if(!c||isFree(c)||c.opening||it.wall!==i||mountMode208(it)==="furniture-plinth") return;')
sub('const gp=v3Frame(ip.pos, nI); grp.add(gp); v3With(v3Ovr(it,b),()=>v3WallItem(gp,it,c,nI));','const depth208=mountMode208(it)==="floor-plinth"?(+bbCfg195(src).t||15):0;const pos208=[ip.pos[0]+nI[0]*depth208,ip.pos[1]+nI[1]*depth208];const gp=v3Frame(pos208, nI); grp.add(gp); v3With(v3Ovr(it,b),()=>v3WallItem(gp,it,c,nI));')
sub('\n}\nfunction v3Build(){','''
  src.items.filter(it=>mountMode208(it)==='furniture-plinth').forEach(it=>{const pose=socketPose208(src,it),c=byType[it.type];if(!pose||!c||S.layers.elec===false)return;const gp=v3Frame(pose.pos,pose.nrm);gp.userData.plinthSocket208=it.id;v3With(v3Ovr(it,b),()=>v3WallItem(gp,it,c,pose.nrm));root.add(gp);v3Tag(gp,src,it);});
}
function v3Build(){''')
# Do not dimension a toe-kick face as if it lay on the structural wall.
sub('it.wall===k&&kitIn(it,kind)&&!isFree(byType[it.type]||{})','it.wall===k&&mountMode208(it)!=="furniture-plinth"&&kitIn(it,kind)&&!isFree(byType[it.type]||{})')
anchor='document.addEventListener("keydown", e=>{ if(V3.open&&e.key==="Escape") close3D(); });'
sub(anchor,Path('tools/plinth_v208.js').read_text()+'''\nwindow.__plinth208={mode:mountMode208,pose:socketPose208,cuts:kitchenCuts208,parts:rectParts208,issues:mountIssues208,detail:plinthDetail208,sheets:plinthSheets208,frame:frameSize208};\n'''+anchor)
sub('<section id="h12">','<section id="h12"><h3>Плинтус и розетки в цоколе (v208)</h3><p>Напольный плинтус автоматически исключается за нижними кухонными модулями и пеналами, включая его длину в смете. В свойствах розетки выберите поверхность: стена, мебельный цоколь или напольный плинтус. Для цоколя задайте мебель и отступ от его центра. Розетка перемещается вместе с мебелью, высота центра остаётся от пола. Лицевая сторона цоколя показана отдельным узлом в свойствах и чертежах. Положение исходной стены означает место подвода кабеля. Проверьте предупреждения о габаритах рамки; размер выреза уточняется по выбранному механизму. У К01/К02 проектная высота цоколя 120 мм, центр розетки 70 мм.</p>')
Path('Дизайн-проект кв. 109 — Шаумяна 14 (v208).html').write_text(s)
Path('/private/tmp/obmerka208-check.js').write_text(re.findall(r'<script(?:\\s[^>]*)?>([\\s\\S]*?)</script>',s)[-1]) if False else None
print('v208 assembled')
