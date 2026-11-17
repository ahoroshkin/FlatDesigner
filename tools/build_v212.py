from pathlib import Path
import re,json
src=Path('Дизайн-проект кв. 109 — Шаумяна 14 (v211).html')
if not src.exists():src=Path('obmerka-v211.html')
s=src.read_text()
def sub(a,b):
 global s
 assert s.count(a)==1,(s.count(a),a[:90]);s=s.replace(a,b,1)
sub('const APP_VER="v211",','const APP_VER="v212",')
sub('тап по двери, дверце, ящику — открыть;','тап по двери, дверце, ящику — открыть; по кнопке зеркала — подсветка;')
sub('Вечер: тап по клавише выключателя — включить или выключить группу','Вечер: нажмите клавишу выключателя или кнопку зеркала')
sub('v3B(g,-hw-6,-hw+10,0,h,-hd,hd,"lamp"); v3B(g,hw-10,hw+6,0,h,-hd,hd,"lamp");','v3B(g,-hw,-hw+16,0,h,hd+.5,hd+2,"lamp"); v3B(g,hw-16,hw,0,h,hd+.5,hd+2,"lamp");')
pth=Path('tmp/project-v212-github.json')
if not pth.exists():pth=Path('data/project_kv109_v212.json')
p=json.loads(pth.read_text());lit=json.dumps(json.dumps(p,ensure_ascii=False,separators=(',',':')),ensure_ascii=False).replace('</','<\\/')
for key in ['PRELOAD_JSON','SAVED_JSON']:
 s,n=re.subn(r'^const '+key+r'=.*$',lambda m:'const '+key+'='+lit+';',s,flags=re.M);assert n==1
sub('hint(`${sw.g}: ${V3.lgOn[sw.g]===false?"выключено":"включено"}`,1400);','hint(`${sw.mirror212?"Подсветка зеркала":sw.g}: ${V3.lgOn[sw.g]===false?"выключено":"включено"}`,1400);')
sub('Подсветка включается встроенной кнопкой. Настенный выключатель не назначается.','Подсветка включается встроенной кнопкой. В 3D нажмите значок питания в нижней части зеркала. Настенный выключатель не назначается.')
anchor='document.addEventListener("keydown", e=>{ if(V3.open&&e.key==="Escape") close3D(); });'
sub(anchor,Path('tools/mirror_v212.js').read_text()+'\n'+anchor)
sub('<section id="h12">','<section id="h12"><h3>Подсветка зеркал в 3D (v212)</h3><p>Зеркало в полный рост и зеркальный шкаф с подсветкой включаются в 3D выбранным способом. Настенный выключатель управляет назначенной группой, встроенная кнопка на зеркале — только этим зеркалом. Нажимайте на круглый значок питания на лицевой стороне зеркала; в режимах «Править» и «Цвет» нажатие сохраняет назначение этих инструментов. Состояние света сохраняется при пересборке текущего 3D-вида. Зеркало в режиме настенного выключателя без назначенной группы не включается автоматически.</p>')
Path('Дизайн-проект кв. 109 — Шаумяна 14 (v212).html').write_text(s)
Path('/private/tmp/v212-syntax.js').write_text(re.findall(r'<script[^>]*>([\s\S]*?)</script>',s)[-1])
print('v212 assembled',p['id'],p['updated'])
