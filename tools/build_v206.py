from pathlib import Path
import json,re
src=Path('Дизайн-проект кв. 109 — Шаумяна 14 (v205).html')
if not src.exists():src=Path('obmerka-v205.html')
s=src.read_text()
def sub(a,b):
 global s
 assert s.count(a)==1,(s.count(a),a[:100])
 s=s.replace(a,b,1)
sub('const APP_VER="v205", APP_DATE="16.11.2026";','const APP_VER="v206", APP_DATE="16.11.2026";')
input_path=Path('tmp/project-v206-github.json')
if not input_path.exists():input_path=Path('data/project_kv109_v206.json')
p=json.loads(input_path.read_text())
lit=json.dumps(json.dumps(p,ensure_ascii=False,separators=(',',':')),ensure_ascii=False).replace('</','<\\/')
s,n=re.subn(r'^const PRELOAD_JSON=.*$',lambda m:'const PRELOAD_JSON='+lit+';',s,flags=re.M);assert n==1
sub('const sz=c.posts?Math.max(5,54*s):22*(S.symScale||0.78), gap=c.posts?(+it.step||71)*s:sz*1.06, off=(np-1)*gap/2;','const sz=Math.max(3,54*s), gap=c.posts?(+it.step||71)*s:sz*1.06, off=(np-1)*gap/2;')
sub('for(let q=0;q<np;q++){                 // сами посты — постоянным размером','for(let q=0;q<np;q++){                 // all point symbols follow the same wall zoom')
sub('if(S.symbols){ const [ty,ii]=symFor(it,q); o.push(symSVG(ty,px,py,c.posts?54*s:22,col,P,ii)); }\n        else o.push(`<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="5.6" fill="${col}" stroke="${P.paper}" stroke-width="1.4"/>`);','''const dot206=`<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${(sz*.25).toFixed(2)}" fill="${col}" stroke="${P.paper}" stroke-width="1.4"/>`;
        const [ty206,ii206]=symFor(it,q);
        o.push(`<g data-elev-point206="${esc(it.id)}" data-point-type="${it.type}" data-post="${q}" data-symbol-size="${sz}">${S.symbols?symSVG(ty206,px,py,sz,col,P,ii206):dot206}</g>`);''')
sub('<section id="h12">','<section id="h12"><h3>Масштаб значков на развёртке (v206)</h3><p>Условные значки розеток, выключателей, воды, канализации и других настенных точек одинаково увеличиваются при приближении стены. В режиме точек масштабируются и кружки. На очень общем виде сохранён минимальный размер для читаемости. Условный значок не задаёт монтажный диаметр вывода. Рамки, оборудование, высоты и расстояния сохраняют реальные размеры.</p>')
Path('Дизайн-проект кв. 109 — Шаумяна 14 (v206).html').write_text(s)
Path('/private/tmp/obmerka206-check.js').write_text(re.findall(r'<script(?:\s[^>]*)?>([\s\S]*?)</script>',s)[-1])
print('v206 assembled, embedded project',p['id'],'updated',p['updated'])
