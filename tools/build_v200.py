from pathlib import Path
import re
src=Path('Дизайн-проект кв. 109 — Шаумяна 14 (v199).html')
if not src.exists():src=Path('obmerka-v199.html')
s=src.read_text()
def sub(a,b):
 global s
 assert s.count(a)==1,(s.count(a),a[:100])
 s=s.replace(a,b,1)
sub('const APP_VER="v199", APP_DATE="12.11.2026";','const APP_VER="v200", APP_DATE="12.11.2026";')
sub('return c.det==="glassp"?25:(it.type==="mirror"?80:0);','return c.det==="glassp"?25:(it.type==="mirror"?80:it.type==="mirrfull"?200:0);')
sub('function furnBox(it){\n  const w=Math.max(50,+it.w||600), d=Math.max(50,+it.d||600);','''function furnitureDepth200(it,c=byType[it.type]||{}){
  return Math.max(thinT(it)?3:50,+it.d||(thinT(it)?c.d||8:600));
}
function furnBox(it){
  const w=Math.max(50,+it.w||600), d=furnitureDepth200(it);''')
sub('d=(t==="mirror"||c.det==="glassp")?Math.max(3,+it.d||c.d||8):Math.max(50,+it.d||c.d||600)', 'd=thinT(it)?furnitureDepth200(it,c):Math.max(50,+it.d||c.d||600)')
sub('case "mirrfull":{ v3B(g,-hw,hw,0,h,-hd,hd,"mirror"); v3B(g,-hw-6,-hw+10,0,h,-hd,hd+6,"lamp"); v3B(g,hw-10,hw+6,0,h,-hd,hd+6,"lamp"); return true; }','case "mirrfull":{ v3B(g,-hw,hw,0,h,-hd,hd,"mirror"); v3B(g,-hw-6,-hw+10,0,h,-hd,hd,"lamp"); v3B(g,hw-10,hw+6,0,h,-hd,hd,"lamp"); return true; }')
sub('<section id="h12">','<section id="h12"><h3>Толщина зеркала (v200)</h3><p>Для зеркала в полный рост с подсветкой поле «Толщина» принимает 10 и 20 мм. План и 3D используют указанную толщину без увеличения до мебельного минимума. У обычных зеркал и стеклянных панелей тонкая геометрия также сохраняется. Зеркальный шкаф остаётся объёмной мебелью. Изменение толщины не меняет положение зеркала или связь подсветки с выключателем.</p>')
Path('Дизайн-проект кв. 109 — Шаумяна 14 (v200).html').write_text(s)
Path('/private/tmp/obm200check.js').write_text(re.findall(r'<script(?:\s[^>]*)?>([\s\S]*?)</script>',s)[-1])
print('v200 assembled')
