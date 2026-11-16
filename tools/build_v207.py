from pathlib import Path
import json,re
src=Path('Дизайн-проект кв. 109 — Шаумяна 14 (v206).html')
if not src.exists():src=Path('obmerka-v206.html')
s=src.read_text()
def sub(a,b):
 global s
 assert s.count(a)==1,(s.count(a),a[:90])
 s=s.replace(a,b,1)
sub('const APP_VER="v206", APP_DATE="16.11.2026";','const APP_VER="v207", APP_DATE="17.11.2026";')
input_path=Path('tmp/project-v207-restored.json')
if not input_path.exists():input_path=Path('data/project_kv109_v207.json')
p=json.loads(input_path.read_text());lit=json.dumps(json.dumps(p,ensure_ascii=False,separators=(',',':')),ensure_ascii=False).replace('</','<\\/')
s,n=re.subn(r'^const PRELOAD_JSON=.*$',lambda m:'const PRELOAD_JSON='+lit+';',s,flags=re.M);assert n==1
# Eliminate mixed dimension lists and prevent unselected furniture handles obscuring labels.
a=s.index('function elevPanel(');b=s.index('/* ---- раскладка напольного покрытия',a);block=s[a:b]
start=block.index('  if(opt.dims!==false){\n  o.push(\'<g data-elev-dim197>\');')
end=block.index('  if(opt.noHandle!==true) elevSizeHandles',start)
block=block[:start]+'''  if(opt.dims!==false)o.push(elevLayoutFor207(r,i,x0,yF,s,P,opt).svg);
'''+block[end:]
aSide=block.index('    if((t2-t1)*s>40) o.push(tx(');bSide=block.index('    hCuts.push(t1,t2); vCuts.push(top);',aSide)
block=block[:aSide]+"    o.push(elevFurnitureLabel207(it,t1,t2,b,top,X,Y,col,P,opt.print?1.5:ZF,S.elevFurniture207!==false&&opt.dims!==false));\n"+block[bSide:]
block=block.replace('if(opt.noHandle!==true){                        // точка, за которую двигать модуль','if(opt.noHandle!==true && S.sel?.kind==="item" && r.items[S.sel.i]?.id===it.id){ // only the selected furniture has a move handle')
start=block.index('    if((t2-t1)*s>44){');end=block.index('    hCuts.push(t1,t2); vCuts.push(b,top);',start)
block=block[:start]+'''    o.push(elevFurnitureLabel207(it,t1,t2,b,top,X,Y,col,P,opt.print?1.5:ZF,S.elevFurniture207!==false&&opt.dims!==false));
'''+block[end:]
block=block.replace('const c=byType[it.type], col=P[groupColor(c.g)]||P.ink;\n    const sp=furnSpan(r,it,i);','const c=byType[it.type], col="#777b7e";\n    const sp=furnSpan(r,it,i);')
block=block.replace('`шаг ${mm(+it.step||71)} · оси ${mm(postSpan(it))} мм`,col,9','`${np} поста · шаг ${mm(+it.step||71)} ${unitName()}`,col,8')
s=s[:a]+block+s[b:]
# Installer elevations: exactly the same shared layout; preserve point table and warnings.
a=s.index('function kitElevWall0(');b=s.index('/* v130: развёртки по помещению',a);block=s[a:b]
x=block.index('  FUR.forEach(F=>{ const tw=');y=block.index('  P.forEach(q=>{ const x=X(q.tc), y=Y(q.h), col=KIT_ST_COL',x)
block=block[:x]+'''  FUR.forEach(F=>o.push(elevFurnitureLabel207(F.it,F.t1,F.t2,F.b,F.top,X,Y,"#777b7e",PRINT_PAL,1.5,S.elevFurniture207!==false)));
'''+block[y:]
x=block.index('  // цепочка сверху — от левого угла');y=block.index('  { const ccy=',x)
block=block[:x]+'''  const data207=elevData207(W,k);data207.points=P.map(q=>({t:q.tc,h:q.h,it:q.it}));
  const dimensions207=elevDimensions207(data207,X,Y,PRINT_PAL,{print:true,furniture:S.elevFurniture207!==false});o.push(dimensions207.svg);
'''+block[y:]
block=block.replace('const Hh=Math.max(Y(0)+22, oy+kpS+84);','const Hh=Math.max(Y(0)+dimensions207.bottom+12, oy+kpS+84);')
block=block.replace('const ty0=Y(0)+34,','const ty0=Y(0)+dimensions207.bottom+22,')
# Avoid auto-shrinking a complete installer elevation and its table onto one small landscape image.
block=block.replace('return `<section class="sheetpg kit"><h1>${ttl}', 'return `<section class="sheetpg kit kitp"><h1>${ttl}')
old_symbol='o.push(kitSym(Object.assign({},q.o,{col,st:q.st}),x,y,PRINT_PAL));'
new_symbol="""if(q.c.posts&&posts(q.it)>1){const n=posts(q.it),step=+q.it.step||71,vertical=q.it.dir==='v',span=(n-1)*step,fw=(vertical?82:span+82)*s,fh=(vertical?span+82:82)*s;o.push(`<g data-kit-frame207="${esc(q.it.id)}"><rect x="${x-fw/2}" y="${y-fh/2}" width="${fw}" height="${fh}" fill="white" stroke="${col}"/>`);for(let z=0;z<n;z++){const off=(z-(n-1)/2)*step*s,[ty,ii]=symFor(q.it,z);o.push(symSVG(ty,x+(vertical?0:off),y+(vertical?off:0),54*s,col,PRINT_PAL,ii));}o.push(`<text x="${x}" y="${y+fh/2+16}" text-anchor="middle" font-family="${KIT_FF}" font-size="${kf(10)}" fill="${col}">${n} поста · шаг ${mm(step)} ${unitName()}</text></g>`);}else o.push(kitSym(Object.assign({},q.o,{col,st:q.st}),x,y,PRINT_PAL));"""
assert old_symbol in block;block=block.replace(old_symbol,new_symbol)
ds=block.index('    const dsc=compact?');de=block.index('\n    o.push(`<text x=',ds)
block=block[:ds]+'    const dsc="";'+block[de:]
# One large elevation per portrait page; the detailed table gets its own pages.
block=block.replace('Wd=compact?900:1300','Wd=900').replace('(compact?240:430)/Hc','600/Hc')
block=block.replace('X,Y,"#777b7e",PRINT_PAL,1))','X,Y,"#777b7e",PRINT_PAL,1.5))')
# Column widths must scale together, not with an incrementally shrinking denominator.
block=block.replace('  const rows=P.map(q=>','  {const total=cols.reduce((a,c)=>a+c.w,0);cols.forEach(c=>c.w*= (Wd-40)/total);}\n  const rows=P.map(q=>')
x=block.index('  return `<section class="sheetpg kit kitp"><h1>${ttl}')
y=block.index('; }',x)+3
newreturn="""  const drawingHeight=Y(0)+dimensions207.bottom+24;
  const figure=`<section class="sheetpg kit kitp"><h1>${ttl} №${m.n} — стена ${esc(W.wlab[k])} · ${esc(r.name)}</h1>${stamp}<div class="planbox"><svg xmlns="http://www.w3.org/2000/svg" width="${Wd}" height="${drawingHeight}" viewBox="0 0 ${Wd} ${drawingHeight}"><rect width="100%" height="100%" fill="#fff"/>${o.join("")}</svg></div><p class="kitnote">Синим — центры монтажных точек, серым — мебель. Подробные сведения — в следующей таблице.</p></section>`;
  const groups=[];let group=[];for(const row of rows){const candidate=group.concat(row),trial=svgTable(cols,candidate,20,12,12);if(group.length&&trial.h>1000){groups.push(group);group=[row];}else group=candidate;}if(group.length)groups.push(group);
  return figure+groups.map((g,j)=>{const table=svgTable(cols,g,20,12,12);return `<section class="sheetpg kit kitp"><h1>Точки стены ${esc(W.wlab[k])} · ${esc(r.name)}${groups.length>1?' · '+(j+1):''}</h1>${stamp}<div class="planbox"><svg xmlns="http://www.w3.org/2000/svg" width="${Wd}" height="${table.h+36}" viewBox="0 0 ${Wd} ${table.h+36}">${table.svg}</svg></div></section>`;}).join(''); }"""
