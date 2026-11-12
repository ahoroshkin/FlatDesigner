from pathlib import Path
import re
source=Path('Дизайн-проект кв. 109 — Шаумяна 14 (v197).html')
if not source.exists(): source=Path('obmerka-v197.html')
s=source.read_text()
def sub(a,b):
 global s
 assert s.count(a)==1,(s.count(a),a[:100])
 s=s.replace(a,b,1)
sub('const APP_VER="v197", APP_DATE="09.11.2026";','const APP_VER="v198", APP_DATE="12.11.2026";')
# Reuse lighting groups without changing the furniture catalog or geometry.
s=re.sub(r'LIGHT_T\.has\((it|o\.it)\.type\)',r'lightItem198(\1)',s)
sub('if(LIGHT_T.has(t)||KIT_LIGHT_X.has(t))','if(lightItem198(it)||litMirror198(it)||KIT_LIGHT_X.has(t))')
sub('let f=lightControlCard197(r);','let f=mirrorUI198(it)+lightControlCard197(r);')
sub('if(!it||!lightItem198(it))return null;',"if(!it||!lightItem198(it))return null;")
# Inactive built-in controls must not remain in an old group or group report.
sub('if(it.lg!==g) return; const c=byType[it.type];',"if(it.lg!==g||litMirror198(it)&&mirrorControl198(it)==='button') return; const c=byType[it.type];")
sub('if(it.lg) s.add(it.lg);',"if(it.lg&&(!litMirror198(it)||mirrorControl198(it)==='switch')) s.add(it.lg);")
sub('if(vp)body+=lightControlOverlay197(vp,S.view,P);','if(vp)body+=lightControlOverlay197(vp,S.view,P)+mirrorSwitchOverlay198(vp,S.view,P);')
sub('const SWAP_KEEP=["id",','const SWAP_KEEP=["mirrorControl","id",')
sub('<section id="h12"><h2>','<section id="h12"><h3>Подсветка зеркала (v198)</h3><p>В карточке зеркала в полный рост и зеркального шкафа выберите «Кнопка на зеркале» или «Настенный выключатель». Во втором случае назначьте конкретную клавишу или группу света. Свободной клавише программа создаст новую группу; занятая добавит зеркало к её существующему свету. При выборе зеркала отмечается выключатель, при выборе выключателя — связанное зеркало. Переход на встроенную кнопку снимает зеркало с группы, не меняя остальные светильники.</p><h2>')
anchor='document.addEventListener("keydown", e=>{ if(V3.open&&e.key==="Escape") close3D(); });'
sub(anchor,Path('tools/mirror_light_v198.js').read_text()+'\n'+anchor)
Path('Дизайн-проект кв. 109 — Шаумяна 14 (v198).html').write_text(s)
Path('/private/tmp/obm198check.js').write_text(re.findall(r'<script(?:\s[^>]*)?>([\s\S]*?)</script>',s)[-1])
print('v198 assembled')
