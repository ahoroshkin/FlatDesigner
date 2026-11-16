from pathlib import Path
import re
src=Path('Дизайн-проект кв. 109 — Шаумяна 14 (v209).html')
if not src.exists():src=Path('obmerka-v209.html')
s=src.read_text()
def sub(a,b):
 global s
 assert s.count(a)==1,(s.count(a),a[:100]);s=s.replace(a,b,1)
sub('const APP_VER="v209",','const APP_VER="v210",')
# ZF controls schematic annotations and handles; object/world geometry still uses T.s.
sub('function zoomFactor(T){ const r=(T&&T.s?T.s:S_REF)/S_REF; const v=r<2.1?r:2.1+Math.sqrt(Math.max(0,r-2.1))*1.15; return clamp(v,0.72,4.5); }','function zoomFactor(T){ const r=Math.max(.001,(T&&T.s?T.s:S_REF)/S_REF);return clamp(1+.12*Math.log2(r),.8,1.35); }')
sub('return clamp(v,0.8,4.5);','return clamp(1+.12*Math.log2(Math.max(.001,q)),.8,1.35);')
sub('const fs=(bold===2?12.5:bold?13:11)*ZF*DSC,','const fs=(bold===2?12.5:bold?13:11)*ZF*TS*DSC,')
a=s.index('function dimLineSVG(');b=s.index('function lineX(',a);s=s[:a]+s[a:b].replace('<text x=', '<text data-dim-scale210="1" x=')+s[b:]
# One source of point positions for both drawing and hit testing, including old free sockets.
anchor='function wallPtHit(r,sp,only,skip){'
helper='''function pointPlan210(r,it,T,z){const ip=itemPos(r,it),base=W2S(T,ip.pos),Z=z==null?zoomFactor(T):z,ZS=Math.min(Z,2),off=(S.symbols?11:9)*Z,c=byType[it.type]||{},np=c.posts?posts(it):1,hor=it.dir!=='v',count=np>1&&hor&&!ip.free?np:1,psz=15*(S.symScale||.78)*ZS,step=psz*1.04;return {ip,base,cx:base[0]+ip.nrm[0]*off,cy:base[1]+ip.nrm[1]*off,count,step,points:Array.from({length:count},(_,q)=>{const k=(q-(count-1)/2)*step;return [base[0]+ip.nrm[0]*off+ip.dir[0]*k,base[1]+ip.nrm[1]*off+ip.dir[1]*k];}),radius:Math.max(13,15*ZS/2+5)};}
function attachWall210(r,it,wall){const ip=itemPos(r,it),pos=ip.pos.slice(),L=segLen(r.points,wall),a=r.points[wall],u=segDir(r.points,wall),wasFree=!!it.free||it.wall==null||mountMode208(it)==='furniture-plinth';it.wall=wall;it.wid=r.wids?.[wall];if(wasFree)it.t=clamp((pos[0]-a[0])*u[0]+(pos[1]-a[1])*u[1],0,L);delete it.free;delete it.x;delete it.y;delete it.designFurnitureId;delete it.plinthHost208;delete it.plinthU208;if(mountMode208(it)==='furniture-plinth')it.install208='wall';}
function nearestPointWall210(r,it){const pos=itemPos(r,it).pos;let wi=0,best=Infinity;r.points.forEach((a,i)=>{if(wallOpen(r,i))return;const q=projSeg(pos,a,r.points[(i+1)%r.points.length]);if(q.dist<best){best=q.dist;wi=i;}});return wi;}
'''
sub(anchor,helper+anchor)
sub('const cx=pos[0]+nx*(S.symbols?11:9)*ZF, cy=pos[1]+ny*(S.symbols?11:9)*ZF;','const point210=pointPlan210(r,it,T,ZF),cx=point210.cx,cy=point210.cy;')
sub('if(!c||c.opening||c.wide||isFree(c)||it.wall==null) continue;','if(!c||c.opening||c.wide||isFree(c)) continue;')
a=s.index('function wallPtHit(r,sp,only,skip){');b=s.index('function hitItemsIn0(',a);block=s[a:b]
a0=block.index('    const ip=itemPos');b0=block.index('    const lo=',a0)
block=block[:a0]+'''    const G=pointPlan210(r,it,T,Z),ip=G.ip,base=G.base,nx=ip.nrm[0],ny=ip.nrm[1],cx=G.cx,cy=G.cy;
    const P=G.points.map(q=>[q[0],q[1],G.radius]);
'''+block[b0:];s=s[:a]+block+s[b:]
sub('const p=(c.opening||c.wide||ip.free)?base:[base[0]+ip.nrm[0]*9, base[1]+ip.nrm[1]*9];','const G210=pointPlan210(r,it,T);const p=(c.opening||c.wide)?base:[G210.cx,G210.cy];')
sub('if(id==="f_wall"){ it.wall=+e.target.value; }','if(id==="f_wall"){ if(!c.opening&&!c.wide&&!isFree(c))attachWall210(r,it,+e.target.value);else it.wall=+e.target.value; }')
sub('<select id="f_wall">${r.points.map','<select id="f_wall">${it.wall==null?\'<option value="" selected disabled>Выберите стену</option>\':\'\'}${r.points.map')
sub("else it[key]=key==='plinthU208'?+e.target.value:e.target.value;save();render();renderSheet();", "else if(key==='install208'&&['wall','floor-plinth'].includes(e.target.value)){const wi=it.wall!=null&&it.wall<r.points.length?it.wall:nearestPointWall210(r,it);attachWall210(r,it,wi);it.install208=e.target.value;}else it[key]=key==='plinthU208'?+e.target.value:e.target.value;save();render();renderSheet();")
sub('Приблизить — щипок или колесо. Размеры и подписи растут вместе с планом.','Приблизить — щипок или колесо. Геометрия увеличивается, а рост размеров и условных подписей ограничен для читаемости.')
sub('<section id="h12">','<section id="h12"><h3>Масштаб и выбор точек (v210)</h3><p>Рост размеров, условных значков и подписей при зуме ограничен. Размеры плана учитывают существующий ползунок размера подписей. Геометрия мебели, оборудования и монтажных рамок сохраняет реальный масштаб. Значок свободной розетки и область нажатия используют общие координаты. При выборе стены или поверхности «На стене» снимается свободное размещение и привязка к цоколю; высота и электрические связи сохраняются. Автоматически добавляемых розеток нет.</p>')
sub('window.__plinth208={','window.__zoom210={point:pointPlan210,attach:attachWall210,zoom:zoomFactor,nearest:nearestPointWall210};\nwindow.__plinth208={')
Path('Дизайн-проект кв. 109 — Шаумяна 14 (v210).html').write_text(s)
print('v210 assembled; project unchanged')
