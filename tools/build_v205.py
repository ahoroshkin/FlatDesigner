from pathlib import Path
import re
src=Path('Дизайн-проект кв. 109 — Шаумяна 14 (v204).html')
if not src.exists():src=Path('obmerka-v204.html')
s=src.read_text()
def sub(a,b):
 global s
 assert s.count(a)==1,(s.count(a),a[:100])
 s=s.replace(a,b,1)
sub('const APP_VER="v204", APP_DATE="16.11.2026";','const APP_VER="v205", APP_DATE="16.11.2026";')
sub('function roomSides(r){','function roomSides(r,dimension205){')
sub('return Math.abs(a[0]*b[1]-a[1]*b[0])<0.009 && (a[0]*b[0]+a[1]*b[1])>0;','return (!dimension205||wallOpen(r,i)===wallOpen(r,j)) && Math.abs(a[0]*b[1]-a[1]*b[0])<(dimension205?Math.sin(Math.PI/180):0.009) && (a[0]*b[0]+a[1]*b[1])>0;')
sub('  let s0=0; for(let i=0;i<n;i++){ if(!col((i-1+n)%n,i)){ s0=i; break; } }','''  // Drawing-only tolerance: at most 1 degree and 8 mm deviation from the
  // complete chord. All intermediate vertices are checked to prevent drift.
  const fits205=edges=>{const A=P[edges[0]],B=P[(edges[edges.length-1]+1)%n],dx=B[0]-A[0],dy=B[1]-A[1],L=Math.hypot(dx,dy);if(L<1)return false;return edges.every(i=>Math.abs((P[i][0]-A[0])*dy-(P[i][1]-A[1])*dx)/L<=8);};
  let s0=0; for(let i=0;i<n;i++){ if(!col((i-1+n)%n,i)){ s0=i; break; } }''')
sub('if(cur && col(cur.edges[cur.edges.length-1],i)) cur.edges.push(i);','if(cur && col(cur.edges[cur.edges.length-1],i) && (!dimension205||(col(cur.edges[0],i)&&fits205(cur.edges.concat(i))))) cur.edges.push(i);')
sub('const out=[], sides=roomSides(r), O=14*DSC;','const out=[], sides=roomSides(r,true), O=14*DSC;')
sub('const sd0=roomSides(r); stepRuns(r,sd0)','const sd0=roomSides(r,true); stepRuns(r,sd0)')
# The standalone/printed plan has an independent outer-dimension loop.
a=s.index('  } else if(n>2 && o.dims!==false){',s.index('// размерные линии стен'))
b=s.index('\n  if(n>2 && o.dims!==false && !(o.thickness===false',a)
block=s[a:b]
block=block.replace('for(let i=0;i<n;i++){\n      const L=segLen(r.points,i);', 'for(const sd205 of roomSides(r,true)){\n      const i=sd205.a,L=sd205.L;')
old='(r.items||[]).filter(it=>{ const c=byType[it.type]; return c&&c.opening&&it.wall===i&&(+it.w||0)>0; }).sort((p1,p2)=>(+p1.t||0)-(+p2.t||0))'
assert old in block
block=block.replace(old,'sideOpenings(r,sd205).filter(x=>x.w>0).map(x=>Object.assign({},x.it,{t:x.s,w:x.w})).sort((p1,p2)=>(+p1.t||0)-(+p2.t||0))')
block=block.replace('const a=W2S(T,r.points[i]), b=W2S(T,r.points[(i+1)%n]);','const a=W2S(T,sd205.A), b=W2S(T,sd205.B);')
block=block.replace('S.sel.i===i;','sd205.edges.includes(S.sel.i);')
block=block.replace('const d=segDir(r.points,i);','const d=sd205.u;')
block=block.replace('dd=segDir(r.points,i), A0=r.points[i]','dd=sd205.u, A0=sd205.A')
block=block.replace('dimOut.push(`<text x="${mx.toFixed(1)}"','dimOut.push(`<text data-dim-total205="${Math.round(L)}" x="${mx.toFixed(1)}"')
s=s[:a]+block+s[b:]
sub('<section id="h12">','<section id="h12"><h3>Размеры прямых стен (v205)</h3><p>На плане и чертежах почти прямые части стены объединены одним общим размером от угла до угла. Допуск только для отрисовки: до 1° и 8 мм отклонения всей цепочки. Реальные углы, уступы и границы открытых стен не объединяются. Геометрия проекта, проёмы, приборы и расчёт площадей не изменяются.</p>')
anchor='document.addEventListener("keydown", e=>{ if(V3.open&&e.key==="Escape") close3D(); });'
sub(anchor,'window.__dims205={sides:r=>roomSides(r,true),svg:roomInnerDims};\n'+anchor)
Path('Дизайн-проект кв. 109 — Шаумяна 14 (v205).html').write_text(s)
Path('/private/tmp/obmerka205-check.js').write_text(re.findall(r'<script(?:\s[^>]*)?>([\s\S]*?)</script>',s)[-1])
print('v205 assembled')