block=block[:x]+newreturn+block[y:]
s=s[:a]+block+s[b:]
sub('for(let i=0;i<blocks.length;i+=3){ const part=blocks.slice(i,i+3)','for(let i=0;i<blocks.length;i++){ const part=blocks.slice(i,i+1)')
sub('blocks.length>3?` · лист ${i/3+1}`','blocks.length>1?` · лист ${i+1}`')
# Sidebar mirrors the same furniture dimension preference.
sub('      <span class="lbl" style="align-self:center;padding-right:2px">Знаки</span>','      <label class="chk"><input type="checkbox" data-elev-furniture207 ${S.elevFurniture207!==false?"checked":""}> Размеры мебели — серым</label>\n      <span class="lbl" style="align-self:center;padding-right:2px">Знаки</span>')
anchor='document.addEventListener("keydown", e=>{ if(V3.open&&e.key==="Escape") close3D(); });'
sub(anchor,Path('tools/elevation_v207.js').read_text()+'''\ndocument.addEventListener('change',e=>{if(!e.target.matches('[data-elev-furniture207]'))return;S.elevFurniture207=e.target.checked;try{localStorage.setItem('obmerka-elev-furniture207',String(e.target.checked));}catch(e){}fitWall();render();renderSheet();});
window.__elev207={data:elevData207,layout:elevDimensions207,forWall:elevLayoutFor207,fit:fitWall};
'''+anchor)
sub('<section id="h12">','<section id="h12"><h3>Читаемые развёртки (v207)</h3><p>Синим показаны центры монтажных точек и высоты от пола, серым — мебель. Проекции мебели на стену вынесены в серую цепочку; внутри подписаны габариты Ш × В × Г из свойств предмета. Общая рамка привязана по центру и шагу постов. Близкие разные привязки не округляются в одну: подписи разнесены с выносками. Шрифт уменьшен, нижнее поле рассчитано по числу рядов. Те же правила используются в отчётах и чертежах для монтажников. «Размеры мебели» можно выключить на развёртке; настройка применяется и при печати. Возвращены два клапана КИВ-125 из старого проекта с сохранением высот и привязок к углам наружных стен.</p>')
# Ensure a restored inlet can be moved like the original furniture; no structural changes.
Path('Дизайн-проект кв. 109 — Шаумяна 14 (v207).html').write_text(s)
Path('/private/tmp/obmerka207-check.js').write_text(re.findall(r'<script(?:\s[^>]*)?>([\s\S]*?)</script>',s)[-1]);print('v207 assembled')
