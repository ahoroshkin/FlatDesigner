from pathlib import Path
import json,re
src=Path('Дизайн-проект кв. 109 — Шаумяна 14 (v212).html')
if not src.exists():src=Path('obmerka-v212.html')
s=src.read_text()
def sub(a,b):
 global s
 assert s.count(a)==1,(s.count(a),a[:100]);s=s.replace(a,b,1)
sub('const APP_VER="v212",','const APP_VER="v213",')
pth=Path('tmp/project-v213-latest.json')
if not pth.exists():pth=Path('data/project_kv109_v213.json')
p=json.loads(pth.read_text());lit=json.dumps(json.dumps(p,ensure_ascii=False,separators=(',',':')),ensure_ascii=False).replace('</','<\\/')
for key in ['PRELOAD_JSON','SAVED_JSON']:
 s,n=re.subn(r'^const '+key+r'=.*$',lambda m:'const '+key+'='+lit+';',s,flags=re.M);assert n==1
sub('y=clamp(h*.35,100,800),z=d/2','y=Math.min(45,h*.15),z=d/2')
sub('в нижней части зеркала','снизу по центру зеркала')
sub('const n=Math.max(2,Math.min(6,+it.np||2)), pw=w/n, fill=({clear:"glassC",matte:"glassM",fluted:"glassF",mirror:"mirror"})[it.pfill||"clear"]||"glassC";','const n=Math.max(2,Math.min(6,+it.np||2)), pw=w/n;')
sub('const m=B(x0+pf,x1-pf,14+pf,h-42-pf,z-4,z+4,fill); if(m&&fill!=="mirror") m.castShadow=false;', 'const fill=slpMaterial213(it,k),m=B(x0+pf,x1-pf,14+pf,h-42-pf,z-4,z+4,fill);if(m){m.userData.leaf213=k;m.userData.fill213=slpFill213(it,k);if(fill!=="mirror")m.castShadow=false;}')
sub('const inner=gArc+`<path','const inner=(it.type==="slpart"?slpPlan213(it,w,d,s):"")+gArc+`<path')
sub('<span>Заполнение</span><select id="f_pfill">','<span>Заполнение всех створок</span><select id="f_pfill">')
sub('[["clear","стекло прозрачное"],["matte","стекло матовое"],["fluted","стекло рифлёное"],["mirror","зеркало"]].map','[["clear","стекло прозрачное"],["matte","стекло матовое"],["fluted","стекло рифлёное"],["mirror","зеркало"],["solid","глухая панель"]].map')
sub('if(id==="f_pfill") it.pfill=e.target.value;','if(id==="f_pfill"){it.pfill=e.target.value;delete it.pfillLeaves213;}')
sub('const T=V3; T.renderer.render(T.scene,T.camera);','const T=V3; reflectionFlush213();')
sub('T.renderer.render(T.scene,T.camera); T.renderer.domElement.toBlob','reflectionFlush213(); T.renderer.domElement.toBlob')
sub('const m=v3Mesh(v3Prism(quad,y0,y1,e=>e===0?1:3), [top?sec:wmi, wmi, wmi, wout]); m.userData.pick={kind:"wall", rid:src.id, wi:i}; grp.add(m);',
'const fs=[\'top:\'+t0+\':\'+t1+\':\'+y1,\'inner\',\'bottom:\'+t0+\':\'+t1+\':\'+y0,\'outer\',\'end:\'+t1+\':\'+y0+\':\'+y1,\'end:\'+t0+\':\'+y0+\':\'+y1];const ms=[top?sec:wout,wmi,wout,wout,wout,wout].map((m,j)=>j===1?m:wallFaceMat213(src,i,fs[j],m));const m=v3Mesh(v3Prism(quad,y0,y1,e=>[1,4,3,5][e]),ms);m.userData.pick={kind:"wall",rid:src.id,wi:i};m.userData.faces213=fs;grp.add(m);')
sub('V3P.pk=Object.assign({},pk,{edges:W.__edges[k].slice(), lab:W.wlab[k]});','V3P.pk=Object.assign({},pk,{edges:(!pk.face213||pk.face213==="inner")?W.__edges[k].slice():[pk.wi], lab:W.wlab[k]});')
sub('const stub=v3Mesh(v3Prism([inner(0),inner(L),oE,oS],0,Math.min(160,Hc),e=>e===0?1:3), [sec, wmi, wmi, wout], false); stub.userData.pick={kind:"wall", rid:src.id, wi:i};', 'const sf=["top:0:"+L+":"+Math.min(160,Hc),"inner","bottom:0:"+L+":0","outer","end:"+L+":0:"+Hc,"end:0:0:"+Hc];const stub=v3Mesh(v3Prism([inner(0),inner(L),oE,oS],0,Math.min(160,Hc),e=>[1,4,3,5][e]),[sec,wmi,wout,wout,wout,wout].map((m,j)=>j===1?m:wallFaceMat213(src,i,sf[j],m)),false);stub.userData.pick={kind:"wall",rid:src.id,wi:i};stub.userData.faces213=sf;')
anchor='document.addEventListener("keydown", e=>{ if(V3.open&&e.key==="Escape") close3D(); });'
sub(anchor,'function installReflector213(){if(THREE.Reflector)return;\n'+Path('tools/reflector_r128.js').read_text()+'\n}\n'+Path('tools/partition_v213.js').read_text()+'\n'+Path('tools/reflections_v213.js').read_text()+'\n'+Path('tools/wall_faces213.js').read_text()+'\n'+anchor)
sub('<section id="h12">','<section id="h12"><h3>Створки и зеркала (v213)</h3><p>У раздвижной перегородки материал каждой створки выбирается отдельно: прозрачное, матовое, рифлёное стекло, зеркало или глухая панель. Номера видны на плане. Общее заполнение применяется сразу ко всем; отдельные варианты сохраняются при изменении числа створок. Материалы показаны на плане, развёртке и в 3D. Зеркальные поверхности отражают интерьер; обновления отражений ограничены для плавной работы. Встроенная кнопка подсветки находится снизу по центру зеркала.</p>')
Path('Дизайн-проект кв. 109 — Шаумяна 14 (v213).html').write_text(s)
Path('/private/tmp/v213-syntax.js').write_text(re.findall(r'<script[^>]*>([\s\S]*?)</script>',s)[-1]);print('v213 assembled',p['id'],p['updated'])
