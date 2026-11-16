from pathlib import Path
import json,re
src=Path('Дизайн-проект кв. 109 — Шаумяна 14 (v203).html')
if not src.exists():src=Path('obmerka-v203.html')
s=src.read_text()
def sub(a,b):
 global s
 assert s.count(a)==1,(s.count(a),a[:90])
 s=s.replace(a,b,1)
sub('const APP_VER="v203", APP_DATE="14.11.2026";','const APP_VER="v204", APP_DATE="16.11.2026";')
input_path=Path('/Users/shoroh/Downloads/Кв_109_-_электрика_предложение_11112026_ (4).json')
if not input_path.exists():input_path=Path('data/project_kv109_v204.json')
p=json.loads(input_path.read_text())
lit=json.dumps(json.dumps(p,ensure_ascii=False,separators=(',',':')),ensure_ascii=False).replace('</','<\\/')
s,n=re.subn(r'^const PRELOAD_JSON=.*$',lambda m:'const PRELOAD_JSON='+lit+';',s,flags=re.M);assert n==1
# Room occupies the sheet; full descriptions remain in existing separate table.
sub('const CO=kind!=="light";','const CO=false;')
sub('const sep=rows.length>8,','const sep=rows.length>0,')
# No callout spiderweb; small local tags, no full descriptions.
sub('ov+=CO?kitPlanCallouts(items,W,PH,m,kind,AV):kitPlace(items,obst,W,PH);','ov+=items.map(o=>kitPill(o.sx+18,o.sy-18,o.tag,o.col||KIT_RED,11)).join("");')
# Tall rooms use the existing portrait sheet layout rather than shrink on landscape.
sub('const W=1300, op=outerPoints(r), xs=op.map(q=>q[0]), ys=op.map(q=>q[1]), bw=Math.max(1000,Math.max(...xs)-Math.min(...xs)), bh=Math.max(1000,Math.max(...ys)-Math.min(...ys));','const op=outerPoints(r), xs=op.map(q=>q[0]), ys=op.map(q=>q[1]), bw=Math.max(1000,Math.max(...xs)-Math.min(...xs)), bh=Math.max(1000,Math.max(...ys)-Math.min(...ys)), portrait204=bh>bw*1.25,W=portrait204?900:1300;')
sub('CO?480:420,CO?640:880','portrait204?900:420,portrait204?1500:880')
sub('<section class="sheetpg kit${extra?" kitx":""}">','<section class="sheetpg kit${portrait204?" kitp":""}${extra?" kitx":""}">')
# Real scaled spacing and outline on elevations.
sub('const sz=22*(S.symScale||0.78), gap=sz*1.06, off=(np-1)*gap/2;','const sz=c.posts?Math.max(5,54*s):22*(S.symScale||0.78), gap=c.posts?(+it.step||71)*s:sz*1.06, off=(np-1)*gap/2;\n      if(c.posts){const fw=(hor?postSpan(it):0)+82,fh=(!hor?postSpan(it):0)+82;o.push(`<rect data-frame204="${it.id}" x="${cx-fw*s/2}" y="${cy-fh*s/2}" width="${fw*s}" height="${fh*s}" rx="${3*s}" fill="none" stroke="${col}" stroke-width="1"/>`);if(np>1)o.push(tx(cx,cy+(hor?sz/2+24:off+35),`шаг ${mm(+it.step||71)} · оси ${mm(postSpan(it))} мм`,col,9));}')
sub('o.push(symSVG(ty,px,py,22,col,P,ii));','o.push(symSVG(ty,px,py,c.posts?54*s:22,col,P,ii));')
# Single common faceplate; individual mechanisms stay inside 54mm openings.
sub('const t=it.type, h=+it.h||c.h||0;\n  if(t==="switch")','const t=it.type, h=+it.h||c.h||0;\n  if(["socket","weak","switch"].includes(t)){const span=postSpan(it),vert=it.dir==="v",hw=(vert?82:span+82)/2,hh=(vert?span+82:82)/2;v3B(gp,-hw,hw,h-hh,h+hh,0,10,"plastic");}\n  if(t==="switch")')
s=s.replace('v3B(gp,X-41,X+41,Y-41,Y+41,0,10,"plastic");','')
s=s.replace('v3B(gp,x-41,x+41,y-41,y+41,0,10,"plastic");','')
sub('if(P.t==="so"){ v3B(gp,X-27,X+27,Y-27,Y+27,10,13,"grey"); continue; }','if(P.t==="so"){v3Cyl(gp,27,27,4,X,Y,12,"white",32,"z");v3Cyl(gp,3.6,3.6,3,X-9.5,Y,14,"black",12,"z");v3Cyl(gp,3.6,3.6,3,X+9.5,Y,14,"black",12,"z");continue;}')
sub('y=h+(vert?o:0);','y=h+(vert?-o:0);')
anchor='document.addEventListener("keydown", e=>{ if(V3.open&&e.key==="Escape") close3D(); });'
sub(anchor,Path('tools/electrical_v204.js').read_text()+'\nwindow.__frame204={join:frameJoin204,candidates:frameCandidates204};\n'+anchor)
sub('<section id="h12">','<section id="h12"><h3>Рамки и чертежи (v204)</h3><p>В карточке розетки или выключателя: «Общая рамка» — объединение соседних приборов на одной стене. Исходные приборы можно восстановить кнопкой разборки. Посты имеют общий центр, шаг и рамку в развёртке и 3D. На чертежах короткие номера, описания — в отдельной таблице.</p>')
Path('Дизайн-проект кв. 109 — Шаумяна 14 (v204).html').write_text(s)
print('v204 assembled; latest project embedded')
